import api from '@/lib/axios';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentData {
  bookingId: string;
  amount: number;
  currency?: string;
}

export interface PaymentResponse {
  id: string;
  transactionId: string;
  clientSecret?: string;
  status: string;
}

export const paymentApi = {
  // Create payment
  createPayment: async (data: PaymentData): Promise<PaymentResponse> => {
    const response = await api.post('/payments/create', {
      bookingId: data.bookingId,
      provider: 'STRIPE',
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create payment');
  },

  // Confirm payment
  confirmPayment: async (transactionId: string): Promise<PaymentResponse> => {
    const response = await api.post('/payments/confirm', { transactionId });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to confirm payment');
  },

  // Get payment by ID
  getPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await api.get(`/payments/${paymentId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch payment');
  },

  // Get payment history
  getPaymentHistory: async (): Promise<PaymentResponse[]> => {
    const response = await api.get('/payments');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch payment history');
  },

  // Redirect to Stripe Checkout
  redirectToCheckout: async (sessionId: string) => {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw new Error(error.message);
    }
  },
};
