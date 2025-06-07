import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, EventType, TicketType, CategoryType } from '@/types';

// In a real app, this would be an environment variable
const API_URL = 'https://api.bticket.example.com';

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

const mockCategories: CategoryType[] = [
  { id: '1', name: 'Music' },
  { id: '2', name: 'Technology' },
  { id: '3', name: 'Food & Drink' },
  { id: '4', name: 'Art & Culture' },
  { id: '5', name: 'Sports' },
  { id: '6', name: 'Entertainment' }
];

const mockTickets: TicketType[] = [
  {
    id: 'ticket1',
    event: mockEvents[0],
    status: 'active',
    purchaseDate: '2025-05-10',
    qrCode: 'https://example.com/qr/ticket1'
  },
  {
    id: 'ticket2',
    event: mockEvents[2],
    status: 'used',
    purchaseDate: '2025-04-15',
    qrCode: 'https://example.com/qr/ticket2'
  },
  {
    id: 'ticket3',
    event: mockEvents[4],
    status: 'expired',
    purchaseDate: '2024-12-20',
    qrCode: 'https://example.com/qr/ticket3'
  }
];

// Auth functions
export const login = async (email: string, password: string) => {
  await delay(1000); // Simulate API delay
  
  // In a real app, this would be a POST request to the API
  if (email === 'user@example.com' && password === 'password') {
    const userData = {
      id: '1',
      name: 'John Doe',
      email: 'user@example.com'
    };
    return { user: userData, token: 'mock-token-12345' };
  }
  
  // Simulate successful login for demo purposes
  const userData = {
    id: '1',
    name: email.split('@')[0], // Use part of email as name
    email: email
  };
  return { user: userData, token: 'mock-token-12345' };
};

export const register = async (name: string, email: string, password: string) => {
  await delay(1500); // Simulate API delay
  
  // In a real app, this would be a POST request to the API
  const userData = {
    id: '1',
    name,
    email
  };
  return { user: userData, token: 'mock-token-12345' };
};

export const logout = async (token: string) => {
  await delay(800); // Simulate API delay
  // In a real app, this would be a POST request to the API
  return { success: true };
};

export const deleteAccount = async (token: string) => {
  await delay(1200); // Simulate API delay
  // In a real app, this would be a DELETE request to the API
  return { success: true };
};

// Events functions
export const getEvents = async () => {
  await delay(1000); // Simulate API delay
  // In a real app, this would be a GET request to the API
  return mockEvents;
};

export const getEventById = async (id: string) => {
  await delay(800); // Simulate API delay
  // In a real app, this would be a GET request to the API
  const event = mockEvents.find(event => event.id === id);
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};

export const getFavorites = async () => {
  await delay(1000); // Simulate API delay
  // In a real app, this would be a GET request to the API
  return mockEvents.filter(event => event.isFavorite);
};

export const toggleFavorite = async (eventId: string) => {
  await delay(600); // Simulate API delay
  // In a real app, this would be a POST request to the API
  const event = mockEvents.find(e => e.id === eventId);
  if (event) {
    event.isFavorite = !event.isFavorite;
    return { isFavorite: event.isFavorite };
  }
  throw new Error('Event not found');
};

// Categories functions
export const getCategories = async () => {
  await delay(800); // Simulate API delay
  // In a real app, this would be a GET request to the API
  return mockCategories;
};

// Tickets functions
export const getUserTickets = async () => {
  await delay(1200); // Simulate API delay
  // In a real app, this would be a GET request to the API
  return mockTickets;
};

export const getTicketById = async (id: string) => {
  await delay(800); // Simulate API delay
  // In a real app, this would be a GET request to the API
  const ticket = mockTickets.find(ticket => ticket.id === id);
  if (!ticket) { 
    throw new Error('Ticket not found');
  }
  return ticket;
};

// Payment function
export const processPayment = async (paymentData: any) => {
  await delay(2000); // Simulate API delay
  // In a real app, this would be a POST request to the API
  return { 
    success: true, 
    ticketId: 'ticket1' // Return the first mock ticket for demo purposes
  };
};

// Set up axios interceptors for adding token to requests
export const setupApiInterceptors = async () => {
  axios.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('@b_ticket_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};