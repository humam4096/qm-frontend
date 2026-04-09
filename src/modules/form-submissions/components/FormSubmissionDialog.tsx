import React from "react";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "@/components/ui/action-dialog";
import { FormSubmissionDisplay } from "./FormSubmissionDisplay";
import type { FormSubmission } from "../types";

interface FormSubmissionDialogProps {
  open: boolean;
  form: FormSubmission | null;
  onOpenChange: (open: boolean) => void;
}

export const FormSubmissionDialog: React.FC<FormSubmissionDialogProps> = ({
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
      contentClassName="max-w-5xl max-h-[95vh] overflow-y-auto"
    >
      <div className="py-2 md:py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        {form && <FormSubmissionDisplay data={form} />}
      </div>
    </ActionDialog>
  );
};