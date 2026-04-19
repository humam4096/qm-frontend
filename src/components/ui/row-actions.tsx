import React from "react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/modules/users/types";

type ActionVariant = "view" | "edit" | "destructive";

type Action<T> = {
  label?: string;
  onClick?: (row: T) => void;
  variant?: ActionVariant;
  icon?: LucideIcon;

  allowedRoles?: UserRole[];
  disabled?: boolean;
  link?: string;
};

type Props<T> = {
  row: T;
  actions: Action<T>[];
};

export function RowActions<T>({ row, actions }: Props<T>) {

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const RoleBasedActions = actions.filter((action) => {
    if (action.allowedRoles && user) {
      if (!action.allowedRoles.includes(user.role)) return false;
    }
    return true;
  });

  const handleClick = (action: Action<T>) => (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (action?.link) {
      navigate(action?.link);
    }
    
    action?.onClick?.(row);
  };

  // Map variant to base colors
  const getVariantClasses = (variant?: ActionVariant) => {
    switch (variant) {
      case "destructive":
        return "text-destructive bg-destructive/10 p-2 group-hover:text-destructive/80 hover:bg-destructive/10";
      case "edit":
        return "text-teal-700 bg-teal-700/10 p-2 group-hover:text-teal-700/80 hover:bg-teal-700/10";
      case "view":
      default:
        return "text-gray-500 bg-gray-500/10 p-2 group-hover:text-gray-500/80 hover:bg-gray-500/10";
    }
  };

  return (
    <div className="flex items-center justify-start gap-1">
      {RoleBasedActions.map((action, i) => {
        const Icon = action.icon;
        const variantClasses = getVariantClasses(action.variant);
        
        // check if action is allowed
        const isDisabled = action.disabled;
        
        return (
          <Button
            key={i}
            size="sm"
            variant="ghost"
            className={`
              flex items-center gap-1 group 
              ${variantClasses}
              ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
            `}
            onClick={isDisabled ? undefined : handleClick(action)}
          >
            {Icon && <Icon className="w-8 h-8 transition-transform group-hover:scale-110" />}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}