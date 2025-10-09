import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white 
      dark:bg-brand-gray/50 
      dark:backdrop-blur-sm 
      border border-gray-200 dark:border-brand-light-gray/20 
      rounded-xl 
      shadow-md dark:shadow-lg 
      p-6 
      transition-colors duration-300
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;