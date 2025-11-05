import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner,Button } from "react-bootstrap";
import { Heart } from "react-bootstrap-icons";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE_URL = "http://localhost:5000/api/store";

const BoxStyles = () => {
  const { collectionId, size } = useParams();
  const navigate = useNavigate();
  const [boxes, setBoxes] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoxes = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE_URL}/collections/${collectionId}/boxes?size=${size}`;
        const res = await axios.get(url);
        setCategory(res.data.category);
        setBoxes(res.data.boxes || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch boxes for this size.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoxes();
  }, [collectionId, size]);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading boxes...</p>
      </div>
    );

  if (error)
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
        <NavLink to="/">Go Home</NavLink>
      </Container>
    );

  if (!boxes.length)
    return (
      <Container className="py-5 text-center">
        <p>No boxes found for {size} pcs in {category?.name}</p>
        <NavLink to="/sweetindulgence">Back to Categories</NavLink>
      </Container>
    );

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="text-center mb-4 text-uppercase">
          {category?.name || "Boxes"} - {size} Pc.
        </h2>
        <Row className="g-4">
          {boxes.map((box) => (
            <Col key={box._id} xs={6} sm={6} md={4} lg={3}>
              <Card className="h-100 position-relative">
                <div className="wishlist-icon position-absolute top-0 end-0 p-2">
                  <Heart />
                </div>
                <Card.Img variant="top" src={box.image || "./images/product-grid.png"} />
                <Card.Body className="text-center">
                  <Card.Title>{box.name}</Card.Title>
                  <p>{box.description || "—"}</p>
                  <p className="fw-bold">₹{box.price}</p>
                <Button
  onClick={() => navigate(`/boxproduct/${category?.id}/${box._id}`)}
                  className="btn btn-dark w-100 mt-2"
                >
                  Build This Box
                </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default BoxStyles;

