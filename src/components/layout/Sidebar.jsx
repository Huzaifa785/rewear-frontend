'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { PointsBadge } from '../ui/Badge';

const Sidebar = () => {
  const { user, points, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      requiresAuth: true
    },
    {
      name: 'Browse Items',
      href: '/items',
      icon: '👕',
      requiresAuth: false
    },
    {
      name: 'My Items',
      href: '/items/my',
      icon: '📦',
      requiresAuth: true
    },
    {
      name: 'List Item',
      href: '/items/create',
      icon: '📸',
      requiresAuth: true
    },
    {
      name: 'My Swaps',
      href: '/swaps',
      icon: '🤝',
      requiresAuth: true
    },
    {
      name: 'Search',
      href: '/search',
      icon: '🔍',
      requiresAuth: false
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: '👤',
      requiresAuth: true
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: '⚙️',
      requiresAuth: true,
      adminOnly: true
    }
  ];

  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.adminOnly && !user?.is_admin) return false;
    return true;
  });

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen sticky top-16 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-2 rounded-lg hover:bg-gray-50 transition-colors mb-4"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* User Stats (when expanded) */}
        {!isCollapsed && isAuthenticated && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">
                  {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.is_admin ? 'Admin' : 'Member'}
                </p>
              </div>
            </div>
            <PointsBadge points={points || 0} size="sm" />
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {filteredItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link ${
                isActive(item.href) ? 'sidebar-link-active' : ''
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Stats (when expanded) */}
        {!isCollapsed && isAuthenticated && (
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Items Listed</span>
                <span className="font-medium">{user?.total_items || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Swaps Completed</span>
                <span className="font-medium">{user?.completed_swaps || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Active Requests</span>
                <span className="font-medium">{user?.pending_swaps || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Icons Only */}
        {isCollapsed && (
          <div className="mt-8 space-y-2">
            {filteredItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={item.name}
              >
                <span className="text-lg">{item.icon}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 