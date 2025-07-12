"use client"

import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getCurrentUser, updateCurrentUser } from '../../services/api_calls';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', bio: '', city: '', state: '', country: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUser();
        setUser(data);
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || ''
        });
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateCurrentUser(form);
      setSuccess(true);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-10">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
              <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
              <Input label="Bio" name="bio" value={form.bio} onChange={handleChange} type="textarea" />
              <div className="grid grid-cols-3 gap-4">
                <Input label="City" name="city" value={form.city} onChange={handleChange} />
                <Input label="State" name="state" value={form.state} onChange={handleChange} />
                <Input label="Country" name="country" value={form.country} onChange={handleChange} />
              </div>
              {success && <div className="text-green-600 text-sm">Profile updated!</div>}
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" className="w-full" loading={saving} disabled={saving}>Save Changes</Button>
            </form>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage; 