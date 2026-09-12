import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { API_ORIGIN } from "../config/api";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setConnected(false);
      setError(null);
      return;
    }

    const s = io(API_ORIGIN, { auth: { token }, withCredentials: true });

    s.on("connect", () => {
      setConnected(true);
      setError(null);
    });

    s.on("disconnect", () => setConnected(false));

    s.on("connect_error", (err) => {
      setConnected(false);
      setError(err.message || "Unable to connect to chat server");
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected, error }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);