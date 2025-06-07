import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register as apiRegister, logout as apiLogout, deleteAccount as apiDeleteAccount } from '@/services/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load user and token from AsyncStorage on app start
  useEffect(() => {
    const loadUserAndToken = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@b_ticket_user');
        const storedToken = await AsyncStorage.getItem('@b_ticket_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load user data from storage', error);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadUserAndToken();
  }, []);

  const storeUserAndToken = async (userData: User, authToken: string) => {
    try {
      await AsyncStorage.setItem('@b_ticket_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@b_ticket_token', authToken);
    } catch (error) {
      console.error('Failed to store user data', error);
    }
  };

  const clearUserAndToken = async () => {
    try {
      await AsyncStorage.removeItem('@b_ticket_user');
      await AsyncStorage.removeItem('@b_ticket_token');
    } catch (error) {
      console.error('Failed to clear user data', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token: authToken } = await apiLogin(email, password);
      setUser(userData);
      setToken(authToken);
      await storeUserAndToken(userData, authToken);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token: authToken } = await apiRegister(name, email, password);
      setUser(userData);
      setToken(authToken);
      await storeUserAndToken(userData, authToken);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await apiLogout(token);
      }
      setUser(null);
      setToken(null);
      await clearUserAndToken();
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await apiDeleteAccount(token);
      }
      setUser(null);
      setToken(null);
      await clearUserAndToken();
    } catch (error) {
      console.error('Delete account failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading: isLoading || isLoadingInitial,
        login,
        register,
        logout,
        deleteAccount,
      }}
    >
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}