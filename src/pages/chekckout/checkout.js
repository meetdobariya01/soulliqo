import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const cartItems = [
  {
    id: 1,
    name: "Sea Salt Caramel",
    qty: 9,
    price: 1099,
    discountPrice: 179,
    discount: "6% OFF",
    img: "./images/wishlist.png",
  },
  {
    id: 2,
    name: "Hazelnut Truffle",
    qty: 5,
    price: 2399,
    discountPrice: 179,
    discount: "67% OFF",
    img: "./images/wishlist.png",
  },
  {
    id: 3,
    name: "Mango Habanero Chili",
    qty: 1,
    price: 2399,
    discountPrice: 179,
    discount: "67% OFF",
    img: "./images/wishlist.png",
  },
  {
    id: 4,
    name: "Hazelnut Latte",
    qty: 1,
    price: 2399,
    discountPrice: 179,
    discount: "67% OFF",
    img: "./images/wishlist.png",
  },
];

const Checkout = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      <Container fluid className="py-4 px-3 container">
        <h5 className="checkout-title mb-4">CHECKOUT</h5>
        <Row>
          {/* LEFT SIDE */}
          <Col md={7} className="mb-4 checkout-main-font">
            {/* Contact */}
            <h6 className=" mb-3 checkout-form">Contact</h6>
            <Form.Control
              type="email"
              placeholder="Email"
              className="mb-4 rounded-0"
            />

            {/* Delivery */}
            <h6 className="checkout-form mb-3">Delivery</h6>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Select className="rounded-0">
                  <option>Country/Region</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="First Name" />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="Last Name" />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Control type="text" placeholder="Address" />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Control type="text" placeholder="Apartment, suite, etc" />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="City" />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="text" placeholder="State" />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="text" placeholder="Pincode" />
              </Col>
            </Row>
            <Form.Check
              type="checkbox"
              label="Save this information for next time"
              className="mb-4"
            />

            {/* Payment */}
            <h6 className="checkout-form mb-3">Payment</h6>
            <p className="text-muted small">
              All transaction are secure and encrypted.
            </p>
            <Card className="mb-4">
              <Card.Body>
                <img
                  src="./images/payment.jpg"
                  alt="payment options"
                  className="img-fluid mb-2"
                />
                <p className="small mb-0">
                  After clicking "Pay now", you will be redirected to Razorpay
                  Secure (UPI, Cards, Wallets, NetBanking) to complete your
                  purchase securely.
                </p>
              </Card.Body>
            </Card>

            {/* Billing Address */}
            <h6 className="checkout-form mb-3">Billing address</h6>
            <Form.Check
              type="radio"
              name="billing"
              label="Same as shipping address"
              defaultChecked
            />
            <Form.Check
              type="radio"
              name="billing"
              label="Use a different billing address"
            />

            {/* Place Order */}
            <div className="mt-4">
              <Button
                style={{
                  backgroundColor: "#7B4B3A",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px 40px",
                }}
              >
                PLACE ORDER
              </Button>
            </div>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={5}>
            {/* Offers */}
            <Card className="mb-3">
              <Card.Body>
                <h6 className="fw-semibold small mb-2">Available Offers</h6>
                <p className="small mb-0">
                  10% Instant Discount on RBL Bank Credit Card and Credit Card
                  EMI on a min spend of ₹3,500. TCA
                </p>
              </Card.Body>
            </Card>

            {/* Cart Summary */}
            <h6 className="fw-semibold mb-3">BOX OF 16</h6>
            {cartItems.map((item) => (
              <Card className="mb-2 rounded-0" key={item.id}>
                <Card.Body className="d-flex align-items-center">
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 small fw-semibold">{item.name}</p>
                    <p className="mb-1 small text-muted">
                      Includes {item.qty} quantities of Truffle
                    </p>
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold me-2">
                        ₹{item.discountPrice}
                      </span>
                      <small className="text-muted text-decoration-line-through me-2">
                        ₹{item.price}
                      </small>
                      <small className="text-danger">{item.discount}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}

            {/* Gift Code */}
            <div className="d-flex my-3">
              <Form.Control
                type="text"
                placeholder="Gift Voucher Code"
                className="rounded-0 me-2"
              />
              <Button
                style={{ backgroundColor: "#7B4B3A", border: "none" }}
                className="rounded-0"
              >
                Apply
              </Button>
            </div>

            {/* Price Details */}
            <h6 className="fw-semibold mb-3">PRICE DETAILS (16 Items)</h6>
            <div className="d-flex justify-content-between small mb-1">
              <span>Total MRP</span>
              <span>₹3,898</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Discount on MRP</span>
              <span className="text-success">- ₹1,698</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Coupon Discount</span>
              <span className="text-danger">Apply Coupon</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Platform Fee</span>
              <span>₹20</span>
            </div>
            <div className="d-flex justify-content-between small mb-3">
              <span>Shipping Fee</span>
              <span className="text-success">FREE</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-semibold">
              <span>Total Amount</span>
              <span>₹2,220</span>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Checkout;
