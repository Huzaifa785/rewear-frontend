"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import QuickActions from '../../../components/layout/QuickActions';
import { getSwap, acceptSwap, rejectSwap, completeSwap, cancelSwap } from '../../../services/api_calls';

const SingleSwapPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [swap, setSwap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchSwap = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSwap(id);
        console.log('Fetched swap:', data);
        setSwap(data);
      } catch (err) {
        setError('Failed to load swap.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSwap();
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setActionError(null);
    try {
      if (action === 'accept') await acceptSwap(id);
      if (action === 'reject') await rejectSwap(id);
      if (action === 'complete') await completeSwap(id);
      if (action === 'cancel') await cancelSwap(id);
      router.refresh();
    } catch (err) {
      setActionError('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Swap Details</h1>
        <QuickActions />
        <Card className="p-8">
          {loading && <div className="text-center py-8">Loading swap...</div>}
          {error && <div className="text-red-600 text-center py-8">{error}</div>}
          {swap && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-lg">
                    {swap.item?.title || 'Unknown Item'}
                  </div>
                  <div className="text-xs text-gray-500">Swap Type: {swap.swap_type}</div>
                </div>
                <Badge variant={swap.status} size="sm">{swap.status}</Badge>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-700">With: @{swap.requester?.username || 'user'}</div>
                <div className="text-sm text-gray-700">Points: {swap.points_offered || 0}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-500">Created: {swap.created_at}</div>
                <div className="text-xs text-gray-500">Updated: {swap.updated_at}</div>
              </div>
              {actionError && <div className="text-red-600 text-sm mb-2">{actionError}</div>}
              <div className="flex space-x-3 mt-6">
                {swap.status === 'pending' && (
                  <>
                    <Button variant="sustainable" loading={actionLoading} onClick={() => handleAction('accept')}>Accept</Button>
                    <Button variant="outline" loading={actionLoading} onClick={() => handleAction('reject')}>Reject</Button>
                    <Button variant="ghost" loading={actionLoading} onClick={() => handleAction('cancel')}>Cancel</Button>
                  </>
                )}
                {swap.status === 'accepted' && (
                  <Button variant="sustainable" loading={actionLoading} onClick={() => handleAction('complete')}>Mark Complete</Button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SingleSwapPage; 