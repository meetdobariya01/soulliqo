import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

const BoxCategories = () => {
  const { collectionId, size } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/classifications/${collectionId}/sizes/${size}/categories`
      )
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, [collectionId, size]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Choose Box Category</h2>
      <Row className="g-4 justify-content-center">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Col xs={12} sm={6} md={3} key={category}>
              <Card className="text-center p-4">
                <Card.Body>
                  <Card.Title>{category}</Card.Title>
                  <Button
                    as={NavLink}
                    to={`/box-styles/${collectionId}/${size}/${category}`}
                  >
                    Select
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No categories available for this size.</p>
        )}
      </Row>
    </Container>
  );
};
export default BoxCategories;