import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL ="https://gale-grid-1.onrender.com";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/current_user`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refreshUser: fetchUser };
}

export default useAuth;
