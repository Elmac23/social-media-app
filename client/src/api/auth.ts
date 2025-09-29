import { LoginDto, RegisterDto } from "@/schema/authSchema";
import { api } from "./index";

export const register = (data: RegisterDto) => {
  return api.post("/auth/register", data);
};
export const login = (data: LoginDto) => {
  return api.post("/auth/login", data);
};

export const refresh = (cookies?: string) => {
  return api.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
      headers: { Cookie: cookies },
    }
  );
};

export const logout = (token: string) => {
  return api.post("/auth/logout", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
