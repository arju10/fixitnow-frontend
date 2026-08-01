import api from '@/lib/axios';

export interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  totalAdmins: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  recentBookings: any[];
}

export const adminApi = {
  // Get dashboard stats
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch stats');
  },

  // Get all users
  getUsers: async (filters?: { role?: string; status?: string }) => {
    const response = await api.get('/admin/users', { params: filters });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch users');
  },

  // Get all bookings
  getBookings: async (filters?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/admin/bookings', { params: filters });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch bookings');
  },

  // Update user status
  updateUserStatus: async (userId: string, status: string) => {
    const response = await api.patch(`/users/${userId}/status`, { status });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update user status');
  },
};
