import { apiClient } from './client';
import { User, Job, Application, Payment, Rating } from '../types';

// Auth API
export const authApi = {
  signup: async (data: { phone: string; name: string; email?: string; password: string; role: string }) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { phone: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Job API
export const jobApi = {
  getJobs: async (params?: { status?: string; jobType?: string; location?: string }) => {
    const response = await apiClient.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: Partial<Job>) => {
    const response = await apiClient.post('/jobs', data);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>) => {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await apiClient.delete(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await apiClient.get('/jobs/my-jobs');
    return response.data;
  },
};

// Application API
export const applicationApi = {
  createApplication: async (data: { jobId: string; message?: string }) => {
    const response = await apiClient.post('/applications', data);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await apiClient.get('/applications/my-applications');
    return response.data;
  },

  getApplicationById: async (id: string) => {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/applications/${id}/status`, { status });
    return response.data;
  },
};

// User API
export const userApi = {
  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  updateWorkerProfile: async (data: any) => {
    const response = await apiClient.put('/users/worker-profile', data);
    return response.data;
  },

  updateFarmerProfile: async (data: any) => {
    const response = await apiClient.put('/users/farmer-profile', data);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};

// Payment API
export const paymentApi = {
  createPayment: async (data: { applicationId: string; amount: number }) => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  releasePayment: async (id: string) => {
    const response = await apiClient.put(`/payments/${id}/release`);
    return response.data;
  },

  getPaymentById: async (id: string) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },
};

// Rating API
export const ratingApi = {
  createRating: async (data: { revieweeId: string; rating: number; comment?: string }) => {
    const response = await apiClient.post('/ratings', data);
    return response.data;
  },

  getRatingsForUser: async (userId: string) => {
    const response = await apiClient.get(`/ratings/user/${userId}`);
    return response.data;
  },

  deleteRating: async (id: string) => {
    const response = await apiClient.delete(`/ratings/${id}`);
    return response.data;
  },
};
