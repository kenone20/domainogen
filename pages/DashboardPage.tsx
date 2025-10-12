import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { useHistory } from '../context/HistoryContext';
import type { GenerationHistoryItem, AnalysisHistoryItem } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TrashIcon, ClockIcon, LightBulbIcon, DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';


const GenerationHistoryCard: React.FC<{ item: GenerationHistoryItem }> = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    return (
        <Card className="p-4 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <LightBulbIcon className="w-4 h-4 mr-2" />
                        <span>Domain Generation</span>
                        <span className="mx-2">•</span>
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Prompt: <span className="font-normal italic">"{item.prompt}"</span></p>
                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Style: {item.style} | TLDs: {item.tlds.join(', ')}</div>
                </div>
                 <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
                    {isExpanded ? 'Hide' : `Show ${item.suggestions.length} domains`}
                    <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
            </div>
            {isExpanded && (
                 <div className="mt-4 border-t border-gray-200 dark:border-brand-light-gray/20 pt-4 space-y-2">
                    {item.suggestions.map(s => (
                        <div key={s.name} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-brand-gray/30 p-2 rounded-md">
                            <span className="font-mono">{s.name}</span>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${s.status === 'available' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : s.status === 'taken' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-gray-200 dark:bg-brand-light-gray text-gray-600 dark:text-gray-400'}`}>
                                    {s.status}
                                </span>
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => navigate(`/analyze/${s.name}`)}>Analyze</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};


const AnalysisHistoryCard: React.FC<{ item: AnalysisHistoryItem }> = ({ item }) => {
    const navigate = useNavigate();
    return (
        <Card className="p-4 animate-fade-in flex justify-between items-center">
             <div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    <span>Domain Analysis</span>
                    <span className="mx-2">•</span>
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">{item.analysis.domain}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate(`/analyze/${item.analysis.domain}`)}>
                View Analysis
            </Button>
        </Card>
    );
};


const DashboardPage: React.FC = () => {
  const { favorites, toggleFavorite } = useDomain();
  const { history, clearHistory } = useHistory();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire history? This action cannot be undone.')) {
        clearHistory();
    }
  }

  const filteredFavorites = favorites.filter(domain => 
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = history.filter(item => {
      const term = searchTerm.toLowerCase();
      if (item.type === 'generation') {
          return item.data.prompt.toLowerCase().includes(term) || item.data.suggestions.some(s => s.name.toLowerCase().includes(term));
      }
      if (item.type === 'analysis') {
          return item.data.analysis.domain.toLowerCase().includes(term);
      }
      return false;
  });

  const tabClasses = (tabName: 'favorites' | 'history') => 
    `px-4 py-2 font-medium rounded-t-lg transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-brand-dark ${
        activeTab === tabName 
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
    }`;
  
  return (
    <div>
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-8">
        Dashboard
      </h1>

      <div className="border-b border-gray-200 dark:border-brand-light-gray/20 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button className={tabClasses('favorites')} onClick={() => setActiveTab('favorites')}>
            Favorites ({favorites.length})
            </button>
            <button className={tabClasses('history')} onClick={() => setActiveTab('history')}>
            History ({history.length})
            </button>
        </nav>
      </div>
        
      <div className="mb-6">
        <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm bg-white dark:bg-brand-dark border border-gray-300 dark:border-brand-light-gray rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            aria-label={`Search ${activeTab}`}
        />
      </div>

      {activeTab === 'favorites' && (
        <>
            {favorites.length === 0 ? (
                <Card className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">You haven't favorited any domains yet.</p>
                <Button onClick={() => navigate('/generate')} className="mt-4">
                    Start Generating
                </Button>
                </Card>
            ) : (
                 <>
                    {filteredFavorites.length > 0 ? (
                        <div className="space-y-4">
                        {filteredFavorites.map(domain => (
                            <Card key={domain.name} className="flex items-center justify-between p-4 animate-fade-in">
                            <span className="font-mono text-lg text-gray-900 dark:text-white">{domain.name}</span>
                            <div className="flex items-center space-x-2">
                                <Button variant="secondary" size="sm" onClick={() => navigate(`/analyze/${domain.name}`)}>
                                View Analysis
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(domain.name)}>
                                Remove
                                </Button>
                            </div>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No domains found matching your search.</p>
                        </Card>
                    )}
                 </>
            )}
        </>
      )}

      {activeTab === 'history' && (
        <div>
            {history.length === 0 ? (
                 <Card className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Your activity history will appear here.</p>
                    <Button onClick={() => navigate('/generate')} className="mt-4">
                        Start Generating
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="text-right">
                        <Button variant="ghost" size="sm" onClick={handleClearHistory} className="text-red-500 dark:text-red-400 hover:bg-red-500/10">
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Clear History
                        </Button>
                    </div>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map(item => {
                            if (item.type === 'generation') {
                                return <GenerationHistoryCard key={item.data.id} item={item.data} />;
                            }
                            if (item.type === 'analysis') {
                                return <AnalysisHistoryCard key={item.data.id} item={item.data} />;
                            }
                            return null;
                        })
                    ) : (
                        <Card className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No history found matching your search.</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;