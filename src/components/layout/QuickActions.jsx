import React from 'react';
import Link from 'next/link';
import Card from '../ui/Card';
import Button from '../ui/Button';

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

export default QuickActions; 