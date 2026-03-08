import { LoginDto, RegisterDto } from "@/schema/authSchema";
import { api, authApi } from "./index";
import extractDataFromAxios from "@/lib/extractDataFromAxios";

type LoginResponse = {
  accessToken: string;
};

export const register = async (data: RegisterDto): Promise<LoginResponse> => {
  return extractDataFromAxios(
    authApi.post<LoginResponse>("/auth/register", data),
  );
};

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  return extractDataFromAxios(authApi.post<LoginResponse>("/auth/login", data));
};

// Use authApi to avoid triggering interceptors (prevents infinite loop)
export const refresh = async (cookies?: string): Promise<LoginResponse> => {
  const fn = authApi.post<LoginResponse>(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
      headers: cookies ? { Cookie: cookies } : undefined,
    },
  );

  return extractDataFromAxios(fn);
};

export const logout = () => {
  const fn = api.post("/auth/logout");

  return extractDataFromAxios(fn);
};
