import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);
        toast.success('Login successful!');
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.message || 'Login failed');
        return { success: false, error: error.message };
      }
    } catch (error) {
      // For demo purposes, allow demo login
      if (email === 'demo@food.com' && password === 'demo123') {
        const demoUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@food.com',
          phone: '+1234567890',
          address: '123 Demo Street, Demo City'
        };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', 'demo-token');
        toast.success('Login successful!');
        return { success: true };
      }
      toast.error('Login failed. Try demo@food.com / demo123');
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Registration successful! Please login.');
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.message || 'Registration failed');
        return { success: false, error: error.message };
      }
    } catch (error) {
      // For demo purposes, simulate successful registration
      toast.success('Registration successful! You can now login with demo@food.com / demo123');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    toast.info('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
        return { success: true };
      } else {
        const error = await response.json();
        toast.error(error.message || 'Profile update failed');
        return { success: false, error: error.message };
      }
    } catch (error) {
      // For demo purposes, simulate successful update
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}