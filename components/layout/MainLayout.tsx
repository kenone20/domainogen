import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from './ToastContainer';

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-brand-dark text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <ToastContainer />
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;