'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser, 
  loginUserJson, 
  registerUser, 
  getCurrentUser, 
  logoutUser, 
  isAuthenticated,
  clearAuthData,
  getUserDashboard
} from '../services/api_calls';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await getCurrentUser();
          setUser(userData);
          // Fetch points from dashboard
          try {
            const dashboard = await getUserDashboard();
            setPoints(dashboard?.statistics?.points_balance || 0);
          } catch {}
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login with form data (OAuth2 compatible)
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(credentials);
      const userData = await getCurrentUser();
      setUser(userData);
      // Fetch points from dashboard
      try {
        const dashboard = await getUserDashboard();
        setPoints(dashboard?.statistics?.points_balance || 0);
      } catch {}
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with JSON data
  const loginJson = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUserJson(credentials);
      const userData = await getCurrentUser();
      setUser(userData);
      // Fetch points from dashboard
      try {
        const dashboard = await getUserDashboard();
        setPoints(dashboard?.statistics?.points_balance || 0);
      } catch {}
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      clearAuthData();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.is_admin || false;
  };

  // Check if user is active
  const isUserActive = () => {
    return user?.is_active || false;
  };

  // Refresh points from dashboard
  const refreshPoints = async () => {
    try {
      const dashboard = await getUserDashboard();
      setPoints(dashboard?.statistics?.points_balance || 0);
    } catch {}
  };

  const value = {
    user,
    points,
    loading,
    error,
    login,
    loginJson,
    register,
    logout,
    updateProfile,
    clearError,
    isAdmin,
    isUserActive,
    isAuthenticated: !!user,
    refreshPoints
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 