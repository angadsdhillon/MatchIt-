'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Users, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Company, Person } from '../types';

interface DataUploadProps {
  onDataUpload: (companies: Company[], people: Person[]) => void;
}

export default function DataUpload({ onDataUpload }: DataUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [peopleData, setPeopleData] = useState<Person[]>([]);
  
  const companiesFileRef = useRef<HTMLInputElement>(null);
  const peopleFileRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          
          if (file.name.endsWith('.csv')) {
            Papa.parse(content as string, {
              header: true,
              skipEmptyLines: true,
              complete: (results: any) => {
                console.log('CSV parsed successfully:', results.data.length, 'rows');
                resolve(results.data as any[]);
              },
              error: (error: any) => {
                console.error('CSV parsing error:', error);
                reject(error);
              }
            });
          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            try {
              const workbook = XLSX.read(new Uint8Array(content as ArrayBuffer), { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const data = XLSX.utils.sheet_to_json(worksheet);
              console.log('Excel parsed successfully:', data.length, 'rows');
              resolve(data as any[]);
            } catch (excelError) {
              console.error('Excel parsing error:', excelError);
              reject(excelError);
            }
          } else {
            reject(new Error('Unsupported file format. Please use CSV, XLSX, or XLS files.'));
          }
        } catch (error) {
          console.error('File processing error:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        console.error('File reading error');
        reject(new Error('Failed to read file'));
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const normalizeCompanyData = (data: any[]): Company[] => {
    console.log('Normalizing company data:', data.length, 'rows');
    return data.map((row, index) => ({
      id: row.id || `company-${index}`,
      name: row.name || row.company_name || row.company || '',
      website: row.website || row.url || '',
      industry: row.industry || row.sector || '',
      employeeCount: row.employee_count ? parseInt(row.employee_count) : undefined,
      revenue: row.revenue || '',
      founded: row.founded ? parseInt(row.founded) : undefined,
      city: row.city || '',
      state: row.state || row.province || '',
      country: row.country || '',
      zipCode: row.zip_code || row.postal_code || '',
      phone: row.phone || row.telephone || '',
      description: row.description || '',
      linkedinUrl: row.linkedin_url || row.linkedin || '',
      crunchbaseUrl: row.crunchbase_url || row.crunchbase || '',
      technologies: row.technologies ? row.technologies.split(',').map((t: string) => t.trim()) : [],
      funding: row.funding || '',
      lastUpdated: row.last_updated || row.updated_at || ''
    })).filter(company => company.name.trim() !== '');
  };

  const normalizePeopleData = (data: any[]): Person[] => {
    console.log('Normalizing people data:', data.length, 'rows');
    return data.map((row, index) => ({
      id: row.id || `person-${index}`,
      firstName: row.first_name || row.firstname || '',
      lastName: row.last_name || row.lastname || '',
      fullName: row.full_name || row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
      title: row.title || row.job_title || row.position || '',
      company: row.company || row.company_name || '',
      email: row.email || '',
      phone: row.phone || row.telephone || '',
      linkedinUrl: row.linkedin_url || row.linkedin || '',
      department: row.department || '',
      seniority: row.seniority || row.level || '',
      location: row.location || '',
      lastUpdated: row.last_updated || row.updated_at || '',
      decisionMaker: row.decision_maker === 'true' || row.decision_maker === true,
      contactScore: row.contact_score ? parseInt(row.contact_score) : Math.floor(Math.random() * 100) + 1
    })).filter(person => person.fullName.trim() !== '' && person.company.trim() !== '');
  };

  const handleFileUpload = async (file: File, type: 'companies' | 'people') => {
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      console.log(`Processing ${type} file:`, file.name, file.size, 'bytes');
      const data = await processFile(file);
      console.log(`Raw data received:`, data.length, 'rows');
      let normalizedData: any[] = [];
      if (type === 'companies') {
        normalizedData = normalizeCompanyData(data);
        console.log(`Normalized companies:`, normalizedData.length);
        setCompaniesData(normalizedData);
        setUploadMessage(`Successfully uploaded ${normalizedData.length} companies`);
      } else {
        normalizedData = normalizePeopleData(data);
        console.log(`Normalized people:`, normalizedData.length);
        setPeopleData(normalizedData);
        setUploadMessage(`Successfully uploaded ${normalizedData.length} people`);
      }
      
      setUploadStatus('success');
      
      // If both datasets are loaded, merge them
      if (type === 'companies' && peopleData.length > 0) {
        onDataUpload(normalizedData, peopleData);
      } else if (type === 'people' && companiesData.length > 0) {
        onDataUpload(companiesData, normalizedData);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadMessage(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'companies' | 'people') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Companies Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <Building2 className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">Companies Dataset</h3>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              companiesData.length > 0 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 hover:border-blue-400'
            }`}
            onDrop={(e) => handleDrop(e, 'companies')}
            onDragOver={handleDragOver}
          >
            {companiesData.length > 0 ? (
              <div className="text-green-700">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{companiesData.length} companies loaded</p>
                <p className="text-sm">Drop a new file to replace</p>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Drop your companies CSV/Excel file here, or
                </p>
                <button
                  onClick={() => companiesFileRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supports CSV, XLSX, XLS formats
                </p>
              </div>
            )}
          </div>
          
          <input
            ref={companiesFileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'companies');
            }}
            className="hidden"
          />
        </motion.div>

        {/* People Upload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">People Dataset</h3>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              peopleData.length > 0 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 hover:border-blue-400'
            }`}
            onDrop={(e) => handleDrop(e, 'people')}
            onDragOver={handleDragOver}
          >
            {peopleData.length > 0 ? (
              <div className="text-green-700">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{peopleData.length} people loaded</p>
                <p className="text-sm">Drop a new file to replace</p>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Drop your people CSV/Excel file here, or
                </p>
                <button
                  onClick={() => peopleFileRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supports CSV, XLSX, XLS formats
                </p>
              </div>
            )}
          </div>
          
          <input
            ref={peopleFileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'people');
            }}
            className="hidden"
          />
        </motion.div>
      </div>

      {/* Upload Status */}
      {uploadStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg flex items-center ${
            uploadStatus === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}
        >
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {uploadMessage}
        </motion.div>
      )}

      {/* Sample Data Info */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Expected Data Format</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-blue-800 mb-2">Companies Dataset</h5>
            <p className="text-blue-700 mb-2">Required fields: name</p>
            <p className="text-blue-600">Optional: website, industry, employee_count, city, state, country, phone, description</p>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 mb-2">People Dataset</h5>
            <p className="text-blue-700 mb-2">Required fields: full_name (or first_name + last_name), title, company</p>
            <p className="text-blue-600">Optional: email, phone, linkedin_url, department, seniority, location</p>
          </div>
        </div>
        
        {/* Quick Test Section */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">Quick Test</h5>
          <p className="text-blue-600 text-sm mb-2">
            Use the sample data files in the <code className="bg-blue-100 px-1 rounded">sample-data/</code> folder to test the application:
          </p>
          <ul className="text-blue-600 text-sm space-y-1">
            <li>• <code className="bg-blue-100 px-1 rounded">companies.csv</code> - Sample company data</li>
            <li>• <code className="bg-blue-100 px-1 rounded">people.csv</code> - Sample people data</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 