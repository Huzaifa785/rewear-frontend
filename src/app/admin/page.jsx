"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getAdminDashboard, approveItem, rejectItem, toggleUserActiveStatus } from '../../services/api_calls';

const AdminPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboardData = await getAdminDashboard();
        setDashboard(dashboardData);
      } catch {
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleApproveItem = async (itemId) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      await approveItem(itemId);
      setActionMessage('Item approved!');
      // Refresh dashboard data
      const dashboardData = await getAdminDashboard();
      setDashboard(dashboardData);
    } catch {
      setActionMessage('Failed to approve item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectItem = async (itemId) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      await rejectItem(itemId);
      setActionMessage('Item rejected!');
      // Refresh dashboard data
      const dashboardData = await getAdminDashboard();
      setDashboard(dashboardData);
    } catch {
      setActionMessage('Failed to reject item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      await toggleUserActiveStatus(userId);
      setActionMessage('User status updated!');
      // Refresh dashboard data
      const dashboardData = await getAdminDashboard();
      setDashboard(dashboardData);
    } catch {
      setActionMessage('Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user?.is_admin) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-10">
          <Card>
            <div className="text-center text-red-600">Access denied. Admins only.</div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-10">
          <Card>Loading...</Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-10">
          <Card className="text-red-600">{error}</Card>
        </div>
      </Layout>
    );
  }

  const stats = dashboard?.statistics || {};
  const recent = dashboard?.recent_activity || {};
  const itemsPendingReview = dashboard?.items_pending_review || [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 space-y-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {actionMessage && (
          <div className={`mb-4 px-4 py-2 rounded ${actionMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{actionMessage}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold mb-2">Platform Stats</h2>
            <div className="space-y-1 text-sm">
              <div>Total Users: {stats.users?.total}</div>
              <div>Active Users: {stats.users?.active}</div>
              <div>Verified Users: {stats.users?.verified}</div>
              <div>Admins: {stats.users?.admins}</div>
              <div>Total Items: {stats.items?.total}</div>
              <div>Available Items: {stats.items?.available}</div>
              <div>Pending Review: {stats.items?.pending_review}</div>
              <div>Swapped Items: {stats.items?.swapped}</div>
              <div>Total Swaps: {stats.swaps?.total}</div>
              <div>Pending Swaps: {stats.swaps?.pending}</div>
              <div>Completed Swaps: {stats.swaps?.completed}</div>
              <div>Total Points in System: {stats.points?.total_in_system}</div>
              <div>Total Points Earned: {stats.points?.total_earned}</div>
              <div>Total Points Spent: {stats.points?.total_spent}</div>
            </div>
          </Card>
          <Card>
            <h2 className="font-semibold mb-2">Items Pending Review</h2>
            {itemsPendingReview.length === 0 ? (
              <div className="text-gray-500">No items pending review.</div>
            ) : (
              <ul className="divide-y">
                {itemsPendingReview.map(item => (
                  <li key={item.id} className="py-2 flex justify-between items-center">
                    <span>{item.title} <span className="text-xs text-gray-500">by {item.owner_username}</span></span>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={actionLoading} onClick={() => handleApproveItem(item.id)} variant="success">Approve</Button>
                      <Button size="sm" disabled={actionLoading} onClick={() => handleRejectItem(item.id)} variant="danger">Reject</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <h2 className="font-semibold mb-2">Recent Users</h2>
            <ul className="divide-y">
              {recent.users?.map(u => (
                <li key={u.id} className="py-2 flex justify-between items-center">
                  <span>{u.username} ({u.email})</span>
                  <div className="flex gap-2 items-center">
                    <span className={`text-xs ${u.is_active ? 'text-green-600' : 'text-red-600'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    <Button size="sm" disabled={actionLoading} onClick={() => handleToggleUser(u.id)} variant={u.is_active ? 'danger' : 'success'}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-semibold mb-2">Recent Items</h2>
            <ul className="divide-y">
              {recent.items?.map(i => (
                <li key={i.id} className="py-2 flex justify-between items-center">
                  <span>{i.title} <span className="text-xs text-gray-500">by {i.owner_username}</span></span>
                  <span className="text-xs text-gray-500">{i.status}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-semibold mb-2">Recent Swaps</h2>
            <ul className="divide-y">
              {recent.swaps?.map(s => (
                <li key={s.id} className="py-2 flex justify-between items-center">
                  <span>#{s.id} {s.swap_type} <span className="text-xs text-gray-500">{s.requester_username} → {s.owner_username}</span></span>
                  <span className={`text-xs ${s.status === 'accepted' ? 'text-green-600' : s.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{s.status}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage; 