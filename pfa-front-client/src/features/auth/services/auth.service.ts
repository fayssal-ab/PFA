import api from "../../../lib/axiosInstance";
import { AuthUser } from "../../../types";
import { NavigateFunction } from "react-router-dom";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  return res.data;
}

export function logout(setUser: (user: AuthUser | null) => void, navigate: NavigateFunction): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  setUser(null);
  navigate("/", { replace: true });
}
