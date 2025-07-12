import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  success,
  icon,
  iconPosition = 'left',
  className = '',
  variant = 'default',
  size = 'md',
  ...props 
}, ref) => {
  const baseClasses = 'w-full border rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 bg-white/80 backdrop-blur-sm';
  
  const variants = {
    default: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/30',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500/30',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500/30'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };
  
  const getVariant = () => {
    if (error) return variants.error;
    if (success) return variants.success;
    return variants.default;
  };
  
  const classes = `${baseClasses} ${getVariant()} ${sizes[size]} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`${classes} ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {success && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 