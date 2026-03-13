import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import type { Company } from '../types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchToolbar } from '@/components/dashboard/SearchToolbar';
import { CompanyFormDialog } from '../components/CompanyFormDialog';
import { useDialogState } from '@/hooks/useDialogState';
import { CompanyAPI } from '../api/company.api';
import { DeleteCompanyDialog } from '../components/DeleteCompanyDialog';
import { BranchDialog } from '../components/BranchDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { CompanyDisplay } from '../components/CompanyDisplay';
import { Pagination } from '@/components/ui/pagination';
import { Plus } from 'lucide-react';


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
  
  // get companies
  const { data: companiesData, isLoading: isCompaniesLoading, error: companiesError } = useQuery({
    queryKey: ['companies', filters],
    queryFn: () => CompanyAPI.getCompanies(filters),
  });
  
  const pagination = companiesData?.pagination
  const totalPages = pagination?.total_pages ?? 0;

  // company id for branches
  const companyId = dialog?.type === 'view' ? dialog.id : undefined;

  // get branches
  const { data: branches = [], isLoading: isBranchesLoading } = useQuery({
    queryKey: ['branches', companyId],
    queryFn: () => CompanyAPI.getBranches(companyId!),
    enabled: !!companyId,
  });

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
          <Button className="px-6 hover:bg-primary/80" onClick={openCreate}>
            <Plus className="me-2 h-4 w-4" />
            {t('companies.addCompany')}
          </Button>
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
        companyToEdit={dialog?.type === 'edit' ? dialog.item : null}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCompanyDialog
        open={dialog?.type === 'delete'}
        companyId={dialog?.type === 'delete' ? dialog.id : null}
        onClose={close}
      />

      {/* Branches Dialog */}
      <BranchDialog
        open={dialog?.type === 'view'}
        branches={branches}
        isLoading={isBranchesLoading}
        onClose={close}
      />
    </div>
  );
};

