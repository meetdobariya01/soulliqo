import React, { useState, useEffect } from "react";
import "./order.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Order = () => {
  const [screen, setScreen] = useState("orders"); // orders | allOrders | track | addresses | logout
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // for tracking

  // Fetch orders on component mount
useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // 🔐 Logged-in user orders
        const res = await axios.get(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } else {
        // 👤 Guest orders (email from localStorage or prompt)
        const guestEmail = localStorage.getItem("guestEmail");

        if (!guestEmail) return;

        const res = await axios.post(`${API_BASE}/orders/guest`, {
          email: guestEmail,
        });

        setOrders(res.data || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  const handleCancel = async (order) => {
    const token = localStorage.getItem("token");
    const createdAt = new Date(order.createdAt);
    const hoursSinceOrder = (new Date() - createdAt) / 1000 / 60 / 60;

    if (hoursSinceOrder > 24) {
      alert("Cannot cancel order after 24 hours");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await axios.post(
        `${API_BASE}/orders/cancel/${order._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      // Update order status locally
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? {
              ...o,
              status: "Cancelled",
              trackingHistory: [
                ...o.trackingHistory,
                { status: "Cancelled", message: "Order cancelled by user", date: new Date() },
              ],
            }
            : o
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };
  // ✅ Image resolver (same logic as Checkout)
  const getSingleImage = (item) => {
    const target = item.product || item.box || item;
    const imageField = target?.image || target?.images || "";

    if (!imageField) return "/images/item.png";

    let rawPaths = [];
    if (Array.isArray(imageField)) {
      rawPaths = imageField.flatMap(img =>
        typeof img === "string" ? img.split(",") : img
      );
    } else if (typeof imageField === "string") {
      rawPaths = imageField.split(",");
    }

    const firstPath = rawPaths.map(p => p.trim()).filter(Boolean)[0];
    if (!firstPath) return "/images/item.png";

    return firstPath.startsWith("http")
      ? firstPath
      : `${firstPath.startsWith("/") ? "" : "/"}${firstPath}`;
  };

  return (
    <div>
      <Header />

      <div className="dashboard-container">
        {/* ---------------- NAVBAR ---------------- */}
        <div className="dashboard-nav">
          <span
            className={screen === "orders" ? "active" : ""}
            onClick={() => setScreen("orders")}
          >
            Orders
          </span>
          <span
            className={screen === "addresses" ? "active" : ""}
            onClick={() => setScreen("addresses")}
          >
            Addresses
          </span>
          <span
            className={screen === "logout" ? "active" : ""}
            onClick={() => setScreen("logout")}
          >
            Logout
          </span>
        </div>

        {/* ORDERS SCREEN */}
        {screen === "orders" && (
          <div className="empty-screen">
            <h1 className="title">
              Orders <span className="circle">{orders.length}</span>
            </h1>
            {loading ? (
              <p>Loading...</p>
            ) : orders.length === 0 ? (
              <>
                <p>You have not placed any orders yet.</p>
                <img src="/images/box.png" alt="" className="box-img" />
              </>
            ) : (
              <button className="black-btn" onClick={() => setScreen("allOrders")}>
                VIEW ORDERS
              </button>
            )}
          </div>
        )}

        {/* ALL ORDERS */}
        {screen === "allOrders" && (
          <div className="orders-list">
            <h2 className="heading">All Orders</h2>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order) => {
                const isDeliveredOrCancelled =
                  order.status === "Delivered" || order.status === "Cancelled";
                const createdAt = new Date(order.createdAt);
                const hoursSinceOrder = (new Date() - createdAt) / 1000 / 60 / 60;

                const canCancel = !isDeliveredOrCancelled && hoursSinceOrder <= 24;

                return (
                  <div key={order._id} className="order-card">
                    <div
                      className={`order-status ${order.status === "Delivered"
                          ? "delivered"
                          : order.status === "Cancelled"
                            ? "cancelled"
                            : "in-transit"
                        }`}
                    >
                      {order.status}
                    </div>
                    <p className="arrival">
                      Ordered on {new Date(order.createdAt).toDateString()}
                    </p>

                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-row">
                        <img
                          src={getSingleImage(item)}
                          className="item-img"
                          alt={item.name || "Item"}
                        />

                        <div>
                          <h5 className="item-title">{item.name}</h5>
                          <p>Qty: {item.quantity}</p>
                          <p>Price: ₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {/* Buttons */}
                    {(canCancel || !isDeliveredOrCancelled) && (
                      <div className="btn-row">
                        {canCancel && (
                          <button className="white-btn" onClick={() => handleCancel(order)}>
                            Cancel
                          </button>
                        )}
                        <button
                          className="white-btn"
                          onClick={() => {
                            setSelectedOrder(order);
                            setScreen("track");
                          }}
                        >
                          Track
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TRACK SCREEN */}
        {screen === "track" && selectedOrder && (
          <div className="track-screen">
            <h3>Track Order</h3>
            {selectedOrder.trackingHistory.length === 0 ? (
              <p>No tracking history yet.</p>
            ) : (
              <ul>
                {selectedOrder.trackingHistory.map((t, idx) => (
                  <li key={idx}>
                    <strong>{t.status}</strong> -{" "}
                    {new Date(t.date).toLocaleString()}{" "}
                    {t.message && `: ${t.message}`}
                  </li>
                ))}
              </ul>
            )}
            <button className="black-btn" onClick={() => setScreen("allOrders")}>
              Back
            </button>
          </div>
        )}

        {/* ADDRESSES */}
        {screen === "addresses" && (
          <div className="empty-screen">
            <h1 className="title">Addresses</h1>
            <p>You have not saved any addresses yet.</p>
          </div>
        )}

        {/* LOGOUT */}
        {screen === "logout" && (
          <div className="popup-screen">
            <h3 className="popup-title">Logout</h3>
            <p>Are you sure you want to Logout?</p>
            <div className="btn-row">
              <button className="white-btn" onClick={() => setScreen("orders")}>
                Cancel
              </button>
              <button className="white-btn red">Logout</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Order;
