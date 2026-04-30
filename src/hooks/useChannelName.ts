import { useMemo } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { resolveChannelName, type CHANNEL_CONFIGS } from "@/lib/channel-resolver";
import type { ChannelConfig } from "@/lib/channel-resolver";


export function useChannelName(
  config: ChannelConfig | (typeof CHANNEL_CONFIGS)[keyof typeof CHANNEL_CONFIGS]
): string | null {
  const { user } = useAuthStore();

  return useMemo(
    () => resolveChannelName(user, config),
    [user, config]
  );
}
