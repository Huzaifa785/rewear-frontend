import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const classes = `bg-white shadow-md rounded-2xl border border-gray-100 p-6 ${className}`;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 font-semibold text-lg ${className}`} {...props}>
    {children}
  </div>
);

// Card Body Component
Card.Body = ({ children, className = '', ...props }) => (
  <div className={`mb-2 ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer Component
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 