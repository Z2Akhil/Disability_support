import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

const USER_KEY = 'user';
const TOKEN_KEY = 'accessToken';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem(USER_KEY)) ||
      JSON.parse(sessionStorage.getItem(USER_KEY));

    const storedToken =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);

      const { user: loggedInUser, accessToken } = res.data;
      if (loggedInUser && accessToken) {
        setUser(loggedInUser);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(loggedInUser));
        storage.setItem(TOKEN_KEY, accessToken);

        return { success: true };
      }

      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);

      const { user: newUser, accessToken } = res.data;
      if (newUser && accessToken) {
        setUser(newUser);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        localStorage.setItem(TOKEN_KEY, accessToken);
        return { success: true };
      }

      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    const token = localStorage.getItem(TOKEN_KEY)
      ? localStorage
      : sessionStorage;
    token.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const token =
        localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (!token) return;
  
      const res = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.data?.user) {
        setUser(res.data.user); // ✅ fixed: only set the user object
        const store =
          localStorage.getItem(TOKEN_KEY) !== null ? localStorage : sessionStorage;
        store.setItem(USER_KEY, JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
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
