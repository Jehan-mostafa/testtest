import type { Product } from "../types/product";

export declare function getProducts(params?: Record<string, string | number | boolean | undefined>): Promise<Product[]>;
export declare function getGiftRecommendations(payload: {
  occasion: string;
  gender: string;
  age: string;
  budget: number;
}): Promise<Product[]>;
export declare function getProduct(productId: string | number): Promise<Product | null>;
export declare function createProduct(payload: Record<string, unknown>): Promise<Product>;
export declare function createProductWithImage(
  payload: Record<string, unknown>,
  imageFile?: File
): Promise<Product>;
export declare function updateProductWithImage(
  productId: string | number,
  payload: Record<string, unknown>,
  imageFile?: File
): Promise<Product>;
export declare function addProductReview(
  productId: string | number,
  payload: { author: string; comment: string }
): Promise<Product>;
export declare function updateProductReview(
  productId: string | number,
  reviewId: string | number,
  payload: { author: string; comment: string }
): Promise<Product>;
export declare function deleteProductReview(
  productId: string | number,
  reviewId: string | number
): Promise<Product>;
