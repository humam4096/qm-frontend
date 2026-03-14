import type { BadgeProps } from "@/components/ui/badge";

export type Status = boolean | number;

interface StatusVariant {
  variant: BadgeProps["variant"];
  className: string;
  labelKey: string;
}

export const getStatusVariant = (status: Status): StatusVariant => {
  const isActive = status === true || status === 1;

  return {
    variant: "outline",
    className: isActive
      ? "text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20"
      : "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900/20",
    labelKey: isActive ? "common.active" : "common.inactive",
  };
};