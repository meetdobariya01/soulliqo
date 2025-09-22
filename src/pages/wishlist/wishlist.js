import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Wishlist = () => {
  const navigate = useNavigate();

  const wishlistItems = [
    {
      id: 1,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
    {
      id: 2,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
    {
      id: 3,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
    {
      id: 4,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
    {
      id: 5,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
    {
      id: 6,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
    {
      id: 7,
      title: "Precious Bond Rakhi Hamper",
      weight: "Wt. 120gm",
      oldPrice: 499,
      price: 345,
      img: "./images/wishlist.png",
    },
  ];

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // go to product detail page
  };

  return (
    <div>
      {/*Header Component */}
      <Header />

      {/* Wishlist Section */}
      <div className="container my-5">
        <h3 className="mb-4 fw-bold">
          My Wishlist - {wishlistItems.length} Items
        </h3>
        <Row xs={2} sm={2} md={3} lg={4} className="g-4">
          {wishlistItems.map((item) => (
            <Col key={item.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Card
                  className="shadow border-0 h-100 rounded-4"
                  onClick={() => handleProductClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={item.img}
                    className="p-3 rounded-4"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fs-6 wishlist-title">{item.title}</Card.Title>
                    <Card.Text className="text-muted wishlist-weight">{item.weight}</Card.Text>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-decoration-line-through text-muted wishlist-oldprice">
                        ₹{item.oldPrice}
                      </span>
                      <span className="fw-bold text-dark wishlist-price">₹{item.price}</span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button
                      className="w-100 rounded-pill wishlist-movetobag"
                      style={{
                        background:
                          "none",
                        border: "none",
                        color: "#7B5B54",
                      }}
                    >
                      Move To Bag
                    </Button>
                  </Card.Footer>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Wishlist;
