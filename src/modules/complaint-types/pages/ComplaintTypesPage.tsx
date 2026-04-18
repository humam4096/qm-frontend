import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { ComplaintType } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { ComplaintTypeFormDialog } from '../components/ComplaintTypeFormDialog';
import { useDialogState } from '@/hooks/useDialogState';
import { DeleteComplaintTypeDialog } from '../components/DeleteComplaintTypeDialog';
import { ComplaintTypeDialog } from '../components/ComplaintTypeDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { ComplaintTypeDisplay } from '../components/ComplaintTypeDisplay';
import { Pagination } from '@/components/ui/pagination';
import { Plus } from 'lucide-react';
import { useGetComplaintTypes } from '../hooks/useComplaintTypes';
import { RoleGuard } from '@/app/router/RoleGuard';

export const ComplaintTypesPage: React.FC = () => {
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
  } = useDialogState<ComplaintType>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const filters = React.useMemo(() => ({
    search: debouncedSearch,
    page: currentPage,
  }), [debouncedSearch, currentPage]);
  
  const { data: complaintTypesData, isLoading, error } = useGetComplaintTypes(filters);
  
  const pagination = complaintTypesData?.pagination;
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
      {/* Header Area */}
      <PageHeader
        title={t('complaintTypes.title')}
        description={t('complaintTypes.subtitle')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('complaintTypes.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <RoleGuard allowedRoles={['system_manager']}>
            <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
              <Plus className="me-2 h-4 w-4" />
              {t('complaintTypes.addComplaintType')}
            </Button>
          </RoleGuard>
        }
      />

      <ComplaintTypeDisplay
        complaintTypes={complaintTypesData?.data || []}
        isLoading={isLoading}
        error={error}
        onEdit={openEdit}
        onView={openView}
        onDelete={openDelete}
      />

      {/* Pagination Container */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Create/Edit Dialog */}
      {(dialog?.type === 'create' || dialog?.type === 'edit') && 
        <ComplaintTypeFormDialog
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open) => !open && close()}
        itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />}

      {/* Delete Confirmation Dialog */}
      {dialog?.type === 'delete' && 
        <DeleteComplaintTypeDialog
        open={dialog?.type === 'delete'}
        complaintTypeId={dialog?.type === 'delete' ? dialog.item?.id : null}
        onClose={close}
      />}

      {/* View Dialog */}
      {dialog?.type === 'view' && 
        <ComplaintTypeDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        complaintType={dialog?.type === 'view' ? dialog.item : null}
      />}
    </div>
  );
};
