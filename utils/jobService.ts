import { JobPosting } from '../types';

// Mock job postings data - fallback when APIs are unavailable
const mockJobPostings: { [companyName: string]: JobPosting[] } = {
  'TechCorp Solutions': [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for developing and maintaining our core platform.',
      url: 'https://indeed.com/viewjob?jk=123456',
      postedDate: '2024-01-15',
      salary: '$120,000 - $150,000',
      jobType: 'Full-time',
      experience: '5+ years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Remote',
      description: 'Join our frontend team to build beautiful, responsive user interfaces that delight our customers.',
      url: 'https://indeed.com/viewjob?jk=123457',
      postedDate: '2024-01-10',
      salary: '$90,000 - $110,000',
      jobType: 'Full-time',
      experience: '3+ years',
      skills: ['React', 'Vue.js', 'CSS', 'JavaScript']
    }
  ],
  'InnovateTech Inc': [
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'InnovateTech Inc',
      location: 'New York, NY',
      description: 'We need a Full Stack Developer to help us build the next generation of our platform.',
      url: 'https://indeed.com/viewjob?jk=123458',
      postedDate: '2024-01-12',
      salary: '$100,000 - $130,000',
      jobType: 'Full-time',
      experience: '4+ years',
      skills: ['Python', 'Django', 'React', 'PostgreSQL']
    }
  ],
  'DataFlow Systems': [
    {
      id: '4',
      title: 'Data Engineer',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      description: 'Help us build scalable data pipelines and infrastructure to support our analytics platform.',
      url: 'https://indeed.com/viewjob?jk=123459',
      postedDate: '2024-01-08',
      salary: '$110,000 - $140,000',
      jobType: 'Full-time',
      experience: '4+ years',
      skills: ['Python', 'Spark', 'Kafka', 'AWS']
    },
    {
      id: '5',
      title: 'Machine Learning Engineer',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      description: 'Join our ML team to develop cutting-edge algorithms and models.',
      url: 'https://indeed.com/viewjob?jk=123460',
      postedDate: '2024-01-05',
      salary: '$130,000 - $160,000',
      jobType: 'Full-time',
      experience: '5+ years',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL']
    }
  ]
};

// Adzuna API - Free job search API (requires registration for API key)
async function fetchFromAdzuna(companyName: string): Promise<JobPosting[]> {
  try {
    // You'll need to sign up at https://developer.adzuna.com/
    const APP_ID = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
    const API_KEY = process.env.NEXT_PUBLIC_ADZUNA_API_KEY;
    
    if (!APP_ID || !API_KEY) {
      console.warn('Adzuna API credentials not found. Using mock data.');
      return [];
    }

    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${API_KEY}&results_per_page=10&what=software engineer&company=${encodeURIComponent(companyName)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      url: job.redirect_url,
      postedDate: job.created,
      salary: job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : undefined,
      jobType: job.contract_time,
      experience: job.category.label,
      skills: job.description ? extractSkillsFromDescription(job.description) : []
    }));
  } catch (error) {
    console.error('Error fetching from Adzuna:', error);
    return [];
  }
}

// GitHub Jobs API (deprecated but still accessible)
async function fetchFromGitHubJobs(companyName: string): Promise<JobPosting[]> {
  try {
    const response = await fetch(
      `https://jobs.github.com/positions.json?search=software engineer&company=${encodeURIComponent(companyName)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub Jobs API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
      postedDate: job.created_at,
      salary: undefined, // GitHub Jobs doesn't provide salary info
      jobType: job.type,
      experience: undefined,
      skills: job.description ? extractSkillsFromDescription(job.description) : []
    }));
  } catch (error) {
    console.error('Error fetching from GitHub Jobs:', error);
    return [];
  }
}

// Web scraping approach using our Next.js API route
async function fetchFromWebScraping(companyName: string): Promise<JobPosting[]> {
  try {
    const response = await fetch(`/api/jobs?company=${encodeURIComponent(companyName)}`);
    
    if (!response.ok) {
      throw new Error(`Web scraping API error: ${response.status}`);
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error('Error with web scraping:', error);
    return [];
  }
}

// Helper function to extract skills from job description
function extractSkillsFromDescription(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'Django', 'Flask', 'Express',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'REST', 'GraphQL', 'Microservices', 'Machine Learning', 'AI', 'Data Science'
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.slice(0, 5); // Limit to 5 skills
}

// Main function to fetch job postings
export async function fetchJobPostings(companyName: string): Promise<JobPosting[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Try real APIs first, fall back to mock data
  let jobs: JobPosting[] = [];
  
  // Try Adzuna API first
  jobs = await fetchFromAdzuna(companyName);
  if (jobs.length > 0) {
    return jobs;
  }
  
  // Try GitHub Jobs API
  jobs = await fetchFromGitHubJobs(companyName);
  if (jobs.length > 0) {
    return jobs;
  }
  
  // Try web scraping approach
  jobs = await fetchFromWebScraping(companyName);
  if (jobs.length > 0) {
    return jobs;
  }
  
  // Fall back to mock data
  return mockJobPostings[companyName] || [];
}

// Alternative implementation using a real job API (you would need to sign up for API keys)
export async function fetchJobPostingsFromAPI(companyName: string): Promise<JobPosting[]> {
  return fetchJobPostings(companyName);
} 