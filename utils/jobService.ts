import { JobPosting } from '../types';

// Mock job postings data - in a real implementation, this would be replaced with actual API calls
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

export async function fetchJobPostings(companyName: string): Promise<JobPosting[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data for demonstration
  // In a real implementation, this would make an API call to Indeed, LinkedIn, or similar
  return mockJobPostings[companyName] || [];
}

// Alternative implementation using a real job API (you would need to sign up for API keys)
export async function fetchJobPostingsFromAPI(companyName: string): Promise<JobPosting[]> {
  try {
    // Example using a hypothetical job API
    // const response = await fetch(`https://api.jobs.com/search?company=${encodeURIComponent(companyName)}&category=software-engineering`);
    // const data = await response.json();
    // return data.jobs.map((job: any) => ({
    //   id: job.id,
    //   title: job.title,
    //   company: job.company,
    //   location: job.location,
    //   description: job.description,
    //   url: job.url,
    //   postedDate: job.posted_date,
    //   salary: job.salary,
    //   jobType: job.job_type,
    //   experience: job.experience,
    //   skills: job.skills
    // }));
    
    // For now, return mock data
    return fetchJobPostings(companyName);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return [];
  }
} 