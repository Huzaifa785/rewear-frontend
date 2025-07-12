"use client"
import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import QuickActions from '../../components/layout/QuickActions';
import { listUserSwaps } from '../../services/api_calls';

const SwapsPage = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSwaps = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listUserSwaps({ limit: 20 });
        setSwaps(data);
      } catch (err) {
        setError('Failed to load swaps.');
      } finally {
        setLoading(false);
      }
    };
    fetchSwaps();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Swaps</h1>
        <QuickActions />
        <Card className="p-6">
          {loading && <div className="text-center py-8">Loading swaps...</div>}
          {error && <div className="text-red-600 text-center py-8">{error}</div>}
          {!loading && swaps.length === 0 && <div className="text-gray-400 text-center py-8">No swaps yet.</div>}
          <div className="divide-y">
            {swaps.map((swap) => (
              <Link key={swap.id} href={`/swaps/${swap.id}`} className="block py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{swap.item?.title || 'Item'}</div>
                    <div className="text-xs text-gray-500">Status: <Badge variant={swap.status} size="sm">{swap.status}</Badge></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{swap.swap_type}</span>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SwapsPage; 