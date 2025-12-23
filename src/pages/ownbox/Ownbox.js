import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Spinner,
} from "react-bootstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE_URL = "http://localhost:8000/api"; // ✅ corrected API base URL

const Ownbox = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collectionData, setCollectionData] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionId) {
      setError("No category selected.");
      setLoading(false);
      return;
    }

    const fetchBoxSizes = async () => {
      try {
        const url = `${API_BASE_URL}/collections/${collectionId}/boxes`;
        const res = await axios.get(url);

        setCollectionData(res.data.category);

        // Map availableSizes to objects with size and image
        const sizesWithImages = (res.data.availableSizes || []).map((size) => {
          const box = res.data.boxes?.find((b) => b.size === size);
          return {
            size,
            image: box?.image || "/images/product-grid.png",
          };
        });

        setAvailableSizes(sizesWithImages);
        setError(null);
      } catch (err) {
        console.error("Error fetching box sizes:", err);
        setError("Could not fetch box sizes for this category.");
        setAvailableSizes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxSizes();
  }, [collectionId]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="secondary" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
        <NavLink to="/">Go Home</NavLink>
      </Container>
    );

  return (
    <div>
      <Header />
      <Container className="py-5">
        <Breadcrumb className="mb-4">
          <li className="breadcrumb-item box-title">
            <NavLink to="/" className="text-decoration-none">
              HOME
            </NavLink>
          </li>
          <li className="breadcrumb-item box-title">
            <NavLink
              to={`/ownbox/${collectionId}`}
              className="text-decoration-none"
            >
              {collectionData?.name?.toUpperCase()}
            </NavLink>
          </li>
          <li className="breadcrumb-item active box-header">
            CHOOSE BOX SIZE
          </li>
        </Breadcrumb>

        <h2 className="fw-bold text-center mb-2 box-main-header">
          CHOOSE YOUR CUSTOM CHOCOLATE BOX SIZE
        </h2>

        <Row className="g-4 justify-content-center">
          {availableSizes.map((item) => (
            <Col xs={12} sm={6} md={3} key={item.size}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border box-card text-center p-4">
                  <Card.Img
                    variant="top"
                    src={item.image || "/images/product-grid.png"}
                    alt={`${item.size} Pc Box`}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold own-box-title fs-1">
                      {item.size}
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">Chocolates</Card.Text>
                    <Button
                      onClick={() =>
                        navigate(`/box-styles/${collectionId}/${item.size}`)
                      }
                      className="w-100 fw-semibold py-2 select-item-btn"
                      style={{
                        backgroundColor: "#7B4B3A",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    >
                      Select {item.size} Pc. Box
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Ownbox;
