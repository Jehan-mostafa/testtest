import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Material, MaterialCartItem } from "../types/material";

interface MaterialCartContextType {
  cartItems: MaterialCartItem[];
  addToCart: (material: Material, quantity?: number) => void;
  removeFromCart: (materialId: string) => void;
  updateQuantity: (materialId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const STORAGE_KEY = "materialCart";

const MaterialCartContext = createContext<MaterialCartContextType | undefined>(undefined);

export const useMaterialCart = (): MaterialCartContextType => {
  const context = useContext(MaterialCartContext);
  if (!context) {
    throw new Error("useMaterialCart must be used within MaterialCartProvider");
  }
  return context;
};

export const MaterialCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<MaterialCartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((material: Material, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === material.id);
      if (existing) {
        return prev.map((item) =>
          item.id === material.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, material.stock) }
            : item
        );
      }
      return [...prev, { ...material, quantity: Math.min(quantity, material.stock) }];
    });
  }, []);

  const removeFromCart = useCallback((materialId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== materialId));
  }, []);

  const updateQuantity = useCallback((materialId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === materialId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <MaterialCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </MaterialCartContext.Provider>
  );
};
