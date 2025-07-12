"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { createItem, uploadImage, listCategories } from '../../../services/api_calls';

const AddItemPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    size: '',
    condition: '',
    points_value: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let imageUrl = '';
      if (form.image) {
        const uploadRes = await uploadImage(form.image);
        imageUrl = uploadRes.url || uploadRes.image_url;
      }
      const itemData = {
        title: form.title,
        description: form.description,
        category_id: form.category_id,
        size: form.size,
        condition: form.condition,
        points_value: Number(form.points_value),
        images: imageUrl ? [imageUrl] : [],
      };
      await createItem(itemData);
      setSuccess(true);
      setTimeout(() => router.push('/items'), 1500);
    } catch (err) {
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-10">
        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Description" name="description" value={form.description} onChange={handleChange} required type="textarea" />
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="input w-full" required>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <select name="size" value={form.size} onChange={handleChange} className="input w-full" required>
                  <option value="">Select size</option>
                  {['xxs','xs','s','m','l','xl','xxl','xxxl','one_size','6','7','8','9','10','11','12'].map(s => (
                    <option key={s} value={s}>{isNaN(s) ? s.toUpperCase() : s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <select name="condition" value={form.condition} onChange={handleChange} className="input w-full" required>
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
            <Input label="Points Value" name="points_value" type="number" value={form.points_value} onChange={handleChange} required min={1} />
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="input w-full" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Item added! Redirecting...</div>}
            <Button type="submit" className="w-full" loading={loading} disabled={loading}>Add Item</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddItemPage; 