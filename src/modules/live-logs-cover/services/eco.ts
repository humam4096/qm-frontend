// services/echo.ts

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getToken } from "@/lib/api";

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

let echoInstance: Echo<any> | null = null;

const AUTH_ENDPOINT = `${import.meta.env.VITE_SERVER_API_LIVE}/broadcasting/auth`;

/**
 * Custom authorizer for private channels.
 *
 * Why not authEndpoint + auth.headers:
 *   Pusher-js's built-in auth transport sends channel_name + socket_id as
 *   application/x-www-form-urlencoded and doesn't reliably attach Bearer
 *   tokens on cross-origin requests. This authorizer uses fetch with
 *   application/json — matching what a stateless Laravel API expects —
 *   and reads the token fresh on every auth attempt instead of capturing
 *   it at Echo initialization time.
 */
const makeAuthorizer =
  (channel: { name: string }) =>
  (socketId: string, callback: (error: boolean, data: unknown) => void) => {
    const token = getToken();

    if (!token) {
      console.error(
        "[Echo authorizer] No auth token — cannot authenticate channel:",
        channel.name
      );
      callback(true, null);
      return;
    }

    fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        socket_id: socketId,
        channel_name: channel.name, // e.g. "private-complaints.global"
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Broadcasting auth failed: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => callback(false, data))
      .catch((err) => {
        console.error("[Echo authorizer]", err);
        callback(true, null);
      });
  };

/**
 * Returns a lazily-initialized Echo instance.
 * Safe to call at any point after login — token is read at auth time, not here.
 */
export const getEcho = (): Echo<any> => {
  if (echoInstance) return echoInstance;

  const scheme = import.meta.env.VITE_REVERB_SCHEME || "http";
  const useTLS = scheme === "https";
  const port = Number(import.meta.env.VITE_REVERB_PORT);

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: useTLS ? undefined : port,
    wssPort: useTLS ? port : undefined,
    forceTLS: useTLS,
    disableStats: true,
    enabledTransports: useTLS ? ["wss"] : ["ws"],
    // Custom authorizer replaces authEndpoint + auth.headers entirely.
    // This is what was causing the empty {} payload — Pusher's default
    // transport was dropping the body on cross-origin requests.
    authorizer: makeAuthorizer as any,
  });

  return echoInstance;
};

/**
 * Tears down the current Echo instance.
 * Call this on logout so the next getEcho() picks up a fresh token.
 */
export const resetEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
// import Echo from "laravel-echo";
// import Pusher from "pusher-js";
// import { getToken } from "@/lib/api";

// // Make Pusher available globally for Laravel Echo
// (window as any).Pusher = Pusher;

// let echoInstance: Echo<any> | null = null;

// /**
//  * Returns a lazily-initialized Echo instance.
//  * Safe to call at any point after login — token is read at call time.
//  */
// export const getEcho = (): Echo<any> => {
//   if (echoInstance) return echoInstance;

//   const token = getToken();
//   const scheme = import.meta.env.VITE_REVERB_SCHEME || "http";
//   const useTLS = scheme === "https";
//   const port = Number(import.meta.env.VITE_REVERB_PORT);

//   echoInstance = new Echo({
//     broadcaster: "reverb",
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: useTLS ? undefined : port,
//     wssPort: useTLS ? port : undefined,
//     forceTLS: useTLS,
//     disableStats: true,
//     enabledTransports: useTLS ? ["wss"] : ["ws"],
//     authEndpoint: `${import.meta.env.VITE_SERVER_API_LIVE}/broadcasting/auth`,
//     auth: {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     },
//   });

//   return echoInstance;
// };

// /**
//  * Tears down the current Echo instance.
//  * Call this on logout so the next getEcho() picks up a fresh token.
//  */
// export const resetEcho = (): void => {
//   if (echoInstance) {
//     echoInstance.disconnect();
//     echoInstance = null;
//   }
// };


// import Echo from "laravel-echo";
// import Pusher from "pusher-js";
// import { getToken } from "@/lib/api";

// // Make Pusher available globally for Laravel Echo
// window.Pusher = Pusher;

// let echoInstance: Echo<any> | null = null;

// export const getEcho = () => {
//   if (echoInstance) return echoInstance;

//   const token = getToken();
//   const scheme = import.meta.env.VITE_REVERB_SCHEME || "http";
//   const useTLS = scheme === "https";

//   echoInstance = new Echo({
//     broadcaster: "reverb",
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: Number(import.meta.env.VITE_REVERB_PORT),
//     wssPort: Number(import.meta.env.VITE_REVERB_PORT),
//     forceTLS: useTLS,
//     disableStats: true,
//     enabledTransports: useTLS ? ["wss"] : ["ws"],
//     authEndpoint: `${import.meta.env.VITE_SERVER_API_LIVE}/broadcasting/auth`,
//     auth: {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     },
//   });

//   return echoInstance;
// };
