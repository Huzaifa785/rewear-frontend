"use client"

import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getFilterOptions, advancedSearchItems } from '../../services/api_calls';

const SearchPage = () => {
  const [filters, setFilters] = useState({ q: '', category_id: '', size: '', condition: '' });
  const [filterOptions, setFilterOptions] = useState({ categories: [], sizes: [], conditions: [] });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(() => setFilterOptions({ categories: [], sizes: [], conditions: [] }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await advancedSearchItems(filters);
      console.log('Search filters:', filters);
        console.log('Search data:', data);
      // Ensure results is always an array
      const resultsArray = Array.isArray(data) ? data : 
                          (data && Array.isArray(data.results)) ? data.results : 
                          (data && Array.isArray(data.items)) ? data.items : [];
      setResults(resultsArray);
      console.log('Search results:', resultsArray);
    } catch {
      setError('Failed to search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 space-y-8">
        <Card>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <Input label="Search" name="q" value={filters.q} onChange={handleChange} className="flex-1" />
            <div className="flex gap-2">
              <select name="category_id" value={filters.category_id} onChange={handleChange} className="input">
                <option value="">All Categories</option>
                {filterOptions.categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select name="size" value={filters.size} onChange={handleChange} className="input">
                <option value="">All Sizes</option>
                {filterOptions.sizes?.map((s) => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
              <select name="condition" value={filters.condition} onChange={handleChange} className="input">
                <option value="">All Conditions</option>
                {filterOptions.conditions?.map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full md:w-auto">Search</Button>
          </form>
        </Card>
        <div>
          {loading && <Card>Loading...</Card>}
          {error && <Card className="text-red-600">{error}</Card>}
          {!loading && results.length === 0 && <Card>No results found.</Card>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {results.map((item) => (
                
              <Card key={item.id} className="p-4">
                {console.log('Rendering item:', item)}
                <div className="flex flex-col items-center">
                  {item.primary_image_url ? (
                    <img src={item.primary_image_url} alt={item.title} className="w-32 h-32 object-cover rounded-xl mb-2" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-4xl mb-2">👕</div>
                  )}
                  <div className="font-semibold text-lg mb-1">{item.title}</div>
                  <div className="text-sm text-gray-500 mb-1">{item.description}</div>
                  <div className="text-xs text-gray-400 mb-1">Size: {item.size}</div>
                  <div className="text-xs text-gray-400 mb-1">Points: {item.points_value}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage; 