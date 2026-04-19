/// <reference types="vite/client" />

import type Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

interface ImportMetaEnv {
  readonly VITE_SERVER_API: string;
  readonly VITE_REVERB_APP_KEY: string;
  readonly VITE_REVERB_HOST: string;
  readonly VITE_REVERB_PORT: string;
  readonly VITE_REVERB_SCHEME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
