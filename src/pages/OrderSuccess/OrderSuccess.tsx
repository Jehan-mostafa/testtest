import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import type { Order } from "../../types/order";
import type { MaterialOrder } from "../../types/material";
import "./OrderSuccess.css";

const ORDER_SESSION_KEY = "lastOrder";

interface CombinedOrderSuccess {
  productOrder?: Order | null;
  materialOrder?: MaterialOrder | null;
  customerName?: string;
  address?: string;
  paymentMethod?: string;
  total?: number;
  createdAt?: string;
  status?: string;
  orderId?: string;
  id?: string;
  shippingAddress?: Order["shippingAddress"];
}

function formatPaymentMethod(method: string): string {
  if (method === "cash_on_delivery") return "Cash on Delivery";
  return method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatAddress(data: CombinedOrderSuccess): string {
  if (data.address) return data.address;
  if (data.productOrder?.shippingAddress) {
    const a = data.productOrder.shippingAddress;
    return [a.street, a.city, a.country].filter(Boolean).join(", ");
  }
  return "";
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as CombinedOrderSuccess | { order?: Order } | null;

  const data: CombinedOrderSuccess | null = (() => {
    if (stateData && ("productOrder" in stateData || "materialOrder" in stateData)) {
      return stateData as CombinedOrderSuccess;
    }
    if (stateData && "order" in stateData && stateData.order) {
      return { productOrder: stateData.order };
    }
    try {
      const stored = sessionStorage.getItem(ORDER_SESSION_KEY);
      return stored ? (JSON.parse(stored) as CombinedOrderSuccess) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!data || (!data.productOrder && !data.materialOrder && !data.orderId && !data.id)) {
      navigate("/", { replace: true });
    }
  }, [data, navigate]);

  if (!data) return null;

  const productOrder = data.productOrder;
  const materialOrder = data.materialOrder;
  const customerName =
    data.customerName ||
    productOrder?.customerName ||
    productOrder?.shippingAddress?.fullName ||
    materialOrder?.customerName ||
    "";
  const total =
    data.total ??
    (productOrder?.total || 0) + (materialOrder?.totalAmount || 0);
  const createdAt =
    data.createdAt || productOrder?.createdAt || materialOrder?.createdAt || new Date().toISOString();
  const status = data.status || productOrder?.status || materialOrder?.status || "pending";
  const paymentMethod =
    data.paymentMethod || productOrder?.paymentMethod || materialOrder?.paymentMethod || "cash_on_delivery";

  return (
    <div className="order-success-page">
      <Navbar />

      <div className="order-success-container">
        <div className="success-card">
          <div className="success-icon" aria-hidden="true">✓</div>

          <h1>Your order has been placed successfully.</h1>
          <p className="success-subtitle">
            Thank you for shopping with us. We&apos;ll contact you shortly to confirm delivery.
          </p>

          <div className="order-details">
            {productOrder && (
              <div className="detail-row">
                <span className="detail-label">Products Order ID</span>
                <span className="detail-value order-id">
                  {productOrder.orderId || productOrder.id}
                </span>
              </div>
            )}
            {materialOrder && (
              <div className="detail-row">
                <span className="detail-label">Materials Order ID</span>
                <span className="detail-value order-id">
                  {materialOrder.orderNumber || materialOrder.id}
                </span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">Customer Name</span>
              <span className="detail-value">{customerName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Shipping Address</span>
              <span className="detail-value">{formatAddress(data)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value payment-badge">
                {formatPaymentMethod(paymentMethod)}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value total-amount">{total.toFixed(2)} EGP</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Order Date</span>
              <span className="detail-value">{formatDate(createdAt)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Order Status</span>
              <span className={`detail-value status-badge status-${status.toLowerCase()}`}>
                {formatStatus(status)}
              </span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/" className="btn-home">Go to Home</Link>
            <Link to="/products" className="btn-shop">Shop Again</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ORDER_SESSION_KEY };
export default OrderSuccess;
