import React from 'react';
import Card from '../components/ui/Card';

const ApiDocsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-4">
          DomainOgen API
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Integrate the power of AI domain generation into your own application.</p>
      </div>

      <Card className="mt-10 text-gray-700 dark:text-gray-300 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Coming Soon!</h2>
        <p>
          We are working hard to build a robust, scalable, and easy-to-use API that will allow you to access our core technologies. Our developer API will provide endpoints for:
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li>AI-powered domain name generation.</li>
            <li>Batch domain availability checks.</li>
            <li>In-depth domain analysis and valuation.</li>
        </ul>
        <p>
            Stay tuned for more information. If you're interested in being a beta tester, please contact us.
        </p>
      </Card>
    </div>
  );
};

export default ApiDocsPage;