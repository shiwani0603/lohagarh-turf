export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

export type Booking = {
  id: string;
  userId: string;
  date: Date;
  timeSlotId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'success' | 'failed';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  transactionId: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Settings = {
  id: string;
  siteName: string;
  aboutText: string;
  address: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  googleMapUrl: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  updatedAt: Date;
};
