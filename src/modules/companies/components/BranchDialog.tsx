import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BranchCard } from '../components/BranchCard';
import { BranchCardSkeleton } from '../components/BranchCardSkeleton';
import type { Branch } from '../types';
import { useTranslation } from 'react-i18next';

interface BranchDialogProps {
  open: boolean;
  branches: Branch[];
  isLoading: boolean;
  onClose: () => void;
}

export const BranchDialog: React.FC<BranchDialogProps> = ({
  open,
  branches,
  isLoading,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{t('companies.branches')}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <BranchCardSkeleton key={i} />
            ))}
          </div>
        ) : branches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pl-2">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t('companies.noBranches')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};