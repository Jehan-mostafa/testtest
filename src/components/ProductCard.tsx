import React from "react";
import { Product } from "../types/product";
import Rating from "./Rating";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="card product-card h-100 shadow-sm" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-subtitle mb-2 text-muted">By {product.artist}</p>
        <p className="card-text fw-bold">
          {product.price} {product.currency}
        </p>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <button className="btn btn-outline-dark mt-3 w-100">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;