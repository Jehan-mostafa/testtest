// src/api/order.api.ts
import axios from "axios";
import type { CreateOrderPayload, Order } from "../types/order";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

function toIdString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "toString" in value) {
    return String(value);
  }
  return String(value);
}

function extractOrder(raw: Record<string, unknown>): Record<string, unknown> {
  const nested = raw.data ?? raw.order;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }
  return raw;
}

function extractOrdersList(raw: Record<string, unknown> | Record<string, unknown>[]): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw;
  const list = raw.data ?? raw.orders ?? raw.items;
  return Array.isArray(list) ? list : [];
}

function normalizeOrder(raw: Record<string, unknown>): Order {
  const shipping = (raw.shippingAddress ?? raw.shipping_address ?? {}) as Record<string, string>;
  const items = (raw.items ?? raw.orderItems ?? []) as Array<Record<string, unknown>>;

  const mongoId = toIdString(raw._id ?? raw.id);
  const displayId = toIdString(
    raw.orderNumber ?? raw.orderId ?? raw.order_id ?? raw._id ?? raw.id
  );

  return {
    id: mongoId,
    orderId: displayId,
    customerName: String(
      shipping.fullName ?? raw.customerName ?? raw.customer_name ?? ""
    ),
    shippingAddress: {
      fullName: shipping.fullName ?? "",
      street: shipping.street ?? shipping.address ?? "",
      city: shipping.city ?? "",
      state: shipping.state ?? "",
      zipCode: shipping.zipCode ?? shipping.zip ?? "",
      country: shipping.country ?? "Egypt",
      phone: shipping.phone ?? "",
    },
    items: items.map((item) => ({
      productId: Number(item.productId ?? item.product_id ?? item.product ?? item.id ?? 0),
      name: String(item.name ?? item.productName ?? ""),
      quantity: Number(item.quantity ?? 1),
      unitPrice: Number(item.unitPrice ?? item.price ?? 0),
      subtotal: Number(item.subtotal ?? item.totalPrice ?? item.total ?? 0),
      image: item.image as string | undefined,
    })),
    paymentMethod: String(raw.paymentMethod ?? raw.payment_method ?? "cash_on_delivery"),
    total: Number(raw.total ?? raw.grandTotal ?? 0),
    subtotal: raw.subtotal != null ? Number(raw.subtotal) : undefined,
    shipping: Number(raw.shipping ?? raw.shippingCost ?? 0) || undefined,
    vat: Number(raw.vat ?? raw.tax ?? 0) || undefined,
    status: String(raw.status ?? "pending"),
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}

async function safeJsonResponse<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function createOrderApi(payload: CreateOrderPayload): Promise<Order> {
  const data = await safeJsonResponse<Record<string, unknown>>(
    client.post("/orders", payload, { headers: authHeaders() })
  );
  return normalizeOrder(extractOrder(data));
}

export async function getOrdersApi(): Promise<Order[]> {
  const data = await safeJsonResponse<Record<string, unknown> | Record<string, unknown>[]>(
    client.get("/orders", { headers: authHeaders() })
  );
  const list = Array.isArray(data) ? data : extractOrdersList(data);
  return list.map(normalizeOrder);
}

export async function getOrderApi(orderId: string | number): Promise<Order> {
  const data = await safeJsonResponse<Record<string, unknown>>(
    client.get(`/orders/${orderId}`, { headers: authHeaders() })
  );
  return normalizeOrder(extractOrder(data));
}

export async function cancelOrderApi(orderId: string | number) {
  return safeJsonResponse(
    client.delete(`/orders/${orderId}`, { headers: authHeaders() })
  );
}
