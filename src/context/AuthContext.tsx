import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'campusfix_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with Sarah Chen (Student) by default for instant out-of-the-box exploration
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return MOCK_USERS[0]; // Student default
    } catch {
      return MOCK_USERS[0];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Validate email format
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid institutional email address.' };
    }
    if (!pass || pass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Match existing mock user or create authenticated session
    const matched = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return { success: true };
    }

    // Fallback: determine role based on email or default to student
    const role: UserRole = email.includes('admin') ? 'admin' : email.includes('facility') || email.includes('staff') ? 'staff' : 'student';
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role,
      studentId: role === 'student' ? `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      department: 'General Studies',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    return { success: true };
  };

  const register = async (data: Partial<User> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'student',
      studentId: data.studentId || `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department || 'Undecided',
      phone: data.phone || '',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoUser = (role: UserRole) => {
    const target = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setUser(target);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
