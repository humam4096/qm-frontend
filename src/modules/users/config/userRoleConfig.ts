// src/modules/users/config/roleConfig.ts

export const ROLE_CONFIG = {
  system_manager: {
    canCreate: [
      "system_manager",
      "quality_manager",
      "project_manager",
      "quality_supervisor",
      "quality_inspector",
      "catering_manager",
    ],
    requires: [],
  },
  quality_manager: {
    canCreate: [
      "quality_supervisor",
      "quality_inspector",
    ],
    requires: [],
  },

  project_manager: {
    canCreate: [
      "quality_manager",
      "quality_inspector",
    ],
    requires: ["branch_id"],
  },

  quality_supervisor: {
    requires: ["zone_id"],
  },

  quality_inspector: {
    requires: ["zone_id"],
  },

  catering_manager: {
    requires: ["branch_id"],
  },
}