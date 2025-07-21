'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Target,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react';
import { MergedData } from '../types';
import JobPostings from './JobPostings';
import ChatAI from './ChatAI';

interface DataTableProps {
  data: MergedData[];
  expandCompanyId?: string;
}

type SortField = 'company' | 'industry' | 'employeeCount' | 'salesFitScore' | 'priority' | 'contactCount';
type SortDirection = 'asc' | 'desc';

export default function DataTable({ data, expandCompanyId }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('salesFitScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showContactDetails, setShowContactDetails] = useState(true);
  const [openChatRows, setOpenChatRows] = useState<Set<string>>(new Set());

  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  useEffect(() => {
    if (expandCompanyId) {
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.add(expandCompanyId);
        return newSet;
      });
      setTimeout(() => {
        const row = rowRefs.current[expandCompanyId];
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [expandCompanyId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleRowExpansion = (companyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleChatRow = (companyId: string) => {
    const newOpenChats = new Set(openChatRows);
    if (newOpenChats.has(companyId)) {
      newOpenChats.delete(companyId);
    } else {
      newOpenChats.add(companyId);
    }
    setOpenChatRows(newOpenChats);
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'company':
        aValue = a.company.name.toLowerCase();
        bValue = b.company.name.toLowerCase();
        break;
      case 'industry':
        aValue = (a.company.industry || '').toLowerCase();
        bValue = (b.company.industry || '').toLowerCase();
        break;
      case 'employeeCount':
        aValue = a.company.employeeCount || 0;
        bValue = b.company.employeeCount || 0;
        break;
      case 'salesFitScore':
        aValue = a.salesFitScore;
        bValue = b.salesFitScore;
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      case 'contactCount':
        aValue = a.contactCount;
        bValue = b.contactCount;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSalesFitColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Table Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Companies & Contacts ({data.length})
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowContactDetails(!showContactDetails)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              {showContactDetails ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showContactDetails ? 'Hide' : 'Show'} Contacts
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Founded
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('industry')}
              >
                <div className="flex items-center">
                  Industry
                  {sortField === 'industry' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('employeeCount')}
              >
                <div className="flex items-center">
                  Size
                  {sortField === 'employeeCount' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('salesFitScore')}
              >
                <div className="flex items-center">
                  Sales Fit
                  {sortField === 'salesFitScore' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center">
                  Priority
                  {sortField === 'priority' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contactCount')}
              >
                <div className="flex items-center">
                  Contacts
                  {sortField === 'contactCount' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => [
              <motion.tr
                key={item.company.id}
                ref={el => { rowRefs.current[item.company.id] = el; }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.company.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.company.city && item.company.state 
                          ? `${item.company.city}, ${item.company.state}`
                          : item.company.country || 'Location not specified'
                        }
                      </div>
                      {item.company.website && (
                        <a 
                          href={item.company.website.startsWith('http') ? item.company.website : `https://${item.company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.company.founded ? item.company.founded : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.company.industry || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.company.employeeCount ? item.company.employeeCount.toLocaleString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getSalesFitColor(item.salesFitScore)}`}>
                      {item.salesFitScore}/100
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.salesFitScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    {item.contactCount}
                    {item.decisionMakerCount > 0 && (
                      <span className="ml-2 text-xs text-green-600">
                        ({item.decisionMakerCount} decision makers)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => toggleRowExpansion(item.company.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {expandedRows.has(item.company.id) ? 'Hide' : 'View'} Details
                  </button>
                  <button
                    onClick={() => toggleChatRow(item.company.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    {openChatRows.has(item.company.id) ? 'Close AI' : 'Ask AI'}
                  </button>
                </td>
              </motion.tr>,
              showContactDetails && expandedRows.has(item.company.id) && (
                <tr key={`contacts-${item.company.id}`}>
                  <td colSpan={7} className="bg-gray-50 p-0">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Contacts at {item.company.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>Sales Fit Score: {item.salesFitScore}/100</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {/* Contacts Section */}
                        <div>
                          <h5 className="text-md font-semibold text-gray-900 mb-3">Company Contacts</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {item.contacts.map((contact) => (
                              <div key={contact.id} className="bg-white rounded-lg border p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-900">{contact.fullName}</h5>
                                    <p className="text-sm text-gray-600">{contact.title}</p>
                                    {contact.department && (
                                      <p className="text-xs text-gray-500">{contact.department}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {contact.seniority && (
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {contact.seniority}
                                      </span>
                                    )}
                                    {contact.decisionMaker && (
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Decision Maker
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  {contact.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Mail className="w-3 h-3 mr-2" />
                                      <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                                        {contact.email}
                                      </a>
                                    </div>
                                  )}
                                  {contact.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Phone className="w-3 h-3 mr-2" />
                                      <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                                        {contact.phone}
                                      </a>
                                    </div>
                                  )}
                                  {contact.linkedinUrl && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <ExternalLink className="w-3 h-3 mr-2" />
                                      <a 
                                        href={contact.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-blue-600"
                                      >
                                        LinkedIn Profile
                                      </a>
                                    </div>
                                  )}
                                  {contact.contactScore && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Target className="w-3 h-3 mr-2" />
                                      <span>Contact Score: {contact.contactScore}/100</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Job Postings Section */}
                        <div className="border-t pt-6">
                          <JobPostings companyName={item.company.name} />
                        </div>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              ),
              openChatRows.has(item.company.id) && (
                <tr key={`ai-chat-${item.company.id}`}>
                  <td colSpan={8} className="bg-gray-50 p-0">
                    <div className="p-6 border-b last:border-b-0">
                      <ChatAI 
                        company={item.company} 
                        onClose={() => toggleChatRow(item.company.id)} 
                      />
                    </div>
                  </td>
                </tr>
              )
            ])}
          </tbody>
        </table>
      </div>
    </div>
  );
} 