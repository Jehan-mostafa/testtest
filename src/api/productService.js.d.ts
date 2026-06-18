import type { Product } from "../types/product";

export function getProducts(params?: Record<string, string | number | boolean | undefined>): Promise<Product[]>;
export function getGiftRecommendations(payload: {
  occasion: string;
  gender: string;
  age: string;
  budget: number;
}): Promise<Product[]>;
export function getProduct(productId: string | number): Promise<Product | null>;
export function createProduct(payload: Record<string, unknown>): Promise<Product>;
export function addProductReview(productId: string | number, payload: { author: string; comment: string }): Promise<Product>;
export function updateProductReview(productId: string | number, reviewId: string | number, payload: { author: string; comment: string }): Promise<Product>;
export function deleteProductReview(productId: string | number, reviewId: string | number): Promise<Product>;
