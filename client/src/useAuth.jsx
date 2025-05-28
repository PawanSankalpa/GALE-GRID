import { useState, useEffect } from "react";
import axios from "axios";

function useAuth() {
  const [user, setUser] = useState(null); // will store user object or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/current_user", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}

export default useAuth;
