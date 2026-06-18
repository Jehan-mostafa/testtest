import axios from "axios";
import type { Product } from "../types/product";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const ASSET_BASE_URL = BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:3000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function normalizeImageUrl(image?: string) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return "";
  if (image.startsWith("/")) return `${ASSET_BASE_URL}${image}`;
  return `${ASSET_BASE_URL}/${image}`;
}

function normalizeProduct(product: any): Product {
  return {
    ...product,
    id: product.id || product._id || `${product.name}-${product.artist}`,
    image: normalizeImageUrl(product.image),
  };
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string;
  selected?: boolean;
}

function normalizeCartItem(item: any, index = 0): CartItem {
  const productSource = item?.product || item?.productId || item;
  const product = normalizeProduct(productSource || {});

  return {
    ...product,
    quantity: item?.quantity ?? 1,
    cartItemId: item?._id || item?.id || item?.cartItemId || `${product.id ?? index}`,
    selected: item?.selected ?? item?.isSelected ?? true,
  };
}

function normalizeCartResponse(payload: any): CartItem[] {
  const cartSource = payload?.data?.items ?? payload?.items ?? payload?.data ?? payload?.cart?.items ?? payload?.cart;

  if (!Array.isArray(cartSource)) {
    return [];
  }

  return cartSource.map((item, index) => normalizeCartItem(item, index));
}

async function safeJsonResponse<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function getCartApi(): Promise<CartItem[]> {
  const data = await safeJsonResponse(client.get("/cart", { headers: authHeaders() }));
  return normalizeCartResponse(data);
}

export async function addCartItemApi(productId: string | number, quantity = 1): Promise<CartItem[]> {
  const data = await safeJsonResponse(
    client.post(
      "/cart/items",
      { productId, quantity },
      { headers: authHeaders() },
    ),
  );
  return normalizeCartResponse(data);
}

export async function updateCartItemApi(itemId: string | number, quantity: number): Promise<CartItem[]> {
  const data = await safeJsonResponse(
    client.put(
      `/cart/items/${itemId}`,
      { quantity },
      { headers: authHeaders() },
    ),
  );
  return normalizeCartResponse(data);
}

export async function removeCartItemApi(itemId: string | number): Promise<CartItem[]> {
  const data = await safeJsonResponse(client.delete(`/cart/items/${itemId}`, { headers: authHeaders() }));
  return normalizeCartResponse(data);
}

export async function toggleCartItemApi(itemId: string | number): Promise<CartItem[]> {
  const data = await safeJsonResponse(client.patch(`/cart/items/${itemId}`, {}, { headers: authHeaders() }));
  return normalizeCartResponse(data);
}

export async function clearCartApi(): Promise<CartItem[]> {
  const data = await safeJsonResponse(client.delete("/cart", { headers: authHeaders() }));
  return normalizeCartResponse(data);
}
