'use client';

import { motion } from 'framer-motion';
import { Users, Building2, Target, TrendingUp, MapPin, Award } from 'lucide-react';
import { MergedData } from '../types';
import { generateDashboardStats } from '../utils/dataProcessing';

interface DashboardStatsProps {
  data: MergedData[];
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = generateDashboardStats(data);
  
  const statCards = [
    {
      title: 'Total Companies',


      
      value: stats.totalCompanies,
      icon: Building2,
      color: 'blue',
      description: 'Companies with contacts'
    },
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: Users,
      color: 'green',
      description: 'People across all companies'
    },
    {
      title: 'High Priority Targets',
      value: stats.highPriorityTargets,
      icon: Target,
      color: 'red',
      description: 'Companies with high sales fit score'
    },
    {
      title: 'Avg Company Size',
      value: Math.round(stats.averageCompanySize),
      icon: TrendingUp,
      color: 'purple',
      description: 'Average employee count'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-full border ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Industries and Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Industries */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center mb-4">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Top Industries</h3>
          </div>
          <div className="space-y-3">
            {stats.topIndustries.map((industry, index) => (
              <div key={industry.industry} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{industry.industry}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(industry.count / stats.topIndustries[0].count) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{industry.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
          </div>
          <div className="space-y-3">
            {stats.geographicDistribution.slice(0, 5).map((location, index) => (
              <div key={location.location} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 mr-3 flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{location.location}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(location.count / stats.geographicDistribution[0].count) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{location.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Priority Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { priority: 'High', count: data.filter(item => item.priority === 'High').length, color: 'bg-red-500' },
            { priority: 'Medium', count: data.filter(item => item.priority === 'Medium').length, color: 'bg-yellow-500' },
            { priority: 'Low', count: data.filter(item => item.priority === 'Low').length, color: 'bg-gray-500' }
          ].map((item) => (
            <div key={item.priority} className="text-center">
              <div className={`w-16 h-16 rounded-full ${item.color} mx-auto mb-2 flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{item.count}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{item.priority} Priority</p>
              <p className="text-xs text-gray-500">
                {data.length > 0 ? Math.round((item.count / data.length) * 100) : 0}% of total
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Role Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Role Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stats.contactRoleDistribution.slice(0, 6).map((role) => (
            <div key={role.role} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">{role.count}</p>
              <p className="text-xs text-gray-600 capitalize">{role.role.replace('-', ' ')}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 