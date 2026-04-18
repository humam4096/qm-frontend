import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { InspectionStage } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { InspectionStageFormDialog } from '../components/InspectionStageFormDialog';
import { useDialogState } from '@/hooks/useDialogState';
import { DeleteInspectionStageDialog } from '../components/DeleteInspectionStageDialog';
import { InspectionStageDialog } from '../components/InspectionStageDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { InspectionStageDisplay } from '../components/InspectionStageDisplay';
import { Pagination } from '@/components/ui/pagination';
import { Plus } from 'lucide-react';
import { useGetInspectionStages } from '../hooks/useInspectionStages';
import { RoleGuard } from '@/app/router/RoleGuard';

export const InspectionStagesPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    dialog,
    openCreate,
    openEdit,
    openDelete,
    openView,
    close
  } = useDialogState<InspectionStage>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const filters = React.useMemo(() => ({
    search: debouncedSearch,
    page: currentPage,
  }), [debouncedSearch, currentPage]);
  
  const { data: stagesData, isLoading, error } = useGetInspectionStages(filters);
  
  const pagination = stagesData?.pagination;
  const totalPages = pagination?.total_pages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <PageHeader
        title={t('inspectionStages.title')}
        description={t('inspectionStages.subtitle')}
      />

      {/* Search Toolbar */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('inspectionStages.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <RoleGuard allowedRoles={['system_manager']}>
            <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
              <Plus className="me-2 h-4 w-4" />
              {t('inspectionStages.addStage')}
            </Button>
          </RoleGuard>
        }
      />

      {/* Stages List */}
      <InspectionStageDisplay
        stages={stagesData?.data || []}
        isLoading={isLoading}
        error={error}
        onEdit={openEdit}
        onView={openView}
        onDelete={openDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Form Dialogs */}
      {(dialog?.type === 'create' || dialog?.type === 'edit') && 
        <InspectionStageFormDialog
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open) => !open && close()}
        itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />}

      {/* Delete Dialog */} 
      {dialog?.type === 'delete' && 
        <DeleteInspectionStageDialog
        open={dialog?.type === 'delete'}
        stage={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />}

      {/* View Dialog */}
      {dialog?.type === 'view' && 
        <InspectionStageDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        stage={dialog?.type === 'view' ? dialog.item : null}
      />}
    </div>
  );
};
