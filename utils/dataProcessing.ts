import { Company, Person, MergedData, DashboardStats, FilterOptions, MapData } from '../types';

// Normalize company names for better matching
export function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Merge companies and people datasets
export function mergeDatasets(companies: Company[], people: Person[]): MergedData[] {
  const mergedData: MergedData[] = [];
  
  companies.forEach(company => {
    const normalizedCompanyName = normalizeCompanyName(company.name);
    const companyContacts = people.filter(person => 
      normalizeCompanyName(person.company) === normalizedCompanyName
    );
    
    if (companyContacts.length > 0) {
      const decisionMakerCount = companyContacts.filter(contact => 
        contact.decisionMaker || 
        contact.seniority === 'C-Suite' || 
        contact.seniority === 'VP' ||
        contact.seniority === 'Director'
      ).length;
      
      const averageContactScore = companyContacts.length > 0 
        ? companyContacts.reduce((sum, contact) => sum + (contact.contactScore || 0), 0) / companyContacts.length
        : 0;
      
      const salesFitScore = calculateSalesFitScore(company, companyContacts);
      const priority = calculatePriority(salesFitScore, decisionMakerCount, company.employeeCount);
      
      mergedData.push({
        company,
        contacts: companyContacts,
        contactCount: companyContacts.length,
        decisionMakerCount,
        averageContactScore,
        salesFitScore,
        priority
      });
    }
  });
  
  return mergedData.sort((a, b) => b.salesFitScore - a.salesFitScore);
}

// Calculate sales fit score based on multiple factors
export function calculateSalesFitScore(company: Company, contacts: Person[]): number {
  let score = 0;
  
  // Company size factor (prefer medium-sized companies)
  if (company.employeeCount) {
    if (company.employeeCount >= 50 && company.employeeCount <= 500) {
      score += 30; // Ideal size for outsourcing
    } else if (company.employeeCount >= 10 && company.employeeCount <= 1000) {
      score += 20;
    } else {
      score += 10;
    }
  }
  
  // Contact quality factor
  const decisionMakers = contacts.filter(contact => 
    contact.decisionMaker || 
    contact.seniority === 'C-Suite' || 
    contact.seniority === 'VP'
  );
  score += decisionMakers.length * 15;
  
  // Contact information completeness
  const contactsWithEmail = contacts.filter(contact => contact.email);
  score += (contactsWithEmail.length / contacts.length) * 20;
  
  // Industry factor (prefer tech companies)
  if (company.industry && typeof company.industry === 'string') {
    const techKeywords = ['technology', 'software', 'saas', 'tech', 'digital', 'it', 'information'];
    const isTechCompany = techKeywords.some(keyword => 
      company.industry!.toLowerCase().includes(keyword)
    );
    if (isTechCompany) score += 15;
  }
  
  // Location factor (prefer US companies)
  if (company.country === 'United States' || company.country === 'USA') {
    score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
}

// Calculate priority level
export function calculatePriority(
  salesFitScore: number, 
  decisionMakerCount: number, 
  employeeCount?: number
): 'High' | 'Medium' | 'Low' {
  if (salesFitScore >= 70 && decisionMakerCount >= 2) return 'High';
  if (salesFitScore >= 50 && decisionMakerCount >= 1) return 'Medium';
  return 'Low';
}

// Generate dashboard statistics
export function generateDashboardStats(mergedData: MergedData[]): DashboardStats {
  const totalCompanies = mergedData.length;
  const totalContacts = mergedData.reduce((sum, item) => sum + item.contactCount, 0);
  const highPriorityTargets = mergedData.filter(item => item.priority === 'High').length;
  
  const averageCompanySize = mergedData.length > 0
    ? mergedData.reduce((sum, item) => sum + (item.company.employeeCount || 0), 0) / mergedData.length
    : 0;
  
  // Top industries
  const industryCounts: { [key: string]: number } = {};
  mergedData.forEach(item => {
    if (item.company.industry) {
      industryCounts[item.company.industry] = (industryCounts[item.company.industry] || 0) + 1;
    }
  });
  const topIndustries = Object.entries(industryCounts)
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Geographic distribution
  const locationCounts: { [key: string]: number } = {};
  mergedData.forEach(item => {
    const location = item.company.state || item.company.country || 'Unknown';
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });
  const geographicDistribution = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Contact role distribution
  const roleCounts: { [key: string]: number } = {};
  mergedData.forEach(item => {
    item.contacts.forEach(contact => {
      const role = contact.seniority || 'Unknown';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  });
  const contactRoleDistribution = Object.entries(roleCounts)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    totalCompanies,
    totalContacts,
    highPriorityTargets,
    averageCompanySize,
    topIndustries,
    geographicDistribution,
    contactRoleDistribution
  };
}

// Generate filter options from merged data
export function generateFilterOptions(mergedData: MergedData[]): FilterOptions {
  const companySizes = new Set<string>();
  const industries = new Set<string>();
  const locations = new Set<string>();
  const seniority = new Set<string>();
  const contactScores: number[] = [];
  const salesFitScores: number[] = [];
  
  mergedData.forEach(item => {
    // Company size categories
    if (item.company.employeeCount) {
      if (item.company.employeeCount < 50) companySizes.add('Small (1-49)');
      else if (item.company.employeeCount < 200) companySizes.add('Medium (50-199)');
      else if (item.company.employeeCount < 1000) companySizes.add('Large (200-999)');
      else companySizes.add('Enterprise (1000+)');
    }
    
    if (item.company.industry) industries.add(item.company.industry);
    if (item.company.state) locations.add(item.company.state);
    if (item.company.country) locations.add(item.company.country);
    
    item.contacts.forEach(contact => {
      if (contact.seniority) seniority.add(contact.seniority);
      if (contact.contactScore) contactScores.push(contact.contactScore);
    });
    
    salesFitScores.push(item.salesFitScore);
  });
  
  return {
    companySize: Array.from(companySizes).sort(),
    industries: Array.from(industries).sort(),
    locations: Array.from(locations).sort(),
    seniority: Array.from(seniority).sort(),
    contactScore: [Math.min(...contactScores), Math.max(...contactScores)],
    salesFitScore: [Math.min(...salesFitScores), Math.max(...salesFitScores)]
  };
}

// Generate map data for visualization
export function generateMapData(mergedData: MergedData[]): MapData[] {
  // This would typically use a geocoding service to get lat/lng
  // For demo purposes, we'll use mock coordinates
  const mockCoordinates = [
    { lat: 40.7128, lng: -74.0060 }, // NYC
    { lat: 34.0522, lng: -118.2437 }, // LA
    { lat: 41.8781, lng: -87.6298 }, // Chicago
    { lat: 29.7604, lng: -95.3698 }, // Houston
    { lat: 33.4484, lng: -112.0740 }, // Phoenix
    { lat: 39.7392, lng: -104.9903 }, // Denver
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 47.6062, lng: -122.3321 }, // Seattle
    { lat: 25.7617, lng: -80.1918 }, // Miami
    { lat: 32.7767, lng: -96.7970 }, // Dallas
  ];
  
  return mergedData.slice(0, 10).map((item, index) => ({
    lat: mockCoordinates[index % mockCoordinates.length].lat,
    lng: mockCoordinates[index % mockCoordinates.length].lng,
    company: item.company,
    contactCount: item.contactCount,
    priority: item.priority
  }));
}

// Filter merged data based on criteria
export function filterMergedData(
  data: MergedData[],
  filters: {
    companySize?: string[];
    industries?: string[];
    locations?: string[];
    seniority?: string[];
    priority?: string[];
    searchTerm?: string;
  }
): MergedData[] {
  return data.filter(item => {
    // Company size filter
    if (filters.companySize && filters.companySize.length > 0) {
      const companySize = item.company.employeeCount;
      let sizeCategory = '';
      if (companySize) {
        if (companySize < 50) sizeCategory = 'Small (1-49)';
        else if (companySize < 200) sizeCategory = 'Medium (50-199)';
        else if (companySize < 1000) sizeCategory = 'Large (200-999)';
        else sizeCategory = 'Enterprise (1000+)';
      }
      if (!filters.companySize.includes(sizeCategory)) return false;
    }
    
    // Industry filter
    if (filters.industries && filters.industries.length > 0) {
      if (!item.company.industry || !filters.industries.includes(item.company.industry)) {
        return false;
      }
    }
    
    // Location filter
    if (filters.locations && filters.locations.length > 0) {
      const location = item.company.state || item.company.country;
      if (!location || !filters.locations.includes(location)) return false;
    }
    
    // Seniority filter
    if (filters.seniority && filters.seniority.length > 0) {
      const hasMatchingSeniority = item.contacts.some(contact => 
        contact.seniority && filters.seniority!.includes(contact.seniority)
      );
      if (!hasMatchingSeniority) return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(item.priority)) return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesCompany = item.company.name.toLowerCase().includes(searchLower);
      const matchesContact = item.contacts.some(contact => 
        contact.fullName.toLowerCase().includes(searchLower) ||
        contact.title.toLowerCase().includes(searchLower)
      );
      if (!matchesCompany && !matchesContact) return false;
    }
    
    return true;
  });
} 