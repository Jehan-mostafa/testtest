export interface MaterialReview {
  _id?: string;
  id?: string;
  author: string;
  date: string;
  comment: string;
  rating?: number;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  specifications: string[];
  rating: number;
  reviewCount?: number;
  reviews?: MaterialReview[];
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
}

export interface MaterialCartItem extends Material {
  quantity: number;
}

export interface MaterialOrderItem {
  materialId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface MaterialOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: MaterialOrderItem[];
  subtotal?: number;
  shipping?: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
