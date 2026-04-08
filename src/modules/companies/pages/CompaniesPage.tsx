import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Company } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { CompanyFormDialog } from '../components/CompanyFormDialog';
import { useDialogState } from '@/hooks/useDialogState';
import { DeleteCompanyDialog } from '../components/DeleteCompanyDialog';
import { CompanyDialog } from '../components/CompanyDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { CompanyDisplay } from '../components/CompanyDisplay';
import { Pagination } from '@/components/ui/pagination';
import { Plus } from 'lucide-react';
import { useGetCompanies } from '../hooks/useCompay';
import { RoleGuard } from '@/app/router/RoleGuard';


export const CompaniesPage: React.FC = () => {
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
  } = useDialogState<Company>();

  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // filtring system
  const filters = React.useMemo(() => ({
    search: debouncedSearch,
    page: currentPage,
  }), [debouncedSearch, currentPage]);
  
  const { data: companiesData, isLoading: isCompaniesLoading, error: companiesError } = useGetCompanies(filters);
  
  const pagination = companiesData?.pagination
  const totalPages = pagination?.total_pages ?? 0;


  // Handlers
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
        title={t('companies.title')}
        description={t('companies.subtitle')}
      />

      {/* Toolbar / Search */}
      <SearchToolbar
        value={searchTerm}
        placeholder={t('companies.searchPlaceholder')}
        onChange={handleSearchChange}
        action={
          <RoleGuard allowedRoles={['system_manager']}>
            <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
              <Plus className="me-2 h-4 w-4" />
              {t('companies.addCompany')}
            </Button>
          </RoleGuard>
        }
      />

      <CompanyDisplay
        companies={companiesData?.data || []}
        isLoading={isCompaniesLoading}
        error={companiesError}
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
          isLoading={isCompaniesLoading}
        />
      )}

      {/* Create/Edit Company Dialog */}
      <CompanyFormDialog
        open={dialog?.type === 'create' || dialog?.type === 'edit'}
        onOpenChange={(open) => !open && close()}
        itemToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCompanyDialog
        open={dialog?.type === 'delete'}
        companyId={dialog?.type === 'delete' ? dialog.item?.id : null}
        onClose={close}
      />

      {/* Branches Dialog */} 
      <CompanyDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        company={dialog?.type === 'view' ? dialog.item : null}
      />
    </div>
  );
};

