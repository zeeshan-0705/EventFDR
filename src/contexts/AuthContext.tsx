'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { storage } from '@/utils/helpers';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      };
    case 'AUTH_ERROR':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: action.payload 
      };
    case 'AUTH_LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = storage.get<User>('eventfdr_user');
      if (savedUser) {
        dispatch({ type: 'AUTH_SUCCESS', payload: savedUser });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };
    
    // Simulate async check
    setTimeout(checkAuth, 300);
  }, []);

  // Login function - calls API
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Save user to localStorage for persistence
      storage.set('eventfdr_user', result.data);
      dispatch({ type: 'AUTH_SUCCESS', payload: result.data });
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Register function - calls API
  const register = async (userData: { name: string; email: string; phone?: string; password: string }) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      // Save user to localStorage for persistence
      storage.set('eventfdr_user', result.data);
      dispatch({ type: 'AUTH_SUCCESS', payload: result.data });
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    storage.remove('eventfdr_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updatedUser = { ...state.user, ...updates } as User;
      storage.set('eventfdr_user', updatedUser);
      
      dispatch({ type: 'UPDATE_USER', payload: updates });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
