import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useMaterialCart } from "../../Context/MaterialCartContext";
import "../ShoppingCart/ShoppingCart.css";
import "./MaterialsCart.css";

const MaterialsCart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useMaterialCart();

  const subtotal = cartTotal;
  const shipping = subtotal > 1000 ? 0 : 45;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;
    navigate("/materials/checkout");
  };

  return (
    <div className="cart-page materials-cart-page">
      <Navbar />

      <div className="cart-container">
        <button className="continue-shopping-btn" onClick={() => navigate("/materials")}>
          ← Continue Shopping
        </button>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-header">
              <h2>Materials Cart <span>{cartItems.length}</span></h2>
              {cartItems.length > 0 && (
                <button className="clear-cart-btn" onClick={clearCart}>🗑️ Clear Cart</button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">🧵</span>
                <h3>Your Materials Cart is Empty</h3>
                <p>Browse our craft materials and add items to your cart.</p>
                <button className="shop-now-btn" onClick={() => navigate("/materials")}>
                  Shop Materials
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image || ""} alt={item.name} onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }} />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-artist">{item.category}</p>
                      <p className="cart-item-price">{item.price} EGP</p>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
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
              <hr className="summary-divider" />
              <div className="summary-row total">
                <span className="label">Total Price</span>
                <span className="value">{total.toFixed(2)} EGP</span>
              </div>
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed To Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsCart;
