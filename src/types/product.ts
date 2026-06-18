// src/types/index.ts
export interface Product {
  id: number;
  name: string;
  artist: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image?: string;
  category: string;
  material?: string;
  inStock?: number;
  tags?: string[];
  description?: string;
  specifications?: {
    dimensions?: string;
    materials?: string;
    shipping?: string;
  };
  aboutArtist?: string;
  reviews?: { _id?: string; id?: string; author: string; date: string; comment: string }[];
}
