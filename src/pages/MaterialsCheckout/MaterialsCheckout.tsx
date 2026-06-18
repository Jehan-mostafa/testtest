import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useMaterialCart } from "../../Context/MaterialCartContext";
import { createMaterialOrderApi } from "../../api/materialOrder.api";
import { getProfileApi } from "../../api/profile.api";
import { MATERIAL_ORDER_SESSION_KEY } from "../MaterialsOrderSuccess/MaterialsOrderSuccess";
import "../Checkout/Checkout.css";
import "./MaterialsCheckout.css";

const MaterialsCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useMaterialCart();

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const orderPlacedRef = useRef(false);
  const initialCheckedRef = useRef(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    getProfileApi()
      .then((profile) => {
        setCustomerInfo((prev) => ({
          ...prev,
          fullName:
            prev.fullName ||
            [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            profile.name ||
            "",
          email: prev.email || profile.email || "",
          phone: prev.phone || profile.phone || "",
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialCheckedRef.current || orderPlacedRef.current) return;
    initialCheckedRef.current = true;
    if (cartItems.length === 0) navigate("/materials/cart", { replace: true });
  }, [cartItems.length, navigate]);

  const subtotal = cartTotal;
  const shipping = subtotal > 1000 ? 0 : 45;
  const total = subtotal + shipping;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!customerInfo.fullName.trim()) err.fullName = "Required";
    if (!customerInfo.phone.trim()) err.phone = "Required";
    if (!customerInfo.address.trim()) err.address = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (submittingRef.current || submitting || !validate()) return;

    submittingRef.current = true;
    setSubmitting(true);
    setOrderError(null);

    try {
      const order = await createMaterialOrderApi({
        customerName: customerInfo.fullName.trim(),
        email: customerInfo.email.trim(),
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
        paymentMethod: "cash_on_delivery",
        items: cartItems.map((item) => ({
          materialId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      });

      orderPlacedRef.current = true;

      const successOrder = {
        ...order,
        orderNumber: order.orderNumber || order.id,
        totalAmount: order.totalAmount || total,
        items: order.items.length > 0
          ? order.items
          : cartItems.map((item) => ({
              materialId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
      };

      sessionStorage.setItem(MATERIAL_ORDER_SESSION_KEY, JSON.stringify(successOrder));
      navigate("/materials/order-success", { state: { order: successOrder }, replace: true });
      clearCart();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      if (message.toLowerCase().includes("401")) {
        navigate("/login");
      } else {
        setOrderError(message);
      }
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const updateField = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="checkout-page materials-checkout-page">
      <Navbar />

      <div className="checkout-container">
        <div className="checkout-form">
          <button type="button" className="back-to-cart-btn" onClick={() => navigate("/materials/cart")}>
            ← Back to Cart
          </button>

          <h2>Customer Information</h2>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              value={customerInfo.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              disabled={submitting}
            />
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => updateField("email", e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              disabled={submitting}
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          <h2 className="section-title">Shipping Address</h2>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              placeholder="Street, city, building..."
              value={customerInfo.address}
              onChange={(e) => updateField("address", e.target.value)}
              disabled={submitting}
            />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>

          <h2 className="section-title">Payment Method</h2>

          <label className="payment-option selected">
            <input type="radio" checked readOnly />
            <span className="payment-option-content">
              <span className="payment-icon">💵</span>
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
            </span>
          </label>

          {orderError && (
            <div className="order-error-banner" role="alert">
              <span>❌</span>
              <span>{orderError}</span>
            </div>
          )}

          <button
            type="button"
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={submitting || cartItems.length === 0}
          >
            {submitting ? (
              <>
                <span className="btn-spinner" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>

        <div className="summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-image">
                  <img src={item.image || ""} alt={item.name} />
                </div>
                <div className="summary-item-details">
                  <p className="summary-item-name">{item.name}</p>
                  <p className="summary-item-meta">
                    {item.price.toFixed(2)} EGP × {item.quantity}
                  </p>
                </div>
                <p className="summary-item-subtotal">
                  {(item.price * item.quantity).toFixed(2)} EGP
                </p>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span><span>{subtotal.toFixed(2)} EGP</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `${shipping.toFixed(2)} EGP`}</span>
            </div>
          </div>
          <div className="summary-grand-total">
            <span>Grand Total</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsCheckout;
