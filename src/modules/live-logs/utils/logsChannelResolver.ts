// utils/logsChannelResolver.ts

import type { User } from "@/modules/users/types";

export const logsChannelResolver = (user: User): string[] => {
  if (!user) return [];

  switch (user.role) {
    case "system_manager":
    case "quality_manager":
      return ["complaints.global"];

    case "catering_manager":
      return user.scope?.id ? [`complaints.branch.${user.scope.id}`] : [];

    default:
      return [];
  }
};
