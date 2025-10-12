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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 300));

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

export const getDomainAge = async (domainName: string): Promise<string> => {
  console.log(`Fetching age for ${domainName}... (MOCK)`);
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const name = domainName.split('.')[0]?.toLowerCase() || '';
  const tld = `.${domainName.split('.')[1]?.toLowerCase() || ''}`;

  // Rule 1: Elite, "blue-chip" .com domains (single dictionary word). Almost guaranteed to be old.
  if (tld === '.com' && commonDictionaryWords.includes(name)) {
      if (Math.random() > 0.05) { // 95% chance it's very old
          const age = Math.floor(Math.random() * 10) + 15; // 15-25 years
          return `${age} years`;
      }
  }

  // Rule 2: Very high-value .com domains (short, 4-5 letters).
  if (tld === '.com' && name.length <= 5) {
      if (Math.random() > 0.15) { // 85% chance it's old
          const age = Math.floor(Math.random() * 15) + 8; // 8-23 years
          return `${age} years`;
      }
  }

  // Rule 3: High-value tech domains (contains tech term, popular TLD).
  if (commonTechTerms.some(term => name.includes(term)) && popularTlds.includes(tld)) {
      if (Math.random() > 0.3) { // 70% chance it has age
          const age = Math.floor(Math.random() * 10) + 3; // 3-12 years
          return `${age} years`;
      }
  }

  // Rule 4: Moderately valuable domains (short-ish name OR on a popular TLD).
  if (name.length <= 8 || popularTlds.includes(tld)) {
      if (Math.random() > 0.5) { // 50% chance it has some age
        const age = Math.floor(Math.random() * 7) + 1; // 1-7 years
        return `${age} year${age > 1 ? 's' : ''}`;
      }
  }

  // Rule 5: Default case for less valuable/more unique/longer domains. Most likely new.
  if (Math.random() > 0.1) { // 90% chance of being new
      return "New";
  } else {
      const age = Math.floor(Math.random() * 2) + 1; // Small (10%) chance it's 1-2 years old
      return `${age} year${age > 1 ? 's' : ''}`;
  }
};