// services/echo.ts
import Echo from "laravel-echo";
// import Pusher from "pusher-js";
import { getToken } from "@/lib/api";

// Make Pusher available globally for Laravel Echo
// window.Pusher = Pusher;

let echoInstance: Echo<any> | null = null;

export const getEcho = () => {
  if (echoInstance) return echoInstance;

  const token = getToken();
  const scheme = import.meta.env.VITE_REVERB_SCHEME || "http";
  const useTLS = scheme === "https";

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT),
    forceTLS: useTLS,
    disableStats: true,
    enabledTransports: useTLS ? ["wss"] : ["ws"],
    authEndpoint: `${import.meta.env.VITE_SERVER_API_LIVE}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  return echoInstance;
};
