import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, ProductVariation } from '../types';
import { PRODUCTS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void; // For Admin
  updateProduct: (product: Product) => void; // For Admin Edit
  deleteProduct: (productId: string) => void; // For Admin Delete
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: Product, variation?: ProductVariation) => {
    setCart((prev) => {
      // Find existing item with same product ID AND same variation ID (if any)
      const existing = prev.find((item) => 
        item.id === product.id && item.selectedVariation?.id === variation?.id
      );

      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      // Create new cart item
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
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
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

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
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