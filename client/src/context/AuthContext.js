import React, { createContext } from "react";
import useAuth from "../useAuth";

// Create AuthContext
export const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: () => {},
});

export function AuthProvider({ children }) {
  const { user, loading, refreshUser } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
