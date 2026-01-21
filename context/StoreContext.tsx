import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, CartItem, ProductVariation, Order, DashboardStats, PaymentMethod } from '../types';
import { PRODUCTS, RECENT_ORDERS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  stats: DashboardStats;
  addToCart: (product: Product, variation?: ProductVariation) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  placeOrder: (customerName: string, paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  // Initialize state from localStorage or fall back to constants
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pos_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch (e) {
      return PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('pos_orders');
      return saved ? JSON.parse(saved) : RECENT_ORDERS;
    } catch (e) {
      return RECENT_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pos_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pos_cart', JSON.stringify(cart));
  }, [cart]);

  // Dynamic Dashboard Statistics
  const stats = useMemo<DashboardStats>(() => {
    // Only count completed orders for sales stats
    const validOrders = orders.filter(o => o.status === 'Completed');
    const totalSales = validOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    // Count unique customers
    const uniqueCustomers = new Set(orders.map(o => o.customer)).size;
    
    // Low stock logic: Any product or variation with stock < 10
    let lowStockCount = 0;
    products.forEach(p => {
      if (p.variations && p.variations.length > 0) {
        if (p.variations.some(v => v.stock < 10)) lowStockCount++;
      } else {
        if (p.stock < 10) lowStockCount++;
      }
    });

    return {
      totalSales,
      totalOrders,
      totalCustomers: uniqueCustomers,
      lowStockAlerts: lowStockCount,
      salesChange: 2.5, // Mock daily change
      ordersChange: 1.2 // Mock daily change
    };
  }, [orders, products]);

  const addToCart = (product: Product, variation?: ProductVariation) => {
    setCart((prev) => {
      const existing = prev.find((item) => 
        item.id === product.id && item.selectedVariation?.id === variation?.id
      );

      // Check stock availability
      const currentStock = variation ? variation.stock : product.stock;
      const currentQtyInCart = existing ? existing.quantity : 0;

      if (currentQtyInCart + 1 > currentStock) {
        alert(`Insufficient stock! Only ${currentStock} available.`);
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      const newItem: CartItem = {
        ...product,
        cartItemId: `${product.id}-${variation?.id || 'base'}-${Date.now()}`,
        quantity: 1,
        selectedVariation: variation
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const maxStock = item.selectedVariation ? item.selectedVariation.stock : item.stock;
          const newQty = item.quantity + delta;
          
          if (newQty > maxStock) {
            // Optional: visual feedback handled by UI disabling button usually, but good safeguard
            return item; 
          }
          return { ...item, quantity: Math.max(0, newQty) };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const oldStatus = orders[orderIndex].status;

    // Inventory Management Logic for Refunds
    if (newStatus === 'Refunded' && oldStatus !== 'Refunded') {
        // Restock items
        const newProducts = [...products];
        orders[orderIndex].items.forEach(item => {
            const productIndex = newProducts.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
                const product = newProducts[productIndex];
                if (item.selectedVariation) {
                    const varIndex = product.variations?.findIndex(v => v.id === item.selectedVariation?.id);
                    if (varIndex !== undefined && varIndex !== -1 && product.variations) {
                        product.variations[varIndex].stock += item.quantity;
                    }
                } else {
                    product.stock += item.quantity;
                }
            }
        });
        setProducts(newProducts);
    } else if (oldStatus === 'Refunded' && newStatus !== 'Refunded') {
        // Deduct items again (un-refund) - Edge case, but handled
        const newProducts = [...products];
        orders[orderIndex].items.forEach(item => {
            const productIndex = newProducts.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
                const product = newProducts[productIndex];
                if (item.selectedVariation) {
                    const varIndex = product.variations?.findIndex(v => v.id === item.selectedVariation?.id);
                    if (varIndex !== undefined && varIndex !== -1 && product.variations) {
                        product.variations[varIndex].stock = Math.max(0, product.variations[varIndex].stock - item.quantity);
                    }
                } else {
                    product.stock = Math.max(0, product.stock - item.quantity);
                }
            }
        });
        setProducts(newProducts);
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const placeOrder = async (customerName: string, paymentMethod: PaymentMethod): Promise<Order> => {
    if (cart.length === 0) throw new Error("Cart is empty");

    // 1. Calculate totals
    const subtotal = cart.reduce((sum, item) => {
      const price = item.selectedVariation ? item.selectedVariation.price : item.price;
      return sum + (price * item.quantity);
    }, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // 2. Deduct Inventory
    const newProducts = [...products];
    
    for (const cartItem of cart) {
      const productIndex = newProducts.findIndex(p => p.id === cartItem.id);
      if (productIndex === -1) continue;

      const product = newProducts[productIndex];

      if (cartItem.selectedVariation) {
        // Handle Variation Stock
        const variationIndex = product.variations?.findIndex(v => v.id === cartItem.selectedVariation?.id);
        if (variationIndex !== undefined && variationIndex !== -1 && product.variations) {
           // Create a new variations array copy
           const newVariations = [...product.variations];
           newVariations[variationIndex] = {
             ...newVariations[variationIndex],
             stock: Math.max(0, newVariations[variationIndex].stock - cartItem.quantity)
           };
           newProducts[productIndex] = { ...product, variations: newVariations };
        }
      } else {
        // Handle Base Product Stock
        newProducts[productIndex] = {
          ...product,
          stock: Math.max(0, product.stock - cartItem.quantity)
        };
      }
    }

    // 3. Create Order Record
    const newOrder: Order = {
      id: `#ORD-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      total: parseFloat(total.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      date: new Date().toISOString(),
      status: 'Completed',
      customer: customerName || 'Walk-in Customer',
      paymentMethod
    };

    // 4. Update State
    setProducts(newProducts);
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        stats,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
