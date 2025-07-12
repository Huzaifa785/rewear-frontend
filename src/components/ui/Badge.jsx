import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-green-100 text-green-800',
    secondary: 'bg-emerald-100 text-emerald-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    dark: 'bg-gray-800 text-white',
    light: 'bg-white text-gray-700 border border-gray-200',
    sustainable: 'bg-green-600 text-white',
    swap: {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      expired: 'bg-orange-100 text-orange-800'
    },
    condition: {
      new: 'bg-green-100 text-green-800',
      like_new: 'bg-emerald-100 text-emerald-800',
      good: 'bg-green-100 text-green-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    }
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const getVariantClasses = () => {
    if (typeof variant === 'string') {
      return variants[variant] || variants.default;
    }
    return variants.default;
  };
  
  const classes = `${baseClasses} ${getVariantClasses()} ${sizes[size]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

// Specialized Badge Components
export const SwapStatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'swap.pending', icon: '⏳' },
    accepted: { label: 'Accepted', variant: 'swap.accepted', icon: '✅' },
    rejected: { label: 'Rejected', variant: 'swap.rejected', icon: '❌' },
    completed: { label: 'Completed', variant: 'swap.completed', icon: '🎉' },
    cancelled: { label: 'Cancelled', variant: 'swap.cancelled', icon: '🚫' },
    expired: { label: 'Expired', variant: 'swap.expired', icon: '⏰' }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} icon={config.icon} {...props}>
      {config.label}
    </Badge>
  );
};

export const ConditionBadge = ({ condition, ...props }) => {
  const conditionConfig = {
    new: { label: 'New', variant: 'condition.new', icon: '🆕' },
    like_new: { label: 'Like New', variant: 'condition.like_new', icon: '✨' },
    good: { label: 'Good', variant: 'condition.good', icon: '👍' },
    fair: { label: 'Fair', variant: 'condition.fair', icon: '⚠️' },
    poor: { label: 'Poor', variant: 'condition.poor', icon: '🔴' }
  };
  
  const config = conditionConfig[condition] || conditionConfig.good;
  
  return (
    <Badge variant={config.variant} icon={config.icon} {...props}>
      {config.label}
    </Badge>
  );
};

export const PointsBadge = ({ points, ...props }) => (
  <Badge variant="sustainable" icon="💎" {...props}>
    {points} points
  </Badge>
);

export default Badge; 