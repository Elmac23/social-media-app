import { LoginDto, RegisterDto } from "@/schema/authSchema";
import { api, authApi } from "./index";
import extractDataFromAxios from "@/lib/extractDataFromAxios";

type LoginResponse = {
  accessToken: string;
};

type DeviceNotVerifiedError = {
  message: string;
  code: "DEVICE_NOT_VERIFIED";
};

type EmailNotVerifiedError = {
  message: string;
  email: string;
  code: "EMAIL_NOT_VERIFIED";
};

export type LoginError = EmailNotVerifiedError | DeviceNotVerifiedError;

export const register = async (data: RegisterDto): Promise<LoginResponse> => {
  return extractDataFromAxios(
    authApi.post<LoginResponse>("/auth/register", data),
  );
};

export const upsertConfirmEmailToken = async (email: string) => {
  return extractDataFromAxios(
    authApi.post("/auth/resend-confirm-email", { email }),
  );
};

export const requestResetPassword = async (email: string) => {
  return extractDataFromAxios(
    authApi.post("/auth/request-reset-password", { email }),
  );
};

export type ResetPasswordData = {
  email: string;
  password: string;
  otp: string;
};

export const resetPassword = async (data: ResetPasswordData) => {
  return extractDataFromAxios(authApi.post("/auth/reset-password", data));
};

export const confirmEmail = async (token: string, email: string) => {
  return extractDataFromAxios(
    authApi.post("/auth/confirm-email", { token, email }),
  );
};

export const createDeviceId = async () => {
  return extractDataFromAxios(
    authApi.post(
      "/auth/device",
      {},
      {
        withCredentials: true,
      },
    ),
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
