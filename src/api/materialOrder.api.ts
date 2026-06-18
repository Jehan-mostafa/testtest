import axios from "axios";
import type { MaterialOrder, MaterialOrderItem } from "../types/material";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

function toIdString(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

function normalizeOrder(raw: Record<string, unknown>): MaterialOrder {
  const items = (raw.items ?? []) as Array<Record<string, unknown>>;

  return {
    id: toIdString(raw._id ?? raw.id),
    orderNumber: toIdString(raw.orderNumber ?? raw._id ?? raw.id),
    customerName: String(raw.customerName ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    address: String(raw.address ?? ""),
    items: items.map((item) => ({
      materialId: toIdString(item.materialId ?? item.material),
      name: String(item.name ?? ""),
      quantity: Number(item.quantity ?? 1),
      price: Number(item.price ?? 0),
      image: item.image as string | undefined,
    })),
    subtotal: raw.subtotal != null ? Number(raw.subtotal) : undefined,
    shipping: raw.shipping != null ? Number(raw.shipping) : undefined,
    totalAmount: Number(raw.totalAmount ?? raw.total ?? 0),
    paymentMethod: String(raw.paymentMethod ?? "cash_on_delivery"),
    status: String(raw.status ?? "pending"),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

export interface CreateMaterialOrderPayload {
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  items: MaterialOrderItem[];
  paymentMethod: string;
}

export async function createMaterialOrderApi(
  payload: CreateMaterialOrderPayload
): Promise<MaterialOrder> {
  try {
    const response = await client.post("/material-orders", payload, {
      headers: authHeaders(),
    });
    const data = response.data?.data ?? response.data;
    return normalizeOrder(data as Record<string, unknown>);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}
