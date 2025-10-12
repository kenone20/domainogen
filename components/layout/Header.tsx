import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-gray-200 dark:bg-brand-gray text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-light-gray hover:text-gray-900 dark:hover:text-white'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-dark focus:ring-indigo-500`}
    >
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg border-b border-gray-200 dark:border-brand-light-gray/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 text-xl font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-dark focus:ring-indigo-500">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
                                🌐 DomainOgen
                            </span>
                        </Link>
                        <nav className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <NavLink to="/generate">Generate</NavLink>
                                <NavLink to="/pricing">Pricing</NavLink>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                <NavLink to="/about">About</NavLink>
                            </div>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-brand-light-gray transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-dark focus:ring-indigo-500" aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};


export default Header;