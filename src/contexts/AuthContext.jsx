import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/helpers';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
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
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = storage.get('eventfdr_user');
      if (savedUser) {
        dispatch({ type: 'AUTH_SUCCESS', payload: savedUser });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };
    
    // Simulate async check
    setTimeout(checkAuth, 500);
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from storage or use demo account
      const users = storage.get('eventfdr_users') || [];
      const user = users.find(u => u.email === email);
      
      // Demo account for testing
      if (email === 'demo@eventfdr.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo-user',
          email: 'demo@eventfdr.com',
          name: 'Demo User',
          phone: '9876543210',
          avatar: null,
          createdAt: new Date().toISOString()
        };
        storage.set('eventfdr_user', demoUser);
        dispatch({ type: 'AUTH_SUCCESS', payload: demoUser });
        return { success: true };
      }
      
      if (!user) {
        throw new Error('No account found with this email');
      }
      
      if (user.password !== password) {
        throw new Error('Incorrect password');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      storage.set('eventfdr_user', userWithoutPassword);
      dispatch({ type: 'AUTH_SUCCESS', payload: userWithoutPassword });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = storage.get('eventfdr_users') || [];
      
      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('An account with this email already exists');
      }
      
      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      // Save to users list
      users.push(newUser);
      storage.set('eventfdr_users', users);
      
      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      storage.set('eventfdr_user', userWithoutPassword);
      dispatch({ type: 'AUTH_SUCCESS', payload: userWithoutPassword });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    storage.remove('eventfdr_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...state.user, ...updates };
      storage.set('eventfdr_user', updatedUser);
      
      // Update in users list too
      const users = storage.get('eventfdr_users') || [];
      const userIndex = users.findIndex(u => u.id === state.user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        storage.set('eventfdr_users', users);
      }
      
      dispatch({ type: 'UPDATE_USER', payload: updates });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
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
