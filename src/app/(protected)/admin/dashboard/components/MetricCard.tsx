import { LucideIcon } from 'lucide-react';
import React from 'react';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
};

/**
 * MetricCard Component
 * Displays a single metric with optional trend indicator
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => (
  <div className={`bg-white rounded-xl p-6 shadow-neumorph hover:shadow-neumorph-hover transition-all duration-300 hover:translate-y-[-4px] ${className}`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {trend && (
          <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
      <div className="p-2 rounded-lg bg-[#0089AD] bg-opacity-10 text-[#0089AD]">
        {icon}
      </div>
    </div>
  </div>
);

export default MetricCard;
