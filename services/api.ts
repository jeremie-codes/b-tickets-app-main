import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, EventType, ProfileType, CategoryType, WishlistItem } from '@/types';
import { API_URL } from '@/configs/index';
import { router } from 'expo-router';

// Auth functions
export const login = async (email: string, password: string) => {
  try {

    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data.data;

    //Configure les intercepteurs pour les requêtes futures
    await setupApiInterceptors();

    return { user, token };
  } catch (error: any) {
    // showNotification(error.response?.data?.message || 'Connexion échoouée !', 'error');
    throw Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (name: string, email: string, password: string) => {

  try {

    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    const { token, user } = response.data.data;

    //Stocke le token
    await AsyncStorage.setItem('@b_ticket_token', token);

    //Configure les intercepteurs pour les requêtes futures
    await setupApiInterceptors();

    return { user, token };
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Register failed');
  }

};

export const logout = async (token: string) => {
  // await delay(800); // Simulate API delay
  // In a real app, this would be a POST request to the API
  try {
    const response = await axios.post(`${API_URL}/logout`);

    const { success } = response.data;

    return { success: success };
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Logout failed');
  }
};

// User profile functions
export const updateUserProfile = async (userData: { name: string; first_name: string; last_name: any, email: string }) => {
  
  try {
    const response = await axios.post(`${API_URL}/profile`, userData);
    // console.log(response.data)
    const { success, data } = response.data;
   
    const profileData = data[0];
    const userResponse = data[1];

    const profile: ProfileType = {
      id: profileData.id.toString(),
      name: profileData.name,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: userResponse.email,
      picture: profileData.picture,
    };

    const userResp: User = {
      id: userResponse.id.toString(),
      name: userResponse.name,
      email: userResponse.email,
      profile,
    };
    await AsyncStorage.setItem('@b_ticket_user', JSON.stringify(userResp));

    return { success, userResp };
  } catch (error: any) {
    console.log(error.response?.data || 'Profile update failed');
    throw error;
  }
};

export const updateUserPassword = async (passwordData: { password: string }) => {
  
  try {
    const response = await axios.post(`${API_URL}/profile`, passwordData);
    const { success } = response.data;
    
    return { success };
  } catch (error: any) {
    console.log(error.response?.data || 'Profile update failed');
    throw error;
  }
};

export const uploadProfileImage = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/profile/picture`,formData);
    const { success, data } = response.data;

    return { success, data };
  } catch (error: any) {
    console.error('Erreur lors de l\'upload', error.response || error.message);
    return { success: false, message: 'Erreur lors de l\'upload de l\'image' };
  }
};

export const deleteAccount = async (token: string) => {
  // await delay(1200); // Simulate API delay
  // In a real app, this would be a DELETE request to the API
  try {
    const response = await axios.post(`${API_URL}/account/delete`);

    const { success } = response.data;

    return { success: success };
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Logout failed');
  }
};

// Events functions
export const getEvents = async () => {

  try {

    const response = await axios.get(`${API_URL}/event/recents`);

    const { recentEvents } = response.data;

    return recentEvents;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Register failed');
  }
};

// Events functions
export const getEventsPopular = async () => {
  // await delay(1000); // Simulate API delay
  // In a real app, this would be a GET request to the API
  // return mockEvents;
  try {

    const response = await axios.get(`${API_URL}/favorites/popular`);

    const { data } = response.data;

    return data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Register failed');
  }
};

export const getEventById = async (id: string) => {
  // await delay(800); // Simulate API delay
  // In a real app, this would be a GET request to the API
   try {

    const response = await axios.get(`${API_URL}/events/${id}`);
    const event = response.data.data;
    // console.log(event)

    // const event = mockEvents.find(event => event.id === id);
    if (!event) {
      throw new Error('Evénement non trouvé !');
    }
    return event;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

export const getFavorites = async () => {
  try {

    const response = await axios.get(`${API_URL}/favorites/list`);
    const { data } = response.data;

    return data.data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

export const toggleFavorite = async (eventId: number, isFavorite: boolean) => {
  // In a real app, this would be a POST request to the API
  try {
    let response;

    if (isFavorite) {
      response = await axios.post(`${API_URL}/favorites/remove/${eventId}`);
        const { event } = response.data.data;
        return { isFavorite: false }; 
    }

    response = await axios.post(`${API_URL}/favorites/add/${eventId}`);
    const { event } = response.data.data;
    return { isFavorite: true };   

  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
    throw new Error('Evénement non trouvé');
  }
};

// Wishlist functions
export const getWishlist = async () => {
    try {

    const response = await axios.get(`${API_URL}/wishlist/events`);

    const { data } = response.data;

    return data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Register failed');
  }
};

export const toggleWishlist = async (eventId: number, isWishlist: boolean) => {
  try {
    let response;

    if (isWishlist) {
      response = await axios.post(`${API_URL}/wishlist/remove/${eventId}`);
        const { event } = response.data.data;
        return { isWishlist: false }; 
    }

    response = await axios.post(`${API_URL}/wishlist/add/${eventId}`);
    const { event } = response.data.data;
    return { isWishlist: true };   

  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
    throw new Error('Evénement non trouvé');
  }
};

// Categories functions
export const getCategories = async () => {

  try {

    const response = await axios.get(`${API_URL}/categories`);
    const { categories } = response.data;
    
    return categories;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

// Tickets functions
export const getUserTickets = async () => {
  try {

    const response = await axios.get(`${API_URL}/tickets`);
    const { data } = response.data;
        
    return data.data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

export const getTicketById = async (id: string) => {
   try {

    const response = await axios.get(`${API_URL}/tickets/${id}`);
    const { data } = response.data;
    
    // console.log(data)
    
    return data;
  } catch (error: any) {
    console.log(error.response?.data?.message || 'Loading failed');
  }
};

// Payment function
export const processPayment = async (paymentData: any) => {
  // console.log(paymentData)
  try {
    const response = await axios.post(`${API_URL}/payTicket`, paymentData);
    const { data } = response;
    return { success: data.success, data };
  } catch (error: any) {
    console.log(error.response?.data || 'Payment failed');
    throw error;
  }
};

// Payment function
export const getPayToken = async () => {
  // console.log(paymentData)
  try {
    const response = await axios.get(`${API_URL}/token`);
    const { success, token } = response.data.data;
    // console.log(token)
    return { success, token };
  } catch (error: any) {
    console.log(error.response?.data || 'Get token Pay failed');
    throw error;
  }
};


let interceptorsSetup = false;

export const setupApiInterceptors = async () => {
  if (interceptorsSetup) return;
  interceptorsSetup = true;

  axios.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('@b_ticket_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Content-Type'] = 'multipart/form-data';
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('@b_ticket_token');
        await AsyncStorage.removeItem('@b_ticket_user');
        router.replace('/(auth)/welcome');
      }
      return Promise.reject(error);
    }
  );
};


