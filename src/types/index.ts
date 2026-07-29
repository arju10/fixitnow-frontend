// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string | null;
  experienceYrs: number;
  location?: string | null;
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  services: Service[];
  availability: AvailabilitySlot[];
}

export interface AdminProfile {
  id: string;
  userId: string;
  department?: string | null;
  permissions: string[];
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CATEGORY & SERVICE TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  services?: Service[];
}

export interface Service {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  durationMins: number;
  categoryId: string;
  technicianId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  technician: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  };
}

// ============================================
// BOOKING TYPES
// ============================================

export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  scheduledAt: string;
  status:
    'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: User;
  technician: {
    id: string;
    user: User;
  };
  service: Service;
  payment?: Payment | null;
  review?: Review | null;
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  transactionId: string;
  amount: number;
  method: string;
  provider: 'STRIPE' | 'SSLCOMMERZ';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  booking: Booking;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer: User;
}

// ============================================
// AVAILABILITY TYPES
// ============================================

export interface AvailabilitySlot {
  id: string;
  technicianId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: any;
}

export interface AuthData {
  user: User;
  token: string;
}

export type AuthResponse = ApiResponse<AuthData>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
}

// ============================================
// FILTER TYPES
// ============================================

export interface ServiceFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
}

export interface TechnicianFilters {
  location?: string;
  skill?: string;
  minRating?: number;
}
