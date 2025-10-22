"use client";

import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";
import { refresh } from "@/api/auth";

const socketContext = React.createContext({
  socket: null as Socket | null,
  isConnected: false,
});

export const useSocket = () => React.useContext(socketContext);

function SocketProvider({ children }: React.PropsWithChildren) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const { accessToken, setAccessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:81", {
      auth: {
        token: accessToken,
      },
    });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [accessToken]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisonnect() {
      setIsConnected(false);
    }

    async function onUnauthorized() {
      try {
        const response = await refresh();
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        const newSocket = io(
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:81",
          {
            auth: {
              token: accessToken,
            },
          }
        );
        setSocket(newSocket);
      } catch (error) {
        console.log("Unauthorized, and refresh failed", error);
      }
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisonnect);
    socket?.on("unauthorized", onUnauthorized);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisonnect);
      socket?.off("unauthorized", onUnauthorized);
    };
  }, [socket]);

  return (
    <socketContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </socketContext.Provider>
  );
}

export default SocketProvider;
