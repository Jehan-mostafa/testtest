import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import type { MaterialOrder } from "../../types/material";
import "../OrderSuccess/OrderSuccess.css";
import "./MaterialsOrderSuccess.css";

export const MATERIAL_ORDER_SESSION_KEY = "lastMaterialOrder";

function formatDate(dateStr: string) {
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

const MaterialsOrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateOrder = (location.state as { order?: MaterialOrder } | null)?.order;

  const order: MaterialOrder | null =
    stateOrder ??
    (() => {
      try {
        const stored = sessionStorage.getItem(MATERIAL_ORDER_SESSION_KEY);
        return stored ? (JSON.parse(stored) as MaterialOrder) : null;
      } catch {
        return null;
      }
    })();

  useEffect(() => {
    if (!order) navigate("/", { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="order-success-page materials-success-page">
      <Navbar />

      <div className="order-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully</h1>
          <p className="success-subtitle">Your materials order has been received.</p>

          <div className="order-details">
            <div className="detail-row">
              <span className="detail-label">Order ID</span>
              <span className="detail-value order-id">{order.orderNumber || order.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Customer Name</span>
              <span className="detail-value">{order.customerName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address</span>
              <span className="detail-value">{order.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value payment-badge">Cash on Delivery</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value total-amount">{order.totalAmount.toFixed(2)} EGP</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order Date</span>
              <span className="detail-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className={`detail-value status-badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="materials-ordered-list">
            <h4>Ordered Materials</h4>
            {order.items.map((item, i) => (
              <div key={i} className="material-ordered-item">
                <span>{item.name} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
              </div>
            ))}
          </div>

          <div className="success-actions">
            <Link to="/" className="btn-home">Go To Home</Link>
            <Link to="/materials" className="btn-shop materials-shop-btn">Shop Again</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsOrderSuccess;
