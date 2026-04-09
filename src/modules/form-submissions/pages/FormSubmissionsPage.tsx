import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Eye, Plus, Trash2 } from 'lucide-react';
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
import { useKitchensList } from '@/modules/kitchens/hooks/useKitchens';
import { useGetFormsList } from '@/modules/forms/hooks/useForms';
import { FormSubmissionDialog } from '../components/FormSubmissionDialog';

export function FormSubmissionsPage() {
  const { t } = useTranslation();

  const { dialog, openDelete, close, openView } = useDialogState<FormSubmission>();
  // const { setIsOpen } = useFormRunner();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isProjectManager = user?.role === 'project_manager';

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

  const { data: submissionsData, isLoading } = useGetFormSubmissions(apiFilters);
  const { data: kitchensData } = useKitchensList();
  const { data: formsData } = useGetFormsList();

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
      {
        key: 'form_id',
        label: t('nav.forms'),
        placeholder: t('forms.selectForm'),
        options: (formsData?.data || []).map(form => ({
          value: form.id,
          label: form.name,
        }))
      },
      {
        key: 'form_type',
        label: t('formSubmissions.formType'),
        options: [
          { value: 'readiness_assessment', label: t('forms.readinessAssessment') },
          { value: 'report', label: t('forms.report') },
        ],
      },
      {
        key: 'status',
        label: t('formSubmissions.status'),
        options: [
          { value: 'under_supervisor_review', label: t('formSubmissions.underSupervisorReview') },
          { value: 'under_manager_review', label: t('formSubmissions.underManagerReview') },
          { value: 'submitted', label: t('formSubmissions.submitted') },
          { value: 'approved', label: t('formSubmissions.approved') },
          { value: 'rejected', label: t('formSubmissions.rejected') },
        ],
      },
    ],
    [t, kitchensData, formsData]
  );

  const activeFilters = useMemo(
    () => buildActiveFilters(filters, filterConfigs),
    [filters, filterConfigs]
  );

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
        header: t('formSubmissions.inspectionDate'),
        accessorKey: 'inspection_date',
        cell: (submission) => (
          <div className="text-muted-foreground">
            {new Date(submission.inspection_date).toLocaleDateString()}
          </div>
        ),
      },
      {
        header: t('formSubmissions.formType'),
        accessorKey: 'form_type',
        cell: (submission) => (
          <div className="text-muted-foreground">
            {t(`forms.builder.${submission.form_type}`)}
          </div>
        ),
      },
      {
        header: t('formSubmissions.score'),
        accessorKey: 'score',
        cell: (submission) => (
          <Badge variant={submission.score >= 80 ? 'default' : 'destructive'}>
            {submission.score}%
          </Badge>
        ),
      },
      {
        header: t('formSubmissions.status'),
        accessorKey: 'status',
        cell: (submission) => {
          const statusMap: Record<string, string> = {
            under_supervisor_review: 'warning',
            under_manager_review: 'info',
            approved: 'success',
            rejected: 'destructive',
          };
          return (
            <Badge variant={statusMap[submission.status] as any}>
              {t(`formSubmissions.${submission.status}`)}
            </Badge>
          );
        },
      },
    ];

    if (!isProjectManager) {
      baseColumns.push({
        header: t('formSubmissions.branchApproval'),
        accessorKey: 'branch_approval',
        cell: (submission) => {
          const approvalMap: Record<string, string> = {
            pending: 'warning',
            approved: 'success',
            rejected: 'destructive',
          };
          return (
            <Badge variant={approvalMap[submission.branch_approval] as any}>
              {t(`formSubmissions.${submission.branch_approval}`)}
            </Badge>
          );
        },
      });
    }
    
    baseColumns.push({
      header: t('formSubmissions.actions'),
      className: 'text-left rtl:text-right',
      cell: (submission) => (
        <RowActions
          row={submission}
          actions={[
            {
              icon: Eye,
              variant: 'view',
              // link: `/form-submissions/${submission.id}`,
              onClick: (row) => openView(row),
            },
            {
              icon: Trash2,
              variant: 'destructive',
              onClick: (row) => openDelete(row),
              allowedRoles: ['system_manager'],
            },
          ]}
        />
      ),
    });

    return baseColumns;
  }, [t, openDelete, isProjectManager]);

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
        action={
          <RoleGuard allowedRoles={['system_manager', "quality_inspector", "project_manager"]}>
            {/* <Button className="px-6 hover:bg-primary/80" onClick={() => setIsOpen(true)}> */}
            <Button className="px-6 hover:bg-primary/80" onClick={() => navigate('/form-submissions/new', {replace: true})}>
              <Plus className="me-2 h-4 w-4" />
              {t('formSubmissions.createSubmission')}
            </Button>
          </RoleGuard>
        }
      />

      <FormSubmissionModal />

      <DataTable
        columns={columns}
        data={submissions}
        isLoading={isLoading}
        currentPage={pagination?.current_page || page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={handlePageChange}
        emptyMessage={t('formSubmissions.empty')}
      />

      <FormSubmissionDialog
        open={dialog?.type === 'view'}
        onOpenChange={(open) => !open && close()}
        form={dialog?.type === 'view' ? dialog.item : null}
      />
      
      <DeleteFormSubmissionDialog
        open={dialog?.type === 'delete'}
        submission={dialog?.type === 'delete' ? dialog.item : null}
        onClose={close}
      />
    </div>
  );
}
