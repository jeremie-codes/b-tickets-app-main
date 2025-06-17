export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

// types/EventType.ts

export interface CategoryType {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface EventMedia {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: any[];
  custom_properties: any[];
  responsive_images: any[];
  generated_conversions: any[];
  order_column: number;
  original_url: string;
  preview_url: string;
  created_at: string;
  updated_at: string;
}

export interface EventPrice {
  id: number;
  amount: number;
  currency: string;
  category: string;
  event_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface EventType {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  date: string;
  time_start: string;
  time_end: string;
  max_ticket: number;
  is_actif: number;
  image: string | null;
  author_name: string;
  author_picture: string | null;
  category_id: number;
  category: CategoryType;
  media: EventMedia[];
  prices: EventPrice[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

export interface WishlistItem {
  id: string;
  event: EventType;
  addedDate: string;
}