import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Reclaimed Wood Shelf",
    artist: "Noah Patel",
    price: 440,
    currency: "EGP",
    rating: 4,
    reviewCount: 46,
    category: "Home Decor",
    material: "Wood",
    inStock: 8,
  },
  {
    id: 2,
    name: "Macrame Plant Hanger",
    artist: "Jordan Ellis",
    price: 318,
    currency: "EGP",
    rating: 5,
    reviewCount: 82,
    category: "Home Decor",
    material: "Cotton",
    inStock: 15,
  },
  {
    id: 7,
    name: "Hand-thrown Mug Pair",
    artist: "Samira Okonkwo",
    price: 178,
    currency: "EGP",
    rating: 4,
    reviewCount: 54,
    category: "Pottery",
    material: "Clay",
    inStock: 21,
    description: "Carefully crafted hand-thrown mug pair by our studio partner. Each piece is unique with natural variation in glaze, fiber, or patina.",
    aboutArtist: "Independent maker focused on sustainable materials and small-batch production. Ships from a home studio with carbon-neutral packaging.",
    specifications: {
      dimensions: "15 x 8 x 3 in",
      materials: "Sterling silver",
      shipping: "Ships in 2–4 business days via tracked parcel. International rates at checkout."
    },
    reviews: [
      { author: "Alex P.", date: "2026-01-17", comment: "Beautiful craftsmanship and fast shipping." },
      { author: "Jamie L.", date: "2025-02-18", comment: "Even better in person than in photos." }
    ]
  }
  // أضف باقي المنتجات بنفس الطريقة
];