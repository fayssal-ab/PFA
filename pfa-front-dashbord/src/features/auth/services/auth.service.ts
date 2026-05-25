import api from "../../../lib/axiosInstance";
import { AuthUser } from "../../../types";
import { NavigateFunction } from "react-router-dom";

export async function login(email: string, password: string): Promise<string> {
  const res = await api.post<string>("/auth/login", { email, password });
  return res.data;
}

export function logout(setUser: (user: AuthUser | null) => void, navigate: NavigateFunction): void {
  localStorage.removeItem("token");
  setUser(null);
  navigate("/", { replace: true });
}