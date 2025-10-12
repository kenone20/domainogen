import React from 'react';
import Card from '../components/ui/Card';

const PricingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-2">
          Pricing
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Simple and transparent.</p>
      </div>

      <Card className="mt-12 text-center py-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pricing Plans Coming Soon!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We are currently finalizing our pricing structure. In the meantime, please enjoy all features of DomainOgen completely free of charge.
        </p>
      </Card>
    </div>
  );
};

export default PricingPage;