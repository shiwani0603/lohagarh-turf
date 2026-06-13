'use client';

import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string;
  date: string;        // YYYY-MM-DD
  sport: string;
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  durationHours: number;
  slotType: 'day' | 'night';
  dayType: 'weekday' | 'weekend';
  pricePerHour: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.date}-${item.startTime}-${Date.now()}`;
    setItems(prev => [...prev, { ...item, id }]);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => { setItems([]); setCoupon(null); };

  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const finalTotal = Math.max(0, subtotal - (coupon?.discount ?? 0));

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, clearCart,
      subtotal, coupon, finalTotal,
      applyCoupon: (code, discount) => setCoupon({ code, discount }),
      removeCoupon: () => setCoupon(null),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
