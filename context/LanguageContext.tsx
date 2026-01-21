
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Locale = 'en' | 'fr' | 'es' | 'ar';

interface TranslationMap {
  [key: string]: {
    [K in Locale]: string;
  };
}

export const translations: TranslationMap = {
  nav_generate: { en: 'Generate', fr: 'Générer', es: 'Generar', ar: 'توليد' },
  nav_pricing: { en: 'Pricing', fr: 'Tarifs', es: 'Precios', ar: 'الأسعار' },
  nav_dashboard: { en: 'Dashboard', fr: 'Tableau de bord', es: 'Panel', ar: 'لوحة التحكم' },
  nav_about: { en: 'About', fr: 'À propos', es: 'Acerca de', ar: 'حول' },
  hero_title_1: { en: 'Find Your Next', fr: 'Trouvez Votre Prochain', es: 'Encuentra Tu Próximo', ar: 'جد اسم' },
  hero_title_2: { en: 'Great Domain.', fr: 'Grand Domaine.', es: 'Gran Dominio.', ar: 'نطاقك القادم.' },
  hero_subtitle: { 
    en: 'AI-generated, SEO-analyzed, and ready to launch. Turn your idea into a global brand.',
    fr: 'Généré par IA, analysé pour le SEO et prêt à être lancé. Transformez votre idée en marque mondiale.',
    es: 'Generado por IA, analizado por SEO y listo para lanzar. Convierte tu idea en una marca global.',
    ar: 'مُنشأ بالذكاء الاصطناعي، ومحلل لتحسين محركات البحث، وجاهز للإطلاق. حول فكرتك إلى علامة تجارية عالمية.'
  },
  btn_generate_free: { en: 'Generate Domains Free', fr: 'Générer Domaines Gratuit', es: 'Generar Dominios Gratis', ar: 'توليد نطاقات مجاناً' },
  btn_analyze: { en: 'Analyze a Domain', fr: 'Analyser un Domaine', es: 'Analizar un Dominio', ar: 'تحليل نطاق' },
  label_prompt: { en: 'Your Prompt', fr: 'Votre Suggestion', es: 'Tu Idea', ar: 'فكرتك' },
  placeholder_prompt: { en: 'e.g., A SaaS for online courses', fr: 'ex: Un SaaS pour cours en ligne', es: 'ej: Un SaaS para cursos online', ar: 'مثال: منصة للدورات التدريبية' },
  style_brandable: { en: 'Brandable', fr: 'Identifiable', es: 'De marca', ar: 'قابل للتمييز' },
  footer_rights: { en: 'All rights reserved.', fr: 'Tous droits réservés.', es: 'Todos los derechos reservados.', ar: 'جميع الحقوق محفوظة.' }
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale') as Locale;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = (key: string) => {
    return translations[key]?.[locale] || key;
  };

  const isRTL = locale === 'ar';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
