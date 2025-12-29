import React, { useEffect, useState } from "react";
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
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { StarFill, Heart, HeartFill } from "react-bootstrap-icons";
import Cookies from "js-cookie";

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Reletedproduct from "../../components/reletedproduct/reletedproduct";
import "../../index.css";

const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const Api = "https://api.soulliqo.com";

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  const [wishlist, setWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // Fetch product + reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${Api}/products/${id}`);
        const data = await safeJson(res);
        setProduct(data);

        const reviewsRes = await fetch(`${Api}/products/${id}/reviews`);
        const reviewsData = await safeJson(reviewsRes);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  // Images (SAFE)
  const images = (() => {
    if (!product?.image) return [];

    if (Array.isArray(product.image)) {
      return product.image
        .flatMap((img) => img.split(","))
        .map((img) => img.trim())
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${Api}${img}`));
    }

    return product.image
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean)
      .map((img) => (img.startsWith("http") ? img : `${Api}${img}`));
  })();

  // Add to Cart
  const handleAddToCart = async () => {
    setLoadingCart(true);

    try {
      if (!token) {
        let guestCart = Cookies.get("guestCart");
        guestCart = guestCart ? JSON.parse(guestCart) : { items: [] };

        const index = guestCart.items.findIndex(
          (i) => i.productId === product._id
        );

        if (index > -1) {
          guestCart.items[index].quantity += qty;
        } else {
          guestCart.items.push({
            productId: product._id,
            quantity: qty,
            price: product.price,
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: images[0],
            },
          });
        }

        Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 7 });
        navigate("/cart");
        return;
      }

      await fetch(`${Api}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });

      navigate("/cart");
    } catch {
      alert("Failed to add to cart");
    }

    setLoadingCart(false);
  };

  // Wishlist
  const handleWishlist = async () => {
    if (!token) return alert("Please login first");
    setLoadingWishlist(true);

    try {
      setWishlist(!wishlist);
    } catch {
      alert("Wishlist error");
    }

    setLoadingWishlist(false);
  };

  const handleCheckPincode = () => {
    const regex = /^[1-9][0-9]{5}$/;
    setPincodeMessage(
      regex.test(pincode)
        ? "✅ Delivery available"
        : "❌ Invalid pincode"
    );
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <Header />

      <Container className="py-5">
        <Row>
          <Col md={5}>
            <Carousel activeIndex={carouselIndex} onSelect={setCarouselIndex}>
              {images.map((img, i) => (
                <Carousel.Item key={i}>
                  <img src={img} className="w-100" alt="product" />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          <Col md={7}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            <div
              onClick={handleWishlist}
              style={{ cursor: "pointer" }}
              className="mb-3"
            >
              {wishlist ? <HeartFill color="red" /> : <Heart />} Wishlist
            </div>

            <Form className="d-flex mb-3">
              <Form.Control
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                style={{ maxWidth: "150px" }}
              />
              <Button variant="link" onClick={handleCheckPincode}>
                CHECK
              </Button>
            </Form>
            <small>{pincodeMessage}</small>

            <div className="mt-4">
              <Button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</Button>
              <span className="mx-3">{qty}</span>
              <Button onClick={() => setQty(qty + 1)}>+</Button>

              <Button
                className="ms-3"
                onClick={handleAddToCart}
                disabled={loadingCart}
                style={{ background: "#7B4B3A", border: "none" }}
              >
                {loadingCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </Col>
        </Row>

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
