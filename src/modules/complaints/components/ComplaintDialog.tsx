import React from 'react';
import type { Complaint } from '../types';
import { ComplaintDisplay } from './ComplaintDisplay';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useTranslation } from 'react-i18next';

interface ComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint | null;
}

export const ComplaintDialog: React.FC<ComplaintDialogProps> = ({
  open,
  onOpenChange,
  complaint,
}) => {
  const { t } = useTranslation();

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={t("complaints.complaintDetails")}
      cancelText={t("common.close")}
      footer={false}
      contentClassName="max-w-3xl"
    >
      <ComplaintDisplay
        complaint={complaint}
      />
    </ActionDialog>
  );
};
