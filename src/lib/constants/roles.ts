export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LANDING_PAGES: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: '/admin/dashboard',
  [USER_ROLES.USER]: '/dashboard',
  [USER_ROLES.MANAGER]: '/manager/dashboard',
};
