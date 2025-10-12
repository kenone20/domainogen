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

  // Rule 1: Very short names are almost always taken, especially on popular TLDs.
  if (name.length <= 3) {
    return false; // 3-letter domains are extremely rare.
  }
  if (name.length === 4 && tld === '.com') {
      return false; // 4-letter .coms are essentially all gone.
  }
  if (name.length <= 5 && popularTlds.includes(tld)) {
    return Math.random() > 0.98; // 2% chance of being available.
  }

  // Rule 2: Common single dictionary words are very likely taken on popular TLDs.
  if (commonDictionaryWords.includes(name) && popularTlds.includes(tld)) {
      return Math.random() > 0.95; // 5% chance of being available.
  }

  // Rule 3: Domains containing common tech/business terms are less likely to be available.
  if (commonTechTerms.some(term => name.includes(term))) {
    // If it's also a .com, it's even less likely.
    if (tld === '.com') {
        return Math.random() > 0.90; // 10% chance of being available.
    }
    if (popularTlds.includes(tld)) {
        return Math.random() > 0.80; // 20% chance of being available on other popular TLDs.
    }
    return Math.random() > 0.6; // 40% chance on less popular TLDs.
  }
  
  // Rule 4: .com domains in general are less available than others.
  if (tld === '.com') {
      return Math.random() > 0.7; // 30% chance of being available.
  }
  
  // Rule 5: .io and .ai are also quite saturated.
  if (tld === '.io' || tld === '.ai') {
      return Math.random() > 0.5; // 50% chance of being available.
  }

  // Rule 6: Default case for other domains. Make them mostly available to not frustrate the user.
  return Math.random() > 0.15; // 85% chance of being available for less common names/TLDs
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
  // Simulate network delay for Whois lookup
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const name = domainName.split('.')[0]?.toLowerCase() || '';
  const tld = `.${domainName.split('.')[1]?.toLowerCase() || ''}`;

  // Simulate age based on perceived value. More valuable domains are older.
  if (name.length <= 4 && tld === '.com') {
    const age = Math.floor(Math.random() * 15) + 10; // 10-25 years
    return `${age} years`;
  }
  if (name.length <= 6 || popularTlds.includes(tld)) {
    if (Math.random() > 0.4) { // 60% chance of being registered
      const age = Math.floor(Math.random() * 10) + 1; // 1-10 years
      return `${age} year${age > 1 ? 's' : ''}`;
    }
  }
  
  // If it's a long name or less common TLD, it's more likely to be new.
  if (Math.random() > 0.1) { // 90% chance of being new for less desirable names
      return "New";
  } else {
      const age = Math.floor(Math.random() * 5) + 1; // Small chance it has some age
      return `${age} year${age > 1 ? 's' : ''}`;
  }
};