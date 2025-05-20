'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BarChart4, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

// Sample data for charts
const teamPerformanceData = [
  { name: 'Team A', value: 85, color: '#0089AD' },
  { name: 'Team B', value: 72, color: '#34C3FF' },
  { name: 'Team C', value: 93, color: '#005F77' },
  { name: 'Team D', value: 64, color: '#00B3E6' },
];

const projectStatusData = [
  { name: 'Completed', value: 12, color: '#0089AD' },
  { name: 'In Progress', value: 8, color: '#34C3FF' },
  { name: 'Planning', value: 5, color: '#005F77' },
  { name: 'On Hold', value: 3, color: '#00B3E6' },
];

const recentActivities = [
  { id: 1, user: 'Alex Johnson', action: 'completed task', item: 'UI Design Review', time: '2 hours ago' },
  { id: 2, user: 'Sarah Miller', action: 'created project', item: 'Q3 Marketing Campaign', time: '4 hours ago' },
  { id: 3, user: 'David Chen', action: 'updated document', item: 'Project Requirements', time: '6 hours ago' },
  { id: 4, user: 'Emma Wilson', action: 'commented on', item: 'Budget Proposal', time: 'Yesterday' },
];

// Chart components
const BarChart = ({ data }: { data: typeof teamPerformanceData }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="h-64 flex items-end space-x-4 mt-4 mb-2">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full rounded-t-lg relative group cursor-pointer"
              style={{ backgroundColor: item.color }}
              whileHover={{ y: -5 }}
              onClick={() => toast.info(`${item.name}: ${item.value}%`, { description: 'Click for detailed report' })}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                {item.name}: {item.value}%
              </div>
            </motion.div>
            <span className="text-xs mt-2 text-gray-600">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const PieChartComponent = ({ data }: { data: typeof projectStatusData }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <div className="relative h-64 flex items-center justify-center mt-4">
      <svg width="200" height="200" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const endAngle = startAngle + angle;
          
          // Calculate the path for the pie slice
          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
          
          // Create the path
          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          const currentStartAngle = startAngle;
          startAngle = endAngle;
          
          return (
            <motion.path
              key={index}
              d={pathData}
              fill={item.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toast.info(`${item.name}: ${item.value} projects (${percentage.toFixed(1)}%)`, { description: 'Click for detailed report' })}
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-xs">
            <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Card component with neumorphic design
const NeumorphicCard = ({ 
  title, 
  children, 
  icon, 
  delay = 0,
  expandable = false
}: { 
  title: string; 
  children: React.ReactNode; 
  icon: React.ReactNode;
  delay?: number;
  expandable?: boolean;
}) => {
  const [expanded, setExpanded] = useState(!expandable);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-2xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] bg-white overflow-hidden"
    >
      <div 
        className={`p-6 ${expandable ? 'cursor-pointer' : ''}`}
        onClick={() => expandable && setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0089AD]/10 text-[#0089AD] flex items-center justify-center">
              {icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          {expandable && (
            <button className="text-gray-500 hover:text-[#0089AD] transition-colors">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  delay = 0 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  delay?: number;
}) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] bg-white"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className={`text-xs flex items-center mt-2 ${trendColor}`}>
            {trend === 'up' ? (
              <TrendingUp size={14} className="mr-1" />
            ) : trend === 'down' ? (
              <TrendingUp size={14} className="mr-1 transform rotate-180" />
            ) : (
              <span className="w-3.5 h-0.5 bg-gray-300 mr-1" />
            )}
            {trendValue}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0089AD]/10 text-[#0089AD] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default function ManagerDashboard() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-[#0089AD] text-white flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Team and project management</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Team Members" 
          value={28} 
          icon={<Users size={24} />} 
          trend="up" 
          trendValue="+3 this month"
          delay={0.1}
        />
        <StatCard 
          title="Active Projects" 
          value={16} 
          icon={<Activity size={24} />} 
          trend="up" 
          trendValue="+2 from last month"
          delay={0.2}
        />
        <StatCard 
          title="Tasks Completed" 
          value={142} 
          icon={<CheckCircle size={24} />} 
          trend="up" 
          trendValue="+23% from last week"
          delay={0.3}
        />
        <StatCard 
          title="Upcoming Deadlines" 
          value={7} 
          icon={<Clock size={24} />} 
          trend="down" 
          trendValue="-2 from last week"
          delay={0.4}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <NeumorphicCard title="Team Performance" icon={<BarChart4 size={20} />} delay={0.2}>
          <p className="text-sm text-gray-600 mb-4">Performance metrics across teams</p>
          <BarChart data={teamPerformanceData} />
          <div className="mt-4 text-right">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('Detailed report will be emailed to you', { description: 'Check your inbox in a few minutes' })}
            >
              View detailed report
            </button>
          </div>
        </NeumorphicCard>

        <NeumorphicCard title="Project Status" icon={<PieChart size={20} />} delay={0.3}>
          <p className="text-sm text-gray-600 mb-4">Current status of all projects</p>
          <PieChartComponent data={projectStatusData} />
          <div className="mt-4 text-right">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('Project status report generated', { description: 'Download started automatically' })}
            >
              Generate report
            </button>
          </div>
        </NeumorphicCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NeumorphicCard title="Recent Activities" icon={<Activity size={20} />} delay={0.4} expandable={false}>
            <div className="space-y-4 mt-2">
              {recentActivities.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0089AD]/10 text-[#0089AD] flex items-center justify-center mr-3">
                    <Users size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-[#0089AD] text-sm font-medium hover:underline">
                View all activities
              </button>
            </div>
          </NeumorphicCard>
        </div>

        <NeumorphicCard title="Upcoming Events" icon={<Calendar size={20} />} delay={0.5}>
          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-lg bg-[#0089AD]/5 border-l-4 border-[#0089AD]">
              <p className="font-medium">Team Meeting</p>
              <p className="text-sm text-gray-600 mt-1">Today, 2:00 PM</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border-l-4 border-gray-300">
              <p className="font-medium">Project Review</p>
              <p className="text-sm text-gray-600 mt-1">Tomorrow, 10:00 AM</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
              <p className="font-medium">Deadline: Q3 Report</p>
              <p className="text-sm text-gray-600 mt-1">May 25, 2025</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button 
              className="bg-[#0089AD] text-white px-4 py-2 rounded-lg shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:bg-[#007a9d] transition-colors"
              onClick={() => toast.success('Calendar opened', { description: 'You can now add or edit events' })}
            >
              View Calendar
            </button>
          </div>
        </NeumorphicCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.button
          whileHover={{ y: -5 }}
          className="p-4 rounded-xl shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] bg-white flex items-center justify-center space-x-2 text-[#0089AD] font-medium"
          onClick={() => toast.success('New team member form opened', { description: 'Fill in the details to add a team member' })}
        >
          <UserPlus size={18} />
          <span>Add Team Member</span>
        </motion.button>
        
        <motion.button
          whileHover={{ y: -5 }}
          className="p-4 rounded-xl shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] bg-white flex items-center justify-center space-x-2 text-[#0089AD] font-medium"
          onClick={() => toast.success('Project creation wizard opened', { description: 'Follow the steps to create a new project' })}
        >
          <PieChart size={18} />
          <span>Create New Project</span>
        </motion.button>
        
        <motion.button
          whileHover={{ y: -5 }}
          className="p-4 rounded-xl shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] bg-white flex items-center justify-center space-x-2 text-[#0089AD] font-medium"
          onClick={() => toast.success('Report generator opened', { description: 'Select metrics to include in your report' })}
        >
          <BarChart4 size={18} />
          <span>Generate Reports</span>
        </motion.button>
      </div>
    </div>
  );
}
