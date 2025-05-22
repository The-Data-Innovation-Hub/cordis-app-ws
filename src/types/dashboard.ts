export interface SystemStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  value: number;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  date: string;
  active_users: number;
  api_requests: number;
  avg_response_time: number;
  error_rate: number;
  created_at: string;
}

export interface DashboardMetrics {
  id: string;
  total_users: number;
  total_api_requests: number;
  avg_response_time: number;
  error_rate: number;
  updated_at: string;
}
