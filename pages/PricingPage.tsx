import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';

const CheckIcon: React.FC = () => (
  <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const PricingCard: React.FC<{ title: string; price: string; description: string; features: string[]; isFeatured?: boolean }> = ({ title, price, description, features, isFeatured = false }) => {
  const { user, togglePro } = useUser();
  const isCurrentPlan = (title === 'Pro' && user.isPro) || (title === 'Free' && !user.isPro);
  
  return (
    <Card className={`flex flex-col ${isFeatured ? 'border-2 border-indigo-500 transform scale-105' : ''}`}>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{description}</p>
      <p className="mt-6">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{price}</span>
        {price !== 'Free' && <span className="text-base font-medium text-gray-500 dark:text-gray-400">/mo</span>}
      </p>
      <ul className="mt-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon />
            <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button 
          className="w-full" 
          variant={isFeatured ? 'primary' : 'secondary'}
          onClick={togglePro}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : (title === 'Pro' ? 'Upgrade to Pro' : 'Switch to Free')}
        </Button>
      </div>
    </Card>
  );
};

const PricingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 mb-2">
          Find the Perfect Plan
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Unlock more power and find the perfect domain faster.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingCard
          title="Free"
          price="Free"
          description="Perfect for getting started and exploring your first few ideas."
          features={[
            '5 AI Generations per day',
            'Standard Availability Checks',
            'Basic Domain Analysis',
            'Manual Domain Checker'
          ]}
        />
        <PricingCard
          title="Pro"
          price="$9.99"
          description="For power users, startups, and professionals ready to build a brand."
          features={[
            'Unlimited AI Generations',
            'Advanced AI Analysis & Valuation',
            'Save & Manage Favorite Domains',
            'Downloadable PDF Appraisal Reports',
            'Full Branding Kit (Logo, Tagline, Colors)',
            'Priority Support',
          ]}
          isFeatured
        />
      </div>
    </div>
  );
};

export default PricingPage;