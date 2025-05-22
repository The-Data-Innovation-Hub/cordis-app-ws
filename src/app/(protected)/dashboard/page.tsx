'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Calendar, 
  CheckCircle, 
  Clock, 
  BarChart4, 
  PieChart,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Star,
  Plus,
  FileEdit
} from 'lucide-react';
import { toast } from 'sonner';

// Sample data for charts
const taskCompletionData = [
  { name: 'Completed', value: 68, color: '#0089AD' },
  { name: 'In Progress', value: 23, color: '#34C3FF' },
  { name: 'Not Started', value: 9, color: '#E2E8F0' },
];

const weeklyProgressData = [
  { day: 'Mon', completed: 4, total: 8 },
  { day: 'Tue', completed: 6, total: 8 },
  { day: 'Wed', completed: 7, total: 8 },
  { day: 'Thu', completed: 7, total: 8 },
  { day: 'Fri', completed: 5, total: 8 },
];

const notificationsData = [
  { id: 1, type: 'message', content: 'New comment on your document', time: '2 hours ago', read: false },
  { id: 2, type: 'task', content: 'Task "Q2 Report" assigned to you', time: '4 hours ago', read: true },
  { id: 3, type: 'system', content: 'System maintenance scheduled', time: 'Yesterday', read: true },
  { id: 4, type: 'reminder', content: 'Meeting with team at 3:00 PM', time: 'Yesterday', read: false },
];

const upcomingTasksData = [
  { id: 1, title: 'Complete project proposal', due: '2025-05-21', priority: 'high', completed: false },
  { id: 2, title: 'Review marketing materials', due: '2025-05-22', priority: 'medium', completed: false },
  { id: 3, title: 'Team weekly sync', due: '2025-05-23', priority: 'medium', completed: false },
  { id: 4, title: 'Prepare monthly report', due: '2025-05-25', priority: 'high', completed: false },
];

// Chart components
const PieChartComponent = ({ data }: { data: typeof taskCompletionData }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <div className="relative h-64 flex items-center justify-between mt-4 px-4">
      <svg width="160" height="160" viewBox="0 0 100 100" className="flex-shrink-0">
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
          
          // Update the start angle for the next slice
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
              onClick={() => toast.info(`${item.name}: ${item.value} tasks (${percentage.toFixed(1)}%)`, { description: 'Click for detailed report' })}
            />
          );
        })}
        
        {/* Center circle for neumorphic effect */}
        <circle cx="50" cy="50" r="30" fill="white" className="drop-shadow-md" />
        
        {/* Total in the center */}
        <text x="50" y="50" textAnchor="middle" className="text-2xl font-bold" fill="#0089AD" dominantBaseline="middle">
          {total}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="flex flex-col justify-center space-y-2 ml-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center text-xs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
            <span>{item.name}: {item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProgressBars = ({ data }: { data: typeof weeklyProgressData }) => {
  return (
    <div className="space-y-3 mt-4">
      {data.map((item, index) => {
        const percentage = (item.completed / item.total) * 100;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.day}</span>
              <span className="text-gray-500">{item.completed}/{item.total} tasks</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#0089AD]"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
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

export default function UserDashboard() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-[#0089AD] text-white flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600">Welcome to your personal workspace</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tasks Completed" 
          value={68} 
          icon={<CheckCircle size={24} />} 
          delay={0.1}
        />
        <StatCard 
          title="Upcoming Tasks" 
          value={12} 
          icon={<Clock size={24} />} 
          delay={0.2}
        />
        <StatCard 
          title="Unread Messages" 
          value={5} 
          icon={<MessageSquare size={24} />} 
          delay={0.3}
        />
        <StatCard 
          title="Saved Items" 
          value={24} 
          icon={<Star size={24} />} 
          delay={0.4}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <NeumorphicCard title="Task Completion" icon={<PieChart size={20} />} delay={0.2}>
          <p className="text-sm text-gray-600 mb-4">Your current task status</p>
          <PieChartComponent data={taskCompletionData} />
          <div className="mt-4 text-right">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('Task report generated', { description: 'Your task completion report is ready' })}
            >
              View detailed report
            </button>
          </div>
        </NeumorphicCard>

        <NeumorphicCard title="Weekly Progress" icon={<BarChart4 size={20} />} delay={0.3}>
          <p className="text-sm text-gray-600 mb-4">Your task completion rate by day</p>
          <ProgressBars data={weeklyProgressData} />
          <div className="mt-4 text-right">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('Weekly report generated', { description: 'Your weekly progress report is ready' })}
            >
              Generate report
            </button>
          </div>
        </NeumorphicCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NeumorphicCard title="Upcoming Tasks" icon={<FileText size={20} />} delay={0.4} expandable={false}>
            <div className="space-y-4 mt-2">
              {upcomingTasksData.map((task, index) => {
                const priorityColor = 
                  task.priority === 'high' ? 'bg-red-500' : 
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500';
                
                // Calculate days remaining
                const dueDate = new Date(task.due);
                const today = new Date();
                const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-2 h-full rounded-full ${priorityColor} mr-3 self-stretch`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{task.title}</p>
                        <p className={`text-xs ${daysRemaining <= 2 ? 'text-red-500' : 'text-gray-500'}`}>
                          {daysRemaining === 0 ? 'Due today' : 
                           daysRemaining === 1 ? 'Due tomorrow' : 
                           `Due in ${daysRemaining} days`}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="text-[#0089AD] hover:text-[#006d8b] transition-colors"
                        onClick={() => toast.success(`Task marked as complete: ${task.title}`)}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        className="text-[#0089AD] hover:text-[#006d8b] transition-colors"
                        onClick={() => toast.info(`Editing task: ${task.title}`)}
                      >
                        <FileEdit size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <button 
                className="bg-[#0089AD] text-white px-4 py-2 rounded-lg shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:bg-[#007a9d] transition-colors flex items-center justify-center mx-auto space-x-2"
                onClick={() => toast.success('New task form opened', { description: 'Create a new task' })}
              >
                <Plus size={16} />
                <span>Add New Task</span>
              </button>
            </div>
          </NeumorphicCard>
        </div>

        <NeumorphicCard title="Notifications" icon={<Bell size={20} />} delay={0.5}>
          <div className="space-y-4 mt-2">
            {notificationsData.map((notification, index) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'} border-l-2 ${notification.read ? 'border-gray-300' : 'border-[#0089AD]'}`}
              >
                <div className="flex justify-between">
                  <p className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.content}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-[#0089AD]"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button 
              className="text-[#0089AD] text-sm font-medium hover:underline"
              onClick={() => toast.success('All notifications marked as read')}
            >
              Mark all as read
            </button>
          </div>
        </NeumorphicCard>
      </div>

      {/* Calendar */}
      <div className="mt-8">
        <NeumorphicCard title="Upcoming Events" icon={<Calendar size={20} />} delay={0.6}>
          <div className="p-4 bg-gray-50 rounded-lg mt-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">May 2025</p>
                <p className="text-sm text-gray-600">3 events scheduled</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <ChevronUp size={16} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="p-3 bg-[#0089AD]/5 rounded-lg border-l-4 border-[#0089AD]">
                <p className="font-medium">Team Meeting</p>
                <p className="text-sm text-gray-600 mt-1">May 21, 2025 • 10:00 AM</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg border-l-4 border-gray-300">
                <p className="font-medium">Project Deadline</p>
                <p className="text-sm text-gray-600 mt-1">May 25, 2025 • All day</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg border-l-4 border-gray-300">
                <p className="font-medium">Client Presentation</p>
                <p className="text-sm text-gray-600 mt-1">May 27, 2025 • 2:00 PM</p>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      {/* Footer with quick actions */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-[#0089AD]/10 text-[#0089AD] px-4 py-2 rounded-lg hover:bg-[#0089AD]/20 transition-colors"
            onClick={() => toast.success('Creating new document')}
          >
            <FileText size={16} />
            <span>New Document</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-[#0089AD]/10 text-[#0089AD] px-4 py-2 rounded-lg hover:bg-[#0089AD]/20 transition-colors"
            onClick={() => toast.success('Setting up a meeting')}
          >
            <Calendar size={16} />
            <span>Schedule Meeting</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-[#0089AD]/10 text-[#0089AD] px-4 py-2 rounded-lg hover:bg-[#0089AD]/20 transition-colors"
            onClick={() => toast.success('Sending message')}
          >
            <MessageSquare size={16} />
            <span>Send Message</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
