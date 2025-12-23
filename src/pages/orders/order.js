import React, { useState } from "react";
import "./order.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Order = () => {
  const [screen, setScreen] = useState("orders"); // orders | allOrders | review | track | addresses | savedAddress | addAddress | editAddress | logout

  return (
    <div>
      {/* Page Header */}
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

        {/* ------------------- SCREENS ------------------- */}

        {/* SCREEN 1 – EMPTY ORDERS */}
        {screen === "orders" && (
          <div className="empty-screen">
            <h1 className="title">
              Orders <span className="circle">0</span>
            </h1>
            <p>You have not placed any orders yet.</p>

            <img src="/images/box.png" alt="" className="box-img" />

            <button
              className="black-btn"
              onClick={() => setScreen("allOrders")}
            >
              START SHOPPING
            </button>
          </div>
        )}

        {/* SCREEN 2 – ALL ORDERS LIST */}
        {screen === "allOrders" && (
          <div className="orders-list">
            <h2 className="heading">All orders</h2>

            <div className="search-filter">
              <input
                type="text"
                placeholder="Search"
                className="form-control search-box"
              />
              <button className="filter-btn">FILTERS</button>
            </div>

            {/* CARD 1 */}
            <div className="order-card">
              <div className="order-status in-transit">In Transit</div>
              <p className="arrival">Arriving by Tue, 29 Jul</p>

              <div className="order-row">
                <img src="/images/item.png" className="item-img" alt="" />

                <div>
                  <h5 className="item-title">Truffle - Box of 04</h5>
                  <p>Men Spread Collar Solid Cotton Casual Shirt</p>
                  <p>Wt: 100gm</p>
                  <p>Qty: 2</p>
                </div>
              </div>

              <div className="btn-row">
                <button className="white-btn">Cancel</button>
                <button
                  className="white-btn"
                  onClick={() => setScreen("track")}
                >
                  Track
                </button>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="order-card">
              <div className="order-status delivered">Delivered</div>
              <p className="arrival">On Sat, 31 May</p>

              <div className="order-row">
                <img src="/images/item.png" className="item-img" alt="" />

                <div>
                  <h5 className="item-title">Truffle - Box of 06</h5>
                  <p>Men Spread Collar Solid Cotton Casual Shirt</p>
                  <p>Wt: 100gm</p>
                  <p>Qty: 2</p>
                </div>
              </div>

              <div className="review-row">
                ⭐⭐⭐⭐☆
                <span
                  className="review-link"
                  onClick={() => setScreen("review")}
                >
                  Write a Review
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3 – WRITE REVIEW */}
        {screen === "review" && (
          <div className="popup-screen">
            <h3 className="popup-title">WRITE REVIEW</h3>

            <div className="review-box">
              <textarea
                className="form-control textarea"
                placeholder="Please write product review here."
              ></textarea>

              <div className="upload-box">
                <button className="upload-btn">Add Photos</button>
              </div>

              <button
                className="black-btn"
                onClick={() => setScreen("allOrders")}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4 – TRACK ORDER */}
        {screen === "track" && (
          <div className="track-screen">
            <h3>Track Item</h3>
            <p>Tracking no: MYSC1190819092</p>

            <ul className="timeline">
              <li>04:37 a.m – Expected at Ahmedabad</li>
              <li>04:10 a.m – Received at Delhi</li>
              <li>01:32 a.m – Received at New Delhi Hub</li>
              <li>01:19 a.m – Item shipped</li>
              <li>Order Placed on Thu, 24 Jul</li>
            </ul>

            <button
              className="black-btn"
              onClick={() => setScreen("allOrders")}
            >
              Back
            </button>
          </div>
        )}

        {/* SCREEN 5 – EMPTY ADDRESS */}
        {screen === "addresses" && (
          <div className="empty-screen">
            <h1 className="title">
              Addresses <span className="circle">0</span>
            </h1>
            <p>You have not saved any addresses yet.</p>

            <button
              className="black-btn"
              onClick={() => setScreen("savedAddress")}
            >
              Add A New Address
            </button>
          </div>
        )}

        {/* SCREEN 6 – SAVED ADDRESSES */}
        {screen === "savedAddress" && (
          <div className="saved-address">
            <h2>Saved Address</h2>

            <button
              className="filter-btn"
              onClick={() => setScreen("addAddress")}
            >
              + ADD NEW ADDRESS
            </button>

            <div className="address-box">
              <h4>Itisha Agarwal</h4>
              <p>Ahmedabad</p>

              <div className="btn-row">
                <button
                  className="white-btn"
                  onClick={() => setScreen("editAddress")}
                >
                  EDIT
                </button>
                <button
                  className="white-btn red"
                  onClick={() => setScreen("deleteAddress")}
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 7 – DELETE CONFIRMATION */}
        {screen === "deleteAddress" && (
          <div className="popup-screen">
            <h3 className="popup-title">Delete Confirmation</h3>
            <p>Are you sure you want to delete this address?</p>

            <div className="btn-row">
              <button
                className="white-btn"
                onClick={() => setScreen("savedAddress")}
              >
                Cancel
              </button>
              <button
                className="white-btn red"
                onClick={() => setScreen("addresses")}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 8 – EDIT / ADD ADDRESS */}
        {(screen === "editAddress" || screen === "addAddress") && (
          <div className="popup-screen">
            <h3 className="popup-title">EDIT ADDRESS</h3>

            <input className="form-control mb-2" placeholder="Name" />
            <input className="form-control mb-2" placeholder="Mobile" />
            <input className="form-control mb-2" placeholder="Address" />
            <input
              className="form-control mb-2"
              placeholder="Apartment, suite"
            />
            <input className="form-control mb-2" placeholder="Pincode" />
            <input className="form-control mb-2" placeholder="State" />
            <input className="form-control mb-2" placeholder="City" />

            <button
              className="black-btn"
              onClick={() => setScreen("savedAddress")}
            >
              Save
            </button>
          </div>
        )}

        {/* SCREEN 9 – LOGOUT CONFIRMATION */}
        {screen === "logout" && (
          <div className="popup-screen">
            <h3 className="popup-title">Logout</h3>
            <p>Are you sure you want to Logout ?</p>

            <div className="btn-row">
              <button className="white-btn" onClick={() => setScreen("orders")}>
                Cancel
              </button>
              <button className="white-btn red">Logout</button>
            </div>
          </div>
        )}
      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  );
};

export default Order;
