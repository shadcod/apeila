'use client';
import React from 'react';
import clsx from 'clsx';

export default function Button({
  children,
  variant = 'primary',     // primary | secondary | danger
  size = 'md',              // sm | md | lg
  fullWidth = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded select-none';
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variants = {
    primary: 'bg-yellow text-black hover:bg-yellow-hover',
    secondary: 'bg-main text-white hover:opacity-90',
    danger: 'bg-sale text-white hover:opacity-90',
  };

  return (
    <button
      {...props}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </button>
  );
}
