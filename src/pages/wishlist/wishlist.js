import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Wishlist = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "DEMO_USER_ID_123";
  const token = localStorage.getItem("token");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Universal image handler
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";

    // If array, take first
    if (Array.isArray(img)) img = img[0];

    // If CSV string, take first
    if (typeof img === "string" && img.includes(",")) {
      img = img.split(",")[0].trim();
    }

    // Fix missing slash
    if (typeof img === "string" && !img.startsWith("http") && !img.startsWith("/")) {
      img = "/" + img;
    }

    // Full URL
    if (typeof img === "string" && img.startsWith("http")) return img;
    return `${API_BASE}${img}`;
  };

  // ✅ Fetch wishlist from backend
  useEffect(() => {                                                                                                                   
    const fetchWishlist = async () => {
      if (userId.startsWith("DEMO") || !token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/wishlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch wishlist`);

        const data = await res.json();
        setWishlistItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, token]);

  // ✅ Remove item
  const removeFromWishlist = async (productId) => {
    if (userId.startsWith("DEMO") || !token)
      return alert("Please log in to manage your wishlist.");

    try {
      const res = await fetch(`${API_BASE}/wishlist/${userId}/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to remove item");

      // Refresh
      const updatedRes = await fetch(`${API_BASE}/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setWishlistItems(Array.isArray(updatedData) ? updatedData : []);
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert(err.message || "Failed to remove item from wishlist.");
    }
  };

  // ✅ Move to bag (add to cart)
  const moveToBag = async (item) => {
    if (userId.startsWith("DEMO") || !token)
      return navigate(`/product/${item._id}`);

    try {
      const res = await fetch(`${API_BASE}/cart/${userId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: item._id, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add to bag");
      navigate(`/product/${item._id}`);
    } catch (err) {
      console.error("Failed to move to bag:", err);
      navigate(`/product/${item._id}`);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <Header userId={userId} />

      <div className="container my-5">
        <h3 className="mb-4 fw-bold montserrat-font">
          My Wishlist - {wishlistItems ? wishlistItems.length : 0} Items
        </h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Loading wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center my-5">
            <p>Your wishlist is empty.</p>
          </div>
        ) : (
          <Row xs={2} sm={2} md={3} lg={4} className="g-4">
            {wishlistItems.map((item) => (
              <Col key={item._id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Card className="shadow border-0 h-100 rounded-4">
                    <Card.Img
                      variant="top"
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300x300?text=No+Image")
                      }
                      style={{
                        // height: "200px",
                        width: "100%",
                        objectFit: "contain",
                        // padding: "10px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleProductClick(item._id)}
                    />

                    <Card.Body onClick={() => handleProductClick(item._id)}>
                      <Card.Title className="fs-6 wishlist-title montserrat-font">
                        {item.name}
                      </Card.Title>
                      <Card.Text className="text-muted wishlist-weight figtree-font">
                        {item.weight || "Wt. —"}
                      </Card.Text>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-dark wishlist-price figtree-font">
                          ₹{item.price}
                        </span>
                      </div>
                    </Card.Body>

                    <Card.Footer className="bg-white border-0 d-flex flex-column gap-2">
                      <Button
                        className="w-100 rounded-pill wishlist-movetobag"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#312625",
                        }}
                        onClick={() => moveToBag(item)}
                      >
                        Move To Bag
                      </Button>

                      <Button
                        className="w-100 rounded-pill wishlist-remove"
                        style={{
                          background: "#312526",
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        Remove
                      </Button>
                    </Card.Footer>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;

