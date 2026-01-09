import { Product, Order, DashboardStats } from './types';

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Cheeseburger', category: 'Food', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', stock: 50, margin: 50, tags: ['Lunch', 'Fast Food', 'Popular'] },
  { id: '2', name: 'Pepperoni Pizza', category: 'Food', price: 12.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80', stock: 30, margin: 45, tags: ['Dinner', 'Italian', 'Sharing'] },
  { id: '3', name: 'Caesar Salad', category: 'Food', price: 7.99, image: 'https://images.unsplash.com/photo-1550384945-20945131a043?auto=format&fit=crop&w=400&q=80', stock: 25, margin: 60, tags: ['Healthy', 'Lunch', 'Vegetarian'] },
  { id: '4', name: 'Chicken Wings', category: 'Food', price: 9.99, image: 'https://images.unsplash.com/photo-1560684346-6245c5f14f61?auto=format&fit=crop&w=400&q=80', stock: 40, margin: 55, tags: ['Appetizer', 'Spicy', 'Sharing'] },
  { id: '5', name: 'French Fries', category: 'Food', price: 3.99, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=400&q=80', stock: 100, margin: 70, tags: ['Side', 'Snack', 'Vegan'] },
  { id: '6', name: 'Coca Cola', category: 'Drinks', price: 2.49, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', stock: 200, margin: 80, tags: ['Soda', 'Cold', 'Classic'] },
  { id: '7', name: 'Iced Tea', category: 'Drinks', price: 2.99, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80', stock: 150, margin: 80, tags: ['Cold', 'Refresher'] },
  { id: '8', name: 'Orange Juice', category: 'Drinks', price: 3.49, image: 'https://images.unsplash.com/photo-1613478221270-13f77dc1d8e1?auto=format&fit=crop&w=400&q=80', stock: 80, margin: 75, tags: ['Breakfast', 'Fruit'] },
  { id: '9', name: 'Latte', category: 'Drinks', price: 4.49, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80', stock: 60, margin: 70, tags: ['Coffee', 'Hot', 'Caffeine'] },
  { id: '10', name: 'Bottled Water', category: 'Drinks', price: 1.99, image: 'https://images.unsplash.com/photo-1564419326-708973200875?auto=format&fit=crop&w=400&q=80', stock: 300, margin: 90, tags: ['Essentials'] },
  { id: '11', name: 'Chocolate Cake', category: 'Desserts', price: 5.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', stock: 20, margin: 65, tags: ['Sweet', 'Indulgence'] },
  { id: '12', name: 'Cheesecake', category: 'Desserts', price: 6.49, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3dfcd?auto=format&fit=crop&w=400&q=80', stock: 15, margin: 60, tags: ['Sweet', 'Classic'] },
  { id: '13', name: 'Ice Cream', category: 'Desserts', price: 4.99, image: 'https://images.unsplash.com/photo-1501443762666-62f9f5d14327?auto=format&fit=crop&w=400&q=80', stock: 40, margin: 60, tags: ['Cold', 'Sweet'] },
  { id: '14', name: 'Apple Pie', category: 'Desserts', price: 5.49, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=400&q=80', stock: 18, margin: 55, tags: ['Warm', 'Fruit'] },
  { id: '15', name: 'Brownie', category: 'Desserts', price: 3.99, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&w=400&q=80', stock: 35, margin: 70, tags: ['Chocolate', 'Snack'] },
];

export const MOCK_STATS: DashboardStats = {
  totalSales: 12450.00,
  totalOrders: 342,
  totalCustomers: 1205,
  lowStockAlerts: 3,
  salesChange: 0.5,
  ordersChange: 4.1
};

export const RECENT_ORDERS: Order[] = [
  { id: '#ORD-001', customer: 'John Doe', total: 24.50, status: 'Completed', date: '2023-10-25', items: [] },
  { id: '#ORD-002', customer: 'Jane Smith', total: 12.99, status: 'Completed', date: '2023-10-25', items: [] },
  { id: '#ORD-003', customer: 'Bob Johnson', total: 45.00, status: 'Pending', date: '2023-10-24', items: [] },
  { id: '#ORD-004', customer: 'Alice Brown', total: 8.99, status: 'Completed', date: '2023-10-24', items: [] },
];

export const CHART_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];