
import { useTranslation } from 'react-i18next';
import { useGetFormSubmissionById } from '../hooks/useFormSubmissions';
import type { FormSubmission } from '../types';
import { FormSubmissionSkeleton } from './FormSubmissionSkeleton';

export function FormSubmissionDisplay({ data }: { data: FormSubmission }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: submissionData, isLoading: isLoadingSubmission } = useGetFormSubmissionById(data?.id);
  const report = submissionData?.data;

  console.log(isLoadingSubmission)

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
            </div>

            {/* SCORE */}
            <div className="text-center bg-linear-to-br from-primary/10 to-secondary/10 px-6 py-4 rounded-xl">
              <p className="text-sm text-muted-foreground">{t('formSubmissions.overallScore')}</p>
              <p className="text-4xl font-bold text-primary">
                {report.score}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('formSubmissions.status')}: <span className="text-secondary font-medium">{report.status}</span>
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
          <ReportItem label={t('formSubmissions.createdBy')} value={report.form.created_by.name} />
          <ReportItem label={t('formSubmissions.createdAt')} value={report.form.created_at} />
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
                          {answer ?? '—'}
                        </span>
                      </div>

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
                  className="flex justify-between border border-muted p-3 rounded-md text-sm bg-linear-to-br from-muted/30 to-background"
                >
                  <div>
                    <p className="font-medium text-secondary">
                      {entry.status}
                    </p>
                    <p className="text-muted-foreground">
                      {t('formSubmissions.by')} {entry.changed_by?.name}
                    </p>
                  </div>

                  <p className="text-muted-foreground">
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
  new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');





// export function FormSubmissionDisplay({ data }) {
//   const { i18n } = useTranslation();
//   const isRTL = i18n.language === 'ar';

//   const { data: submissionData } = useGetFormSubmissionById(data?.id);
//   const report = submissionData?.data;

//   if (!report) return null;

//   return (
//     <div className="space-y-8 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

//       {/* ================= HEADER ================= */}
//       <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-secondary rounded-2xl p-6 text-white shadow-2xl">
//         <div className="absolute inset-0 bg-white/5" />

//         <div className="relative flex items-center gap-5">
//           <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
//             <FileText className="w-10 h-10" />
//           </div>

//           <div className="flex-1">
//             <h1 className="text-3xl font-bold">{report.form.name}</h1>
//             <p className="text-white/80">{report.form.description}</p>

//             <div className="flex gap-2 mt-3 flex-wrap">
//               <Badge variant="secondary">{report.status}</Badge>
//               <Badge variant="outline">{report.branch_approval.status}</Badge>
//               <Badge className="bg-white/20 text-white border-white/30">
//                 Score: {report.score}%
//               </Badge>
//             </div>
//           </div>

//           {/* SCORE EMPHASIS */}
//           <div className="text-center">
//             <p className="text-white/70 text-sm">Overall</p>
//             <p className="text-4xl font-bold">{report.score}%</p>
//           </div>
//         </div>
//       </div>

//       {/* ================= QUICK INFO ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

//         <div className="p-5 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 flex gap-4 items-center shadow">
//           <Building2 className="w-8 h-8 text-primary" />
//           <div>
//             <p className="text-sm text-muted-foreground">Kitchen</p>
//             <p className="font-bold">{report.kitchen.name}</p>
//           </div>
//         </div>

//         <div className="p-5 rounded-xl bg-linear-to-br from-secondary/5 to-secondary/10 flex gap-4 items-center shadow">
//           <Calendar className="w-8 h-8 text-secondary" />
//           <div>
//             <p className="text-sm text-muted-foreground">Inspection Date</p>
//             <p className="font-bold">
//               {formatDate(report.inspection_date, isRTL)}
//             </p>
//           </div>
//         </div>

//         <div className="p-5 rounded-xl bg-linear-to-br from-info/5 to-info/10 flex gap-4 items-center shadow">
//           <User className="w-8 h-8 text-info" />
//           <div>
//             <p className="text-sm text-muted-foreground">Inspector</p>
//             <p className="font-bold">{report.submitted_by.name}</p>
//           </div>
//         </div>
//       </div>

//       {/* ================= FORM DETAILS ================= */}
//       <div className="rounded-2xl p-6 bg-linear-to-br from-muted/40 to-muted/10 border shadow-sm">
//         <h2 className="font-semibold text-lg mb-4">Form Details</h2>

//         <div className="grid md:grid-cols-3 gap-4 text-sm">
//           <ReportItem label="Form Type" value={report.form.form_type} />
//           <ReportItem label="User Role" value={report.form.user_role} />
//           <ReportItem label="Questions" value={report.form.questions_count} />
//           <ReportItem label="Sections" value={report.form.sections_count} />
//           <ReportItem label="Created By" value={report.form.created_by.name} />
//           <ReportItem label="Created At" value={report.form.created_at} />
//         </div>
//       </div>

//       {/* ================= SECTIONS ================= */}
//       <div className="space-y-8">
//         <h2 className="text-xl font-semibold border-b pb-2">
//           Inspection Details
//         </h2>

//         {report.form.sections.map((section, sIndex) => (
//           <div
//             key={section.id}
//             className="rounded-2xl border bg-linear-to-br from-background to-muted/30 p-6 shadow-sm space-y-4"
//           >
//             {/* Section Header */}
//             <div>
//               <h3 className="text-lg font-semibold text-primary">
//                 {sIndex + 1}. {section.title}
//               </h3>
//               {section.description && (
//                 <p className="text-sm text-muted-foreground">
//                   {section.description}
//                 </p>
//               )}
//             </div>

//             {/* Questions */}
//             <div className="space-y-3">
//               {section.questions.map((q, qIndex) => {
//                 const answer = getAnswer(q);

//                 return (
//                   <div
//                     key={q.id}
//                     className="p-4 rounded-xl border bg-white/60 backdrop-blur-sm"
//                   >
//                     <p className="font-medium">
//                       {sIndex + 1}.{qIndex + 1} {q.question}
//                     </p>

//                     {/* Answer */}
//                     <div className="mt-2 text-sm flex justify-between items-center">
//                       <span className="text-muted-foreground">
//                         Answer:
//                       </span>

//                       <span className="font-semibold text-primary">
//                         {answer ?? '—'}
//                       </span>
//                     </div>

//                     {/* Score */}
//                     <div className="text-xs text-muted-foreground mt-2">
//                       Score: {q.score_earned} / {q.weight}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= STATUS HISTORY ================= */}
//       {report.status_history?.length > 0 && (
//         <div className="rounded-2xl p-6 border bg-linear-to-br from-muted/40 to-muted/10 shadow-sm">
//           <h2 className="font-semibold mb-4">Status Timeline</h2>

//           <div className="space-y-3">
//             {report.status_history.map((entry, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center p-3 rounded-lg bg-muted/40 border"
//               >
//                 <div>
//                   <Badge>{entry.status}</Badge>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     By: {entry.changed_by?.name}
//                   </p>
//                 </div>

//                 <p className="text-sm text-muted-foreground">
//                   {formatDate(entry.changed_at, isRTL)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= HELPERS ================= */

// const ReportItem = ({ label, value }) => {
//   if (!value) return null;

//   return (
//     <div>
//       <p className="text-muted-foreground">{label}</p>
//       <p className="font-medium">{value}</p>
//     </div>
//   );
// };

// const getAnswer = (q) => {
//   switch (q.question_type) {
//     case 'text':
//       return q.answer_text;
//     case 'number':
//       return q.answer_number;
//     case 'boolean':
//       return q.answer_boolean ? 'Yes' : 'No';
//     default:
//       return q.answer_text;
//   }
// };

// const formatDate = (date, isRTL) =>
//   new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
