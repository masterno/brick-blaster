import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For development, we'll use local storage only
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const mockUser = { id: 1, email, username: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
      return mockUser;
    } catch (err) {
      setError('Login failed');
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      // Simulate API call
      const mockUser = { id: 1, email, username };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
      return mockUser;
    } catch (err) {
      setError('Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
