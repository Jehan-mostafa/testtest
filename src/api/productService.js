import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const ASSET_BASE_URL = BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:3000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function normalizeError(error) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function normalizeImageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return "";
  if (image.startsWith("/")) return `${ASSET_BASE_URL}${image}`;
  return `${ASSET_BASE_URL}/${image}`;
}

function normalizeReview(review) {
  if (!review || typeof review !== "object") {
    return review;
  }

  return {
    ...review,
    id: review.id || review._id,
  };
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return product;
  }

  const hasProductShape = Boolean(product.id || product._id || (product.name && product.artist));
  if (!hasProductShape) {
    return null;
  }

  return {
    ...product,
    id: product.id || product._id || `${product.name}-${product.artist}`,
    image: normalizeImageUrl(product.image),
    reviews: Array.isArray(product.reviews) ? product.reviews.map(normalizeReview) : product.reviews,
  };
}

export async function getProducts(params = {}) {
  try {
    const response = await client.get("/products", { params });
    return (response.data?.data ?? []).map(normalizeProduct);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function getGiftRecommendations(payload) {
  try {
    const response = await client.post("/products/recommendations", payload);
    return (response.data?.data ?? []).map(normalizeProduct).filter(Boolean);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function getProduct(productId) {
  try {
    const response = await client.get(`/products/${productId}`);
    return normalizeProduct(response.data?.data ?? null);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function createProduct(payload) {
  try {
    const response = await client.post("/products", payload);
    return normalizeProduct(response.data?.data ?? response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function createProductWithImage(payload, imageFile) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    });
    if (imageFile) formData.append("image", imageFile);

    const response = await client.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProduct(response.data?.data ?? response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function updateProductWithImage(productId, payload, imageFile) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    });
    if (imageFile) formData.append("image", imageFile);

    const response = await client.put(`/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeProduct(response.data?.data ?? response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function addProductReview(productId, payload) {
  try {
    const response = await client.post(`/products/${productId}/reviews`, payload);
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function updateProductReview(productId, reviewId, payload) {
  try {
    const response = await client.put(`/products/${productId}/reviews/${reviewId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function deleteProductReview(productId, reviewId) {
  try {
    const response = await client.delete(`/products/${productId}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}
