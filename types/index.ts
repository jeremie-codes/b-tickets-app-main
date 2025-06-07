export interface User {
  id: string;
  name: string;
  email: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  isFavorite: boolean;
}

export interface CategoryType {
  id: string;
  name: string;
}

export interface TicketType {
  id: string;
  event: EventType;
  status: 'active' | 'used' | 'expired';
  purchaseDate: string;
  qrCode: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile';
  last4?: string;
  phoneNumber?: string;
}