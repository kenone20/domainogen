// This is a MOCK service to simulate checking domain availability.
// In a real application, you would integrate with an API like GoDaddy or WhoisXML.
// The logic below provides a more realistic simulation than Math.random().

// More comprehensive lists for more realistic results
const popularTlds = ['.com', '.io', '.ai', '.app', '.co'];
const commonTechTerms = ['app', 'ai', 'io', 'co', 'shop', 'store', 'crypto', 'web3', 'tech', 'data', 'cloud', 'labs', 'dev', 'link', 'net', 'flow', 'hub'];
const commonDictionaryWords = ['love', 'business', 'online', 'media', 'world', 'group', 'future', 'life', 'today', 'money', 'health', 'home', 'news'];

export const checkAvailability = async (domainName: string): Promise<boolean> => {
  console.log(`Checking availability for ${domainName}... (MOCK)`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 300));

  const name = domainName.split('.')[0]?.toLowerCase() || '';
  const tld = `.${domainName.split('.')[1]?.toLowerCase() || ''}`;

  // Rule 1: Very short names are almost always taken.
  // 3 chars or less is almost guaranteed to be taken on any TLD.
  if (name.length <= 3) {
    return false;
  }
  // 4 or 5 chars on a popular TLD is also very likely taken.
  if (name.length <= 5 && popularTlds.includes(tld)) {
    return Math.random() > 0.95; // 5% chance of being available
  }

  // Rule 2: Domains containing common tech/business terms are less likely to be available.
  if (commonTechTerms.some(term => name.includes(term))) {
    // If it's also a .com, it's even less likely.
    if (tld === '.com') {
        return Math.random() > 0.85; // 15% chance of being available
    }
    return Math.random() > 0.7; // 30% chance of being available
  }

  // Rule 3: Common single dictionary words for .com are very likely taken.
  if (tld === '.com' && commonDictionaryWords.includes(name)) {
      return false;
  }
  
  // Rule 4: .com domains in general are less available than others.
  if (tld === '.com') {
      return Math.random() > 0.5; // 50% chance of being available
  }

  // Rule 5: Default case for other domains. Make them mostly available to not frustrate the user.
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
  console.log(`Fetching age for ${domainName}...`);
  // Simulate network delay for Whois lookup
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  // Simulate different ages. 50% chance it's "New", otherwise a random age.
  if (Math.random() > 0.5) {
    return "New";
  }
  const age = Math.floor(Math.random() * 15) + 1;
  return `${age} year${age > 1 ? 's' : ''}`;
};