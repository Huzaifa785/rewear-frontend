'use client';

import React, { useState, useEffect } from 'react';
import { listItems, listCategories, getTrendingItems } from '../../services/api_calls';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge, { ConditionBadge, PointsBadge } from '../../components/ui/Badge';
import Link from 'next/link';
import QuickActions from '../../components/layout/QuickActions';

// Item Card Component
const ItemCard = ({ item }) => (
  <Card className="overflow-hidden card-hover">
    <div className="aspect-square bg-gray-200 relative overflow-hidden">
      {item.images && item.images.length > 0 ? (
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl">👕</span>
        </div>
      )}
      <div className="absolute top-2 right-2">
        <ConditionBadge condition={item.condition} size="sm" />
      </div>
    </div>
    
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
        <PointsBadge points={item.points_value} size="sm" />
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>Size: {item.size}</span>
        <span>Brand: {item.brand || 'Unknown'}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <span className="text-sm text-gray-600">@{item.owner?.username}</span>
        </div>
        
        <Link href={`/items/${item.id}`}>
          <Button variant="sustainable" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  </Card>
);

// Filter Sidebar Component
const FilterSidebar = ({ filters, setFilters, categories }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      category_id: '',
      size: '',
      condition: '',
      min_points: '',
      max_points: '',
      brand: '',
      color: '',
      material: '',
      tags: '',
      location: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <Input
            placeholder="Search items..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            icon="🔍"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            className="input"
            value={filters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select
            className="input"
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
          >
            <option value="">All Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
          <select
            className="input"
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Points Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Points Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.min_points}
              onChange={(e) => handleFilterChange('min_points', e.target.value)}
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.max_points}
              onChange={(e) => handleFilterChange('max_points', e.target.value)}
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <Input
            placeholder="Brand name"
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <Input
            placeholder="Color"
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            className="input"
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          >
            <option value="created_at">Newest First</option>
            <option value="points_asc">Points: Low to High</option>
            <option value="points_desc">Points: High to Low</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

// Items Page
const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category_id: '',
    size: '',
    condition: '',
    min_points: '',
    max_points: '',
    brand: '',
    color: '',
    material: '',
    tags: '',
    location: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, categoriesData, trendingData] = await Promise.all([
          listItems(filters),
          listCategories(),
          getTrendingItems(5)
        ]);
        
        setItems(itemsData);
        setCategories(categoriesData);
        setTrendingItems(trendingData);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div className="flex items-center justify-center h-64">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Items</h1>
        <QuickActions />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
            <p className="text-gray-600 mt-1">
              Discover amazing pre-loved clothing from our community
            </p>
          </div>
          <Link href="/items/create">
            <Button variant="sustainable" icon="📸">
              List Your Item
            </Button>
          </Link>
        </div>

        {/* Trending Items */}
        {trendingItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Trending Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {trendingItems.map((item, index) => (
                <ItemCard key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              categories={categories}
            />
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All Items ({items.length})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <Button variant="ghost" size="sm">Grid</Button>
                <Button variant="ghost" size="sm">List</Button>
              </div>
            </div>

            {items.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">👕</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or check back later for new items.
                </p>
                <Button variant="sustainable" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <ItemCard key={index} item={item} />
                ))}
              </div>
            )}

            {/* Load More */}
            {items.length >= 20 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Items
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemsPage; 