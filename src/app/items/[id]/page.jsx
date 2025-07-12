"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import Card from '../../../components/ui/Card';
import Badge, { ConditionBadge, PointsBadge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import QuickActions from '../../../components/layout/QuickActions';
import { getItem, createSwapRequest } from '../../../services/api_calls';

const SingleItemPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapError, setSwapError] = useState(null);
  const [swapSuccess, setSwapSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getItem(id);
        setItem(data);
      } catch (err) {
        setError('Failed to load item.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  const handleProposeSwap = async () => {
    setSwapLoading(true);
    setSwapError(null);
    setSwapSuccess(false);
    try {
      await createSwapRequest({ item_id: id, swap_type: 'points_redemption', points_offered: item.points_value });
      setSwapSuccess(true);
    } catch (err) {
      setSwapError('Failed to propose swap.');
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Item Details</h1>
        <QuickActions />
        <Card className="p-8">
          {loading && <div className="text-center py-8">Loading item...</div>}
          {error && <div className="text-red-600 text-center py-8">{error}</div>}
          {item && (
            <>
              <div className="flex flex-col md:flex-row gap-8 mb-6">
                <div className="w-full md:w-1/2">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="rounded-xl w-full object-cover" />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-5xl">👕</div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
                  <p className="text-gray-600">{item.description}</p>
                  <div className="flex items-center space-x-2">
                    <ConditionBadge condition={item.condition} size="sm" />
                    <PointsBadge points={item.points_value} size="sm" />
                  </div>
                  <div className="text-sm text-gray-500">Size: {item.size}</div>
                  <div className="text-sm text-gray-500">Brand: {item.brand || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">Owner: @{item.owner?.username}</div>
                </div>
              </div>
              {swapError && <div className="text-red-600 text-sm mb-2">{swapError}</div>}
              {swapSuccess && <div className="text-green-600 text-sm mb-2">Swap request sent!</div>}
              <Button variant="sustainable" loading={swapLoading} onClick={handleProposeSwap}>
                Propose Swap for {item.points_value} points
              </Button>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SingleItemPage; 