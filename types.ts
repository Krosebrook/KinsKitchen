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
  stock: number;
  margin: number;
  variations?: ProductVariation[];
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedVariation?: ProductVariation;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  customer: string;
}

export type Category = 'All Products' | 'Food' | 'Drinks' | 'Desserts';

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockAlerts: number;
  salesChange: number;
  ordersChange: number;
}