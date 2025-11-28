// import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Carousel,
  Tab,
  Nav,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
// import { Heart, HeartFill } from "react-bootstrap-icons";
import "../../index.css";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Button, Form, Carousel, Tab, Nav } from "react-bootstrap";
// import { Heart, HeartFill, StarFill } from "react-bootstrap-icons";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import Reletedproduct from "../../components/reletedproduct/reletedproduct";

// const Productdetails = () => {
//   const { id } = useParams();
//   const Api = "http://localhost:5000";

//   const [product, setProduct] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [wishlist, setWishlist] = useState(false);
//   const [pincode, setPincode] = useState("");
//   const [pincodeMessage, setPincodeMessage] = useState("");
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [carouselIndex, setCarouselIndex] = useState(0);
//   const [loadingCart, setLoadingCart] = useState(false);
//   const [loadingWishlist, setLoadingWishlist] = useState(false);

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId") || "DEMO_USER_ID_123";

//   const safeJson = async (res) => {
//     try {
//       return await res.json();
//     } catch {
//       return {};
//     }
//   };

//   // Fetch product data and reviews whenever id changes
//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const res = await fetch(`${Api}/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await safeJson(res);
//         setProduct(data);

//         const reviewsRes = await fetch(`${Api}/products/${id}/reviews`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const reviewsData = await safeJson(reviewsRes);
//         setReviews(reviewsData);

//         // Wishlist check
//         if (data && data._id) {
//           const wishlistRes = await fetch(`${Api}/wishlist/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const wishlistData = await safeJson(wishlistRes);
//           const wishlistArray = Array.isArray(wishlistData)
//             ? wishlistData
//             : wishlistData.products || [];
//           setWishlist(wishlistArray.some((item) => item._id === data._id));
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     };

//     fetchProductData();
//   }, [id, token, userId]);

//   // Add to cart
// const handleAddToCart = async () => {
//   if (!token) return alert("Please login to add items to cart.");
//   setLoadingCart(true);
//   try {
//     const res = await fetch(`${Api}/cart/add`, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json", 
//         Authorization: `Bearer ${token}` 
//       },
//       body: JSON.stringify({ productId: product._id, quantity: qty }),
//     });

//     const data = await safeJson(res);
//     if (!res.ok) return alert(data.message || "Failed to add to cart.");

//     alert(`✅ Added ${qty} ${product.name} to cart`);
    
//     // ✅ Redirect to cart page after successful add
//     window.location.href = "/cart";
//     // or use navigate("/cart") if using React Router hook
//     // navigate("/cart");
    
//   } catch (err) {
//     console.error(err);
//     alert("Error adding to cart");
//   }
//   setLoadingCart(false);
// };


//   // Wishlist toggle
//   const handleWishlist = async () => {
//     if (!token) return alert("Please login to manage your wishlist.");
//     setLoadingWishlist(true);

//     const productId = product._id;
//     const action = wishlist ? "remove" : "add";
//     const url = `${Api}/wishlist/${userId}/${action}/${productId}`;

//     try {
//       const res = await fetch(url, {
//         method: action === "add" ? "POST" : "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await safeJson(res);

//       if (res.ok) {
//         setWishlist(!wishlist);
//         alert(`Product ${action === "add" ? "added to" : "removed from"} wishlist!`);
//       } else {
//         alert(`Failed to update wishlist: ${data.message || "An unknown error occurred."}`);
//       }
//     } catch (err) {
//       console.error("Wishlist update error:", err);
//       alert("An error occurred while updating the wishlist.");
//     }
//     setLoadingWishlist(false);
//   };

//   // Pincode check
//   const handleCheckPincode = () => {
//     const pincodePattern = /^[1-9][0-9]{5}$/;
//     if (pincodePattern.test(pincode)) {
//       setPincodeMessage("✅ Delivery available to your pincode.");
//     } else {
//       setPincodeMessage("❌ Please enter a valid 6-digit Indian pincode.");
//     }
//   };

//   // Submit review
//   const handleSubmitReview = async () => {
//     if (!rating || !reviewText) return alert("Please provide rating and review text.");
//     if (!token) return alert("Please login to submit a review.");
//     try {
//       const res = await fetch(`${Api}/products/${id}/review`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ rating, text: reviewText }),
//       });
//       const data = await safeJson(res);
//       if (!res.ok) return alert(data.message || "Failed to submit review");

//       setReviews(data.ratings || data);
//       setRating(0);
//       setReviewText("");
//       alert("✅ Review & rating submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting review");
//     }
//   };

//   if (!product) return <div>Loading...</div>;

//   const images = Array.isArray(product.image) ? product.image : [product.image];
//   const averageRating =
//     reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

//   return (
//     <div>
//       <Header />
//       <Container fluid className="py-5 container">
//         <Row>
//           {/* Thumbnails */}
//           <Col md={1} className="d-none d-md-block">
//             {images.map((img, index) => (
//               <div
//                 key={index}
//                 className={`mb-2 p-1 border ${carouselIndex === index ? "border-dark" : "border-light"}`}
//                 style={{ cursor: "pointer", maxWidth: "80px" }}
//                 onClick={() => setCarouselIndex(index)}
//               >
//                 <img className="img-fluid" src={img} alt={`Thumbnail ${index}`} />
//               </div>
//             ))}
//           </Col>

//           {/* Carousel */}
//           <Col md={5}>
//             <Carousel activeIndex={carouselIndex} onSelect={setCarouselIndex} interval={null}>
//               {images.map((img, index) => (
//                 <Carousel.Item key={index}>
//                   <img className="d-block w-100 rounded shadow" src={img} alt={`Slide ${index}`} />
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           </Col>

//           {/* Product details */}
//           <Col md={6}>
//             <h3>{product.name}</h3>
//             <p>{product.weight}</p>
//             <p>
//               ₹{product.price} <del className="text-muted ms-2">₹{product.oldPrice || "590.00"}</del>
//             </p>

//             <div
//               className="mb-3"
//               onClick={handleWishlist}
//               style={{ cursor: loadingWishlist ? "not-allowed" : "pointer" }}
//             >
//               {wishlist ? <HeartFill color="red" size={22} /> : <Heart size={22} />}{" "}
//               {wishlist ? "Remove from Wish List" : "Add to Wish List"}
//             </div>

//             {reviews.length > 0 && (
//               <div className="mb-3">
//                 {[...Array(5)].map((_, i) => (
//                   <StarFill key={i} style={{ color: i < Math.round(averageRating) ? "#FFD700" : "#ccc" }} />
//                 ))}
//                 <span className="ms-2">
//                   ({reviews.length} review{reviews.length > 1 ? "s" : ""})
//                 </span>
//               </div>
//             )}

//             <Form className="d-flex mb-3">
//               <Form.Control
//                 type="text"
//                 placeholder="Enter pincode"
//                 value={pincode}
//                 onChange={(e) => setPincode(e.target.value)}
//                 style={{ maxWidth: "150px" }}
//               />
//               <Button variant="link" onClick={handleCheckPincode}>
//                 CHECK
//               </Button>
//             </Form>
//             <small className="mb-3 d-block">{pincodeMessage}</small>

//             <div className="d-flex align-items-center mt-4">
//               <Button variant="light" onClick={() => qty > 1 && setQty(qty - 1)}>
//                 −
//               </Button>
//               <span className="px-3">{qty}</span>
//               <Button variant="light" onClick={() => setQty(qty + 1)}>
//                 +
//               </Button>
//               <Button
//                 className="ms-3"
//                 style={{ backgroundColor: "#7B4B3A", border: "none", color: "#fff" }}
//                 onClick={handleAddToCart}
//                 disabled={loadingCart}
//               >
//                 {loadingCart ? "Adding..." : "Add to Cart"}
//               </Button>
//             </div>
//           </Col>
//         </Row>

//         {/* Tabs for details and reviews */}
//         <section className="py-5">
//           <Tab.Container defaultActiveKey="details">
//             <Nav variant="tabs" className="mb-3 bg-color text-white p-2">
//               <Nav.Item>
//                 <Nav.Link eventKey="details" className="text-dark">Product Details</Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link eventKey="reviews" className="text-dark">Reviews</Nav.Link>
//               </Nav.Item>
//             </Nav>
//             <Tab.Content>
//               <Tab.Pane eventKey="details">
//                 <p>{product.description || "No description available."}</p>
//               </Tab.Pane>
//               <Tab.Pane eventKey="reviews">
//                 <div className="mb-3">
//                   {[1,2,3,4,5].map((star)=>(
//                     <span
//                       key={star}
//                       style={{ cursor:"pointer", fontSize:"1.5rem", color:(hoverRating||rating)>=star?"#FFD700":"#ccc" }}
//                       onMouseEnter={()=>setHoverRating(star)}
//                       onMouseLeave={()=>setHoverRating(0)}
//                       onClick={()=>setRating(star)}
//                     >
//                       <StarFill />
//                     </span>
//                   ))}
//                 </div>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   placeholder="Write your review..."
//                   value={reviewText}
//                   onChange={(e)=>setReviewText(e.target.value)}
//                   className="mb-3"
//                 />
//                 <Button onClick={handleSubmitReview}>Submit Review</Button>

//                 <div className="mt-4">
//                   {reviews.length===0 && <p>No reviews yet.</p>}
//                   {reviews.map((rev, idx)=>(
//                     <div key={idx} className="mb-3 p-2 border rounded">
//                       <div>
//                         {[...Array(5)].map((_, i)=>(
//                           <StarFill key={i} style={{ color:i<rev.rating?"#FFD700":"#ccc" }} />
//                         ))}
//                       </div>
//                       <p>{rev.review || rev.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               </Tab.Pane>
//             </Tab.Content>
//           </Tab.Container>
//         </section>

//         {/* Related Products */}
//         <Reletedproduct category={product.category} currentProductId={product._id} />

//       </Container>
//       <Footer />
//     </div>
//   );
// };

// export default Productdetails;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Container, Row, Col, Button, Form, Carousel, Tab, Nav } from "react-bootstrap";
import { Heart, HeartFill, StarFill } from "react-bootstrap-icons";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Reletedproduct from "../../components/reletedproduct/reletedproduct";

const Productdetails = () => {
  const { id } = useParams();
  const Api = "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId") || "DEMO_USER_ID_123";

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // ✅ Fetch product + reviews
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${Api}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await safeJson(res);
        setProduct(data);

        const reviewsRes = await fetch(`${Api}/products/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviewsData = await safeJson(reviewsRes);
        setReviews(reviewsData);

        // Check wishlist
        if (data && data._id) {
          const wishlistRes = await fetch(`${Api}/wishlist/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const wishlistData = await safeJson(wishlistRes);
          const wishlistArray = Array.isArray(wishlistData)
            ? wishlistData
            : wishlistData.products || [];
          setWishlist(wishlistArray.some((item) => item._id === data._id));
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id, token, userId]);

  // ✅ Add to cart
  const handleAddToCart = async () => {
    if (!token) return alert("Please login to add items to cart.");
    setLoadingCart(true);
    try {
      const res = await fetch(`${Api}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });

      const data = await safeJson(res);
      if (!res.ok) return alert(data.message || "Failed to add to cart.");

      alert(`✅ Added ${qty} ${product.name} to cart`);
      window.location.href = "/cart";
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
    setLoadingCart(false);
  };

  // ✅ Wishlist toggle
  const handleWishlist = async () => {
    if (!token) return alert("Please login to manage your wishlist.");
    setLoadingWishlist(true);

    const productId = product._id;
    const action = wishlist ? "remove" : "add";
    const url = `${Api}/wishlist/${userId}/${action}/${productId}`;

    try {
      const res = await fetch(url, {
        method: action === "add" ? "POST" : "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeJson(res);

      if (res.ok) {
        setWishlist(!wishlist);
        alert(`Product ${action === "add" ? "added to" : "removed from"} wishlist!`);
      } else {
        alert(`Failed to update wishlist: ${data.message || "An unknown error occurred."}`);
      }
    } catch (err) {
      console.error("Wishlist update error:", err);
      alert("An error occurred while updating the wishlist.");
    }
    setLoadingWishlist(false);
  };

  // ✅ Pincode check
  const handleCheckPincode = () => {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (pincodePattern.test(pincode)) {
      setPincodeMessage("✅ Delivery available to your pincode.");
    } else {
      setPincodeMessage("❌ Please enter a valid 6-digit Indian pincode.");
    }
  };

  // ✅ Submit review
  const handleSubmitReview = async () => {
    if (!rating || !reviewText) return alert("Please provide rating and review text.");
    if (!token) return alert("Please login to submit a review.");
    try {
      const res = await fetch(`${Api}/products/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, text: reviewText }),
      });
      const data = await safeJson(res);
      if (!res.ok) return alert(data.message || "Failed to submit review");

      setReviews(data.ratings || data);
      setRating(0);
      setReviewText("");
      alert("✅ Review & rating submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }
  };

  if (!product) return <div>Loading...</div>;

  // ✅ FIXED IMAGE HANDLING (handles arrays or comma-separated values)
  const images = (() => {
    if (!product?.image) return [];

    if (Array.isArray(product.image)) {
      return product.image
        .flatMap((img) => img.split(",").map((i) => i.trim()))
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${Api}${img}`));
    }

    if (typeof product.image === "string") {
      return product.image
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${Api}${img}`));
    }

    return [];
  })();

  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <Header />
      <Container fluid className="py-5 container">
        <Row>
          {/* Thumbnails */}
          <Col md={1} className="d-none d-md-block">
            {images.map((img, index) => (
              <div
                key={index}
                className={`mb-2 p-1 border ${carouselIndex === index ? "border-dark" : "border-light"}`}
                style={{ cursor: "pointer", maxWidth: "80px" }}
                onClick={() => setCarouselIndex(index)}
              >
                <img className="img-fluid" src={img} alt={`Thumbnail ${index}`} />
              </div>
            ))}
          </Col>

          {/* Carousel */}
          <Col md={5}>
            <Carousel activeIndex={carouselIndex} onSelect={setCarouselIndex} interval={null}>
              {images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100 rounded shadow" src={img} alt={`Slide ${index}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          {/* Product details */}
          <Col md={6}>
            <h3>{product.name}</h3>
            <p>{product.weight}</p>
            <p>
              ₹{product.price}{" "}
              <del className="text-muted ms-2">₹{product.oldPrice || "590.00"}</del>
            </p>

            <div
              className="mb-3"
              onClick={handleWishlist}
              style={{ cursor: loadingWishlist ? "not-allowed" : "pointer" }}
            >
              {wishlist ? <HeartFill color="red" size={22} /> : <Heart size={22} />}{" "}
              {wishlist ? "Remove from Wish List" : "Add to Wish List"}
            </div>

            {reviews.length > 0 && (
              <div className="mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarFill key={i} style={{ color: i < Math.round(averageRating) ? "#FFD700" : "#ccc" }} />
                ))}
                <span className="ms-2">
                  ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                </span>
              </div>
            )}

            <Form className="d-flex mb-3">
              <Form.Control
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{ maxWidth: "150px" }}
              />
              <Button variant="link" onClick={handleCheckPincode}>
                CHECK
              </Button>
            </Form>
            <small className="mb-3 d-block">{pincodeMessage}</small>

            <div className="d-flex align-items-center mt-4">
              <Button variant="light" onClick={() => qty > 1 && setQty(qty - 1)}>
                −
              </Button>
              <span className="px-3">{qty}</span>
              <Button variant="light" onClick={() => setQty(qty + 1)}>
                +
              </Button>
              <Button
                as={NavLink}
                to="/boxcheckout"
                className="ms-3 py-2 cart-btn font-light"
                style={{
                  backgroundColor: "#7B4B3A",
                  border: "none",
                  fontWeight: "400",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  padding: "10px 30px",
                }}
                className="ms-3"
                style={{ backgroundColor: "#7B4B3A", border: "none", color: "#fff" }}
                onClick={handleAddToCart}
                disabled={loadingCart}
              >
                {loadingCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Tabs for details and reviews */}
        <section className="py-5">
          <Container>
            {/* Tabs */}
            <Tab.Container defaultActiveKey="details">
              <Nav variant="tabs" className="mb-3 bg-color text-white p-2">
                <Nav.Item>
                  <Nav.Link eventKey="details" className="text-white nav-font">
                    Product Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="ingredients"
                    className="text-white nav-font"
                  >
                    Ingredients
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews" className="text-white nav-font">
                    Reviews
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              {/* Tab Content */}
              <Tab.Content>
                {/* Product Details */}
                <Tab.Pane
                  eventKey="details"
                  className="animate_animated animate_fadeIn tab-content"
                >
                  <p>
                    Step into a realm of unparalleled off-duty style with these
                    grey acid wash joggers that effortlessly marry fashion with
                    comfort. Crafted for those committed to style even on their
                    days off, these joggers feature a chic drawstring waist and
                    a wide leg cut. The distinctive acid wash adds a touch of
                    urban edge, making these joggers a versatile choice for
                    leisurely pursuits and relaxed outings. Elevate your casual
                    wardrobe with the perfect blend of fashion-forward design
                    and comfort-driven details, redefining off-duty elegance
                    with every step.
                  </p>
                  <p>
                    Step into a realm of unparalleled off-duty style with these
                    grey acid wash joggers that effortlessly marry fashion with
                    comfort. Crafted for those committed to style even on their
                    days off, these joggers feature a chic drawstring waist and
                    a wide leg cut. The distinctive acid wash adds a touch of
                    urban edge, making these joggers a versatile choice for
                    leisurely pursuits and relaxed outings. Elevate your casual
                    wardrobe with the perfect blend of fashion-forward design
                    and comfort-driven details, redefining off-duty elegance
                    with every step.
                  </p>
                  <ul>
                    <li>Dark grey</li>
                    <li>Acid wash finish</li>
                    <li>Drawstring waist</li>
                    <li>Side slit pockets</li>
                    <li>Pin tuck pleat</li>
                    <li>Wide leg</li>
                    <li>Model is 5’9”/175cm and wears UK 10/EU 38/US 6</li>
                    <li>Product Code: 891545603</li>
                  </ul>
                </Tab.Pane>
                {/* Ingredients */}
                <Tab.Pane
                  eventKey="ingredients"
                  className="animate_animated animate_fadeIn"
                >
                  <p>Ingredient details will go here...</p>
                </Tab.Pane>
                {/* Reviews */}
                <Tab.Pane
                  eventKey="reviews"
                  className="animate_animated animate_fadeIn"
                >
                  <p>Customer reviews will go here...</p>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Container>
          <Tab.Container defaultActiveKey="details">
            <Nav variant="tabs" className="mb-3 bg-color text-white p-2">
              <Nav.Item>
                <Nav.Link eventKey="details" className="text-dark">
                  Product Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reviews" className="text-dark">
                  Reviews
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <p>{product.description || "No description available."}</p>
              </Tab.Pane>
              <Tab.Pane eventKey="reviews">
                <div className="mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        color: (hoverRating || rating) >= star ? "#FFD700" : "#ccc",
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <StarFill />
                    </span>
                  ))}
                </div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={handleSubmitReview}>Submit Review</Button>

                <div className="mt-4">
                  {reviews.length === 0 && <p>No reviews yet.</p>}
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="mb-3 p-2 border rounded">
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <StarFill key={i} style={{ color: i < rev.rating ? "#FFD700" : "#ccc" }} />
                        ))}
                      </div>
                      <p>{rev.review || rev.text}</p>
                    </div>
                  ))}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>

        {/* Related Products */}
        <Reletedproduct category={product.category} currentProductId={product._id} />
      </Container>
      <Footer />
    </div>
  );
};

export default Productdetails;
