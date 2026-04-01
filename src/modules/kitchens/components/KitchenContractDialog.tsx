import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import type { Contract } from "@/modules/contracts/types";
import { ContractDisplay } from "@/modules/contracts/components/ContractDisplay";
import i18n from "@/app/providers/i18n";

interface KitchenContractDialogProps {
  open: boolean;
  contract: Contract | null;
  onOpenChange: (open: boolean) => void;
}

export const KitchenContractDialog: React.FC<KitchenContractDialogProps> = ({
  open,
  contract,
  onOpenChange,
}) => {
  const { t } = useTranslation();
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
