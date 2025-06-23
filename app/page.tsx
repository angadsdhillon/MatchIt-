'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, BarChart3, Map, Users, Target, TrendingUp, Filter, Search, Download } from 'lucide-react';
import { Company, Person, MergedData } from '../types';
import { mergeDatasets, generateDashboardStats, generateFilterOptions, filterMergedData } from '../utils/dataProcessing';
import DataUpload from '../components/DataUpload';
import DashboardStats from '../components/DashboardStats';
import CompanyMap from '../components/CompanyMap';
import DataTable from '../components/DataTable';
import FilterPanel from '../components/FilterPanel';
import Charts from '../components/Charts';

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [mergedData, setMergedData] = useState<MergedData[]>([]);
  const [filteredData, setFilteredData] = useState<MergedData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    companySize: [] as string[],
    industries: [] as string[],
    locations: [] as string[],
    seniority: [] as string[],
    priority: [] as string[],
    searchTerm: ''
  });

  // Merge datasets when both are loaded
  useEffect(() => {
    if (companies.length > 0 && people.length > 0) {
      const merged = mergeDatasets(companies, people);
      setMergedData(merged);
      setFilteredData(merged);
      setIsDataLoaded(true);
    }
  }, [companies, people]);

  // Apply filters when they change
  useEffect(() => {
    if (mergedData.length > 0) {
      const filtered = filterMergedData(mergedData, filters);
      setFilteredData(filtered);
    }
  }, [filters, mergedData]);

  const handleDataUpload = (companyData: Company[], peopleData: Person[]) => {
    setCompanies(companyData);
    setPeople(peopleData);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const exportData = () => {
    const csvContent = generateCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-intelligence-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (data: MergedData[]) => {
    const headers = [
      'Company Name',
      'Industry',
      'Employee Count',
      'Location',
      'Website',
      'Sales Fit Score',
      'Priority',
      'Contact Count',
      'Decision Maker Count',
      'Top Contact Name',
      'Top Contact Title',
      'Top Contact Email'
    ];

    const rows = data.map(item => [
      item.company.name,
      item.company.industry || '',
      item.company.employeeCount || '',
      `${item.company.city || ''}, ${item.company.state || ''}`,
      item.company.website || '',
      item.salesFitScore,
      item.priority,
      item.contactCount,
      item.decisionMakerCount,
      item.contacts[0]?.fullName || '',
      item.contacts[0]?.title || '',
      item.contacts[0]?.email || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                PIT Solutions Sales Intelligence Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your company and people datasets into actionable sales insights. 
                Upload your Success AI data and get comprehensive intelligence for your sales team.
              </p>
            </div>
            
            <DataUpload onDataUpload={handleDataUpload} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Upload className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Datasets</h3>
                <p className="text-gray-600">Import your company and people data from Success AI or other sources</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <BarChart3 className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analyze Insights</h3>
                <p className="text-gray-600">Get comprehensive analytics and sales fit scoring</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Target className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Target Prospects</h3>
                <p className="text-gray-600">Identify high-priority targets with contact information</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Intelligence Dashboard</h1>
              <p className="text-sm text-gray-600">
                {filteredData.length} companies • {filteredData.reduce((sum, item) => sum + item.contactCount, 0)} contacts
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'companies', name: 'Companies', icon: Users },
              { id: 'map', name: 'Geographic View', icon: Map },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterPanel
              data={mergedData}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <DashboardStats data={filteredData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Charts data={filteredData} />
                  <CompanyMap data={filteredData} />
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <DataTable data={filteredData} />
            )}

            {activeTab === 'map' && (
              <div className="space-y-6">
                <CompanyMap data={filteredData} />
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
                  <p className="text-gray-600">
                    View your target companies on an interactive map. Click on markers to see company details and contacts.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <Charts data={filteredData} />
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>
                  <p className="text-gray-600">
                    Deep dive into your data with comprehensive charts and insights to optimize your sales strategy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 