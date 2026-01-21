export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[]; // Support for multiple images
  stock: number;
  margin: number;
  variations?: ProductVariation[];
  tags?: string[];
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedVariation?: ProductVariation;
}

export type PaymentMethod = 'Cash' | 'Card' | 'Online';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  date: string; // ISO string
  status: 'Completed' | 'Pending' | 'Cancelled' | 'Refunded';
  customer: string;
  paymentMethod: PaymentMethod;
}

export type Category = 'All Products' | 'Food' | 'Drinks' | 'Desserts';

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockAlerts: number;
  salesChange: number; // Percentage
  ordersChange: number; // Percentage
}