
import { useTranslation } from 'react-i18next';
import { useGetFormSubmissionById } from '../hooks/useFormSubmissions';
import { FormSubmissionSkeleton } from './FormSubmissionSkeleton';

export function FormSubmissionDisplay({ data }: { data: {id: string} }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: submissionData, isLoading: isLoadingSubmission } = useGetFormSubmissionById(data?.id);
  const report = submissionData?.data;

  const getAnswer = (q: any) => {
    switch (q.question_type) {
      case 'text':
        return q.answer_text;
      case 'number':
        return q.answer_number;
      case 'boolean':
        return q.answer_boolean ? t('formSubmissions.yes') : t('formSubmissions.no');
      default:
        return q.answer_text;
    }
  };

  if (isLoadingSubmission) return <FormSubmissionSkeleton />;
  if (!report) return null;

  return (
    <>
      <div
        className="max-w-5xl mx-auto bg-linear-to-br from-background to-muted/30 p-8 space-y-10 rounded-2xl shadow"
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        {/* ================= HEADER ================= */}
        <div className="border-b border-primary/20 pb-6 space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            {report.form.name}
          </h1>
          <p className="text-muted-foreground">
            {report.form.description}
          </p>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong className="text-primary">{t('formSubmissions.kitchen')}:</strong> {report.kitchen.name}</p>
              <p><strong className="text-secondary">{t('formSubmissions.inspector')}:</strong> {report.submitted_by.name}</p>
              <p><strong className="text-info">{t('formSubmissions.date')}:</strong> {formatDate(report.inspection_date, isRTL)}</p>
              <p><strong className="text-info">{t('formSubmissions.time')}:</strong> {report.time?.label}</p>
            </div>

            {/* SCORE */}
            <div className="text-center bg-linear-to-br from-primary/10 to-secondary/10 px-6 py-4 rounded-xl">
              <p className="text-sm text-muted-foreground">{t('formSubmissions.overallScore')}</p>
              <p className="text-4xl font-bold text-primary">
                {report.score}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('formSubmissions.status')}: <span className="text-secondary font-medium">{t(`formSubmissions.${report.status}`)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <ReportItem label={t('formSubmissions.formType')} value={report.form.form_type} />
          <ReportItem label={t('formSubmissions.userRole')} value={report.form.user_role} />
          <ReportItem label={t('formSubmissions.questions')} value={report.form.questions_count} />
          <ReportItem label={t('formSubmissions.sections')} value={report.form.sections_count} />
          {/* <ReportItem label={t('formSubmissions.createdBy')} value={report.form.created_by.name} /> */}
          {/* <ReportItem label={t('formSubmissions.createdAt')} value={report.form.created_at} /> */}
        </div>

        {/* ================= APPROVAL ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-warning/30 rounded-lg p-4 bg-linear-to-br from-warning/5 to-warning/10">
            <h2 className="font-semibold mb-2 text-warning">{t('formSubmissions.branchApproval')}</h2>
            <p>
              <strong>{t('formSubmissions.status')}:</strong>{' '}
              <span className="text-warning font-medium">
                {report.branch_approval}
              </span>
            </p>

            {report.branch_approval_notes && (
              <p className="mt-2 text-muted-foreground">
                {report.branch_approval_notes}
              </p>
            )}
          </div>

          <div className="border border-info/30 rounded-lg p-4 bg-linear-to-br from-info/5 to-info/10">
            <h2 className="font-semibold mb-2 text-info">
              {t('formSubmissions.branchApprovalNotes')}
            </h2>
            <p><strong>{t('formSubmissions.note')}:</strong> {report.branch_approval_notes}</p>

            {report.branch_approval_notes && (
              <p className="mt-2 text-muted-foreground">
                {report.branch_approval_notes}
              </p>
            )}
          </div>
        </div>

        {/* ================= SECTIONS ================= */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold border-b border-primary/20 pb-2 text-primary">
            {t('formSubmissions.inspectionDetails')}
          </h2>

          {report.form.sections.map((section, sIndex) => (
            <div key={section.id} className="space-y-4">

              {/* Section Title */}
              <div>
                <h3 className="text-lg font-semibold text-secondary">
                  {sIndex + 1}. {section.title}
                </h3>
                {section.description && (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.questions.map((q, qIndex) => {
                  const answer = getAnswer(q);
                  const optionAnswer = q.options.filter(option => option.is_selected).map(option => option.option).join(', ');
                  const hasNotes = q.answer_notes && q.answer_notes.trim() !== '';

                  return (
                    <div
                      key={q.id || qIndex}
                      className="border border-muted rounded-md p-4 bg-linear-to-br from-background to-muted/40 transition"
                    >
                      <p className="font-medium">
                        {sIndex + 1}.{qIndex + 1} {q.question}
                      </p>

                      {/* Answer */}
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">{t('formSubmissions.answer')}: </span>
                        <span className="font-medium text-primary">
                          {answer || optionAnswer}
                        </span>
                      </div>

                      {/* Answer Notes */}
                      {hasNotes && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
                            <div className="shrink-0 mt-0.5">
                              <svg className="h-4 w-4 text-amber-600 dark:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                                {t('formSubmissions.notesLabel')}
                              </span>
                              <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                                {q.answer_notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Score */}
                      <div className="text-xs text-muted-foreground mt-2">
                        {t('formSubmissions.score')}:{' '}
                        <span className="text-secondary font-medium">
                          {q.score_earned} / {q.weight}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ================= STATUS HISTORY ================= */}
       {report.status_history?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold border-b border-primary/20 pb-2 mb-4 text-primary">
              {t('formSubmissions.statusTimeline')}
            </h2>

            <div className="space-y-3">
              {report.status_history.map((entry, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-4 border border-muted p-3 rounded-md text-sm bg-linear-to-br from-muted/30 to-background"
                >
                  {/* LEFT */}
                  <div className="space-y-1">
                    <p className="font-medium text-secondary">
                      {entry.status}
                    </p>

                    <p className="text-muted-foreground">
                      {t('formSubmissions.by')} {entry.changed_by?.name}
                    </p>

                    {/* ✅ NOTES */}
                    {entry.notes && entry.notes?.trim() && (
                      <div className='flex gap-4 items-center'>
                        <p className="text-muted-foreground">
                          {t('common.notes')}:
                        </p>
                        <p className="text-xs text-teal-700 italic bg-muted/40 px-2 py-1 rounded">
                          {entry.notes}
                        </p>
                      </div>
                    )}
                    
                  </div>

                  {/* RIGHT (DATE) */}
                  <p className="text-muted-foreground whitespace-nowrap">
                    {formatDate(entry.changed_at, isRTL)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="pt-6 border-t border-primary/20 text-xs text-muted-foreground text-center">
          {t('formSubmissions.generatedReport')} • {new Date().toLocaleString()}
        </div>
      </div>
    </>
  );
}

const ReportItem = ({ label, value }: { label: string, value: string | number }) => {
  if (!value) return null;

  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const formatDate = (date: string, isRTL: boolean) =>
  new Date(date).toLocaleString(isRTL ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });