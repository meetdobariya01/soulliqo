// import React, { useEffect, useState } from "react";
// import { useParams, NavLink } from "react-router-dom";
// import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";

// const Productgrid = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Main API URL
//   const API_BASE = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";
//   // Admin Backend URL (where /uploads live)
//   const ADMIN_API_BASE = "https://admin.soulliqo.com"; 

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         let url = `${API_BASE}/products`;
//         if (category) url += `?category=${encodeURIComponent(category)}`;

//         const res = await fetch(url);
//         const data = await res.json();
//         setProducts(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("❌ Failed to fetch products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [category, API_BASE]);

//   // ✅ Updated image resolver to handle the Admin Subdomain
//   const getImageUrl = (img) => {
//     if (!img || (Array.isArray(img) && img.length === 0)) return "/placeholder.jpg";

//     // 1. Handle Array or String
//     let imagePath = Array.isArray(img) ? img[0] : img;

//     // 2. Handle CSV string (if multiple paths in one string)
//     if (typeof imagePath === "string" && imagePath.includes(",")) {
//       imagePath = imagePath.split(",")[0].trim();
//     }

//     if (typeof imagePath !== "string") return "/placeholder.jpg";

//     // 3. Ensure leading slash
//     const normalizedPath = imagePath.startsWith("/") ? imagePath : "/" + imagePath;

//     // 4. ROUTE LOGIC:
//     // If it's an upload from the admin panel
//     if (normalizedPath.startsWith("/uploads")) {
//       return `${ADMIN_API_BASE}${normalizedPath}`;
//     }

//     // If it's a static image from the main server
//     if (normalizedPath.startsWith("/images")) {
//       return `${API_BASE}${normalizedPath}`;
//     }

//     // Already an absolute URL
//     return imagePath;
//   };

//   return (
//     <div>
//       <Header />
//       <Container className="py-5">
//         <h2 className="mb-4 text-center text-uppercase">
//           {category || "All Products"}
//         </h2>

//         {loading ? (
//           <div className="text-center my-5">
//             <Spinner animation="border" />
//             <p>Loading products...</p>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center my-5">
//             <p>No products found.</p>
//           </div>
//         ) : (
//           <Row className="g-4">
//             {products.map((product) => (
//               <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
//                 <Card className="h-100 shadow-sm position-relative border-0">
//                   <NavLink
//                     to={`/product/${product._id}`}
//                     className="text-decoration-none text-dark"
//                   >
//                     <Card.Img
//                       variant="top"
//                       // ✅ Check both 'image' and 'images' properties
//                       src={getImageUrl(product.image || product.images)}
//                       alt={product.name}
//                       onError={(e) => {
//                         e.target.onerror = null; // Prevent infinite loops
//                         e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
//                       }}
//                       style={{
//                         height: "200px",
//                         width: "100%",
//                         objectFit: "contain",
//                         borderRadius: "12px",
//                       }}
//                     />
//                     <Card.Body className="text-center">
//                       <Card.Title className="fs-6 text-truncate mb-1 montserrat-font">
//                         {product.name}
//                       </Card.Title>
//                       <p className="fw-bold mb-0 figtree-font">₹{product.price}</p>
//                     </Card.Body>
//                   </NavLink>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </Container>
//       <Footer />
//     </div>
//   );
// };

// export default Productgrid;
import React, { useEffect, useState } from "react";
import { useParams, NavLink, useLocation  } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";
const ADMIN_API_BASE = "https://admin.soulliqo.com"; // admin uploads

// Unified image resolver
const resolveImageUrl = (img) => {
  if (!img || (Array.isArray(img) && img.length === 0)) return "/placeholder.jpg";

  let imagePath = Array.isArray(img) ? img[0] : img;

  if (typeof imagePath === "string" && imagePath.includes(",")) {
    imagePath = imagePath.split(",")[0].trim();
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : "/" + imagePath;

  if (normalizedPath.startsWith("/uploads")) return `${ADMIN_API_BASE}${normalizedPath}`;
  if (normalizedPath.startsWith("/images")) return `${normalizedPath}`;

  return imagePath; // absolute URL
};

const resolveAllImages = (imgField) => {
  if (!imgField) return [];
  const arr = Array.isArray(imgField) ? imgField : [imgField];
  return arr.flatMap((img) =>
    typeof img === "string"
      ? img.split(",").map((i) => resolveImageUrl(i.trim()))
      : resolveImageUrl(img)
  ).filter(Boolean);
};

const Productgrid = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_BASE}/products`;
        if (category) url += `?category=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);
const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth"
    });
  }, [pathname]);

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="mb-4 text-center text-uppercase">
          {category || "All Products"}
        </h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center my-5">
            <p>No products found.</p>
          </div>
        ) : (
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm position-relative border-0">
                  <NavLink
                    to={`/product/${product._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <Card.Img
                      variant="top"
                      src={resolveAllImages(product.image || product.images)[0]}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="fs-6 text-truncate mb-1 montserrat-font">
                        {product.name}
                      </Card.Title>
                      <p className="fw-bold mb-0 figtree-font">₹{product.price}</p>
                    </Card.Body>
                  </NavLink>
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

export default Productgrid;
