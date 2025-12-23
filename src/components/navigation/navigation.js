import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // us

const Navigation = () => {
  return (
    <div>
        <Navbar expand="lg" bg="light" className="border-bottom shadow-sm">
      <Container className="justify-content-center">
        <Nav className="gap-4">
          <Nav.Item>
            <Nav.Link as={Link} to="/orders" className="fw-bold active">
              Orders
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/addresses">
              Addresses
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/logout">
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
    </div>
  )
}

export default Navigation;
