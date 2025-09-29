"use client";

import { api } from "@/api";
import { refresh } from "@/api/auth";
import { UserWithToken } from "@/types/user";
import type { AxiosError, AxiosRequestConfig } from "axios";

import React, {
  useState,
  Dispatch,
  SetStateAction,
  use,
  useLayoutEffect,
} from "react";

type AuthContextType = {
  accessToken: string;
  user?: UserWithToken;
  setAccessToken: Dispatch<SetStateAction<string>>;
};

const authContext = React.createContext<AuthContextType>({
  accessToken: "",
  user: {} as UserWithToken,
  setAccessToken: () => {},
});

export function useAuth() {
  return use(authContext);
}

function AuthProvider({
  children,
  user,
}: React.PropsWithChildren & { user?: UserWithToken }) {
  const [accessToken, setAccessToken] = useState(user?.accessToken || "");

  useLayoutEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (!originalRequest) return;
        const status = error.response?.status;

        if (!originalRequest) return Promise.reject(error);

        if (status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await refresh();
            const { accessToken } = response.data;
            originalRequest.headers!["authorization"] = `Bearer ${accessToken}`;
            setAccessToken(accessToken);
            return api(originalRequest as AxiosRequestConfig);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <authContext.Provider
      value={{
        user,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export default AuthProvider;
