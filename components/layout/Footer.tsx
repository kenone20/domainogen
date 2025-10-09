import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-brand-dark border-t border-gray-200 dark:border-brand-light-gray/20">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex justify-center space-x-6 mb-4">
            <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm">About</Link>
            <Link to="/affiliate" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm">Affiliate</Link>
            <Link to="/api-docs" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm">API</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} DomainOgen.com. All rights reserved.</p>
        <p className="mt-1">Find your next great domain with the power of AI.</p>
      </div>
    </footer>
  );
};

export default Footer;