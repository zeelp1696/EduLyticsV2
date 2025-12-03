import { createContext, useContext, useState, useEffect } from 'react';

export enum AdminRole {
  INSTITUTION_ADMIN = 'institution_admin',
  DEVELOPER_ADMIN = 'developer_admin'
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  institution_id?: string;
  institution_name?: string;
}

export interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  hasPermission: (requiredRoles: AdminRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const savedAdmin = localStorage.getItem('admin_user');
        const token = localStorage.getItem('admin_token');
        
        if (savedAdmin && token) {
          setAdmin(JSON.parse(savedAdmin));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing admin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
      localStorage.setItem('admin_token', data.access_token);

      setAdmin(data.admin);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (requiredRoles: AdminRole[]) => {
    if (!admin) return false;
    return requiredRoles.includes(admin.role);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated, isLoading, login, logout, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
