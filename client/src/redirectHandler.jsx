// RedirectHandler.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function RedirectHandler() {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      await refreshUser(); // fetch the user from backend
      navigate("/dashboard"); // or wherever you want
    };

    handleRedirect();
  }, []);

  return <p>Logging you in...</p>;
}

export default RedirectHandler;
