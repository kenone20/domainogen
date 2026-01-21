
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Generate high-value, brandable domain names with AI. Get instant SEO strength analysis and professional appraisal reports.",
  canonical
}) => {
  const { locale } = useLanguage();
  const fullTitle = title ? `${title} | DomainOgen.com` : "DomainOgen.com | AI Domain Generator & SEO Analysis";
  
  const baseUrl = "https://domainogen.com";

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Dynamic Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : 'ar_SA'} />

      {/* Hreflang for SEO */}
      <link rel="alternate" href={`${baseUrl}/?lang=en`} hrefLang="en" />
      <link rel="alternate" href={`${baseUrl}/?lang=fr`} hrefLang="fr" />
      <link rel="alternate" href={`${baseUrl}/?lang=es`} hrefLang="es" />
      <link rel="alternate" href={`${baseUrl}/?lang=ar`} hrefLang="ar" />
      <link rel="alternate" href={baseUrl} hrefLang="x-default" />
    </>
  );
};

export default SEO;
