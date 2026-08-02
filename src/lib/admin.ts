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
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch stats');
    } catch (error: any) {
      console.error('Admin stats error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get all users
  getUsers: async (filters?: { role?: string; status?: string }) => {
    try {
      const response = await api.get('/admin/users', { params: filters });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch users');
    } catch (error: any) {
      console.error('Admin users error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get all bookings
  getBookings: async (filters?: { status?: string; page?: number; limit?: number }) => {
    try {
      const response = await api.get('/admin/bookings', { params: filters });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch bookings');
    } catch (error: any) {
      console.error('Admin bookings error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update user status
  updateUserStatus: async (userId: string, status: string) => {
    try {
      const response = await api.patch(`/users/${userId}/status`, { status });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to update user status');
    } catch (error: any) {
      console.error('Update user status error:', error.response?.data || error.message);
      throw error;
    }
  },
};
