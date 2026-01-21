
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-gray-50 dark:bg-brand-dark border-t border-gray-200 dark:border-brand-light-gray/20">
      <div className={`container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm ${isRTL ? 'font-arabic' : ''}`}>
        <div className={`flex justify-center space-x-6 ${isRTL ? 'space-x-reverse' : ''} mb-4`}>
            <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm">{t('nav_about')}</Link>
            <Link to="/affiliate" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm">Affiliate</Link>
            <Link to="/api-docs" className="hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm">API</Link>
        </div>
        <p dir="ltr" className="inline-block">&copy; {new Date().getFullYear()} DomainOgen.com. {t('footer_rights')}</p>
        <p className="mt-1">Find your next great domain with the power of AI.</p>
      </div>
    </footer>
  );
};

export default Footer;
