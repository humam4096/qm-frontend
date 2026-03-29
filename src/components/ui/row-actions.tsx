import React from "react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type ActionVariant = "view" | "edit" | "destructive";

type Action<T> = {
  label?: string;
  onClick: (row: T) => void;
  variant?: ActionVariant; // updated variant type
  icon?: LucideIcon;
};

type Props<T> = {
  row: T;
  actions: Action<T>[];
};

export function RowActions<T>({ row, actions }: Props<T>) {
  const handleClick =
    (action: Action<T>) => (e: React.MouseEvent) => {
      e.stopPropagation();
      action.onClick(row);
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
      {actions.map((action, i) => {
        const Icon = action.icon;
        const variantClasses = getVariantClasses(action.variant);

        return (
          <Button
            key={i}
            size="sm"
            variant="ghost"
            className={`flex items-center gap-1 group ${variantClasses}`}
            onClick={handleClick(action)}
          >
            {Icon && <Icon className="w-8 h-8 transition-transform group-hover:scale-110" />}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}