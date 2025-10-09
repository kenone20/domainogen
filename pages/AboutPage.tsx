import React from 'react';
import Card from '../components/ui/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-4">
          About DomainOgen
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">The smartest way to find your next great domain.</p>
      </div>

      <Card className="mt-10 text-gray-700 dark:text-gray-300 space-y-4">
        <p>
          DomainOgen was born from a simple idea: finding the perfect domain name should be inspiring, not frustrating. In today's digital landscape, a great domain is the cornerstone of a brand's identity. It needs to be memorable, relevant, and available. That's a tall order.
        </p>
        <p>
          We leverage the power of advanced AI to break through the creative block. By understanding your ideas, keywords, and desired brand style, our generator provides unique, brandable domain suggestions in seconds.
        </p>
        <p>
          But we don't stop there. We provide in-depth analysis on SEO strength, brandability, and estimated value, giving you the data you need to make an informed decision. Our goal is to empower entrepreneurs, creators, and businesses to launch their next big idea with the perfect digital address.
        </p>
      </Card>
    </div>
  );
};

export default AboutPage;