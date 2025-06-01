import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("https://www.galegrid.com/user", {
          withCredentials: true,
        });
        const data = res.data;

        if (data.loggedIn) {
          setLoggedIn(true);
          setUsername(data.user.username);
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        console.error("Error checking login:", error);
        setLoggedIn(false);
        setUsername("");
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, username, setLoggedIn, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
}
