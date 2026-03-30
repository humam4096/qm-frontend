import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { ContractDisplay } from "./ContractDisplay";
import type { Contract } from "../types";

interface ContractDialogProps {
  open: boolean;
  contract: Contract | null;
  onOpenChange: (open: boolean) => void;
}

export const ContractDialog: React.FC<ContractDialogProps> = ({
  open,
  contract,
  onOpenChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-7xl max-h-[90vh] overflow-y-auto"
    >
      <div className="py-2 md:py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <ContractDisplay data={contract} />
      </div>
    </ActionDialog>
  );
};