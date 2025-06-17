export interface Guest {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  tableId?: number;
  dietaryRestrictions?: string;
  accompanyingGuests?: number;
  category: 'family' | 'friends' | 'colleagues' | 'other';
  createdAt?: string;
  updatedAt?: string;
}

export interface Table {
  id?: number;
  name: string;
  capacity: number;
  occupiedSeats: number;
  location?: string;
  notes?: string;
  guests?: Guest[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id?: number;
  category: string;
  estimatedAmount: number;
  actualAmount: number;
  isPaid: boolean;
  dueDate?: string;
  vendor?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  category: 'planning' | 'venue' | 'catering' | 'decoration' | 'photography' | 'other';
  createdAt?: string;
  updatedAt?: string;
}

export interface WeddingInfo {
  id?: number;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  ceremonyTime: string;
  receptionTime: string;
  estimatedGuests: number;
  budget: number;
  createdAt?: string;
  updatedAt?: string;
}