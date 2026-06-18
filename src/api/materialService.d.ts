import type { Material } from "../types/material";

export function getMaterials(): Promise<Material[]>;
export function getMaterial(materialId: string): Promise<Material | null>;
export function createMaterialWithImage(
  payload: Record<string, unknown>,
  imageFile?: File
): Promise<Material | null>;
export function updateMaterialWithImage(
  materialId: string,
  payload: Record<string, unknown>,
  imageFile?: File
): Promise<Material | null>;
