import React, { forwardRef } from 'react';
import type { DomainAnalysis } from '../../types';

interface PdfReportProps {
  analysis: DomainAnalysis;
  logoDataUrl: string;
}

const PdfReport = forwardRef<HTMLDivElement, PdfReportProps>(({ analysis, logoDataUrl }, ref) => {
  const { domain, brandability, seoStrength, estimatedValue, summary, colorPalette, tagline, domainAge, metaDescription, metaKeywords } = analysis;

  return (
    <div ref={ref} className="bg-brand-dark text-gray-200 p-10 font-sans" style={{ width: '800px' }}>
      <header className="border-b-2 border-indigo-500 pb-4 mb-8 text-center">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Domain Appraisal Report</h1>
        <p className="text-2xl font-mono text-cyan-400 mt-2">{domain}</p>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4 border-l-4 border-indigo-500 pl-3">Core Metrics</h2>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div className="bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Brandability</p>
              <p className="text-3xl font-bold text-white">{brandability}/10</p>
            </div>
            <div className="bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider">SEO Strength</p>
              <p className="text-3xl font-bold text-white">{seoStrength}/10</p>
            </div>
             <div className="bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Domain Age</p>
              <p className="text-3xl font-bold text-white">{domainAge}</p>
            </div>
            <div className="bg-brand-gray p-4 rounded-lg border border-brand-light-gray/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Estimated Value</p>
              <p className="text-3xl font-bold text-indigo-400">${estimatedValue.toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-brand-gray p-6 rounded-lg border border-brand-light-gray/10">
          <h2 className="text-2xl font-semibold text-indigo-400 mb-3 border-l-4 border-indigo-500 pl-3">Executive Summary</h2>
          <p className="text-gray-300 leading-relaxed text-sm">{summary}</p>
        </section>

        <section className="mb-8 bg-brand-gray p-6 rounded-lg border border-brand-light-gray/10">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3 border-l-4 border-cyan-500 pl-3">SEO Meta Strategy</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Recommended Meta Description</p>
              <p className="text-gray-200 text-sm leading-snug">{metaDescription}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Target SEO Keywords</p>
              <p className="text-gray-200 text-sm italic font-mono">{metaKeywords}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-indigo-400 mb-4 border-l-4 border-indigo-500 pl-3">Brand Identity Kit</h2>
          <div className="bg-brand-gray p-6 rounded-lg border border-brand-light-gray/10 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-200 text-lg">Official Tagline</h3>
              <p className="text-xl italic text-cyan-400">"{tagline}"</p>
            </div>
             <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wider mb-2">Primary Color Palette</h3>
                    <div className="flex space-x-4">
                        {colorPalette.map(color => (
                        <div key={color} className="w-16 h-16 rounded-full border border-brand-light-gray flex items-center justify-center text-[8px] text-white/50" style={{ backgroundColor: color }}>
                          {color}
                        </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wider mb-2">Logo Concept</h3>
                    <div className="w-24 h-24 rounded-lg bg-brand-light-gray border border-brand-light-gray/50 flex items-center justify-center shadow-inner overflow-hidden">
                        {logoDataUrl ? (
                            <img src={logoDataUrl} alt="AI generated logo" className="w-full h-full object-cover" />
                        ) : (
                            <p className="text-xs text-gray-400">Asset pending</p>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-gray-500 text-xs mt-10 pt-4 border-t border-brand-light-gray/20">
        <p>Verified Analysis by 🌐 DomainOgen.com &copy; {new Date().getFullYear()}</p>
        <p className="mt-1 opacity-50">Confidential digital asset appraisal. Market values fluctuate based on demand.</p>
      </footer>
    </div>
  );
});

export default PdfReport;