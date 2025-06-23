'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Target } from 'lucide-react';
import { MergedData } from '../types';
import { generateMapDataWithGeocoding, CityMapData } from '../utils/dataProcessing';

interface CompanyMapProps {
  data: MergedData[];
  onCompanyClick?: (companyId: string) => void;
}

export default function CompanyMap({ data, onCompanyClick }: CompanyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [cityMapData, setCityMapData] = useState<CityMapData[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setCityMapData(null);
    generateMapDataWithGeocoding(data).then(result => {
      if (isMounted) {
        setCityMapData(result);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [data]);

  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== 'undefined' && mapRef.current && cityMapData && cityMapData.length > 0) {
        const L = await import('leaflet');
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstanceRef.current);
        }
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        // Add city markers
        cityMapData.forEach((city) => {
          const markerSize = 10 + Math.min(city.count, 10) * 3; // scale with company count
          const marker = L.circleMarker([city.lat, city.lng], {
            radius: markerSize,
            fillColor: '#2563eb',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapInstanceRef.current);
          // Popup with clickable company names
          const popupContent = document.createElement('div');
          popupContent.className = 'p-2';
          popupContent.innerHTML = `
            <h3 class="font-semibold text-gray-900 mb-1">${city.city ? city.city + ', ' : ''}${city.state ? city.state + ', ' : ''}${city.country}</h3>
            <p class="text-sm text-gray-600 mb-2">${city.count} compan${city.count === 1 ? 'y' : 'ies'} in this city</p>
            <ul class="list-disc pl-4 text-xs text-gray-700"></ul>
          `;
          const ul = popupContent.querySelector('ul');
          city.companies.forEach(item => {
            const li = document.createElement('li');
            if (onCompanyClick) {
              const btn = document.createElement('button');
              btn.textContent = `${item.company.name} (${item.company.industry || 'Industry N/A'})`;
              btn.className = 'text-blue-600 hover:underline focus:outline-none bg-transparent border-0 p-0 m-0 cursor-pointer';
              btn.onclick = (e) => {
                e.preventDefault();
                onCompanyClick(item.company.id);
                marker.closePopup();
              };
              li.appendChild(btn);
            } else {
              li.textContent = `${item.company.name} (${item.company.industry || 'Industry N/A'})`;
            }
            ul?.appendChild(li);
          });
          marker.bindPopup(popupContent);
          markersRef.current.push(marker);
        });
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
  }, [cityMapData, onCompanyClick]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span className="text-gray-500">Geocoding company locations...</span>
      </div>
    );
  }

  if (!cityMapData || cityMapData.length === 0) {
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
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
            <span>Companies per City</span>
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
          <span className="text-gray-600">Total Cities</span>
          <span className="font-semibold">{cityMapData.length}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Total Companies</span>
          <span className="font-semibold">{data.length}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Largest City Group</span>
          <span className="font-semibold">{Math.max(...cityMapData.map(c => c.count))} companies</span>
        </div>
      </div>
    </motion.div>
  );
} 