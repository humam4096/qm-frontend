import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import type { ComplaintType } from '../types';
import { ComplaintTypeCard } from './ComplaintTypeCard';
import { ComplaintTypeCardSkeleton } from './ComplaintTypeCardSkeleton';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useToggleComplaintTypeStatus } from '../hooks/useComplaintTypes';
import { toast } from 'sonner';

interface ComplaintTypeDisplayProps {
  complaintTypes: ComplaintType[];
  isLoading: boolean;
  error: any;
  onEdit: (item: ComplaintType) => void;
  onView: (item: ComplaintType) => void;
  onDelete: (item: ComplaintType) => void;
}

export const ComplaintTypeDisplay: React.FC<ComplaintTypeDisplayProps> = ({
  complaintTypes,
  isLoading,
  error,
  onEdit,
  onView,
  onDelete,
}) => {
  const { t } = useTranslation();

  // change state confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedComplaintType, setSelectedComplaintType] = useState<ComplaintType | null>(null);

  const { mutateAsync: toggleComplaintTypeStatus, isPending: stateToggleIsPending } = useToggleComplaintTypeStatus();

  const handleStateChange = async () => {
    try {
      await toggleComplaintTypeStatus(selectedComplaintType?.id!);
      setConfirmOpen(false);
      toast.success(t('common.success'));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t('common.unexpectedError');
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ComplaintTypeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-3 w-full">
        <AlertCircle className="w-5 h-5" />
        <p className="text-destructive">{t('common.somethingWentWrong')}</p>
      </div>
    );
  }

  if (!complaintTypes || complaintTypes.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-lg">
        <p className="text-muted-foreground">{t('complaintTypes.empty')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complaintTypes?.map((complaintType) => (
          <ComplaintTypeCard
            key={complaintType?.id}
            complaintType={complaintType}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onStatusChange={(complaintTypeToChange) => {
              setSelectedComplaintType(complaintTypeToChange);
              setConfirmOpen(true);
            }}
          />
        ))}
      </div>
      {/* State change confirmation dialog */}
      <ActionDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('complaintTypes.changeStatus')}
        description={t('complaintTypes.changeStatusConfirm')}
        submitText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onSubmit={handleStateChange}
        isLoading={stateToggleIsPending}
        footer
        contentClassName="max-w-md"
      >
        <p className="text-muted-foreground">
          {t('complaintTypes.statusChangeWarning')}
        </p>
      </ActionDialog>
    </>
  );
};
