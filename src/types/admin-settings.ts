export interface AdminSettings {
  id: string;
  password_min_length: number;
  password_require_numbers_symbols: boolean;
  require_two_factor: boolean;
  ip_whitelist_enabled: boolean;
  ip_whitelist: string[];
  ai_model: string;
  ai_api_key: string | null;
  created_at: string;
  updated_at: string;
}
