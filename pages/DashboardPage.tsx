import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const DashboardPage: React.FC = () => {
  const { favorites, toggleFavorite } = useDomain();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user.isPro) {
    return (
      <Card className="text-center max-w-lg mx-auto py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Unlock Your Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Saving and managing favorite domains is a Pro feature. Upgrade your plan to get access.</p>
        <Button onClick={() => navigate('/pricing')}>View Pro Plans</Button>
      </Card>
    );
  }
  
  const filteredFavorites = favorites.filter(domain => 
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-8">
        My Favorite Domains
      </h1>
      
      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">You haven't favorited any domains yet.</p>
          <Button onClick={() => navigate('/generate')} className="mt-4">
            Start Generating
          </Button>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm bg-white dark:bg-brand-dark border border-gray-300 dark:border-brand-light-gray rounded-md px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              aria-label="Search favorited domains"
            />
          </div>
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
    </div>
  );
};

export default DashboardPage;