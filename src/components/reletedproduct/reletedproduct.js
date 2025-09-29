import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    img: "./images/chocolate-block-product.png",
    name: "Precious Bond Rakhi Hamper",
    weight: "Wt. 100gm",
    price: 345,
    oldPrice: 499,
  },
  {
    id: 2,
    img: "./images/chocolate-block-product.png",
    name: "Precious Bond Rakhi Hamper",
    weight: "Wt. 100gm",
    price: 345,
    oldPrice: 499,
  },
  {
    id: 3,
    img: "./images/chocolate-block-product.png",
    name: "Precious Bond Rakhi Hamper",
    weight: "Wt. 100gm",
    price: 345,
    oldPrice: 499,
  },
  {
    id: 4,
    img: "./images/chocolate-block-product.png",
    name: "Precious Bond Rakhi Hamper",
    weight: "Wt. 100gm",
    price: 345,
    oldPrice: 499,
  },
];

const Reletedproduct = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/product/${id}`); // redirect to product detail page
  };

  return (
    <div>
      <section className="py-5">
        <Container>
          <h5 className="mb-4 mt-5 releted-title">Related Product</h5>
          <Row>
            {products.map((product, index) => (
              <Col
                key={index}
                md={3} // 4 per row on desktop
                sm={6} // 2 per row on tablets
                xs={6} // 2 per row on mobile also
                className="mb-4 animate__animated animate__zoomIn"
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(product.id)}
              >
                <Card className="h-100 shadow-sm border-0 product-card">
                  <Card.Img
                    variant="top"
                    src={product.img}
                    alt={product.name}
                    className="product-img"
                  />
                  <Card.Body>
                    <Card.Title className="fs-6 text-truncate product-details">
                      {product.name}
                    </Card.Title>
                    <Card.Text className="mb-1 product-details">{product.weight}</Card.Text>
                    <Card.Text>
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{product.oldPrice}
                      </span>
                      <span className="fw-bold">₹{product.price}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Reletedproduct;
