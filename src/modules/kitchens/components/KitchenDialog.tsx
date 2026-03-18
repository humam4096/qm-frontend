import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { KitchenDisplay } from "./KitchenDisplay";
import type { Kitchen } from "../types";

interface KitchenDialogProps {
  open: boolean;
  kitchen: Kitchen | null;
  onOpenChange: (open: boolean) => void;
}

export const KitchenDialog: React.FC<KitchenDialogProps> = ({
  open,
  kitchen,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("kitchens.kitchenDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-6xl"
    >
        <div className="py-4">
          <KitchenDisplay data={kitchen} />
        </div>
    </ActionDialog>
  );
};
