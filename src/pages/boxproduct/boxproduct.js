import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Nav,
  Tab
} from "react-bootstrap";
import { Heart } from "react-bootstrap-icons";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/store";

const BoxProduct = () => {
  const { boxId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/boxes/${boxId}`);
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        setProduct(data);

        const images = Array.isArray(data.image)
          ? data.image
          : data.image?.split(",") || [];

        if (images.length > 0) {
          setMainImage(resolveImage(images[0]));
        }
      } catch (error) {
        console.error("Product load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [boxId]);

  const resolveImage = (img) => {
    if (!img) return "https://via.placeholder.com/500";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`;
  };

  // ✅ ADD TO CART FUNCTION
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add item to cart");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `/cart/add`,
        {
          productId: product._id,
          quantity: qty,
          type: "box"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Redirect to Cart page
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center">
          <Spinner animation="border" />
        </Container>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center">
          <h5>Product not found</h5>
        </Container>
        <Footer />
      </>
    );
  }

  const images = Array.isArray(product.image)
    ? product.image
    : product.image?.split(",") || [];

  return (
    <>
      <Header />

      <Container className="py-5" style={{ fontFamily: "Poppins, sans-serif" }}>
        <Row>
          {/* LEFT IMAGE AREA */}
          <Col md={6} className="d-flex">
            <div className="me-3 d-flex flex-column">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={resolveImage(img)}
                  alt="thumb"
                  onClick={() => setMainImage(resolveImage(img))}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    marginBottom: 10,
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>

            <div className="flex-grow-1">
              <img
                src={mainImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "contain",
                  background: "#f5f5f5"
                }}
              />
            </div>
          </Col>

          {/* RIGHT INFO AREA */}
          <Col md={6}>
            <h2 className="fw-semibold">{product.name}</h2>
            <p className="text-muted">{product.weight || "100gm"}</p>

            <h4 className="mb-3">
              ₹{product.price}{" "}
              {product.oldPrice && (
                <small className="text-decoration-line-through text-muted ms-2">
                  ₹{product.oldPrice}
                </small>
              )}
            </h4>

            <div className="d-flex align-items-center gap-2 mb-3">
              <Heart /> <span>Add to Wish List</span>
            </div>

            {/* Pincode */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: 200 }}
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <Button variant="link" className="fw-semibold">
                CHECK
              </Button>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="d-flex align-items-center gap-3 mt-3">
              <div className="d-flex border">
                <Button
                  variant="light"
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                >
                  -
                </Button>

                <div className="px-4 d-flex align-items-center">
                  {qty}
                </div>

                <Button variant="light" onClick={() => setQty(qty + 1)}>
                  +
                </Button>
              </div>

              <Button className="px-4" variant="dark" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>

        {/* TABS SECTION */}
        <Tab.Container defaultActiveKey="details">
          <Nav variant="tabs" className="mt-5">
            <Nav.Item>
              <Nav.Link eventKey="details">Product Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviews">Reviews</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="border p-4 bg-white">
            <Tab.Pane eventKey="details">
              <p>{product.description || "No description available."}</p>
            </Tab.Pane>

            <Tab.Pane eventKey="reviews">
              <p>No reviews yet.</p>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>

      <Footer />
    </>
  );
};

export default BoxProduct;
