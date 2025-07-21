import { JobPosting } from '../types';

// Fetch real job postings from Adzuna API
export async function fetchJobPostings(companyName: string): Promise<JobPosting[]> {
  const APP_ID = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
  const API_KEY = process.env.NEXT_PUBLIC_ADZUNA_API_KEY;

  if (!APP_ID || !API_KEY) {
    console.error('Adzuna API credentials are missing.');
    return [];
  }

  try {
    // Search for software engineering jobs at the given company
    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${API_KEY}&results_per_page=10&what=software engineer&company=${encodeURIComponent(companyName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }
    return data.results.map((job: any) => ({
      id: job.id || job.__CLASS__ || job.redirect_url,
      title: job.title,
      company: job.company?.display_name || companyName,
      location: job.location?.display_name || '',
      description: job.description,
      url: job.redirect_url,
      postedDate: job.created,
      salary: job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : undefined,
      jobType: job.contract_time,
      experience: job.category?.label,
      skills: extractSkillsFromDescription(job.description || '')
    }));
  } catch (error) {
    console.error('Error fetching from Adzuna:', error);
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

// For compatibility with the rest of the app
export async function fetchJobPostingsFromAPI(companyName: string): Promise<JobPosting[]> {
  return fetchJobPostings(companyName);
} 