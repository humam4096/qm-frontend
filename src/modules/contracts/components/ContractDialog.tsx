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
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      // title={t("contracts.contractDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-7xl max-h-[800px] overflow-y-scroll"
    >
      <div className="py-4 overflow-y-scroll">
        <ContractDisplay data={contract} />
      </div>
    </ActionDialog>
  );
};