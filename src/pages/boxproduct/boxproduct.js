import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ProgressBar,
  Breadcrumb,
  Spinner,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { NavLink, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Boxproduct = () => {
  const params = useParams();
  const location = useLocation();

  const rawCategoryId = params.categoryId;
  const rawBoxId = params.boxId;

  const fallbackCategoryId =
    location?.state?.categoryId ||
    location?.state?.category?.id ||
    location?.state?.category?._id ||
    location?.state?.box?.category?.id ||
    location?.state?.box?.category?._id ||
    null;

  const categoryId =
    rawCategoryId && rawCategoryId !== "undefined"
      ? rawCategoryId
      : fallbackCategoryId;

  const boxId =
    rawBoxId && rawBoxId !== "undefined"
      ? rawBoxId
      : location?.state?.box?._id || rawBoxId;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [box, setBox] = useState({});
  const [boxLimit, setBoxLimit] = useState(16);
  const [typeLimits, setTypeLimits] = useState({});
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveImage = (img) => {
    if (!img) return "./images/product-grid.png";
    if (/^(https?:)?\/\//i.test(img) || /^data:/i.test(img)) return img;
    const base =
      process.env.REACT_APP_API_URL || "http://localhost:5000";
    if (img.startsWith("/")) return `${base}${img}`;
    return `${base}/${img}`;
  };

  useEffect(() => {
    const fetchChocolates = async () => {
      if (!categoryId || !boxId) {
        setError(
          "Missing categoryId or boxId. Please navigate from the category/box selection page."
        );
        setProducts([]);
        setBox({});
        setBoxLimit(16);
        setTypeLimits({});
        setLoading(false);
        setCart({});
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const base =
          process.env.REACT_APP_API_URL || "http://localhost:5000";
        const url = `${base}/api/store/chocolates/${categoryId}/${boxId}`;
        const res = await axios.get(url);

        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);

        if (data.length > 0) {
          const fetchedBox = data[0].box || {};
          setBox(fetchedBox);
          setBoxLimit(fetchedBox.totalLimit || fetchedBox.size || 16);

          const normalizedTypeLimits = Object.fromEntries(
            Object.entries(
              fetchedBox.typeLimits || {}
            ).map(([k, v]) => [k.toLowerCase(), v])
          );

          setTypeLimits(normalizedTypeLimits);
        } else {
          setBox({});
          setBoxLimit(16);
          setTypeLimits({});
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching chocolates:", err);
        const serverMessage = err?.response?.data?.message;
        setError(
          serverMessage ||
            "Unable to load products. Please try again later."
        );
        setProducts([]);
        setBox({});
        setBoxLimit(16);
        setTypeLimits({});
      } finally {
        setLoading(false);
        setCart({});
      }
    };

    fetchChocolates();
  }, [categoryId, boxId]);

  const typeCounts = products.reduce((acc, p) => {
    const id = p._id;
    const qty = cart[id] || 0;
    const type = (p.chocolateType || p.type || "").toLowerCase();
    if (!type) return acc;
    acc[type] = (acc[type] || 0) + qty;
    return acc;
  }, {});

  const chocolateTypes = [
    "all",
    ...new Set(
      products
        .map((p) =>
          (p.chocolateType || p.type || "").toLowerCase()
        )
        .filter(Boolean)
    ),
  ];

  const updateQuantity = (id, change) => {
    setCart((prev) => {
      const product = products.find((p) => p._id === id);
      if (!product) return prev;

      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + change);

      const prevTotal = Object.values(prev).reduce(
        (a, b) => a + b,
        0
      );
      const delta = Math.max(0, newQty - currentQty);
      const newTotal = prevTotal + delta;

      if (change > 0 && newTotal > boxLimit) {
        alert(
          `Total limit reached: you can only select up to ${boxLimit} chocolates.`
        );
        return prev;
      }

      const type = (
        product.chocolateType || product.type || ""
      ).toLowerCase();

      if (change > 0 && type && typeLimits[type] !== undefined) {
        const prevTypeCount =
          products.reduce((acc, p) => {
            const pid = p._id;
            const ptype = (
              p.chocolateType || p.type || ""
            ).toLowerCase();

            if (!ptype) return acc;
            acc[ptype] =
              (acc[ptype] || 0) + (prev[pid] || 0);
            return acc;
          }, {})[type] || 0;

        if (prevTypeCount + delta > typeLimits[type]) {
          alert(
            `You can only add up to ${
              typeLimits[type]
            } ${type.toUpperCase()} chocolates.`
          );
          return prev;
        }
      }

      const updated = { ...prev, [id]: newQty };
      if (updated[id] === 0) delete updated[id];
      return updated;
    });
  };

  return (
    <div>
      <Header />

      <Container fluid className="py-4 container">
        <Breadcrumb>
          <Breadcrumb.Item
            className="box-title"
            href="/ownbox"
          >
            BUILD YOUR OWN BOX
          </Breadcrumb.Item>
          <Breadcrumb.Item
            className="box-header"
            active
          >
            {box?.size ? `BOX OF ${box.size}` : "BOX"}
          </Breadcrumb.Item>
        </Breadcrumb>

        <h5
          className="text-center mb-4 boxproduct-title"
          style={{ color: "#8B6F4E" }}
        >
          CHOOSE YOUR CHOCOLATES
        </h5>

        {/* ✅ TYPE DROPDOWN */}
        <div className="d-flex justify-content-end mb-3">
          <DropdownButton
            title={
              selectedType === "all"
                ? "All Types"
                : selectedType.toUpperCase()
            }
            variant="outline-dark"
            size="sm"
          >
            {chocolateTypes.map((type) => (
              <Dropdown.Item
                key={type}
                onClick={() => setSelectedType(type)}
                active={selectedType === type}
              >
                {type === "all"
                  ? "All Types"
                  : type.toUpperCase()}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted">
              Loading chocolates...
            </p>
          </div>
        ) : error ? (
          <div className="text-center my-5">
            <p className="text-danger">{error}</p>
            <div className="mt-2">
              <NavLink
                to="/sweetindulgence"
                style={{ textDecoration: "none" }}
              >
                <Button variant="outline-dark">
                  Back to Categories
                </Button>
              </NavLink>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center my-5 text-muted">
            No products found for this category.
          </div>
        ) : (
          <Row>
            {products
              .filter((product) => {
                const type = (
                  product.type ||
                  product.chocolateType ||
                  ""
                ).toLowerCase();

                if (typeLimits && typeLimits[type] === 0)
                  return false;

                if (
                  selectedType !== "all" &&
                  type !== selectedType
                )
                  return false;

                return true;
              })
              .map((product) => {
                const id = product._id;
                const name =
                  product.name ||
                  product.chocolateName ||
                  "Chocolate";
                const type =
                  product.type ||
                  product.chocolateType ||
                  "";
                const img = resolveImage(product.image);

                return (
                  <Col
                    key={id}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    className="mb-4"
                  >
                    <div className="text-center">
                      <p className="small fw-semibold boxproduct-name">
                        {name}
                      </p>
                      {type && (
                        <p className="text-muted small">
                          {type} Chocolate
                        </p>
                      )}
                      <div className="d-flex justify-content-center align-items-center">
                        <Button
                          variant="light"
                          className="border rounded-0"
                          onClick={() =>
                            updateQuantity(id, -1)
                          }
                        >
                          -
                        </Button>
                        <span
                          className="px-3 py-1 border-top border-bottom"
                          style={{
                            minWidth: 30,
                            textAlign: "center",
                          }}
                        >
                          {cart[id] || 0}
                        </span>
                        <Button
                          variant="light"
                          className="border rounded-0"
                          onClick={() =>
                            updateQuantity(id, 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </Col>
                );
              })}
          </Row>
        )}

        {Object.values(cart).reduce((a, b) => a + b, 0) >
          0 && (
          <div
            className="position-fixed bottom-0 start-0 w-100 bg-dark shadow-lg p-3 d-flex justify-content-between align-items-center"
            style={{ zIndex: 999 }}
          >
            <div className="flex-grow-1 me-3 text-light">
              <p className="mb-1 small">
                Select up to {boxLimit} total |{" "}
                <strong>
                  {Object.values(cart).reduce(
                    (a, b) => a + b,
                    0
                  )}{" "}
                  selected
                </strong>
              </p>

              <ProgressBar
                now={
                  (Object.values(cart).reduce(
                    (a, b) => a + b,
                    0
                  ) /
                    boxLimit) *
                  100
                }
                variant="warning"
                style={{ height: 6 }}
              />
            </div>

            <NavLink
              to="/boxcheckout"
              state={{ cart, products, box }}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="dark"
                className="px-4 py-2 rounded-0"
                style={{
                  backgroundColor: "#fff",
                  border: "none",
                  color: "#6F524C",
                }}
              >
                Review Your Order
              </Button>
            </NavLink>
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Boxproduct;
