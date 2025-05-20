'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Server, 
  Database, 
  Settings, 
  BarChart4, 
  PieChart, 
  LineChart,
  AlertTriangle, 
  CheckCircle, 
  ChevronDown,
  ChevronUp,
  Activity,
  Lock,
  UserPlus,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

// Sample data for charts
const userActivityData = [
  { date: 'Jan', value: 120, color: '#0089AD' },
  { date: 'Feb', value: 150, color: '#0089AD' },
  { date: 'Mar', value: 180, color: '#0089AD' },
  { date: 'Apr', value: 220, color: '#0089AD' },
  { date: 'May', value: 270, color: '#0089AD' },
];

const systemStatusData = [
  { name: 'Database', status: 'Healthy', value: 98, color: '#0089AD' },
  { name: 'API', status: 'Healthy', value: 99, color: '#34C3FF' },
  { name: 'Auth', status: 'Healthy', value: 100, color: '#005F77' },
  { name: 'Storage', status: 'Warning', value: 87, color: '#FFA500' },
];

const securityAlertsData = [
  { id: 1, type: 'Failed Login', user: 'user@example.com', location: 'London, UK', time: '2 hours ago', severity: 'medium' },
  { id: 2, type: 'Permission Change', user: 'admin@example.com', location: 'New York, USA', time: '4 hours ago', severity: 'high' },
  { id: 3, type: 'New API Key', user: 'api@example.com', location: 'Paris, France', time: '6 hours ago', severity: 'low' },
  { id: 4, type: 'Password Reset', user: 'support@example.com', location: 'Tokyo, Japan', time: 'Yesterday', severity: 'low' },
];

// Chart components
const LineChartComponent = ({ data }: { data: typeof userActivityData }) => {
  const maxValue = Math.max(...data.map(item => item.value)) * 1.1;
  
  return (
    <div className="h-64 relative mt-4 mb-2">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
        <span>{Math.round(maxValue)}</span>
        <span>{Math.round(maxValue * 0.75)}</span>
        <span>{Math.round(maxValue * 0.5)}</span>
        <span>{Math.round(maxValue * 0.25)}</span>
        <span>0</span>
      </div>
      
      {/* Chart area */}
      <div className="absolute left-12 right-0 top-0 bottom-0">
        {/* Horizontal grid lines */}
        <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="border-t border-gray-200 w-full h-0"></div>
          ))}
        </div>
        
        {/* Line chart */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${(data.length - 1) * 100} 100`} preserveAspectRatio="none">
          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={data.map((item, i) => {
              const x = i * (100 / (data.length - 1));
              const y = 100 - (item.value / maxValue) * 100;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="#0089AD"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Points */}
          {data.map((item, i) => {
            const x = i * (100 / (data.length - 1));
            const y = 100 - (item.value / maxValue) * 100;
            
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke="#0089AD"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="cursor-pointer hover:r-6 transition-all"
                onMouseOver={() => {
                  toast.info(`${item.date}: ${item.value} active users`, {
                    position: 'top-center',
                    duration: 2000,
                  });
                }}
              />
            );
          })}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="absolute left-12 right-0 bottom-0 transform translate-y-6 flex justify-between text-xs text-gray-500">
        {data.map((item, i) => (
          <span key={i}>{item.date}</span>
        ))}
      </div>
    </div>
  );
};

const StatusBars = ({ data }: { data: typeof systemStatusData }) => {
  return (
    <div className="space-y-4 mt-4">
      {data.map((item, index) => {
        const statusColor = item.status === 'Healthy' ? 'bg-green-500' : 
                          item.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500';
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                <span>{item.status}</span>
                <span className="text-gray-500">{item.value}%</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${statusColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              ></motion.div>
            </div>
          </div>
        );
      })}
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
  delay = 0 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  delay?: number;
}) => {
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
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0089AD]/10 text-[#0089AD] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-[#0089AD] text-white flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System administration and management</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={1254} 
          icon={<Users size={24} />} 
          delay={0.1}
        />
        <StatCard 
          title="System Uptime" 
          value="99.98%" 
          icon={<Server size={24} />} 
          delay={0.2}
        />
        <StatCard 
          title="Database Size" 
          value="2.4 GB" 
          icon={<Database size={24} />} 
          delay={0.3}
        />
        <StatCard 
          title="Security Alerts" 
          value={7} 
          icon={<AlertTriangle size={24} />} 
          delay={0.4}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <NeumorphicCard title="User Activity" icon={<LineChart size={20} />} delay={0.2}>
          <p className="text-sm text-gray-600 mb-4">Monthly active users</p>
          <LineChartComponent data={userActivityData} />
          <div className="mt-4 text-right">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('User activity report generated', { description: 'Check your inbox for the detailed report' })}
            >
              Export Report
            </button>
          </div>
        </NeumorphicCard>

        <NeumorphicCard title="System Status" icon={<Activity size={20} />} delay={0.3}>
          <p className="text-sm text-gray-600 mb-4">Current status of system components</p>
          <StatusBars data={systemStatusData} />
          <div className="mt-4 text-right">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('System diagnostics started', { description: 'Running full system check' })}
            >
              Run Diagnostics
            </button>
          </div>
        </NeumorphicCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NeumorphicCard title="Security Alerts" icon={<Lock size={20} />} delay={0.4} expandable={false}>
            <div className="space-y-4 mt-2">
              {securityAlertsData.map((alert, index) => {
                const severityColor = 
                  alert.severity === 'high' ? 'bg-red-500' : 
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500';
                
                return (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-2 h-full rounded-full ${severityColor} mr-3 self-stretch`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">User: {alert.user}</p>
                      <p className="text-xs text-gray-500 mt-1">Location: {alert.location}</p>
                    </div>
                    <button 
                      className="ml-2 text-[#0089AD] hover:text-[#006d8b] transition-colors"
                      onClick={() => toast.info(`Investigating ${alert.type} alert`, { description: `Alert details for ${alert.user}` })}
                    >
                      <Settings size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <button 
                className="text-[#0089AD] text-sm font-medium hover:underline"
                onClick={() => toast.success('Security report generated', { description: 'Full security audit report is ready' })}
              >
                View All Alerts
              </button>
            </div>
          </NeumorphicCard>
        </div>

        <NeumorphicCard title="Quick Actions" icon={<Settings size={20} />} delay={0.5}>
          <div className="space-y-4 mt-2">
            <button 
              className="w-full p-3 rounded-lg bg-white shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center space-x-3 text-left"
              onClick={() => toast.success('User management opened', { description: 'You can now manage user accounts' })}
            >
              <UserPlus className="text-[#0089AD]" size={18} />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-gray-500">Add, edit, or remove users</p>
              </div>
            </button>
            
            <button 
              className="w-full p-3 rounded-lg bg-white shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center space-x-3 text-left"
              onClick={() => toast.success('System settings opened', { description: 'You can now configure system settings' })}
            >
              <Settings className="text-[#0089AD]" size={18} />
              <div>
                <p className="font-medium">System Settings</p>
                <p className="text-xs text-gray-500">Configure application settings</p>
              </div>
            </button>
            
            <button 
              className="w-full p-3 rounded-lg bg-white shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center space-x-3 text-left"
              onClick={() => toast.success('Backup initiated', { description: 'System backup has started' })}
            >
              <Database className="text-[#0089AD]" size={18} />
              <div>
                <p className="font-medium">Backup System</p>
                <p className="text-xs text-gray-500">Create a system backup</p>
              </div>
            </button>
          </div>
        </NeumorphicCard>
      </div>

      {/* API Status */}
      <div className="mt-8">
        <NeumorphicCard title="API Status" icon={<Globe size={20} />} delay={0.6}>
          <div className="p-4 bg-gray-50 rounded-lg mt-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">API Endpoints</p>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600">Healthy</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Authentication</p>
                  <CheckCircle className="text-green-500" size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Response time: 42ms</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Database</p>
                  <CheckCircle className="text-green-500" size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Response time: 78ms</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Storage</p>
                  <CheckCircle className="text-green-500" size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Response time: 65ms</p>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </div>

    </div>
  );
}
