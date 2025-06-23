'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Target } from 'lucide-react';
import { MergedData } from '../types';
import { generateMapData } from '../utils/dataProcessing';

interface CompanyMapProps {
  data: MergedData[];
}

export default function CompanyMap({ data }: CompanyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      if (typeof window !== 'undefined' && mapRef.current && data.length > 0) {
        const L = await import('leaflet');
        
        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Initialize map
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstanceRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        const mapData = generateMapData(data);
        mapData.forEach((item) => {
          const getPriorityColor = (priority: string) => {
            switch (priority) {
              case 'High': return '#ef4444';
              case 'Medium': return '#f59e0b';
              case 'Low': return '#6b7280';
              default: return '#6b7280';
            }
          };

          const getPrioritySize = (priority: string) => {
            switch (priority) {
              case 'High': return 12;
              case 'Medium': return 10;
              case 'Low': return 8;
              default: return 8;
            }
          };

          const marker = L.circleMarker([item.lat, item.lng], {
            radius: getPrioritySize(item.priority),
            fillColor: getPriorityColor(item.priority),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapInstanceRef.current);

          const popupContent = `
            <div class="p-2">
              <h3 class="font-semibold text-gray-900 mb-1">${item.company.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${item.company.industry || 'Industry not specified'}</p>
              <div class="flex items-center space-x-4 text-xs text-gray-500">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  ${item.contactCount} contacts
                </span>
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  ${item.priority} priority
                </span>
              </div>
              ${item.company.employeeCount ? `
                <p class="text-xs text-gray-500 mt-1">
                  ${item.company.employeeCount.toLocaleString()} employees
                </p>
              ` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
          markersRef.current.push(marker);
        });

        // Fit map to markers if there are any
        if (markersRef.current.length > 0) {
          const group = L.featureGroup(markersRef.current);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No data available for map visualization</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border"
        style={{ minHeight: '400px' }}
      />
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Total Companies</span>
          <span className="font-semibold">{data.length}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">High Priority</span>
          <span className="font-semibold text-red-600">
            {data.filter(item => item.priority === 'High').length}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Avg Sales Fit</span>
          <span className="font-semibold">
            {Math.round(data.reduce((sum, item) => sum + item.salesFitScore, 0) / data.length)}
          </span>
        </div>
      </div>
    </motion.div>
  );
} 