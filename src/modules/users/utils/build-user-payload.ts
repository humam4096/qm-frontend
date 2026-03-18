import type { CreateUserPayload } from "../types";

export const buildUserPayload = (
  data: CreateUserPayload,
  isZoneRequired: boolean,
  isBranchRequired: boolean
) => {
  const payload: any = { ...data };

  if (isZoneRequired) {
    payload.zone_id = data.zone_id ?? null;
  } else {
    delete payload.zone_id;
  }

  if (isBranchRequired) {
    payload.branch_id = data.branch_id ?? null;
  } else {
    delete payload.branch_id;
  }

  return payload;
};