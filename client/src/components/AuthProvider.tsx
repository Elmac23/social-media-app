"use client";

import { api } from "@/api";
import { refresh } from "@/api/auth";
import { UserWithToken } from "@/types/user";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";

import React, {
  useState,
  Dispatch,
  SetStateAction,
  use,
  useLayoutEffect,
  useRef,
  useEffect,
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

export function useAuth(redirectIfNotLoggedIn: boolean = true) {
  const { accessToken, setAccessToken, user } = use(authContext);
  const router = useRouter();

  // Use useEffect to avoid synchronous navigation during render
  useEffect(() => {
    if (!user && redirectIfNotLoggedIn) {
      router.push("/auth/login");
    }
  }, [user, redirectIfNotLoggedIn, router]);

  return { accessToken, setAccessToken, user: user || undefined };
}

// Track refresh state to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function AuthProvider({
  children,
  user,
}: React.PropsWithChildren & { user?: UserWithToken }) {
  const [accessToken, setAccessToken] = useState(user?.accessToken || "");

  // Use ref to always have the latest token without recreating interceptors
  const accessTokenRef = useRef(accessToken);

  // Update ref when token changes
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Setup interceptors only once on mount
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = accessTokenRef.current;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as
          | (AxiosRequestConfig & {
              _retry?: boolean;
            })
          | undefined;

        if (!originalRequest) return Promise.reject(error);

        const status = error.response?.status;

        if ((status === 401 || status === 403) && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            let newAccessToken: string;

            // Prevent multiple refresh calls - reuse existing promise
            if (isRefreshing && refreshPromise) {
              newAccessToken = await refreshPromise;
            } else {
              isRefreshing = true;
              refreshPromise = refresh()
                .then((res) => {
                  const token = res.accessToken;
                  setAccessToken(token);
                  isRefreshing = false;
                  refreshPromise = null;
                  return token;
                })
                .catch((err) => {
                  isRefreshing = false;
                  refreshPromise = null;
                  throw err;
                });
              newAccessToken = await refreshPromise;
            }

            // Set the new token in the original request
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api.request(originalRequest);
          } catch (refreshError) {
            // Clear token on refresh failure (user needs to login again)
            setAccessToken("");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty deps - interceptors created only once

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
