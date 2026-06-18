import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import {
  addProductReview,
  deleteProductReview,
  getProduct,
  getProducts,
  updateProductReview,
} from "../../api/productService.js";
import type { Product } from "../../types/product";
import "./ProductDetails.css";
import Navbar from "../../components/Navbar";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageBroken, setImageBroken] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const syncProductReviewsLocally = (
    current: Product,
    updater: (reviews: NonNullable<Product["reviews"]>) => NonNullable<Product["reviews"]>,
    reviewCountDelta = 0,
  ) => ({
    ...current,
    reviews: updater(current.reviews || []),
    reviewCount: Math.max((current.reviewCount || 0) + reviewCountDelta, 0),
  });

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      if (!id) {
        setError("Invalid product id");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const productData = await getProduct(id);
        if (!active) return;
        if (!productData) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setProduct(productData);
        setImageBroken(false);

        const allProducts = await getProducts();
        if (!active) return;

        setRelatedProducts(
          allProducts
            .filter(
              (item: Product) => item.id !== productData.id && item.category === productData.category,
            )
            .slice(0, 4),
        );
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!product) return;

    const author = reviewAuthor.trim();
    const comment = reviewComment.trim();

    if (!author || !comment) {
      setReviewError("Please enter your name and review.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewMessage("");

    const newReview = {
      author,
      comment,
      date: new Date().toISOString(),
    };

    try {
      const reviewResponse = editingReviewId
        ? await updateProductReview(product.id, editingReviewId, { author, comment })
        : await addProductReview(product.id, { author, comment });

      void reviewResponse;

      const freshProduct = await getProduct(product.id);
      if (freshProduct) {
        setProduct(freshProduct);
      } else {
        setProduct((current) =>
          current
            ? {
                ...current,
                reviews: editingReviewId
                  ? (current.reviews || []).map((review) =>
                      (review.id || review._id) === editingReviewId
                        ? { ...review, author, comment }
                        : review,
                    )
                  : [newReview, ...(current.reviews || [])],
                reviewCount: editingReviewId
                  ? current.reviewCount || 0
                  : (current.reviewCount || 0) + 1,
              }
            : current,
        );
      }

      setReviewAuthor("");
      setReviewComment("");
      setEditingReviewId(null);
      setReviewMessage("Your review was added.");
    } catch {
      setProduct((current) =>
        current
          ? {
              ...current,
              reviews: editingReviewId
                ? (current.reviews || []).map((review) =>
                    (review.id || review._id) === editingReviewId
                      ? { ...review, author, comment }
                      : review,
                  )
                : [newReview, ...(current.reviews || [])],
              reviewCount: editingReviewId
                ? current.reviewCount || 0
                : (current.reviewCount || 0) + 1,
            }
          : current,
      );
      setReviewAuthor("");
      setReviewComment("");
      setEditingReviewId(null);
      setReviewMessage(editingReviewId ? "Your review was updated locally." : "Your review was added locally.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleStartEditReview = (review: NonNullable<Product["reviews"]>[number]) => {
    const reviewId = review.id || review._id;
    if (!reviewId) return;

    setEditingReviewId(reviewId);
    setReviewAuthor(review.author);
    setReviewComment(review.comment);
    setReviewError("");
    setReviewMessage("");
  };

  const handleDeleteReview = async (review: NonNullable<Product["reviews"]>[number]) => {
    if (!product) return;

    const reviewId = review.id || review._id;
    if (!reviewId) return;

    try {
      await deleteProductReview(product.id, reviewId);

      const freshProduct = await getProduct(product.id);
      if (freshProduct) {
        setProduct(freshProduct);
      } else {
        setProduct((current) =>
          current
            ? syncProductReviewsLocally(
                current,
                (reviews) => reviews.filter((item) => (item.id || item._id) !== reviewId),
                -1,
              )
            : current,
        );
      }

      if (editingReviewId === reviewId) {
        setEditingReviewId(null);
        setReviewAuthor("");
        setReviewComment("");
      }

      setReviewMessage("Review deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      setReviewError(err instanceof Error ? err.message : "Failed to delete review.");
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="not-found">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="not-found">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="not-found">
          <p>Product not found</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Navbar />
      
      <div className="product-details-main">
       
        <button className="back-btn" onClick={() => navigate("/products")}>
          ← Back to Marketplace
        </button>

    
        <div className="product-details-grid">
          <div className="product-gallery">
            <div className="product-main-image">
              {product.image && !imageBroken ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-detail-image"
                  onError={() => setImageBroken(true)}
                />
              ) : (
                <span className="product-detail-emoji">🏺</span>
              )}
            </div>
          </div>

          <div className="product-info-details">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-artist">By {product.artist}</p>
            <p className="product-detail-price">{product.price} {product.currency}</p>
           

            <div className="detail-divider" />

            <p className="product-detail-description">
              {product.description || "Carefully crafted piece by our studio partner. Each piece is unique with natural variation in glaze, fiber, or patina."}
            </p>

            <div className="detail-section">
              <h4>About the Artist</h4>
              <p>{product.aboutArtist || "Independent maker focused on sustainable materials and small-batch production. Ships from a home studio with carbon-neutral packaging."}</p>
            </div>

            <div className="detail-section">
              <h4>Specifications</h4>
              <ul className="specs-list">
                <li><strong>Dimensions:</strong> {product.specifications?.dimensions || "15 x 8 x 3 in"}</li>
                <li><strong>Materials:</strong> {product.specifications?.materials || "Sterling silver"}</li>
                <li><strong>Shipping:</strong> {product.specifications?.shipping || "Ships in 2–4 business days via tracked parcel"}</li>
              </ul>
            </div>

            <div className="stock-status">
              <span className="in-stock">✓ In stock: {product.inStock || 21} available</span>
            </div>

            <button className="btn btn-primary add-to-cart-btn "> <i className="bi bi-cart-check"></i> Add to Cart</button>

            <div className="share-link">
              <small>Share this product · <a href="#">Copy link</a></small>
            </div>
          </div>
        </div>

       
        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={review.id || review._id || idx} className="review-card">
                <div className="review-header">
                  <strong>{review.author}</strong>
                  <span className="review-date">{review.date}</span>
                  <div className="review-actions">
                    <button type="button" className="review-action-btn" onClick={() => handleStartEditReview(review)}>
                      Edit
                    </button>
                    <button type="button" className="review-action-btn danger" onClick={() => handleDeleteReview(review)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}

          <form className="review-form" onSubmit={handleSubmitReview}>
            <h4>{editingReviewId ? "Edit Review" : "Add a Review"}</h4>
            <div className="review-form-row">
              <input
                type="text"
                className="review-input"
                placeholder="Your name"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
              />
            </div>
            <div className="review-form-row">
              <textarea
                className="review-textarea"
                placeholder="Write your review"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
            {reviewError && <p className="review-form-error">{reviewError}</p>}
            {reviewMessage && <p className="review-form-success">{reviewMessage}</p>}
            <div className="review-form-actions">
              {editingReviewId && (
                <button
                  type="button"
                  className="btn btn-outline review-cancel-btn"
                  onClick={() => {
                    setEditingReviewId(null);
                    setReviewAuthor("");
                    setReviewComment("");
                    setReviewError("");
                    setReviewMessage("");
                  }}
                >
                  Cancel
                </button>
              )}
              <button className="btn btn-primary review-submit-btn" type="submit" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </form>
        </div>

       
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h3>Related in {product.category}</h3>
            <div className="related-grid">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="related-card" onClick={() => navigate(`/product/${rel.id}`)}>
                  <div className="related-thumb">
                    <span>🏺</span>
                  </div>
                  <div className="related-info">
                    <h6>{rel.name}</h6>
                    <p className="related-artist">by {rel.artist}</p>
                    <p className="related-price">{rel.price} {rel.currency}</p>
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

export default ProductDetails;