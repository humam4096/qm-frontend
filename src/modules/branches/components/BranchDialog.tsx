import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { BranchDisplay } from "./BranchDisplay";
import type { Branch } from "../types";

interface BranchDialogProps {
  open: boolean;
  branch: Branch | null;
  onOpenChange: (open: boolean) => void;
}

export const BranchDialog: React.FC<BranchDialogProps> = ({
  open,
  branch,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("branches.branchDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
      <div className="py-4">
        <BranchDisplay data={branch} />
      </div>
    </ActionDialog>
  );
};