import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { FormDisplay } from "./FormDisplay";
import type { Form } from "../types";

interface FormDialogProps {
  open: boolean;
  form: Form | null;
  onOpenChange: (open: boolean) => void;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  form,
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
        <FormDisplay data={form} />
      </div>
    </ActionDialog>
  );
};