'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Link from 'next/link';

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Browse Items', href: '/items', icon: '👕' },
  { name: 'My Items', href: '/items/my', icon: '📦' },
  { name: 'List Item', href: '/items/create', icon: '📸' },
  { name: 'My Swaps', href: '/swaps', icon: '🤝' },
  { name: 'Search', href: '/search', icon: '🔍' },
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Admin', href: '/admin', icon: '⚙️', adminOnly: true },
];

const Layout = ({ children, showSidebar = true }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Horizontal App Navigation */}
      {isAuthenticated && showSidebar !== false && (
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="flex flex-wrap gap-2 md:gap-6 py-2 justify-start md:justify-center">
              {mainNav.filter(item => !item.adminOnly || user?.is_admin).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 