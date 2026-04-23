import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { api } from "./api";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo?: Echo<"pusher">;  }
}

window.Pusher = Pusher;

let echoInstance: Echo<"pusher"> | null = null;

type ConnectionState = "connecting" | "connected" | "disconnected" | "failed";
type ConnectionListener = (state: ConnectionState) => void;

const connectionListeners = new Set<ConnectionListener>();

export const onConnectionStateChange = (listener: ConnectionListener): (() => void) => {
  connectionListeners.add(listener);
  return () => connectionListeners.delete(listener);
};

const notifyListeners = (state: ConnectionState) => {
  connectionListeners.forEach((listener) => listener(state));
};

const getPusher = () => {
  return (echoInstance?.connector as any)?.pusher;
};
export const getConnectionState = (): ConnectionState => {
  if (!echoInstance) return "disconnected";
  
  const pusher = getPusher();
  const state = pusher?.connection?.state;
  
  if (state === "connected") return "connected";
  if (state === "connecting" || state === "initialized") return "connecting";
  if (state === "unavailable" || state === "failed") return "failed";
  
  return "disconnected";
};

export const getEcho = (): Echo<"pusher"> => {
  if (echoInstance) {
    return echoInstance;
  }

  const token = api.getToken();

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${import.meta.env.VITE_SERVER_API_LIVE}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  } as any);

  const pusher = getPusher();

  pusher.connection.bind("connecting", () => notifyListeners("connecting"));
  pusher.connection.bind("connected", () => notifyListeners("connected"));
  pusher.connection.bind("disconnected", () => notifyListeners("disconnected"));
  pusher.connection.bind("failed", () => notifyListeners("failed"));
  pusher.connection.bind("unavailable", () => notifyListeners("failed"));

  return echoInstance;
};

export const disconnectEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
