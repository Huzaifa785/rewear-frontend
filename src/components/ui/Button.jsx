import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0';
  
  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500/30',
    secondary: 'bg-white text-gray-700 shadow-sm hover:shadow-md border border-gray-200 focus:ring-gray-500/30',
    ghost: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500/30',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500/30',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500/30',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500/30',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-sm hover:shadow-md focus:ring-yellow-500/30',
    sustainable: 'bg-green-600 text-white shadow-sm hover:shadow-md hover:bg-green-700 focus:ring-green-500/30'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-dots mr-2">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button; 