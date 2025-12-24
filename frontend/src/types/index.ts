export type UserRole = 'WORKER' | 'FARMER' | 'ADMIN';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export type PaymentStatus = 'PENDING' | 'HELD_IN_ESCROW' | 'RELEASED' | 'REFUNDED' | 'FAILED';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  workerProfile?: WorkerProfile;
  farmerProfile?: FarmerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  skills: string[];
  languages: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  experienceYears: number;
  certifications: string[];
  totalEarnings: number;
  totalJobs: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  farmLocation: string;
  latitude?: number;
  longitude?: number;
  farmSize?: number;
  cropTypes: string[];
  totalSpent: number;
  totalJobsPosted: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  farmerId: string;
  farmer: User;
  title: string;
  description: string;
  jobType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  wagePerDay: number;
  duration: number;
  workersNeeded: number;
  requiredSkills: string[];
  startDate: string;
  endDate?: string;
  status: JobStatus;
  applications?: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  workerId: string;
  worker: User;
  status: ApplicationStatus;
  message?: string;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  applicationId: string;
  application?: Application;
  amount: number;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  releasedAt?: string;
}

export interface Rating {
  id: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  rating: number;
  comment?: string;
  createdAt: string;
}
