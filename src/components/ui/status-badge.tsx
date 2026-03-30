

import { useAuthStore } from "@/app/store/useAuthStore";
import { Badge } from "@/components/ui/badge";
import { getStatusVariant } from "@/lib/status";
import type { UserRole } from "@/modules/users/types";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: boolean | number;
  onClick?: () => void;
  isLoading?: boolean;
  allowedRoles?: UserRole[] | undefined;
}

export function StatusBadge({
  status,
  onClick,
  allowedRoles
}: StatusBadgeProps) {
  const { t } = useTranslation();
  const { variant, labelKey, className } = getStatusVariant(status);

  const isAllowed = (allowedRoles: UserRole[] | undefined) => {
    const { user } = useAuthStore();
    return allowedRoles?.includes(user?.role as UserRole);
  }
  
  return (
    <Badge
      variant={variant}
      onClick={isAllowed(allowedRoles) ? onClick : undefined }
      className={`${className}
       ${isAllowed(allowedRoles) && "cursor-pointer"}`
      }
    >
      {t(labelKey)}
    </Badge>
  );
}