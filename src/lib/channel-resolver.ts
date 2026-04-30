import type { User, UserRole } from "@/modules/users/types";

type ChannelScope = "global" | "branch" | null;

export interface ChannelConfig {
  baseChannel: string;
  roleScopes: Partial<Record<UserRole, ChannelScope>>;
}

export function resolveChannelName(
  user: User | null,
  config: ChannelConfig
): string | null {
  if (!user) return null;

  const scope = config.roleScopes[user.role];

  // User role not configured for this channel
  if (scope === undefined || scope === null) {
    return null;
  }

  // Global scope - no additional identifier needed
  if (scope === "global") {
    return `${config.baseChannel}.global`;
  }

  // Branch or zone scope - requires scope ID
  if (scope === "branch" && user.scope?.id) {
    return `${config.baseChannel}.${scope}.${user.scope.id}`;
  }

  // User has role but missing required scope data
  return null;
}


export const CHANNEL_CONFIGS = {
  MEAL_TIME_TRACKER: {
    baseChannel: "meal-time-window-tracker",
    roleScopes: {
      system_manager: "global",
      quality_manager: "global",
      project_manager: "global",
      catering_manager: "branch",
    },
  } as ChannelConfig,

  COMPLAINTS: {
    baseChannel: "complaints",
    roleScopes: {
      system_manager: "global",
      quality_manager: "global",
      project_manager: "global",
      catering_manager: "branch",
    },
  } as ChannelConfig,

  SUBMISSIONS: {
    baseChannel: "submissions",
    roleScopes: {
      system_manager: "global",
      project_manager: "global",
      quality_manager: "global",
      catering_manager: "branch",
    },
  } as ChannelConfig,
} as const;
