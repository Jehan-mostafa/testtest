import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import Navbar from "../../components/Navbar";
import "./ShoppingCart.css";

const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    refreshCart,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadCart = async () => {
      try {
        setLoading(true);
        await refreshCart();
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate, refreshCart]);

  const applyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
      setAppliedCoupon("SAVE10");
      setCouponSuccess("Coupon applied! You saved 10 EGP");
      setCouponCode("");
    } else if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
      setAppliedCoupon("SAVE20");
      setCouponSuccess("Coupon applied! You saved 20 EGP");
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 1000 ? 0 : 45;
  const vat = (subtotal + shipping) * 0.14;
  const total = subtotal + shipping + vat - discount;
  const freeShippingRemaining = subtotal >= 1000 ? 0 : 1000 - subtotal;
  const freeShippingProgress = Math.min((subtotal / 1000) * 100, 100);

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;

    navigate("/checkout", {
      state: {
        discount,
        couponCode: appliedCoupon ?? undefined,
      },
    });
  };

  const handleRemove = async (lineKey: string) => {
    setRemovingKey(lineKey);
    try {
      await removeFromCart(lineKey);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setRemovingKey(null);
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <div className="cart-top-actions">
          <button className="continue-shopping-btn" onClick={() => navigate("/products")}>
            ← Products
          </button>
          <button className="continue-shopping-btn" onClick={() => navigate("/materials")}>
            ← Materials
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-header">
              <h2>
                Shopping Cart <span>{cartItems.length}</span>
              </h2>
              {cartItems.length > 0 && (
                <div className="cart-header-actions">
                  <button className="clear-cart-btn" onClick={clearCart}>
                    🗑️ Clear Cart
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">🛒</span>
                <h3>Your Cart is Empty</h3>
                <p>Add products or materials to your cart to get started.</p>
                <div className="empty-cart-buttons">
                  <button className="shop-now-btn" onClick={() => navigate("/products")}>
                    Shop Products
                  </button>
                  <button className="shop-now-btn materials" onClick={() => navigate("/materials")}>
                    Shop Materials
                  </button>
                </div>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div
                    key={item.lineKey}
                    className={`cart-item ${removingKey === item.lineKey ? "removing" : ""}`}
                  >
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span className="cart-item-placeholder">
                          {item.itemType === "material" ? "🧵" : "🏺"}
                        </span>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <span className={`cart-item-type-badge ${item.itemType}`}>
                        {item.itemType === "material" ? "Material" : "Product"}
                      </span>
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-artist">
                        {item.itemType === "product"
                          ? item.artist && `By ${item.artist}`
                          : item.category}
                      </p>
                      <p className="cart-item-price">{item.price} EGP</p>

                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}
                            disabled={
                              item.itemType === "material" &&
                              item.stock != null &&
                              item.quantity >= item.stock
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemove(item.lineKey)}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      {(item.price * item.quantity).toFixed(2)} EGP
                      <small>Total</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3>📋 Order Summary</h3>

              <div className="summary-row">
                <span className="label">Subtotal</span>
                <span className="value">{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="summary-row">
                <span className="label">Shipping</span>
                <span className="value">{shipping === 0 ? "Free" : `${shipping.toFixed(2)} EGP`}</span>
              </div>
              <div className="summary-row">
                <span className="label">VAT (14%)</span>
                <span className="value">{vat.toFixed(2)} EGP</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span className="label">Discount</span>
                  <span className="value">-{discount.toFixed(2)} EGP</span>
                </div>
              )}

              <hr className="summary-divider" />

              <div className="summary-row total">
                <span className="label">Total</span>
                <span className="value">{Math.round(total).toFixed(2)} EGP</span>
              </div>

              <div className="coupon-section">
                <div className="coupon-input-group">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="apply-coupon-btn" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>
                {couponError && <p className="coupon-msg error">❌ {couponError}</p>}
                {couponSuccess && <p className="coupon-msg success">✅ {couponSuccess}</p>}
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout →
              </button>

              {freeShippingRemaining > 0 && cartItems.length > 0 && (
                <div className="free-shipping-notice">
                  <span>🚚</span>
                  <span>Add {freeShippingRemaining.toFixed(2)} EGP for free shipping</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
