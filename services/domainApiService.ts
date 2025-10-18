import { AFFILIATE_LINKS } from '../constants';
// This is a MOCK service to simulate checking domain availability.
// In a real application, you would integrate with an API like GoDaddy or WhoisXML.
// The logic below provides a more realistic simulation than Math.random().

// Expanded lists for more realistic filtering
const popularTlds = ['.com', '.io', '.ai', '.app', '.co', '.dev'];
const commonTechTerms = [
    'app', 'ai', 'io', 'co', 'shop', 'store', 'crypto', 'web3', 'tech', 'data', 
    'cloud', 'labs', 'dev', 'link', 'net', 'flow', 'hub', 'sync', 'digital', 'systems'
];
const commonDictionaryWords = [
    'love', 'business', 'online', 'media', 'world', 'group', 'future', 'life', 'today',
    'money', 'health', 'home', 'news', 'art', 'style', 'food', 'travel', 'work', 'play'
];

export const checkAvailability = async (domainName: string): Promise<boolean> => {
  console.log(`Checking availability for ${domainName}... (MOCK)`);
  // Simulate a faster, real-time-like network delay.
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

  const name = domainName.split('.')[0]?.toLowerCase() || '';
  const tld = `.${domainName.split('.')[1]?.toLowerCase() || ''}`;

  // This mock logic is intentionally strict to simulate real-world scarcity
  // of good domain names, improving the user experience by reducing the
  // number of "available" domains that would likely be taken.

  // Rule 1: Very short names are almost always taken, especially on popular TLDs.
  if (name.length <= 4 && popularTlds.includes(tld)) {
    return Math.random() > 0.995; // 0.5% chance, these are virtually all gone.
  }
  if (name.length <= 3) {
    return false; // 3-letter domains are extremely rare.
  }

  // Rule 2: Common single dictionary words are extremely likely taken on popular TLDs.
  if (commonDictionaryWords.includes(name) && tld === '.com') {
      return false; // Effectively 0% chance.
  }
   if (commonDictionaryWords.includes(name) && popularTlds.includes(tld)) {
      return Math.random() > 0.99; // 1% chance of being available.
  }

  // Rule 3: Domains containing common tech/business terms are less likely to be available.
  if (commonTechTerms.some(term => name.includes(term))) {
    // If it's also a .com, it's even less likely.
    if (tld === '.com') {
        return Math.random() > 0.97; // 3% chance of being available.
    }
    if (popularTlds.includes(tld)) {
        return Math.random() > 0.95; // 5% chance of being available on other popular TLDs.
    }
    return Math.random() > 0.8; // 20% chance on less popular TLDs.
  }
  
  // Rule 4: .com domains in general are less available than others.
  if (tld === '.com') {
      return Math.random() > 0.90; // 10% chance of being available.
  }
  
  // Rule 5: .io and .ai are also quite saturated.
  if (tld === '.io' || tld === '.ai') {
      return Math.random() > 0.85; // 15% chance of being available.
  }

  // Rule 6: Default case for other domains.
  return Math.random() > 0.60; // 40% chance of being available for less common names/TLDs
};


export const checkMultipleAvailability = async (domainNames: string[]): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};
  const promises = domainNames.map(async (name) => {
    const isAvailable = await checkAvailability(name);
    results[name] = isAvailable;
  });
  await Promise.all(promises);
  return results;
};

// This mock function simulates fetching a domain's age with realistic, nuanced logic
// to improve the accuracy of the AI analysis.
export const getDomainAge = async (domainName: string): Promise<string> => {
  console.log(`Fetching age for ${domainName}... (MOCK)`);
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const name = domainName.split('.')[0]?.toLowerCase() || '';
  const tld = `.${domainName.split('.')[1]?.toLowerCase() || ''}`;
  const nameLength = name.length;

  // --- .com domains (most valuable and oldest) ---
  if (tld === '.com') {
    // Rule 1: Elite, single dictionary word .coms are almost always very old.
    if (commonDictionaryWords.includes(name)) {
      if (Math.random() > 0.05) { // 95% chance it's from the dot-com era
        const age = Math.floor(Math.random() * 11) + 18; // 18-28 years
        return `${age} years`;
      }
      const age = Math.floor(Math.random() * 6) + 10; // 10-15 years
      return `${age} years`;
    }

    // Rule 2: Very short .coms are also extremely old.
    if (nameLength <= 4) {
      if (Math.random() > 0.02) { // 98% chance of being 16-25 years old
         const age = Math.floor(Math.random() * 10) + 16;
         return `${age} years`;
      }
      const age = Math.floor(Math.random() * 8) + 5; // 5-12 years (simulates a dropped domain)
      return `${age} years`;
    }
    if (nameLength === 5) {
      if (Math.random() > 0.10) { // 90% chance of being 10-20 years old
        const age = Math.floor(Math.random() * 11) + 10;
        return `${age} years`;
      }
      const age = Math.floor(Math.random() * 6) + 3; // 3-8 years
      return `${age} years`;
    }

    // Rule 3: .coms with tech terms often have significant age.
    if (commonTechTerms.some(term => name.includes(term))) {
         if (Math.random() > 0.25) { // 75% chance it has age
            const age = Math.floor(Math.random() * 13) + 4; // 4-16 years
            return `${age} years`;
        }
    }
    
    // Rule 4: General .coms still have a good chance of being aged.
     if (Math.random() > 0.4) { // 60% chance of having some age
        const age = Math.floor(Math.random() * 10) + 2; // 2-11 years
        return `${age} year${age > 1 ? 's' : ''}`;
     }
  }

  // --- .ai and .io domains (newer tech gold rush) ---
  if (tld === '.ai' || tld === '.io') {
    if (commonTechTerms.some(term => name.includes(term)) || nameLength <= 5) {
        if (Math.random() > 0.2) { // 80% chance it's registered
            const age = Math.floor(Math.random() * 7) + 2; // 2-8 years
            return `${age} years`;
        }
    }
    if (Math.random() > 0.6) { // 40% chance for other .ai/.io names
        const age = Math.floor(Math.random() * 5) + 1; // 1-5 years
        return `${age} year${age > 1 ? 's' : ''}`;
    }
  }

  // --- Other popular new TLDs (.co, .dev, .app) ---
  if (['.co', '.dev', 'app'].includes(tld)) {
    if (Math.random() > 0.5) { // 50% chance it has some age
        const age = Math.floor(Math.random() * 4) + 1; // 1-4 years
        return `${age} year${age > 1 ? 's' : ''}`;
    }
  }

  // --- Default Case: Newer TLDs or long/unique names, most are new ---
  if (Math.random() > 0.15) { // 85% chance of being new
    if (Math.random() > 0.9) { // Small chance of being a few months old
        const months = Math.floor(Math.random() * 8) + 3;
        return `${months} months`;
    }
    return "New";
  }
  
  // 15% chance of being 1-2 years old
  const age = Math.floor(Math.random() * 2) + 1;
  return `${age} year${age > 1 ? 's' : ''}`;
};
