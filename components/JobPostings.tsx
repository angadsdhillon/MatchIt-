'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  Code, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { JobPosting } from '../types';
import { fetchJobPostings } from '../utils/jobService';

interface JobPostingsProps {
  companyName: string;
}

export default function JobPostings({ companyName }: JobPostingsProps) {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobs = await fetchJobPostings(companyName);
        setJobPostings(jobs);
      } catch (err) {
        setError('Failed to load job postings');
        console.error('Error loading job postings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobPostings();
  }, [companyName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading job postings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (jobPostings.length === 0) {
    return (
      <div className="text-center py-8">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No software engineering job postings found for {companyName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
          Software Engineering Job Postings ({jobPostings.length})
        </h4>
      </div>
      
      <div className="grid gap-4">
        {jobPostings.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 text-lg mb-1">
                  {job.title}
                </h5>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Apply
              </a>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {job.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {job.salary && (
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{job.salary}</span>
                </div>
              )}
              
              {job.jobType && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{job.jobType}</span>
                </div>
              )}
              
              {job.experience && (
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span>{job.experience}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center mb-2">
                  <Code className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Required Skills:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 