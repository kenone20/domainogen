import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useDomain } from '../context/DomainContext';
import { useToast } from '../context/ToastContext';
import { useHistory } from '../context/HistoryContext';
import { analyzeDomain, generateImage } from '../services/geminiService';
import type { DomainAnalysis } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PdfReport from '../components/ui/PdfReport';
import SEO from '../components/layout/SEO';
import { AFFILIATE_LINKS } from '../constants';
import { ArrowDownTrayIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  score?: number;
  maxScore?: number;
  isJustification?: boolean;
}> = ({ title, value, description, score, maxScore = 10, isJustification = false }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const barTimer = setTimeout(() => {
      if (progressBarRef.current && score !== undefined) {
        progressBarRef.current.style.width = `${(score / maxScore) * 100}%`;
      }
    }, 100);

    let numberTimer: number | undefined;
    if (score !== undefined) {
      setAnimatedScore(0);
      if (score > 0) {
        const duration = 1000;
        const stepTime = Math.floor(duration / score);
        let current = 0;
        numberTimer = window.setInterval(() => {
          current += 1;
          setAnimatedScore(current);
          if (current >= score) {
            clearInterval(numberTimer);
          }
        }, stepTime);
      }
    }
    
    return () => {
      clearTimeout(barTimer);
      if (numberTimer) clearInterval(numberTimer);
    };
  }, [score, maxScore]);

  const displayValue = score !== undefined ? `${animatedScore}/${maxScore}` : value;

  return (
    <Card className="text-center flex flex-col">
      <div className="flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white my-2 tabular-nums">
          {displayValue}
        </p>
        <p className={`text-xs text-gray-500 dark:text-gray-400 min-h-[2.5rem] ${isJustification ? 'italic' : ''}`}>
          {isJustification ? `"${description}"` : description}
        </p>
      </div>
      {score !== undefined && (
        <div className="mt-auto pt-2">
          <div className="w-full bg-gray-200 dark:bg-brand-light-gray/50 rounded-full h-2 overflow-hidden">
            <div
              ref={progressBarRef}
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `0%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={maxScore}
              aria-label={`${title} score: ${score} out of ${maxScore}`}
            ></div>
          </div>
        </div>
      )}
    </Card>
  );
};

const AnalyzePage: React.FC = () => {
  // Fix: Initialize navigate using useNavigate hook
  const navigate = useNavigate();
  const { domain } = useParams<{ domain: string }>();
  const { currentAnalysis, setCurrentAnalysis } = useDomain();
  const { showToast } = useToast();
  const { addAnalysisToHistory } = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!domain) return;

    const fetchAllData = async () => {
        setIsLoading(true);
        setIsLogoLoading(true);
        setLogoDataUrl('');

        try {
            const analysisData = await analyzeDomain(domain);
            setCurrentAnalysis(analysisData);
            
            addAnalysisToHistory({
              id: Date.now().toString(),
              timestamp: Date.now(),
              analysis: analysisData,
            });

            setIsLoading(false);

            const base64Image = await generateImage(analysisData.logoSuggestion.prompt);
            setLogoDataUrl(`data:image/png;base64,${base64Image}`);
        } catch (err) {
            showToast('error', 'Failed to load domain analysis. Please try again.');
            console.error(err);
            setIsLoading(false);
        } finally {
            setIsLogoLoading(false);
        }
    };
    
    fetchAllData();
  }, [domain, setCurrentAnalysis, showToast, addAnalysisToHistory]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !currentAnalysis) return;
    setIsGeneratingPdf(true);
    try {
        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            backgroundColor: '#0f172a',
            useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${currentAnalysis.domain}-appraisal.pdf`);

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        showToast('error', "Sorry, we couldn't generate the PDF report.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleDownloadLogo = () => {
    if (!logoDataUrl || !domain) return;
    const link = document.createElement('a');
    link.href = logoDataUrl;
    link.download = `${domain.split('.')[0]}-logo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', `${label} copied to clipboard!`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SEO title={`Analyzing ${domain}...`} />
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!domain) {
      return <p className="text-center">No domain specified.</p>;
  }

  if (!currentAnalysis) {
    return <p className="text-center">No domain analysis available. Please generate and analyze a domain first.</p>;
  }
  
  const { brandability, brandabilityJustification, seoStrength, seoStrengthJustification, estimatedValue, summary, logoSuggestion, colorPalette, tagline, domainAge, risks, alternativeSuggestions, metaDescription, metaKeywords } = currentAnalysis;
  const namecheapLink = AFFILIATE_LINKS.NAMECHEAP.replace('{{domain}}', domain);

  return (
    <>
      <SEO 
        title={`${domain} Appraisal & SEO Report`} 
        description={`Full domain analysis for ${domain}. Brandability: ${brandability}/10, SEO Strength: ${seoStrength}/10. Estimated value: $${estimatedValue.toLocaleString()}.`}
      />
      {/* Off-screen component for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px' }}>
          {currentAnalysis && <PdfReport ref={reportRef} analysis={currentAnalysis} logoDataUrl={logoDataUrl} />}
      </div>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2 font-mono">{domain}</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">In-depth AI Analysis & Appraisal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Brandability" value={`${brandability}/10`} description={brandabilityJustification} score={brandability} isJustification={true} />
            <StatCard title="SEO Strength" value={`${seoStrength}/10`} description={seoStrengthJustification} score={seoStrength} isJustification={true} />
            <StatCard title="Domain Age" value={domainAge} description="How long the domain has been registered." />
            <StatCard title="Estimated Value" value={`$${estimatedValue.toLocaleString()}`} description="AI-powered market value appraisal." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-2 text-indigo-500 dark:text-indigo-400">AI Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
          </Card>
          
          <Card>
            <h3 className="text-xl font-semibold mb-2 text-yellow-500 dark:text-yellow-400">Risks</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{risks}</p>
          </Card>
        </div>

        <Card className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-cyan-500 dark:text-cyan-400">SEO Meta Kit</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suggested Meta Description</label>
                <button onClick={() => copyToClipboard(metaDescription, 'Meta Description')} className="text-indigo-500 hover:text-indigo-600 flex items-center text-xs font-semibold">
                  <ClipboardDocumentIcon className="w-4 h-4 mr-1" /> Copy
                </button>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-brand-dark/50 border border-gray-200 dark:border-brand-light-gray/20 rounded-md text-gray-800 dark:text-gray-200 text-sm">
                {metaDescription}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suggested Meta Keywords</label>
                <button onClick={() => copyToClipboard(metaKeywords, 'Meta Keywords')} className="text-indigo-500 hover:text-indigo-600 flex items-center text-xs font-semibold">
                  <ClipboardDocumentIcon className="w-4 h-4 mr-1" /> Copy
                </button>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-brand-dark/50 border border-gray-200 dark:border-brand-light-gray/20 rounded-md text-gray-800 dark:text-gray-200 text-sm font-mono">
                {metaKeywords}
              </div>
            </div>
          </div>
        </Card>
        
        {alternativeSuggestions && alternativeSuggestions.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold mb-2 text-green-500 dark:text-green-400">Alternative Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {alternativeSuggestions.map((alt, index) => (
                <div key={`${alt}-${index}`} className="text-center font-mono p-3 bg-gray-100 dark:bg-brand-gray/80 rounded-md text-gray-800 dark:text-gray-200 border border-transparent hover:border-indigo-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/analyze/${alt}`)}>
                  {alt}
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4 text-indigo-500 dark:text-indigo-400">Branding Kit</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Suggested Tagline</h4>
                <p className="text-lg italic text-cyan-600 dark:text-cyan-400">"{tagline}"</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Color Palette</h4>
                <div className="flex space-x-4 mt-2">
                  {colorPalette.map(color => (
                    <div key={color} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-brand-light-gray group relative" style={{ backgroundColor: color }}>
                       <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Logo Suggestion</h4>
                <div className="flex items-start gap-4 mt-2">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-brand-light-gray flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-brand-light-gray/20">
                      {isLogoLoading ? (
                          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      ) : (
                          logoDataUrl && <img src={logoDataUrl} alt="AI generated logo suggestion" className="w-full h-full rounded-lg object-cover shadow-sm"/>
                      )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight"><strong>Logo Prompt:</strong> {logoSuggestion.prompt}</p>
                    {!isLogoLoading && logoDataUrl && (
                        <Button size="sm" variant="secondary" onClick={handleDownloadLogo} className="mt-3">
                            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                            Download PNG
                        </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-semibold mb-4 text-indigo-500 dark:text-indigo-400">Acquisition</h3>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">Take the first step to securing your brand.</p>
              <a href={namecheapLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full shadow-lg shadow-indigo-500/20">Register Domain (Namecheap)</Button>
              </a>
               <Button 
                  variant="secondary" 
                  className="w-full" 
                  disabled={isGeneratingPdf}
                  onClick={handleDownloadPdf}
                >
                  {isGeneratingPdf ? 'Building Report...' : 'Download Full PDF Appraisal'}
              </Button>
              <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest pt-2">
                  Secure checkout via namecheap
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AnalyzePage;