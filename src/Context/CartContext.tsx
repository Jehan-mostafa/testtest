// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Product } from "../types/product";
import type { Material } from "../types/material";
import {
  getCartApi,
  addCartItemApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../api/cart.api";

const MATERIAL_CART_KEY = "materialCart";

export type CartItemType = "product" | "material";

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string;
}

export interface MaterialCartItem extends Material {
  quantity: number;
}

export interface UnifiedCartItem {
  itemType: CartItemType;
  lineKey: string;
  id: string;
  cartItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  artist?: string;
  stock?: number;
}

interface CartContextType {
  productItems: CartItem[];
  materialItems: MaterialCartItem[];
  cartItems: UnifiedCartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  addMaterialToCart: (material: Material, quantity?: number) => void;
  removeFromCart: (lineKey: string) => Promise<void>;
  updateQuantity: (lineKey: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

function loadMaterialItems(): MaterialCartItem[] {
  try {
    const saved = localStorage.getItem(MATERIAL_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function toUnifiedItems(
  products: CartItem[],
  materials: MaterialCartItem[]
): UnifiedCartItem[] {
  const productLines: UnifiedCartItem[] = products.map((item) => ({
    itemType: "product",
    lineKey: `product:${item.cartItemId || item.id}`,
    id: String(item.id),
    cartItemId: item.cartItemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    artist: item.artist,
    category: item.category,
  }));

  const materialLines: UnifiedCartItem[] = materials.map((item) => ({
    itemType: "material",
    lineKey: `material:${item.id}`,
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category,
    stock: item.stock,
  }));

  return [...productLines, ...materialLines];
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productItems, setProductItems] = useState<CartItem[]>([]);
  const [materialItems, setMaterialItems] = useState<MaterialCartItem[]>(loadMaterialItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(MATERIAL_CART_KEY, JSON.stringify(materialItems));
  }, [materialItems]);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCartApi();
      setProductItems(data);
    } catch (err) {
      console.log("Error loading cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const cartItems = useMemo(
    () => toUnifiedItems(productItems, materialItems),
    [productItems, materialItems]
  );

  const addToCart = async (product: Product, quantity: number = 1) => {
    const updated = await addCartItemApi(product.id, quantity);
    setProductItems(updated);
  };

  const addMaterialToCart = (material: Material, quantity: number = 1) => {
    setMaterialItems((prev) => {
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
  };

  const removeFromCart = async (lineKey: string) => {
    if (lineKey.startsWith("material:")) {
      const id = lineKey.replace("material:", "");
      setMaterialItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    const itemId = lineKey.replace("product:", "");
    const updated = await removeCartItemApi(itemId);
    setProductItems(updated);
  };

  const updateQuantity = async (lineKey: string, quantity: number) => {
    if (quantity < 1) return;

    if (lineKey.startsWith("material:")) {
      const id = lineKey.replace("material:", "");
      setMaterialItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
      );
      return;
    }

    const itemId = lineKey.replace("product:", "");
    const updated = await updateCartItemApi(itemId, quantity);
    setProductItems(updated);
  };

  const clearCart = async () => {
    setMaterialItems([]);
    const updated = await clearCartApi();
    setProductItems(updated);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    productItems,
    materialItems,
    cartItems,
    isLoading,
    addToCart,
    addMaterialToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };
