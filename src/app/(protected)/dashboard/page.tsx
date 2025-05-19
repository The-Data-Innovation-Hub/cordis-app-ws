'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <div className="w-16 h-16 rounded-full bg-[#0089AD] text-white flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)]">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-gray-600">Access your most used features here.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h2>
          <p className="text-gray-600">View your latest actions and updates.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Statistics</h2>
          <p className="text-gray-600">Check your performance metrics.</p>
        </motion.div>
      </div>
    </div>
  );
}
