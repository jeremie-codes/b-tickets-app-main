export interface ProfileType {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  picture: string;
  profileImage?: string;
}

export interface User {
  id: any;
  name: string;
  profile: ProfileType;
  email: string;
  password?: string;
  created_at: string;
}

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

export interface EventPromos {
  id: number;
  code: string;
  description: string;
  start_at: string;
  end_at: number;
  event_id: number;
  type: string;
  price_id: number;
  active: number;
  value_usd: string;
  value_cdf: string;
  value_percentage: string;
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
  promos: EventPromos[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TicketType {
  id: number;
  reference: string;
  quantity: number;
  total_amount: number;
  unit_amount: number;
  currency: string;
  payment_method: string;
  type_ticket: string;
  qrcode: string;
  is_refunded: number;
  scanned_by: string | null;
  used_at: string | null;
  success: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  event: EventType;
  tickets: any[]; // Remplace par une structure précise si disponible
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile';
  last4?: string;
  phoneNumber?: string;
}

export interface WishlistItem {
  id: number;
  event: EventType;
  created_at: string;
}