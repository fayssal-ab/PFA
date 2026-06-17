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

export interface RegisterClientDto {
  adresse: string;
  telephone: string;
  user: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
  };
}

export const registerClient = async (
  data: RegisterClientDto
) => {
  const response = await api.post(
    "/clients/register-client",
    data
  );

  return response.data;
};