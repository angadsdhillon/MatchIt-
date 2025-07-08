export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  revenue?: string;
  founded?: number;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  description?: string;
  linkedinUrl?: string;
  crunchbaseUrl?: string;
  technologies?: string[];
  funding?: string;
  lastUpdated?: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  department?: string;
  seniority?: 'C-Suite' | 'VP' | 'Director' | 'Manager' | 'Senior' | 'Mid-Level' | 'Junior';
  location?: string;
  lastUpdated?: string;
  decisionMaker?: boolean;
  contactScore?: number;
}

export interface MergedData {
  company: Company;
  contacts: Person[];
  contactCount: number;
  decisionMakerCount: number;
  averageContactScore: number;
  salesFitScore: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface FilterOptions {
  companySize: string[];
  industries: string[];
  locations: string[];
  seniority: string[];
  contactScore: number[];
  salesFitScore: number[];
}

export interface DashboardStats {
  totalCompanies: number;
  totalContacts: number;
  highPriorityTargets: number;
  averageCompanySize: number;
  topIndustries: Array<{ industry: string; count: number }>;
  geographicDistribution: Array<{ location: string; count: number }>;
  contactRoleDistribution: Array<{ role: string; count: number }>;
}

export interface MapData {
  lat: number;
  lng: number;
  company: Company;
  contactCount: number;
  priority: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  salary?: string;
  jobType?: string;
  experience?: string;
  skills?: string[];
} 