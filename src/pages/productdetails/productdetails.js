import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Carousel, Tab, Nav } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import Cookies from "js-cookie";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Reletedproduct from "../../components/reletedproduct/reletedproduct";
import "../../index.css";

const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const Api = "https://api.soulliqo.com"; // Change to your API

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
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
    try { return await res.json(); } catch { return {}; }
  };

  // Fetch product & reviews
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${Api}/products/${id}`);
        const data = await safeJson(res);
        setProduct(data);

        const reviewsRes = await fetch(`${Api}/products/${id}/reviews`);
        const reviewsData = await safeJson(reviewsRes);
        setReviews(reviewsData);
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

  // Images array
  const images = (() => {
    if (!product?.image) return [];
    let rawImages = Array.isArray(product.image) ? product.image.flatMap(img => typeof img === 'string' ? img.split(",") : img) : product.image.split(",");
    return rawImages.filter(Boolean).map(img => img.startsWith("http") ? img : `${Api}${img.startsWith("/") ? "" : "/"}${img}`);
  })();

  // Add to cart (guest via Cookies or logged-in)
  const handleAddToCart = async () => {
    setLoadingCart(true);
    try {
      if (!token) {
        let guestCart = Cookies.get("guestCart");
        guestCart = guestCart ? JSON.parse(guestCart) : { items: [] };
        const existingIndex = guestCart.items.findIndex(item => item.productId === product._id);
        if (existingIndex > -1) guestCart.items[existingIndex].quantity += qty;
        else guestCart.items.push({
          productId: product._id,
          quantity: qty,
          price: product.price,
          type: "product",
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: images[0],
            weight: product.weight
          }
        });
        Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 7 });
        alert(`✅ Added ${qty} ${product.name} ${product.price} to Guest Cart`);
        navigate("/cart");
        return;
      }

      // Logged-in
      const res = await fetch(`${Api}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });
      if (res.status === 401) return handleAuthError();
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to add to cart.");
      alert(`✅ Added ${qty} ${product.name} to cart`);
      navigate("/cart");
    } catch {
      alert("Error adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleCheckPincode = () => {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (pincodePattern.test(pincode)) setPincodeMessage("✅ Delivery available to your pincode.");
    else setPincodeMessage("❌ Please enter a valid 6-digit Indian pincode.");
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText) return alert("Please provide rating and review text.");
    if (!token) return alert("Please login to submit a review.");
    try {
      const res = await fetch(`${Api}/products/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <Header />
      <Container className="py-5">
        <Row>
          <Col md={1} className="d-none d-md-block">
            {images.map((img, index) => (
              <div key={index} className={`mb-2 p-1 border ${carouselIndex === index ? "border-dark" : "border-light"}`} style={{ cursor: "pointer", height: "80px", overflow: "hidden" }} onClick={() => setCarouselIndex(index)}>
                <img className="w-100 h-100" style={{ objectFit: "cover" }} src={img} alt="thumb" />
              </div>
            ))}
          </Col>

          <Col md={5}>
            <Carousel activeIndex={carouselIndex} onSelect={setCarouselIndex} interval={null} indicators={false}>
              {images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100 rounded shadow-sm" style={{ aspectRatio: "1/1", objectFit: "cover" }} src={img} alt="product" />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          <Col md={6}>
            <h2 className="fw-bold">{product.name}</h2>
            <p className="text-muted">{product.weight}</p>
            <h3 style={{ color: "#7B4B3A" }}>₹{product.price} <del className="text-muted fs-6">₹{product.oldPrice || "590.00"}</del></h3>

            <div className="mb-3 d-flex align-items-center">
              {[...Array(5)].map((_, i) => (
                <StarFill key={i} className="me-1" style={{ color: i < Math.round(averageRating) ? "#FFD700" : "#ccc" }} />
              ))}
              <span className="ms-2 small">({reviews.length} reviews)</span>
            </div>

            <Form className="d-flex mb-3 align-items-center">
              <Form.Control type="text" placeholder="Enter pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} style={{ maxWidth: "200px" }} />
              <Button variant="link" onClick={handleCheckPincode} className="text-dark fw-bold text-decoration-none">CHECK</Button>
            </Form>
            {pincodeMessage && <small className="d-block mb-3">{pincodeMessage}</small>}

            <div className="d-flex align-items-center mt-4">
              <div className="border d-flex align-items-center me-3 bg-light">
                <Button variant="white" onClick={() => qty > 1 && setQty(qty - 1)}>−</Button>
                <span className="px-3 fw-bold">{qty}</span>
                <Button variant="white" onClick={() => setQty(qty + 1)}>+</Button>
              </div>
              <Button onClick={handleAddToCart} disabled={loadingCart} className="px-5 py-2 border-0 fw-bold" style={{ backgroundColor: "#7B4B3A" }}>
                {loadingCart ? "ADDING..." : "ADD TO CART"}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Reviews Tab */}
        <section className="py-5 mt-4">
          <Tab.Container defaultActiveKey="details">
            <Nav variant="tabs" className="custom-tabs border-bottom">
              <Nav.Item><Nav.Link eventKey="details" className="text-dark fw-bold">Product Details</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="reviews" className="text-dark fw-bold">Reviews</Nav.Link></Nav.Item>
            </Nav>
            <Tab.Content className="py-4">
              <Tab.Pane eventKey="details">
                <p>{product.description || "No description available for this product."}</p>
              </Tab.Pane>
              <Tab.Pane eventKey="reviews">
                <div className="mb-4">
                  <h6>Rate this product:</h6>
                  <div className="mb-2">
                    {[1,2,3,4,5].map(star => (
                      <StarFill key={star} size={24} className="me-1"
                        style={{ cursor: "pointer", color: (hoverRating || rating) >= star ? "#FFD700" : "#ccc" }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Form.Control as="textarea" rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your review..." className="mb-2"/>
                  <Button onClick={handleSubmitReview} style={{backgroundColor: "#7B4B3A", border: "none"}}>Submit Review</Button>
                </div>
                <hr />
                {reviews.map((rev, idx) => (
                  <div key={idx} className="mb-3 p-3 border rounded bg-light">
                    <div className="mb-1">
                      {[...Array(5)].map((_, i) => (
                        <StarFill key={i} size={14} style={{ color: i < rev.rating ? "#FFD700" : "#ccc" }} />
                      ))}
                    </div>
                    <p className="mb-0 small">{rev.text || rev.review}</p>
                  </div>
                ))}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>

        <Reletedproduct category={product.category} currentProductId={product._id} />
      </Container>
      <Footer />
    </div>
  );
};

export default Productdetails;
