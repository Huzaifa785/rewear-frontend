'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserDashboard, getUserItems, getUserSwaps } from '../../services/api_calls';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { PointsBadge } from '../../components/ui/Badge';
import Link from 'next/link';

// Stats Card Component
const StatsCard = ({ title, value, icon, trend, color = 'green' }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </Card>
);

// Recent Activity Component
const RecentActivity = ({ activities }) => (
  <Card className="p-6">
  {console.log('Recent activities:', activities)}
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-sm">{activity.icon}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          {activity.points && (
            <PointsBadge points={activity.points} size="sm" />
          )}
        </div>
      ))}
    </div>
  </Card>
);

// Quick Actions Component
const QuickActions = () => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <Link href="/items/create">
        <Button variant="sustainable" className="w-full" icon="📸">
          List Item
        </Button>
      </Link>
      <Link href="/items">
        <Button variant="secondary" className="w-full" icon="🔍">
          Browse Items
        </Button>
      </Link>
      <Link href="/swaps">
        <Button variant="outline" className="w-full" icon="🤝">
          My Swaps
        </Button>
      </Link>
      <Link href="/search">
        <Button variant="ghost" className="w-full" icon="🎯">
          Find Matches
        </Button>
      </Link>
    </div>
  </Card>
);

// Recent Items Component
const RecentItems = ({ items }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Items</h3>
      <Link href="/items" className="text-sm text-green-600 hover:text-green-500">
        View all
      </Link>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-lg">👕</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
          <div className="text-right">
            <PointsBadge points={item.points_value} size="sm" />
            <Badge variant={item.status === 'available' ? 'success' : 'warning'} size="sm" className="mt-1">
              {item.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Dashboard Page
const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboard = await getUserDashboard();
        setDashboardData(dashboard);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
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

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  const stats = dashboardData?.statistics || {};
  const userInfo = dashboardData?.user || {};
  const recentItems = dashboardData?.recent_items || [];
  const recentSentSwaps = dashboardData?.recent_sent_swaps || [];
  const recentReceivedSwaps = dashboardData?.recent_received_swaps || [];
  const recentTransactions = dashboardData?.recent_transactions || [];

  // Build recent activity from swaps and transactions
  const activities = [];
  recentSentSwaps.forEach(swap => {
    activities.push({
      icon: swap.status === 'accepted' ? '✅' : swap.status === 'pending' ? '🤝' : swap.status === 'cancelled' ? '❌' : '⏳',
      title: `Swap ${swap.status} for "Item"`,
      time: swap.created_at ? new Date(swap.created_at).toLocaleString() : '',
      points: swap.points_offered || null
    });
  });
  recentTransactions.forEach(tx => {
    activities.push({
      icon: tx.transaction_type === 'item_listed' ? '📸' : '💎',
      title: tx.description,
      time: tx.created_at ? new Date(tx.created_at).toLocaleString() : '',
      points: tx.amount
    });
  });
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <Layout>
      <div className="space-y-10 px-2 md:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userInfo.first_name || userInfo.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your sustainable fashion journey
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <PointsBadge points={stats.points_balance || 0} size="lg" />
            <Link href="/profile">
              <Button variant="ghost" icon="👤">
                Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Points"
            value={stats.points_balance || 0}
            icon="💎"
            color="green"
            trend={12}
          />
          <StatsCard
            title="Items Listed"
            value={stats.total_items || 0}
            icon="👕"
            color="green"
            trend={8}
          />
          <StatsCard
            title="Swaps Completed"
            value={stats.total_swaps || 0}
            icon="🤝"
            color="emerald"
            trend={15}
          />
          <StatsCard
            title="Active Requests"
            value={stats.pending_swaps || 0}
            icon="⏳"
            color="yellow"
            trend={-5}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <RecentItems items={recentItems} />
            <RecentActivity activities={activities.slice(0, 5)} />
          </div>
          {/* Right Column */}
          <div className="space-y-8">
            <QuickActions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 