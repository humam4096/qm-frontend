// utils/logsChannelResolver.ts

import type { User } from "@/modules/users/types";

import type { ChannelType } from "../services/realtimeManager";

export interface ChannelConfig {
  channel: string;
  channelType: ChannelType;
  /** Events to subscribe to on this channel. Leading dot required for broadcastAs() events. */
  events: string[];
}

type RoleResolver = (user: User) => ChannelConfig[];

/**
 * Role → channel config mapping.
 *
 * - system_manager  : private authenticated channel, global scope
 * - catering_manager: private authenticated channel, scoped to their branch
 *
 * The public `complaints.public` channel is always subscribed to regardless
 * of role — it requires no auth and is safe to expose.
 */
const roleChannelResolvers: Partial<Record<string, RoleResolver>> = {
  system_manager: (): ChannelConfig[] => [
    {
      channel: "complaints.global",
      channelType: "private",
      events: [".complaint.created", ".complaint.status.updated"],
    },
  ],

  catering_manager: (user): ChannelConfig[] => {
    if (!user.scope?.id) {
      console.warn("[logsChannelResolver] catering_manager has no branch_id");
      return [];
    }
    return [
      {
        channel: `complaints.branch.${user.scope.id}`,
        channelType: "private",
        events: [".complaint.created", ".complaint.status.updated"],
      },
    ];
  },
};

/** Channels every authenticated user subscribes to, regardless of role. */
const SHARED_CHANNELS: ChannelConfig[] = [
  {
    channel: "complaints.public",
    channelType: "public",
    events: [".complaint.created", ".complaint.status.updated"],
  },
];

/**
 * Returns the full list of channel configs for a given user.
 * Always includes shared public channels + role-specific private channels.
 */
export const logsChannelResolver = (user: User): ChannelConfig[] => {
  if (!user?.role) return SHARED_CHANNELS;

  const resolver = roleChannelResolvers[user.role];
  if (!resolver) {
    console.warn(`[logsChannelResolver] No channel mapping for role: "${user.role}"`);
    return SHARED_CHANNELS;
  }

  return [...SHARED_CHANNELS, ...resolver(user)];
};


// export const logsChannelResolver = (user: User): string[] => {
//   if (!user) return [];

//   switch (user.role) {
//     case "system_manager":
//     case "quality_manager":
//       return ["complaints.global"];

//     case "catering_manager":
//       return user.scope?.id ? [`complaints.branch.${user.scope.id}`] : [];

//     default:
//       return [];
//   }
// };

// type ChannelResolver = (user: User) => string[];

// /**
//  * Role → channel mapping.
//  * Add new roles here without touching any hook or component.
//  */
// const roleChannelResolvers: Partial<Record<string, ChannelResolver>> = {
//   system_manager: () => ["complaints.global"],
 
//   catering_manager: (user) =>
//     user.scope?.id ? [`complaints.branch.${user.scope.id}`] : [],
// };
 
// /**
//  * Returns the list of Reverb channel names a given user should subscribe to,
//  * based on their role.
//  */
// export const logsChannelResolver = (user: User): string[] => {
//   if (!user?.role) return [];
 
//   const resolver = roleChannelResolvers[user.role];
//   if (!resolver) {
//     console.warn(`[logsChannelResolver] No channel mapping for role: "${user.role}"`);
//     return [];
//   }
 
//   return resolver(user);
// };
 

