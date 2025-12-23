import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AfterLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      navigate("/dashboard"); // or wherever you want
    }
  }, [navigate]);

  return <h2>Loading...</h2>;
};

export default AfterLogin;
