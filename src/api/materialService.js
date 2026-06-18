import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const ASSET_BASE_URL = BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:3000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function normalizeError(error) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

function normalizeImageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return "";
  if (image.startsWith("/")) return `${ASSET_BASE_URL}${image}`;
  return `${ASSET_BASE_URL}/${image}`;
}

function normalizeMaterial(material) {
  if (!material || typeof material !== "object") return null;
  if (!material.name) return null;

  return {
    ...material,
    id: String(material.id || material._id || material.name),
    image: normalizeImageUrl(material.image),
    specifications: Array.isArray(material.specifications) ? material.specifications : [],
    stock: material.stock ?? material.inStock ?? 0,
    rating: material.rating ?? 0,
    reviewCount: material.reviewCount ?? (material.reviews?.length || 0),
    reviews: Array.isArray(material.reviews) ? material.reviews : [],
  };
}

export async function getMaterials() {
  try {
    const response = await client.get("/materials");
    return (response.data?.data ?? []).map(normalizeMaterial).filter(Boolean);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function getMaterial(materialId) {
  try {
    const response = await client.get(`/materials/${materialId}`);
    return normalizeMaterial(response.data?.data ?? null);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function createMaterialWithImage(payload, imageFile) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : String(value)
        );
      }
    });
    if (imageFile) formData.append("image", imageFile);

    const response = await client.post("/materials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeMaterial(response.data?.data ?? response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}

export async function updateMaterialWithImage(materialId, payload, imageFile) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : String(value)
        );
      }
    });
    if (imageFile) formData.append("image", imageFile);

    const response = await client.put(`/materials/${materialId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeMaterial(response.data?.data ?? response.data);
  } catch (error) {
    throw new Error(normalizeError(error));
  }
}
