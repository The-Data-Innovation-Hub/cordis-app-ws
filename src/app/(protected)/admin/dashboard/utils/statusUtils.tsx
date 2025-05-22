import type { LucideIcon } from 'lucide-react';
import { Shield, Activity, Network } from 'lucide-react';
import type { SystemStatus } from '@/types/dashboard';

interface SystemStatusDisplay {
  icon: React.ReactNode;
  color: string;
}

type StatusIcons = {
  [key in SystemStatus['status']]: React.ReactNode;
};

const statusIcons: StatusIcons = {
  operational: <Shield className="w-6 h-6" />,
  degraded: <Activity className="w-6 h-6" />,
  outage: <Network className="w-6 h-6" />,
} as const;

const statusColors = {
  operational: 'text-green-500',
  degraded: 'text-yellow-500',
  outage: 'text-red-500',
} as const;

/**
 * Helper function to get status display configuration
 * @param status - The system status object
 * @returns Object containing icon and color for the status
 */
export function getStatusDisplay(status: SystemStatus): SystemStatusDisplay {
  return {
    icon: statusIcons[status.status],
    color: statusColors[status.status],
  };
}
