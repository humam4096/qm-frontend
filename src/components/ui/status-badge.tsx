

import { Badge } from "@/components/ui/badge";
import { getStatusVariant } from "@/lib/status";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: boolean | number;
  onClick?: () => void;
  isLoading?: boolean;
}

export function StatusBadge({
  status,
  onClick,
  isLoading,
}: StatusBadgeProps) {
  const { t } = useTranslation();
  const { variant, labelKey, className } = getStatusVariant(status);

  return (
    <Badge
      variant={variant}
      onClick={onClick}
      className={`${className} ${
        isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
      }`}
    >
      {t(labelKey)}
    </Badge>
  );
}