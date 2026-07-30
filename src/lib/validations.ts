import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'TECHNICIAN', 'ADMIN']),
});

// Booking validation - Updated for datetime-local format
export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  scheduledAt: z.string().min(1, 'Please select a date and time'),
  notes: z.string().optional(),
});

// Service validation
export const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  durationMins: z.number().positive('Duration must be positive').optional(),
  categoryId: z.string().min(1, 'Please select a category'),
});

// Review validation
export const reviewSchema = z.object({
  bookingId: z.string().min(1, 'Please select a booking'),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// Technician profile validation
export const technicianProfileSchema = z.object({
  bio: z.string().optional(),
  experienceYrs: z.number().min(0).optional(),
  location: z.string().optional(),
});

// Customer profile validation
export const customerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type TechnicianProfileInput = z.infer<typeof technicianProfileSchema>;
export type CustomerProfileInput = z.infer<typeof customerProfileSchema>;
