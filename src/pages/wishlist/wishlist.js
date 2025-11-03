import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Wishlist = () => {
    const navigate = useNavigate();
    // ✅ FIX: Replace placeholder with a more meaningful variable that expects a real ID
    // or retrieve it from local storage/auth state, defaulting to a placeholder for local dev.
    const userId = localStorage.getItem("userId") || "DEMO_USER_ID_123"; 
    const token = localStorage.getItem("token");
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch wishlist from backend
    useEffect(() => {
        const fetchWishlist = async () => {
            if (userId.startsWith("DEMO") || !token) {
                setLoading(false);
                return; // Skip fetch if no valid user ID or token
            }
            try {
                // ✅ FIX: Include token for authorization
                const res = await fetch(`http://localhost:5000/wishlist/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch wishlist, status: ${res.status}`);
                }
                
                const data = await res.json();
                
                // The backend now returns an array of products, not an object with a 'wishlist' key.
                // We'll trust the backend's new response structure (array of products).
                const products = Array.isArray(data) ? data : []; 
                setWishlistItems(products);

            } catch (err) {
                console.error("Failed to fetch wishlist:", err);
                setWishlistItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [userId, token]); // Added token dependency

    // Remove item from wishlist
    const removeFromWishlist = async (productId) => {
        if (userId.startsWith("DEMO") || !token) return alert("Please log in to manage your wishlist.");
        try {
            // ✅ FIX: Include token for authorization
            const res = await fetch(
                `http://localhost:5000/wishlist/${userId}/remove/${productId}`,
                { 
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to remove item, status: ${res.status}`);
            }

            // After successful removal, re-fetch the list or manually update state (re-fetch is safer)
            const updatedRes = await fetch(`http://localhost:5000/wishlist/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedData = await updatedRes.json();
            setWishlistItems(Array.isArray(updatedData) ? updatedData : []);

        } catch (err) {
            console.error("Failed to remove item:", err);
            alert(err.message || "Failed to remove item from wishlist.");
        }
    };

    const handleProductClick = (id) => {
        navigate(`/productdetails/${id}`);
    };

    return (
        <div>
            {/* Note: Header component needs to handle 'userId' prop or use context/global state for user info */}
            <Header userId={userId} /> 

            <div className="container my-5">
                <h3 className="mb-4 fw-bold">
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
                                            // FIX: The original code had a missing image (404). 
                                            // Use a robust check for the image source.
                                            src={item.image || (Array.isArray(item.images) ? item.images[0] : "./images/placeholder.png")}
                                            className="p-3 rounded-4"
                                            style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                                            onClick={() => handleProductClick(item._id)}
                                        />
                                        <Card.Body onClick={() => handleProductClick(item._id)}>
                                            <Card.Title className="fs-6 wishlist-title">{item.name}</Card.Title>
                                            <Card.Text className="text-muted wishlist-weight">
                                                {item.weight || "Wt. —"}
                                            </Card.Text>
                                            <div className="d-flex align-items-center gap-2">
                                                {item.oldPrice && (
                                                    <span className="text-decoration-line-through text-muted wishlist-oldprice">
                                                        ₹{item.oldPrice}
                                                    </span>
                                                )}
                                                <span className="fw-bold text-dark wishlist-price">₹{item.price}</span>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer className="bg-white border-0 d-flex flex-column gap-2">
                                            <Button
                                                className="w-100 rounded-pill wishlist-movetobag"
                                                style={{ background: "none", border: "none", color: "#7B5B54" }}
                                            >
                                                Move To Bag
                                            </Button>
                                            <Button
                                                className="w-100 rounded-pill wishlist-remove"
                                                style={{ background: "#ff6b6b", border: "none", color: "#fff" }}
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