import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { apiClient, setApiAuthToken } from "./services/apiClient.js";

export const AuthContext = createContext();

const TOKEN_STORAGE_KEY = "galegrid_auth_token";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setApiAuthToken(null);
    setToken("");
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await apiClient.post("/api/auth/login", { email, password });
    const nextToken = response.data?.token;
    const nextUser = response.data?.user;

    if (!nextToken || !nextUser) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setApiAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);

    return nextUser;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await apiClient.post("/api/auth/register", { name, email, password });
    const nextToken = response.data?.token;
    const nextUser = response.data?.user;

    if (!nextToken || !nextUser) {
      throw new Error("Invalid register response");
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setApiAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);

    return nextUser;
  }, []);

  useEffect(() => {
    async function bootstrapAuth() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setApiAuthToken(storedToken);
      setToken(storedToken);

      try {
        const response = await apiClient.get("/api/auth/me");
        setUser(response.data?.user || null);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    bootstrapAuth();
  }, [logout]);

  const contextValue = useMemo(() => {
    const loggedIn = Boolean(user && token);
    const username = user?.name || "";

    return {
      loading,
      token,
      user,
      role: user?.role || "guest",
      loggedIn,
      username,
      setLoggedIn: () => {},
      setUsername: () => {},
      login,
      register,
      logout,
    };
  }, [loading, token, user, login, register, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
