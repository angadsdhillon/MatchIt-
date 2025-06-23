'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MergedData } from '../types';
import { generateFilterOptions } from '../utils/dataProcessing';

interface FilterPanelProps {
  data: MergedData[];
  filters: {
    companySize: string[];
    industries: string[];
    locations: string[];
    seniority: string[];
    priority: string[];
    searchTerm: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterPanel({ data, filters, onFilterChange }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (data.length > 0) {
      setFilterOptions(generateFilterOptions(data));
    }
  }, [data]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      companySize: [],
      industries: [],
      locations: [],
      seniority: [],
      priority: [],
      searchTerm: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return count + (value ? 1 : 0);
    }, 0);
  };

  if (!filterOptions) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 space-y-6"
        >
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or contacts..."
                value={localFilters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size
            </label>
            <div className="space-y-2">
              {filterOptions.companySize.map((size: string) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.companySize.includes(size)}
                    onChange={(e) => {
                      const newSizes = e.target.checked
                        ? [...localFilters.companySize, size]
                        : localFilters.companySize.filter(s => s !== size);
                      handleFilterChange('companySize', newSizes);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industries
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {filterOptions.industries.slice(0, 10).map((industry: string) => (
                <label key={industry} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.industries.includes(industry)}
                    onChange={(e) => {
                      const newIndustries = e.target.checked
                        ? [...localFilters.industries, industry]
                        : localFilters.industries.filter(i => i !== industry);
                      handleFilterChange('industries', newIndustries);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{industry}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locations
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {filterOptions.locations.map((location: string) => (
                <label key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.locations.includes(location)}
                    onChange={(e) => {
                      const newLocations = e.target.checked
                        ? [...localFilters.locations, location]
                        : localFilters.locations.filter((l: string) => l !== location);
                      handleFilterChange('locations', newLocations);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seniority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Seniority
            </label>
            <div className="space-y-2">
              {filterOptions.seniority.map((seniority: string) => (
                <label key={seniority} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.seniority.includes(seniority)}
                    onChange={(e) => {
                      const newSeniority = e.target.checked
                        ? [...localFilters.seniority, seniority]
                        : localFilters.seniority.filter(s => s !== seniority);
                      handleFilterChange('seniority', newSeniority);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{seniority.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="space-y-2">
              {['High', 'Medium', 'Low'].map((priority) => (
                <label key={priority} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.priority.includes(priority)}
                    onChange={(e) => {
                      const newPriority = e.target.checked
                        ? [...localFilters.priority, priority]
                        : localFilters.priority.filter(p => p !== priority);
                      handleFilterChange('priority', newPriority);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (Array.isArray(value) && value.length > 0) {
                    return value.map((item) => (
                      <span
                        key={`${key}-${item}`}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {item}
                        <button
                          onClick={() => {
                            const newValue = value.filter(v => v !== item);
                            handleFilterChange(key, newValue);
                          }}
                          className="ml-1 hover:bg-blue-200 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ));
                  } else if (value && typeof value === 'string') {
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {value}
                        <button
                          onClick={() => handleFilterChange(key, '')}
                          className="ml-1 hover:bg-blue-200 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 