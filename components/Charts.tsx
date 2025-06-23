'use client';

import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { MergedData } from '../types';
import { generateDashboardStats } from '../utils/dataProcessing';

interface ChartsProps {
  data: MergedData[];
}

export default function Charts({ data }: ChartsProps) {
  const stats = generateDashboardStats(data);

  // Prepare data for charts
  const industryData = stats.topIndustries.map(item => ({
    name: item.industry,
    value: item.count
  }));

  const locationData = stats.geographicDistribution.slice(0, 8).map(item => ({
    name: item.location,
    value: item.count
  }));

  const salesFitDistribution = [
    { range: '80-100', count: data.filter(item => item.salesFitScore >= 80).length },
    { range: '60-79', count: data.filter(item => item.salesFitScore >= 60 && item.salesFitScore < 80).length },
    { range: '40-59', count: data.filter(item => item.salesFitScore >= 40 && item.salesFitScore < 60).length },
    { range: '0-39', count: data.filter(item => item.salesFitScore < 40).length }
  ];

  const companySizeDistribution = [
    { size: 'Small (1-49)', count: data.filter(item => (item.company.employeeCount || 0) < 50).length },
    { size: 'Medium (50-199)', count: data.filter(item => (item.company.employeeCount || 0) >= 50 && (item.company.employeeCount || 0) < 200).length },
    { size: 'Large (200-999)', count: data.filter(item => (item.company.employeeCount || 0) >= 200 && (item.company.employeeCount || 0) < 1000).length },
    { size: 'Enterprise (1000+)', count: data.filter(item => (item.company.employeeCount || 0) >= 1000).length }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Industry Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Industries</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={industryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Geographic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Sales Fit Score Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Fit Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesFitDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Company Size Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Size Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={companySizeDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {companySizeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Priority Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'High Priority', value: data.filter(item => item.priority === 'High').length },
                { name: 'Medium Priority', value: data.filter(item => item.priority === 'Medium').length },
                { name: 'Low Priority', value: data.filter(item => item.priority === 'Low').length }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell fill="#ef4444" />
              <Cell fill="#f59e0b" />
              <Cell fill="#6b7280" />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Contact Role Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Role Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.contactRoleDistribution.slice(0, 6)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="role" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
} 