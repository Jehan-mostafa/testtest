import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import Navbar from "../../components/Navbar";
import { useCart } from "../../Context/CartContext";
import { getMaterial, getMaterials } from "../../api/materialService.js";
import type { Material } from "../../types/material";
import "../ProductDetails/ProductDetails.css";
import "./MaterialDetails.css";

const MaterialDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addMaterialToCart } = useCart();
  const [material, setMaterial] = useState<Material | null>(null);
  const [related, setRelated] = useState<Material[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageBroken, setImageBroken] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid material id");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMaterial(id);
        if (!data) {
          setError("Material not found");
          return;
        }
        setMaterial(data);
        setImageBroken(false);

        const all = await getMaterials();
        setRelated(
          all.filter((m) => m.id !== data.id && m.category === data.category).slice(0, 4)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!material) return;
    addMaterialToCart(material, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!material) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    addMaterialToCart(material, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="not-found"><p>Loading material...</p></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="not-found">
          <p>{error || "Material not found"}</p>
          <button className="btn btn-primary" onClick={() => navigate("/materials")}>
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Navbar />

      <div className="product-details-main">
        <button className="back-btn" onClick={() => navigate("/materials")}>
          ← Back to Materials
        </button>

        <div className="product-details-grid">
          <div className="product-gallery">
            <div className="product-main-image">
              {material.image && !imageBroken ? (
                <img
                  src={material.image}
                  alt={material.name}
                  className="product-detail-image"
                  onError={() => setImageBroken(true)}
                />
              ) : (
                <span className="product-detail-emoji">🧵</span>
              )}
            </div>
          </div>

          <div className="product-info-details">
            <h1 className="product-detail-name">{material.name}</h1>
            <p className="product-detail-artist">Category: {material.category}</p>
            <p className="product-detail-price">{material.price} EGP</p>
            

            <div className="detail-divider" />

            <p className="product-detail-description">{material.description}</p>

            <div className="detail-section">
              <h4>Specifications</h4>
              <ul className="specs-list">
                {material.specifications.length > 0 ? (
                  material.specifications.map((spec, i) => <li key={i}>{spec}</li>)
                ) : (
                  <li>Standard craft-grade material</li>
                )}
              </ul>
            </div>

            <div className="detail-section">
              <h4>Seller Information</h4>
              <p><strong>{material.sellerName || "HandMade Supplier"}</strong></p>
              {material.sellerPhone && <p>Phone: {material.sellerPhone}</p>}
              {material.sellerEmail && <p>Email: {material.sellerEmail}</p>}
            </div>

            <div className="stock-status">
              <span className={material.stock > 0 ? "in-stock" : "out-of-stock"}>
                {material.stock > 0
                  ? `✓ In stock: ${material.stock} available`
                  : "✕ Out of stock"}
              </span>
            </div>

            <div className="material-qty-row">
              <span>Quantity:</span>
              <div className="material-qty-controls">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(material.stock, q + 1))}
                  disabled={quantity >= material.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="material-action-btns">
              <button
                className={`btn btn-primary add-to-cart-btn ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={material.stock === 0}
              >
                <i className="bi bi-cart-plus" />
                {added ? " Added to Cart!" : " Add to Cart"}
              </button>
              <button
                className="btn btn-outline material-buy-now-btn"
                onClick={handleBuyNow}
                disabled={material.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h3>Reviews</h3>
          {material.reviews && material.reviews.length > 0 ? (
            material.reviews.map((review, idx) => (
              <div key={review.id || review._id || idx} className="review-card">
                <div className="review-header">
                  <strong>{review.author}</strong>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet.</p>
          )}
        </div>

        {related.length > 0 && (
          <div className="related-section">
            <h3>Related in {material.category}</h3>
            <div className="related-grid">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="related-card"
                  onClick={() => navigate(`/materials/${rel.id}`)}
                >
                  <div className="related-thumb"><span>🧵</span></div>
                  <div className="related-info">
                    <h6>{rel.name}</h6>
                    <p className="related-price">{rel.price} EGP</p>
                    <Rating rating={rel.rating} reviewCount={rel.reviewCount} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialDetails;
