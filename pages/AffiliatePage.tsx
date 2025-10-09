import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AffiliatePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-4">
          Partner With Us
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Join the DomainOgen Affiliate Program and earn by sharing the future of domain generation.</p>
      </div>

      <Card className="mt-10 text-gray-700 dark:text-gray-300 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Why Partner with DomainOgen?</h2>
        <p>
          Our affiliate program is designed for content creators, marketers, and tech enthusiasts who want to share our innovative tools with their audience. We offer competitive commissions, a trusted brand, and a product that practically sells itself.
        </p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Generous Commissions:</strong> Earn a recurring commission for every Pro user you refer.</li>
            <li><strong>High Conversion Rate:</strong> Our unique AI tools and clean user experience lead to high engagement and sign-ups.</li>
            <li><strong>Marketing Assets:</strong> Access a library of banners, links, and content to help you promote DomainOgen.</li>
            <li><strong>Dedicated Support:</strong> Our affiliate team is here to help you succeed.</li>
        </ul>
        <div className="text-center pt-4">
            <Button>Become an Affiliate (Coming Soon)</Button>
        </div>
      </Card>
    </div>
  );
};

export default AffiliatePage;