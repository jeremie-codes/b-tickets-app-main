import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile, updateUserPassword, uploadProfileImage, login as apiLogin, register as apiRegister, logout as apiLogout, deleteAccount as apiDeleteAccount, setupApiInterceptors } from '@/services/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  updateUser: (userDatas: { name: string; first_name: string; last_name: any, email: string }) => Promise<boolean>;
  updatePassword: (passwords: { password: string }) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updatePicture: (formData: FormData) => Promise<any>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  triggerFavoritesRefresh: () => void;
  favoritesRefreshKey: number;
  triggerWisshRefresh: () => void;
  wishRefrListReshKey: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [favoritesRefreshKey, setFavoritesRefreshKey] = useState(Date.now());
  const [wishRefrListReshKey, setWishRefrListReshKey] = useState(Date.now());

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@b_ticket_user');
        const storedToken = await AsyncStorage.getItem('@b_ticket_token');

        if (storedToken) {
          setToken(storedToken);
        }
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && typeof parsedUser === 'object') {
              setUser(parsedUser);
            } else {
              console.warn('User data is not an object');
              await AsyncStorage.removeItem('@b_ticket_user');
            }
          } catch (e) {
            console.warn('Corrupted user data in storage', e);
            await AsyncStorage.removeItem('@b_ticket_user');
          }
        }

        // Configure axios interceptors une seule fois ici
        await setupApiInterceptors();

      } catch (error) {
        console.error('Failed to load user data from storage', error);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    initializeAuth();
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

      // Assure toi que les interceptors sont configurés avec ce token
      await setupApiInterceptors();

    } catch (error) {
      console.error('Connexion échouée !', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userDatas: { name: string; first_name: string; last_name: any, email: string }) => {
    setIsLoading(true);
    try {
      const { success, userResp } = await updateUserProfile(userDatas);
      await AsyncStorage.setItem('@b_ticket_user', JSON.stringify(userResp));
      setUser(userResp);
      return success;
    } catch (error) {
      console.error('Mise à jour utilisateur échouée !', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (passwords: { password: string }) => {
    setIsLoading(true);
    try {
      const { success } = await updateUserPassword(passwords);
      return success;
    } catch (error) {
      console.error('Mise à jour mot de passe échouée !', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePicture = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const { success, data } = await uploadProfileImage(formData);
      if (!user) return;
      const updatedUser = {
        ...user,
        profile: data,
      };
      await AsyncStorage.setItem('@b_ticket_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return success;
    } catch (error) {
      console.error('Mise à jour photo échouée !', error);
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

      // Configure aussi interceptors ici pour le token nouveau
      await setupApiInterceptors();

    } catch (error) {
      console.error('Enregistrement échoué !', error);
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
      console.error('Déconnexion échouée', error);
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
      console.error('Suppression de compte échouée !', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFavoritesRefresh = () => {
    setFavoritesRefreshKey(Date.now());
  };

  const triggerWisshRefresh = () => {
    setWishRefrListReshKey(Date.now());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading: isLoading || isLoadingInitial,
        login,
        updateUser,
        updatePassword,
        updatePicture,
        register,
        logout,
        deleteAccount,
        triggerFavoritesRefresh,
        favoritesRefreshKey,
        triggerWisshRefresh,
        wishRefrListReshKey
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
