import { useEffect, useState } from "react";
import { getEcho, onConnectionStateChange, getConnectionState } from "@/lib/echo";

type ConnectionState = "connecting" | "connected" | "disconnected" | "failed";

export const useEchoConnection = () => {
  const [state, setState] = useState<ConnectionState>(() => {
    getEcho();
    return getConnectionState();
  });

  useEffect(() => {
    const currentState = getConnectionState();
    setState(currentState);
    
    const unsubscribe = onConnectionStateChange((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  return {
    state,
    isConnected: state === "connected",
    isConnecting: state === "connecting",
    isFailed: state === "failed",
  };
};
