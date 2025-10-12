import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useHistory } from '../context/HistoryContext';
import { generateDomains } from '../services/geminiService';
import { checkAvailability, checkMultipleAvailability } from '../services/domainApiService';
import type { DomainSuggestion } from '../types';
import { TLD_OPTIONS, AFFILIATE_LINKS } from '../constants';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { StarIcon as StarIconSolid, ChevronDownIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

const DomainResultCard: React.FC<{ domain: DomainSuggestion, onToggleFavorite: (domain: DomainSuggestion) => void, onAnalyze: (name: string) => void }> = ({ domain, onToggleFavorite, onAnalyze }) => {
  const getAffiliateLink = (provider: keyof typeof AFFILIATE_LINKS) => {
    return AFFILIATE_LINKS[provider].replace('{{domain}}', domain.name);
  };

  const buttonClasses = "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-dark transition-all duration-200 ease-in-out";
  const primaryButtonClasses = "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 focus:ring-indigo-500";
  const smallSizeClasses = "px-2 py-1 text-sm";

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-brand-gray/30 rounded-lg animate-fade-in">
      <div className="flex items-center">
        <button onClick={() => onToggleFavorite(domain)} className="group mr-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-brand-light-gray transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-brand-gray focus:ring-yellow-500" aria-label={`Favorite ${domain.name}`}>
          {domain.isFavorited ? 
            <StarIconSolid className="w-6 h-6 text-yellow-400 transition-colors duration-200" /> : 
            <StarIconOutline className="w-6 h-6 text-gray-400 dark:text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" />
          }
        </button>
        <span className="font-mono text-lg text-gray-900 dark:text-white">{domain.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        {domain.status === 'available' ? (
          <>
            <a href={getAffiliateLink('NAMECHEAP')} target="_blank" rel="noopener noreferrer" className={`${buttonClasses} ${primaryButtonClasses} ${smallSizeClasses}`}>
              Buy Now
            </a>
            <Button onClick={() => onAnalyze(domain.name)} size="sm" variant="secondary">Analyze</Button>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-red-500 dark:text-red-400 capitalize">{domain.status}</span>
            <Button onClick={() => onAnalyze(domain.name)} size="sm" variant="secondary">Analyze</Button>
          </>
        )}
      </div>
    </div>
  );
};

const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const { suggestions, setSuggestions, toggleFavorite, favorites } = useDomain();
  const { useGeneration } = useUser();
  const { showToast } = useToast();
  const { addGenerationToHistory } = useHistory();

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Brandable');
  const [selectedTlds, setSelectedTlds] = useState<string[]>(['.com']);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isHowToOpen, setIsHowToOpen] = useState(false);

  const [manualDomain, setManualDomain] = useState('');
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [manualResult, setManualResult] = useState<DomainSuggestion | null>(null);
  
  const handleTldChange = (tld: string) => {
    setSelectedTlds(prev => 
      prev.includes(tld) ? prev.filter(t => t !== tld) : [...prev, tld]
    );
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }
  
  const runGeneration = useCallback(async (isMore = false) => {
    if (!prompt.trim()) {
      showToast('error', 'Please enter a prompt describing your idea.');
      return;
    }
    if (selectedTlds.length === 0) {
      showToast('error', 'Please select at least one TLD.');
      return;
    }
    
    isMore ? setIsLoadingMore(true) : setIsLoading(true);

    try {
      const newSuggestions = await generateDomains(prompt, style, selectedTlds);
      useGeneration();

      const domainNames = newSuggestions.map(s => s.name);
      const availabilityResults = await checkMultipleAvailability(domainNames);
      
      const availableSuggestions = newSuggestions
        .filter(s => availabilityResults[s.name])
        .map(s => ({ ...s, isFavorited: favorites.some(f => f.name === s.name), status: 'available' as const }));

      if (newSuggestions.length > 0 && availableSuggestions.length === 0) {
        showToast('info', 'AI generated some domains, but they were all taken. Try generating more or adjusting your prompt!');
      }

      if (!isMore) {
        const allSuggestionsWithStatus = newSuggestions.map(s => ({
            ...s,
            isFavorited: false,
            status: availabilityResults[s.name] ? 'available' : 'taken'
        } as DomainSuggestion));

        addGenerationToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          prompt,
          style,
          tlds: selectedTlds,
          suggestions: allSuggestionsWithStatus,
        });
      }

      setSuggestions(prev => isMore ? [...prev, ...availableSuggestions] : availableSuggestions);
      
    } catch (err) {
      showToast('error', 'AI failed to generate domains. Please try again later.');
      console.error(err);
    } finally {
      isMore ? setIsLoadingMore(false) : setIsLoading(false);
    }
  }, [prompt, style, selectedTlds, setSuggestions, useGeneration, showToast, addGenerationToHistory, favorites]);


  const handleManualCheck = async () => {
    const domainToCheck = manualDomain.trim().toLowerCase();
    if (!domainToCheck) return;
    
    setIsManualChecking(true);
    setManualResult(null);

    try {
        const isAvailable = await checkAvailability(domainToCheck);
        const isFavorited = favorites.some(fav => fav.name === domainToCheck);
        setManualResult({
            name: domainToCheck,
            status: isAvailable ? 'available' : 'taken',
            isFavorited: isFavorited
        });
    } catch (error) {
        showToast('error', 'Could not check domain availability.');
    } finally {
        setIsManualChecking(false);
    }
  };

  const handleToggleFavoriteManualResult = () => {
    if (!manualResult) return;
    // Create a new object with the toggled favorite state for local UI update
    const updatedResult = { ...manualResult, isFavorited: !manualResult.isFavorited };
    setManualResult(updatedResult);
    // Call the global context function to update the main favorites list
    toggleFavorite(manualResult);
  };


  const formInputClasses = "w-full bg-gray-50 dark:bg-brand-dark border border-gray-300 dark:border-brand-light-gray rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow";

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <div className="mb-4">
          <button onClick={() => setIsHowToOpen(!isHowToOpen)} className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-gray focus:ring-indigo-500 rounded-md p-1">
            How to Use
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isHowToOpen ? 'rotate-180' : ''}`} />
          </button>
          {isHowToOpen && (
            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-2 pl-2 border-l-2 border-gray-200 dark:border-brand-light-gray">
              <p><strong>1. Enter Your Prompt:</strong> Describe your business, product, or idea in the text area.</p>
              <p><strong>2. Choose a Style:</strong> Select a generation style that fits your brand (e.g., Brandable, Modern).</p>
              <p><strong>3. Select TLDs:</strong> Pick the domain extensions you're interested in (like .com, .ai).</p>
              <p><strong>4. Generate:</strong> Hit the generate button and let the AI create a list of available names for you.</p>
              <p><strong>5. Analyze & Favorite:</strong> Click 'Analyze' for an in-depth report or the star to save domains to your dashboard.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Prompt</label>
            <textarea id="prompt" value={prompt} onChange={handlePromptChange} placeholder="e.g., A SaaS for managing online courses" rows={3} className={formInputClasses}></textarea>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Style</label>
                 <select id="style" value={style} onChange={e => setStyle(e.target.value)} className={formInputClasses}>
                    <option>Brandable</option>
                    <option>Modern</option>
                    <option>Luxury</option>
                    <option>Techy</option>
                    <option>Two-word</option>
                 </select>
               </div>
           </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top-Level Domains (TLDs)</label>
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {TLD_OPTIONS.map(tld => (
                  <button key={tld} onClick={() => handleTldChange(tld)} className={`px-3 py-2 text-sm rounded-md transition-colors border ${selectedTlds.includes(tld) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-100 dark:bg-brand-gray border-gray-300 dark:border-brand-light-gray text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-light-gray'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-gray focus:ring-indigo-500`}>
                    {tld}
                  </button>
                ))}
             </div>
          </div>
          <div>
            <Button onClick={() => runGeneration(false)} isLoading={isLoading} disabled={isLoading} className="w-full mt-2">
              Generate Domains
            </Button>
          </div>
        </div>
      </Card>

      {isLoading && <div className="text-center p-8">Searching for available domains...</div>}
      
      {suggestions.length > 0 && (
        <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Domains</h2>
            <div className="space-y-3">
              {suggestions.map((domain, index) => (
                <DomainResultCard key={`${domain.name}-${index}`} domain={domain} onToggleFavorite={toggleFavorite} onAnalyze={(name) => navigate(`/analyze/${name}`)} />
              ))}
            </div>
             <div className="mt-6 text-center">
                <Button onClick={() => runGeneration(true)} isLoading={isLoadingMore} disabled={isLoadingMore} variant="secondary">
                  Generate More
                </Button>
             </div>
        </>
      )}

      <Card className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Check a Specific Domain</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={manualDomain}
            onChange={(e) => {
              setManualDomain(e.target.value);
              setManualResult(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleManualCheck()}
            placeholder="e.g., myidea.com"
            className={`flex-grow ${formInputClasses}`}
          />
          <Button onClick={handleManualCheck} isLoading={isManualChecking} disabled={!manualDomain.trim()} className="sm:w-auto">
            Check Availability
          </Button>
        </div>
        {isManualChecking && <div className="text-center p-4">Checking...</div>}
        {manualResult && !isManualChecking && (
          <div className="mt-4">
             <DomainResultCard domain={manualResult} onToggleFavorite={handleToggleFavoriteManualResult} onAnalyze={(name) => navigate(`/analyze/${name}`)} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default GeneratePage;