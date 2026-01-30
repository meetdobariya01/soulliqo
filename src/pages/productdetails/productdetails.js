import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Carousel,
  Tab,
  Nav,
} from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import Cookies from "js-cookie";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Heart, HeartFill } from "react-bootstrap-icons";
import Reletedproduct from "../../components/reletedproduct/reletedproduct";
import "../../index.css";

const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const Api = process.env.REACT_APP_API_URL || "https://api.soulliqo.com"; // backend base URL
  const ADMIN_API_BASE = "https://admin.soulliqo.com";

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");

  const token = localStorage.getItem("token");

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // Fetch product + reviews (BACKEND from first code)
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${Api}/products/${id}`);
        const data = await safeJson(res);
        setProduct(data);

        const reviewsRes = await fetch(`${Api}/products/${id}/reviews`);
        const reviewsData = await safeJson(reviewsRes);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAuthError = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    alert("Your session has expired. Please login again.");
    navigate("/login");
  };
  const handleWishlist = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Please login to use wishlist");
      navigate("/login");
      return;
    }

    try {
      const url = wishlist
        ? `${Api}/wishlist/${userId}/remove/${product._id}`
        : `${Api}/wishlist/${userId}/add/${product._id}`;

      const res = await fetch(url, {
        method: wishlist ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Wishlist error");
        return;
      }

      setWishlist(!wishlist);
    } catch (err) {
      alert("Wishlist failed");
    }
  };

  // Images handling (same logic as Cart page)
const images = (() => {
  const imageField = product?.image || product?.images || "";
  if (!imageField) return [];

  const rawImages = Array.isArray(imageField)
    ? imageField.flatMap((img) =>
        typeof img === "string" ? img.split(",") : img
      )
    : imageField.split(",");

  return rawImages
    .filter(Boolean)
    .map((img) => {
      const path = img.trim().startsWith("/") ? img.trim() : "/" + img.trim();

      // If uploaded via admin panel
      if (path.startsWith("/uploads")) return `${ADMIN_API_BASE}${path}`;

      // If already full URL
      if (path.startsWith("http")) return path;

      // Fallback: API base path
      return `${path}`;
    });
})();
  // Add to cart (guest + logged-in backend)
  const handleAddToCart = async () => {
    setLoadingCart(true);
    try {
      // Guest cart
      if (!token) {
        let guestCart = Cookies.get("guestCart");
        guestCart = guestCart ? JSON.parse(guestCart) : { items: [] };

        const existingIndex = guestCart.items.findIndex(
          (item) => item.productId === product._id
        );

        if (existingIndex > -1) {
          guestCart.items[existingIndex].quantity += qty;
        } else {
          guestCart.items.push({
            productId: product._id,
            quantity: qty,
            price: product.price,
            type: "product",
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: images[0],
              weight: product.weight,
            },
          });
        }

        Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 7 });
        alert(`✅ Added ${qty} ${product.name} to cart`);
        navigate("/cart");
        return;
      }

      // Logged-in cart
      const res = await fetch(`${Api}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });

      if (res.status === 401) return handleAuthError();
      const data = await safeJson(res);
      if (!res.ok) return alert(data.message || "Failed to add to cart");

      alert(`✅ Added ${qty} ${product.name} to cart`);
      navigate("/cart");
    } catch (err) {
      alert("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleCheckPincode = () => {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (pincodePattern.test(pincode)) {
      setPincodeMessage("✅ Delivery available to your pincode.");
    } else {
      setPincodeMessage("❌ Please enter a valid 6-digit Indian pincode.");
    }
  };

  // Submit review (backend from first code)
  const handleSubmitReview = async () => {
    if (!rating || !reviewText)
      return alert("Please provide rating and review text.");
    if (!token) return alert("Please login to submit a review.");

    try {
      const res = await fetch(`${Api}/products/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, text: reviewText }),
      });

      const data = await safeJson(res);
      setReviews(data.ratings || data);
      setRating(0);
      setReviewText("");
      alert("✅ Review submitted!");
    } catch {
      alert("Error submitting review");
    }
  };

  if (!product) return <div className="text-center py-5">Loading...</div>;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div>
      <Header />
      <Container className="py-5">
        <Row>
          {/* Thumbnails */}
          <Col md={1} className="d-none d-md-block">
            {images.map((img, index) => (
              <div
                key={index}
                className={`mb-2 p-1 border ${carouselIndex === index ? "border-dark" : "border-light"
                  }`}
                style={{ cursor: "pointer", height: "80px", overflow: "hidden" }}
                onClick={() => setCarouselIndex(index)}
              >
                <img
                  src={img}
                  alt="thumb"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </Col>

          {/* Main image */}
          <Col md={5}>
            <Carousel
              activeIndex={carouselIndex}
              onSelect={setCarouselIndex}
              interval={null}
              indicators={false}
            >
              {images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={img}
                    alt="product"
                    className="d-block w-100 rounded shadow-sm mb-4"
                    style={{ aspectRatio: "1/1", objectFit: "cover" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          {/* Product info UI (from second code) */}
          <Col md={6}>
            <h2 className="fw-bold montserrat-font fs-3">{product.name}</h2>
            <p className="text-muted figtree-font">Wt. {product.weight}</p>

            <div className="mb-3 d-flex align-items-center">
              {[...Array(5)].map((_, i) => (
                <StarFill
                  key={i}
                  className="me-1 fs-2"
                  style={{
                    color: i < Math.round(averageRating) ? "#FFD700" : "#ccc",
                  }}
                />
              ))}
              <span className="ms-2 small">({reviews.length} reviews)</span>
            </div>

            <h3 className="figtree-font fw-bold my-4" style={{ color: "#7B4B3A" }}>
              ₹{product.price}
            </h3>
            <div
              onClick={handleWishlist}
              style={{ cursor: "pointer" }}
              className="mb-3 figtree-font"
            >
              {wishlist ? <HeartFill color="red" /> : <Heart />} Add to Wish List
            </div>

            <p className="mt-3 figtree-font fs-4">Enter Pincode</p>
            <Form className="pincode-form">
              <Form.Control
                type="text"
                placeholder="000000"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="pincode-input"
              />
              <Button
                variant="link"
                className="pincode-btn"
                onClick={handleCheckPincode}
              >
                CHECK
              </Button>
            </Form>
            {pincodeMessage && (
              <small className="d-block mb-3">{pincodeMessage}</small>
            )}

            <div className="d-flex align-items-center mt-4">
              <div className="border d-flex align-items-center me-3 bg-light figtree-font">
                <Button
                  variant="white"
                  onClick={() => qty > 1 && setQty(qty - 1)}
                >
                  −
                </Button>
                <span className="px-3 fw-bold">{qty}</span>
                <Button variant="white" onClick={() => setQty(qty + 1)}>
                  +
                </Button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={loadingCart}
                className="px-5 py-2 border-0 fw-bold montserrat-font"
                style={{ backgroundColor: "#312526" }}
              >
                {loadingCart ? "ADDING..." : "ADD TO CART"}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Tabs */}
        <section className="py-5 mt-4">
          <div className="border py-4 px-3 rounded shadow-sm">
            <Tab.Container defaultActiveKey="details">
              <Nav
                variant="tabs"
                className="custom-tabs border-bottom montserrat-font bg-color p-2"
              >
                <Nav.Item>
                  <Nav.Link eventKey="details" className="text-dark fw-bold">
                    Product Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews" className="text-dark fw-bold">
                    Reviews
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="py-4 figtree-font">
                <Tab.Pane eventKey="details">
                  <p>
                    {product.description ||
                      "No description available for this product."}
                  </p>
                </Tab.Pane>

                <Tab.Pane eventKey="reviews">
                  <div className="mb-4 figtree-font">
                    <h6>Rate this product:</h6>
                    <div className="mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarFill
                          key={star}
                          size={24}
                          className="me-1"
                          style={{
                            cursor: "pointer",
                            color:
                              (hoverRating || rating) >= star
                                ? "#FFD700"
                                : "#ccc",
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review..."
                      className="mb-2 figtree-font"
                    />
                    <Button
                      onClick={handleSubmitReview}
                      style={{ backgroundColor: "#312526", border: "none" }}
                    >
                      Submit Review
                    </Button>
                  </div>

                  <hr />

                  {reviews.map((rev, idx) => (
                    <div key={idx} className="mb-3 p-3 border rounded bg-light">
                      <div className="mb-1">
                        {[...Array(5)].map((_, i) => (
                          <StarFill
                            key={i}
                            size={14}
                            style={{
                              color: i < rev.rating ? "#FFD700" : "#ccc",
                            }}
                          />
                        ))}
                      </div>
                      <p className="mb-0 small">
                        {rev.text || rev.review}
                      </p>
                    </div>
                  ))}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </section>

        <Reletedproduct
          category={product.category}
          currentProductId={product._id}
        />
      </Container>
      <Footer />
    </div>
  );
};

export default Productdetails;
