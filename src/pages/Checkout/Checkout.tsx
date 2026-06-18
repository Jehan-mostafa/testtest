import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useCart } from "../../Context/CartContext";
import { createOrderApi } from "../../api/order.api";
import { createMaterialOrderApi } from "../../api/materialOrder.api";
import { getProfileApi } from "../../api/profile.api";
import { buildOrderItems } from "../../types/order";
import { ORDER_SESSION_KEY } from "../OrderSuccess/OrderSuccess";
import "./Checkout.css";

type PaymentMethod = "cash_on_delivery";

interface CheckoutLocationState {
  discount?: number;
  couponCode?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = (location.state as CheckoutLocationState) ?? {};

  const { cartItems, productItems, materialItems, cartTotal, clearCart, isLoading: cartLoading } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const profileLoadedRef = useRef(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const orderPlacedRef = useRef(false);
  const initialCartCheckedRef = useRef(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    addressLine1: "",
    state: "",
    zipCode: "",
    country: "Egypt",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (profileLoadedRef.current) return;
    profileLoadedRef.current = true;

    getProfileApi()
      .then((profile) => {
        setShippingInfo((prev) => ({
          ...prev,
          fullName:
            prev.fullName ||
            [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            profile.name ||
            "",
          phoneNumber: prev.phoneNumber || profile.phone || "",
        }));
      })
      .catch(() => {
        // Profile pre-fill is optional
      });
  }, []);

  useEffect(() => {
    if (cartLoading || initialCartCheckedRef.current || orderPlacedRef.current) return;
    initialCartCheckedRef.current = true;
    if (cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartLoading, cartItems.length, navigate]);

  const discount = checkoutState.discount ?? 0;
  const couponCode = checkoutState.couponCode;

  const subtotal = cartTotal;
  const shipping = subtotal > 1000 ? 0 : 45;
  const vat = (subtotal + shipping) * 0.14;
  const total = subtotal + shipping + vat - discount;

  const validate = () => {
    const err: Record<string, string> = {};

    if (!shippingInfo.fullName.trim()) err.fullName = "Full name is required";
    if (!shippingInfo.phoneNumber.trim()) err.phoneNumber = "Phone number is required";
    if (!shippingInfo.city.trim()) err.city = "City is required";
    if (!shippingInfo.addressLine1.trim()) err.addressLine1 = "Address is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (submittingRef.current || submitting) return;
    if (!validate()) return;

    submittingRef.current = true;
    setSubmitting(true);
    setOrderError(null);

    try {
      const address = [
        shippingInfo.addressLine1.trim(),
        shippingInfo.city.trim(),
        shippingInfo.country.trim() || "Egypt",
      ]
        .filter(Boolean)
        .join(", ");

      const shippingAddress = {
        fullName: shippingInfo.fullName.trim(),
        phone: shippingInfo.phoneNumber.trim(),
        city: shippingInfo.city.trim(),
        street: shippingInfo.addressLine1.trim(),
        state: shippingInfo.state.trim() || shippingInfo.city.trim(),
        zipCode: shippingInfo.zipCode.trim() || "00000",
        country: shippingInfo.country.trim() || "Egypt",
      };

      let productOrder = null;
      let materialOrder = null;

      if (productItems.length > 0) {
        const payload = {
          paymentMethod,
          shippingAddress,
          items: buildOrderItems(productItems),
          subtotal,
          shipping,
          vat,
          total,
          ...(couponCode ? { couponCode } : {}),
        };
        productOrder = await createOrderApi(payload);
      }

      if (materialItems.length > 0) {
        materialOrder = await createMaterialOrderApi({
          customerName: shippingInfo.fullName.trim(),
          email: "",
          phone: shippingInfo.phoneNumber.trim(),
          address,
          paymentMethod,
          items: materialItems.map((item) => ({
            materialId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        });
      }

      orderPlacedRef.current = true;

      const successData = {
        productOrder: productOrder
          ? {
              ...productOrder,
              orderId: productOrder.orderId || productOrder.id,
              customerName: productOrder.customerName || shippingAddress.fullName,
            }
          : null,
        materialOrder: materialOrder
          ? {
              ...materialOrder,
              orderNumber: materialOrder.orderNumber || materialOrder.id,
            }
          : null,
        customerName: shippingInfo.fullName.trim(),
        address,
        paymentMethod,
        total,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      sessionStorage.setItem(ORDER_SESSION_KEY, JSON.stringify(successData));
      navigate("/order-success", { state: successData, replace: true });
      clearCart().catch(() => {});
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to place order. Please try again.";
      if (message.toLowerCase().includes("401") || message.toLowerCase().includes("unauthorized")) {
        navigate("/login");
      } else {
        setOrderError(message);
      }
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const updateField = (field: keyof typeof shippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (cartLoading) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-loading">
          <div className="checkout-spinner" />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        <div className="checkout-form">
          <button
            type="button"
            className="back-to-cart-btn"
            onClick={() => navigate("/cart")}
          >
            ← Back to Cart
          </button>

          <h2>Customer &amp; Shipping</h2>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              placeholder="Full Name"
              value={shippingInfo.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              disabled={submitting}
            />
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              placeholder="Phone Number"
              value={shippingInfo.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              disabled={submitting}
            />
            {errors.phoneNumber && <p className="field-error">{errors.phoneNumber}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={(e) => updateField("city", e.target.value)}
              disabled={submitting}
            />
            {errors.city && <p className="field-error">{errors.city}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="addressLine1">Shipping Address</label>
            <input
              id="addressLine1"
              placeholder="Street address, building, apartment"
              value={shippingInfo.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              disabled={submitting}
            />
            {errors.addressLine1 && <p className="field-error">{errors.addressLine1}</p>}
          </div>

          <h2 className="section-title">Payment Method</h2>

          <label className={`payment-option ${paymentMethod === "cash_on_delivery" ? "selected" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={paymentMethod === "cash_on_delivery"}
              onChange={() => setPaymentMethod("cash_on_delivery")}
              disabled={submitting}
            />
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
              <div key={item.lineKey} className="summary-item">
                <div className="summary-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span>{item.itemType === "material" ? "🧵" : "🏺"}</span>
                  )}
                </div>
                <div className="summary-item-details">
                  <p className="summary-item-name">
                    <small>{item.itemType === "material" ? "Material" : "Product"} · </small>
                    {item.name}
                  </p>
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
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `${shipping.toFixed(2)} EGP`}</span>
            </div>
            <div className="summary-row">
              <span>VAT (14%)</span>
              <span>{vat.toFixed(2)} EGP</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-{discount.toFixed(2)} EGP</span>
              </div>
            )}
          </div>

          <div className="summary-grand-total">
            <span>Grand Total</span>
            <span>{Math.round(total).toFixed(2)} EGP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
