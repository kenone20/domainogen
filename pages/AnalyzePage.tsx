import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
import { AFFILIATE_LINKS } from '../constants';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  score?: number;
  maxScore?: number;
}> = ({ title, value, description, score, maxScore = 10 }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the progress bar on mount
    const barTimer = setTimeout(() => {
      if (progressBarRef.current && score !== undefined) {
        progressBarRef.current.style.width = `${(score / maxScore) * 100}%`;
      }
    }, 100);

    // Animate the score number
    let numberTimer: number | undefined;
    if (score !== undefined) {
      setAnimatedScore(0); // Start animation from 0
      if (score > 0) {
        const duration = 1000; // Match the progress bar's duration
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
        <p className="text-xs text-gray-500 dark:text-gray-400 min-h-[2.5rem]">{description}</p>
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
            // Fetch analysis which contains the prompt
            const analysisData = await analyzeDomain(domain);
            setCurrentAnalysis(analysisData);
            
            addAnalysisToHistory({
              id: Date.now().toString(),
              timestamp: Date.now(),
              analysis: analysisData,
            });

            setIsLoading(false); // Analysis is loaded, main content can show

            // Fetch logo using the prompt from the analysis
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
    // We only want this effect to run when the domain parameter in the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, setCurrentAnalysis, showToast, addAnalysisToHistory]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !currentAnalysis) return;
    setIsGeneratingPdf(true);
    try {
        const canvas = await html2canvas(reportRef.current, {
            scale: 2, // Higher scale for better quality
            backgroundColor: '#0f172a', // Match the dark theme
            useCORS: true, // For the logo image
        });
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions to maintain aspect ratio within a standard A4 page width (approx 595pt)
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
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
  
  const { brandability, brandabilityJustification, seoStrength, seoStrengthJustification, estimatedValue, summary, logoSuggestion, colorPalette, tagline, domainAge, risks, alternativeSuggestions } = currentAnalysis;
  const namecheapLink = AFFILIATE_LINKS.NAMECHEAP.replace('{{domain}}', domain);

  return (
    <>
      {/* Off-screen component for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px' }}>
          {currentAnalysis && <PdfReport ref={reportRef} analysis={currentAnalysis} logoDataUrl={logoDataUrl} />}
      </div>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2 font-mono">{domain}</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">In-depth AI Analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Brandability" value={`${brandability}/10`} description={brandabilityJustification} score={brandability} />
            <StatCard title="SEO Strength" value={`${seoStrength}/10`} description={seoStrengthJustification} score={seoStrength} />
            <StatCard title="Domain Age" value={domainAge} description="How long the domain has been registered." />
            <StatCard title="Estimated Value" value={`$${estimatedValue.toLocaleString()}`} description="AI-powered market value appraisal." />
        </div>

        <Card className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-indigo-500 dark:text-indigo-400">AI Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">{summary}</p>
        </Card>
        
        {risks && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold mb-2 text-yellow-500 dark:text-yellow-400">Risks & Considerations</h3>
            <p className="text-gray-700 dark:text-gray-300">{risks}</p>
          </Card>
        )}
        
        {alternativeSuggestions && alternativeSuggestions.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-xl font-semibold mb-2 text-green-500 dark:text-green-400">Alternative Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {alternativeSuggestions.map((alt, index) => (
                <div key={`${alt}-${index}`} className="text-center font-mono p-3 bg-gray-100 dark:bg-brand-gray/80 rounded-md text-gray-800 dark:text-gray-200">
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
                    <div key={color} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-brand-light-gray" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Logo Suggestion</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-brand-light-gray flex-shrink-0 flex items-center justify-center">
                      {isLogoLoading ? (
                          <svg className="animate-spin h-8 w-8 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      ) : (
                          logoDataUrl && <img src={logoDataUrl} alt="AI generated logo suggestion" className="w-full h-full rounded-lg object-cover"/>
                      )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-1"><strong>Logo Prompt:</strong> {logoSuggestion.prompt}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-semibold mb-4 text-indigo-500 dark:text-indigo-400">Next Steps</h3>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">Ready to make this domain yours?</p>
              <a href={namecheapLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Purchase on Namecheap</Button>
              </a>
               <Button 
                  variant="secondary" 
                  className="w-full" 
                  disabled={isGeneratingPdf}
                  onClick={handleDownloadPdf}
                >
                  {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Appraisal Report'}
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  Purchasing through our links is a great way to support DomainOgen.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AnalyzePage;