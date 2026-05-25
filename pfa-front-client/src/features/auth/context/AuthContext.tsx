import React, { useState, useEffect, createContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthUser } from "../../../types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<AuthUser>(token);
    decoded.role = decoded.role?.toLowerCase();
    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    return token ? decodeToken(token) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    setUser(decodeToken(token));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}