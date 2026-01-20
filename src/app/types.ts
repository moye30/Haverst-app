export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
  notes: string;
  birthday?: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  preferences: string[];
  history: ServiceHistory[];
}

export interface ServiceHistory {
  id: string;
  date: string;
  services: string[];
  total: number;
  notes: string;
  photos?: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  services: string[];
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes: string;
  reminder: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  clientId?: string;
  appointmentId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
  lastPurchase: string;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'birthday' | 'lowStock' | 'reminder';
  title: string;
  message: string;
  date: string;
  read: boolean;
}
