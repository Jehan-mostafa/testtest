// src/Context/FavouritesContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../types/product";
import type { Material } from "../types/material";

interface FavouritesContextType {
  favourites: Product[];
  materialFavourites: Material[];
  addToFavourites: (product: Product) => void;
  removeFromFavourites: (productId: number) => void;
  isFavourite: (productId: number) => boolean;
  toggleFavourite: (product: Product) => void;
  isMaterialFavourite: (materialId: string) => boolean;
  toggleMaterialFavourite: (material: Material) => void;
  removeMaterialFavourite: (materialId: string) => void;
  clearFavourites: () => void;
  favouritesCount: number;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
};

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<Product[]>(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  const [materialFavourites, setMaterialFavourites] = useState<Material[]>(() => {
    const saved = localStorage.getItem("materialFavourites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem("materialFavourites", JSON.stringify(materialFavourites));
  }, [materialFavourites]);

  const addToFavourites = (product: Product) => {
    setFavourites((prev) => {
      if (!prev.some((p) => p.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromFavourites = (productId: number) => {
    setFavourites((prev) => prev.filter((p) => p.id !== productId));
  };

  const isFavourite = (productId: number) => favourites.some((p) => p.id === productId);

  const toggleFavourite = (product: Product) => {
    if (isFavourite(product.id)) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product);
    }
  };

  const isMaterialFavourite = (materialId: string) =>
    materialFavourites.some((m) => m.id === materialId);

  const addMaterialFavourite = (material: Material) => {
    setMaterialFavourites((prev) => {
      if (!prev.some((m) => m.id === material.id)) {
        return [...prev, material];
      }
      return prev;
    });
  };

  const removeMaterialFavourite = (materialId: string) => {
    setMaterialFavourites((prev) => prev.filter((m) => m.id !== materialId));
  };

  const toggleMaterialFavourite = (material: Material) => {
    if (isMaterialFavourite(material.id)) {
      removeMaterialFavourite(material.id);
    } else {
      addMaterialFavourite(material);
    }
  };

  const clearFavourites = () => {
    setFavourites([]);
    setMaterialFavourites([]);
  };

  const favouritesCount = favourites.length + materialFavourites.length;

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        materialFavourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite,
        toggleFavourite,
        isMaterialFavourite,
        toggleMaterialFavourite,
        removeMaterialFavourite,
        clearFavourites,
        favouritesCount,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
