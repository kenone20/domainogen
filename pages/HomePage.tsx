
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SEO from '../components/layout/SEO';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="text-center flex flex-col items-center justify-center py-20 md:py-32">
      <SEO 
        title={t('hero_title_1') + ' ' + t('hero_title_2')} 
        description={t('hero_subtitle')}
      />
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-brand-dark bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      </div>
      <div className="absolute top-0 left-0 -z-10 h-1/2 w-full bg-gradient-to-b from-indigo-100/30 dark:from-indigo-900/30 to-transparent"></div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 animate-fade-in">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
          {t('hero_title_1')}
        </span>
        <span className="block">{t('hero_title_2')}</span>
      </h1>
      <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {t('hero_subtitle')}
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Button 
          variant="primary" 
          className="px-8 py-4 text-lg w-full sm:w-auto"
          onClick={() => navigate('/generate')}
        >
          {t('btn_generate_free')}
        </Button>
        <Button 
          variant="secondary" 
          className="px-8 py-4 text-lg w-full sm:w-auto"
          onClick={() => navigate('/generate')}
        >
          {t('btn_analyze')}
        </Button>
      </div>

      <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div>
          <h2 className="text-xl font-bold mb-2 text-indigo-500">AI-Powered Creativity</h2>
          <p className="text-gray-500 dark:text-gray-400">Our advanced algorithms suggest names that aren't just unique, but highly brandable and memorable for your target audience.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-cyan-500">Instant SEO Check</h2>
          <p className="text-gray-500 dark:text-gray-400">Every suggestion is analyzed for SEO potential, keyword strength, and search engine competitiveness.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-purple-500">Branding Toolkit</h2>
          <p className="text-gray-500 dark:text-gray-400">Get a suggested tagline, color palette, and AI-generated logo to jumpstart your project immediately.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
