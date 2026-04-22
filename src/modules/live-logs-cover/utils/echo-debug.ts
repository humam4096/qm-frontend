import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

// Enable Pusher debug logs
Pusher.logToConsole = true;

export const createDebugEcho = () => {
  const config = {
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: import.meta.env.VITE_REVERB_SCHEME ?? "https",
    enabledTransports: ["ws", "wss"],
  };

  console.log("🔧 Echo Config:", config);

  const echo = new Echo(config as any);

  // 🔍 Connection state tracking
  const pusher = (echo.connector as any).pusher;

  pusher.connection.bind("state_change", (states: any) => {
    console.log("📡 State:", states.previous, "→", states.current);
  });

  pusher.connection.bind("error", (err: any) => {
    console.error("❌ Connection error:", err);
  });

  pusher.connection.bind("connected", () => {
    console.log("✅ Connected to WebSocket");
  });

  return echo;
};


export const debugChannel = (echo: any, channelName: string) => {
  console.log(`📡 Subscribing to: ${channelName}`);

  const channel = echo.channel(channelName);

  channel.subscribed(() => {
    console.log(`✅ Subscribed to ${channelName}`);
  });

  channel.error((err: any) => {
    console.error(`❌ Channel error (${channelName}):`, err);
  });

  channel.listenToAll((event: string, data: any) => {
    console.log(`📥 Event received: ${event}`, data);
  });

  channel.listenToAll((event: string, data: any) => {
    console.log("📥 RAW EVENT:", event);
    console.log("📦 DATA:", data);
  });

  channel.listen(".complaint.created", (e: any) => {
    console.log("🔥 Specific event:", e);
  });

  return channel;
};