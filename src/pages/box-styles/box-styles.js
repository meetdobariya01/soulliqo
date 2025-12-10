import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Heart } from "react-bootstrap-icons";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE = "http://localhost:5000/api/store";

const BoxStyles = () => {
  const { collectionId, size } = useParams();
  const navigate = useNavigate();

  const [boxes, setBoxes] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_BASE}/collections/${collectionId}/boxes?size=${size}`
        );

        setBoxes(response.data.boxes || []);
        setCategory(response.data.category || null);
        setError(null);
      } catch (err) {
        console.error("Box load error:", err);
        setError("Unable to load boxes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, [collectionId, size]);

  const resolveImage = (img) => {
    if (!img) return "https://via.placeholder.com/300";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <Container className="py-5 text-center">
          <Spinner animation="border" />
        </Container>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <Container className="py-5 text-center">
          <p className="text-danger">{error}</p>
          <NavLink to="/sweetindulgence">⬅ Back</NavLink>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="text-center mb-4 text-uppercase">
          {category?.name || "Collection"} - {size} Pc Boxes
        </h2>

        {boxes.length === 0 ? (
          <p className="text-center text-muted">No boxes available</p>
        ) : (
          <Row className="g-4">
            {boxes.map((box) => (
              <Col key={box._id} xs={6} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm position-relative">
                  <div className="position-absolute top-0 end-0 p-2">
                    <Heart role="button" />
                  </div>

                  <Card.Img
                    variant="top"
                    src={resolveImage(box.image)}
                    style={{ height: "200px", objectFit: "contain" }}
                  />

                  <Card.Body className="text-center">
                    <Card.Title>{box.name}</Card.Title>
                    <p className="small text-muted">{box.description}</p>
                    <p className="fw-bold">₹{box.price}</p>


                    <Button
                      variant="dark"
                      className="w-100"
                      onClick={() =>
                        navigate(`/boxproduct/${box.category}/${box._id}`, {
                          state: {
                            categoryId: box.category,
                            box: box,
                            category: category
                          }
                        })
                      }
                    >
                      Build This Box
                    </Button>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default BoxStyles;