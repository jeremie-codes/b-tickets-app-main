import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, EventType, ProfileType, CategoryType, WishlistItem } from '@/types';
import { API_URL } from '@/configs/index';

// For demo purposes, we're simulating API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockEvents: EventType[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Join us for the biggest music festival of the year! Featuring top artists from around the world, this three-day event will be filled with amazing performances, great food, and unforgettable memories. Bring your friends and enjoy the summer vibes!',
    date: '2025-07-15',
    time: '16:00',
    location: 'Central Park, New York',
    price: 89.99,
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '1',
    featured: true,
    isFavorite: false
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    description: 'The most anticipated tech conference of the year is back! Learn about the latest technologies, attend workshops, and network with industry professionals. This is your chance to stay ahead in the tech world.',
    date: '2025-09-20',
    time: '09:00',
    location: 'Convention Center, San Francisco',
    price: 199.99,
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '2',
    featured: true,
    isFavorite: false
  },
  {
    id: '3',
    title: 'International Food Festival',
    description: 'Taste cuisines from around the world at our International Food Festival. With over 50 food stalls representing different countries, this is a food lover\'s paradise. Don\'t miss the cooking demonstrations by renowned chefs!',
    date: '2025-06-10',
    time: '12:00',
    location: 'Riverfront Park, Chicago',
    price: 45.00,
    image: 'https://images.pexels.com/photos/5379707/pexels-photo-5379707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '3',
    featured: false,
    isFavorite: false
  },
  {
    id: '4',
    title: 'Art & Design Expo',
    description: 'Explore the world of art and design at our annual expo. See works from emerging and established artists, attend panel discussions, and participate in interactive workshops. Perfect for art enthusiasts and professionals alike.',
    date: '2025-08-05',
    time: '10:00',
    location: 'Modern Art Gallery, Los Angeles',
    price: 25.00,
    image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '4',
    featured: false,
    isFavorite: false
  },
  {
    id: '5',
    title: 'Marathon City Run',
    description: 'Challenge yourself with our annual city marathon. The 42km route takes you through the most scenic parts of the city. All participants receive a medal, and prizes are awarded to top finishers. Register now to secure your spot!',
    date: '2025-10-12',
    time: '07:00',
    location: 'Downtown, Boston',
    price: 75.00,
    image: 'https://images.pexels.com/photos/2774895/pexels-photo-2774895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '5',
    featured: true,
    isFavorite: false
  },
  {
    id: '6',
    title: 'Comedy Night Special',
    description: 'Laugh your heart out at our Comedy Night Special. We\'ve brought together the funniest comedians for an evening of entertainment. Grab your tickets now for a night filled with laughter and fun!',
    date: '2025-07-28',
    time: '20:00',
    location: 'Comedy Club, Austin',
    price: 35.00,
    image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '6',
    featured: false,
    isFavorite: false
  }
];

// Auth functions
export const login = async (email: string, password: string) => {
  try {

    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data.data;

    console.log(user.id);
    
    //Stocke le token
    // await AsyncStorage.setItem('@b_ticket_token', token);

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
// export const updateUserProfile = async (userData: { name: string; email: string; profileImage?: string }) => {
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

// export const uploadProfileImage = async (base64Image: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/user/upload-profile-image`, {
//       image: base64Image
//     });
//     const { success, imageUrl } = response.data;
//     return { success, imageUrl };
//   } catch (error: any) {
//     console.log(error.response?.data?.message || 'Image upload failed');
//     throw error;
//   }
// };

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
  // await delay(1000); // Simulate API delay
  // In a real app, this would be a GET request to the API
  // return mockEvents;
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

// Set up axios interceptors for adding token to requests
export const setupApiInterceptors = async () => {
  axios.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('@b_ticket_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Content-Type'] = 'multipart/form-data'
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

function capitalize(str: string) {
  str = str.toLowerCase(); // met tout en minuscules d'abord
  return str.charAt(0).toUpperCase() + str.slice(1);
}