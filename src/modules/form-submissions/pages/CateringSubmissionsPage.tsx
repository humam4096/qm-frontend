import { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Eye, Plus, SquareCheckBig } from 'lucide-react';
import { useDialogState } from '@/hooks/useDialogState';
import { useGetFormSubmissions } from '../hooks/useFormSubmissions';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { RowActions } from '@/components/ui/row-actions';
import { Badge } from '@/components/ui/badge';
import { useAdvancedFilters } from '@/hooks/filter-systerm/useAdvancedFilters';
import { AdvancedFilterSystem } from '@/components/dashboard/AdvancedFilterSystem';
import { buildActiveFilters } from '@/hooks/filter-systerm/buildActiveFilters';
import type { FormSubmission } from '../types';
import { DeleteFormSubmissionDialog } from '../components/DeleteFormSubmissionDialog';
import { RoleGuard } from '@/app/router/RoleGuard';
// import { useFormRunner } from '../context/FormRunnerContext';
import { FormSubmissionModal } from '../components/FormSubmissionModal';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/useAuthStore';
import { FormSubmissionDialog } from '../components/FormSubmissionDialog';
import { UpdateSubmissionDialog } from '../components/UpdateSubmissionDialog';
import type { UserRole } from '@/modules/users/types';
import { useLazyFetchData } from '@/hooks/useLazyFetchData';
import { KitchenAPI } from '@/modules/kitchens/api/kitchens.api';

export function CateringSubmissionsPage() {
  const { t } = useTranslation();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const { dialog, openDelete, close, openView, openEdit } = useDialogState<FormSubmission>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isSystemManager = user?.role === 'system_manager';

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    page,
    setPage,
    apiFilters,
  } = useAdvancedFilters();

  const { data: submissionsData, isLoading } = useGetFormSubmissions({...apiFilters, form_type: 'readiness_assessment'});

  const { data: kitchensData } = useLazyFetchData({
    queryKey: ['kitchens-list'],
    queryFn: KitchenAPI.getKitchensList,
    isOpen: isFilterPanelOpen,
  });

  const submissions = submissionsData?.data ?? [];
  const pagination = submissionsData?.pagination;

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);


  const filterConfigs = useMemo(
    () => [
      {
        key: 'kitchen_id',
        label: t('nav.kitchens'),
        placeholder: t('formSubmissions.selectKitchen'),
        options: (kitchensData?.data || []).map(kitchen => ({
          value: kitchen.id,
          label: kitchen.name,
        }))
      },
    ],
    [t, kitchensData]
  );

  const activeFilters = useMemo(
    () => buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  );

  const allowdRoleFormUpdate: Record<string, UserRole> = {
    "under_supervisor_review": "quality_supervisor",
    "under_quality_manager_review": "quality_manager",
  }

  const columns = useMemo<ColumnDef<FormSubmission>[]>(() => {
    const baseColumns: ColumnDef<FormSubmission>[] = [
      {
        header: '#',
        className: 'w-12 text-center text-muted-foreground font-medium',
        cell: (_, index) => index + 1,
      },
      {
        header: t('formSubmissions.form'),
        accessorKey: 'form',
        cell: (submission) => (
          <div className="font-medium">{submission.form.name}</div>
        ),
      },
      {
        header: t('formSubmissions.kitchen'),
        accessorKey: 'kitchen',
        cell: (submission) => (
          <div className="text-muted-foreground">
            {submission.kitchen.name}
          </div>
        ),
      },
      {
        header: t('formSubmissions.time'),
        accessorKey: 'time.label' as keyof FormSubmission,
        cell: (submission) => (
          <div className="text-muted-foreground">
            {submission?.time?.label ? `${new Date(submission.inspection_date).toLocaleDateString()} - ${submission?.time?.label}` : t('forms.readinessAssessment')}
          </div>
        ),
      },
      {
        header: t('formSubmissions.status'),
        accessorKey: 'status',
        cell: (submission) => {
      
          return (
            <Badge variant={"outline"}>
              {t(`formSubmissions.${submission.status}`)}
            </Badge>
          );
        },
      },
      {
        header: t('formSubmissions.score'),
        accessorKey: 'score',
        cell: (submission) => (
          <Badge className={`${
            submission.score >= 80 ? 'text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20' :
            submission.score >= 60 ? 'text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700 dark:bg-yellow-900/20' :
            'text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-700 dark:bg-red-900/20'
          }`} variant={"outline"}>
            {submission.score}%
          </Badge>
        ),
      },
    ];

    if (isSystemManager) {
      baseColumns.push({
        header: t('formSubmissions.branchApproval'),
        accessorKey: 'branch_approval',
        cell: (submission) => {
          return (
            <Badge className={`${
              submission.branch_approval === 'accepted' ? 'text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-900/20' : 
              submission.branch_approval === 'pending' ? 'text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700 dark:bg-yellow-900/20' : 
              'text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-700 dark:bg-red-900/20'}`} 
              variant={"outline"}
              >
              {t(`formSubmissions.${submission.branch_approval}`)}
            </Badge>
          );
        },
      });
    }
    
    baseColumns.push({
      header: t('formSubmissions.actions'),
      className: 'text-left rtl:text-right',
      cell: (submission) => {
        const allowedUser = allowdRoleFormUpdate[submission?.status]
        
        return (
          <RowActions
            row={submission}
            actions={[
              {
                icon: Eye,
                variant: 'view',
                onClick: (row) => openView(row),
              },
              {
                icon: SquareCheckBig,
                variant: 'edit',
                onClick: (row) => openEdit(row),
                allowedRoles: allowedUser && [allowedUser] || [],
              },
            ]}
          />
        )
        
      },
    });

    return baseColumns;
  }, [t, openDelete, isSystemManager]);

  return (
    
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <PageHeader
        title={t('formSubmissions.title')}
        description={t('formSubmissions.subtitle')}
      />

      <AdvancedFilterSystem
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={setFilter}
        onFilterRemove={removeFilter}
        onClearAllFilters={clearFilters}
        onFilterPanelChange={setIsFilterPanelOpen}
        action={
          <RoleGuard allowedRoles={['system_manager', "quality_inspector", "project_manager"]}>
            <Button className="px-6 hover:bg-primary/80" onClick={() => navigate('/form-submissions/new', {replace: true})}>
              <Plus className="me-2 h-4 w-4" />
              {t('formSubmissions.createSubmission')}
            </Button>
          </RoleGuard>
        }
      />

      <DataTable
        columns={columns}
        data={submissions}
        isLoading={isLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('formSubmissions.empty')}
      />

      {dialog?.type === 'view' && 
        <FormSubmissionDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        form={dialog?.type === 'view' ? dialog.item : null}
      />}
      
      {dialog?.type === 'delete' && 
        <DeleteFormSubmissionDialog
        open={dialog?.type === 'delete'}
        submission={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />}

      {dialog?.type === 'edit' && 
        <UpdateSubmissionDialog
        open={dialog?.type === 'edit'}
        onOpenChange={(open) => !open && close()}
        form={dialog?.type === 'edit' ? dialog.item : null}
      />}

      <FormSubmissionModal />
    </div>
  );
}
