
import React from 'react';
import { useLanguage, Locale } from '../../context/LanguageContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

const LanguagePicker: React.FC = () => {
  const { locale, setLocale, isRTL } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-light-gray transition-colors text-gray-600 dark:text-gray-300">
        <GlobeAltIcon className="h-5 w-5" />
        <span className="text-xs font-bold uppercase">{locale}</span>
      </button>
      <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-32 bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-light-gray/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-brand-light-gray flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg ${locale === lang.code ? 'text-indigo-600 font-bold bg-indigo-50/50 dark:bg-brand-light-gray/50' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguagePicker;
