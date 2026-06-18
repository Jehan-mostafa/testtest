import type { CartItem } from "../Context/CartContext";

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image?: string;
}

export interface CreateOrderPayload {
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  notes?: string;
  couponCode?: string;
}

export interface Order {
  id: string;
  orderId?: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentMethod: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  vat?: number;
  status: string;
  createdAt: string;
}

export function buildOrderItems(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    subtotal: item.price * item.quantity,
    image: item.image,
  }));
}
