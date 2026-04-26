import { useTranslation } from 'react-i18next';
import type { Form } from '@/modules/forms/types';
import type { Answer } from '../types';
import { QuestionRenderer } from './QuestionRenderer';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface FormRendererProps {
  form: Form;
  answers: Answer[];
  onAnswerChange: (answer: Answer) => void;
}

// Helper function to check if a question is answered
const isQuestionAnswered = (answer: Answer | undefined): boolean => {
  if (!answer) return false;
  // Check text answer
  if (answer.answer_text && answer.answer_text.trim() !== '') return true;
  // Check number answer (including 0)
  if (answer.answer_number !== undefined && answer.answer_number !== null) return true;
  // Check boolean answer (including false)
  if (answer.answer_boolean !== undefined && answer.answer_boolean !== null) return true;
  // Check selected options
  if (answer.selected_options && answer.selected_options.length > 0) return true;
  return false;
};

export function FormRenderer({ form, answers, onAnswerChange }: FormRendererProps) {
  const { t } = useTranslation();

  // Calculate answered questions
  const totalQuestions = form?.sections.reduce((acc, section) => acc + section.questions.length, 0) || 0;
  const answeredQuestions = answers.filter(isQuestionAnswered).length;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Form Header - Questionnaire Style */}
      <div className="hidden md:block rounded-lg md:rounded-xl bg-linear-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="p-2 md:p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <FileText className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
              {form?.name}
            </h2>
            {form?.description && (
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {form?.description}
              </p>
            )}
            
            {/* Metadata Pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {form?.form_type && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/80 border border-border/50 text-xs font-medium">
                  <span className="text-muted-foreground">{t('formSubmissions.type')}:</span>
                  <span className="text-foreground">{form.form_type}</span>
                </span>
              )}
              {form?.inspection_stage?.name && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/80 border border-border/50 text-xs font-medium">
                  <span className="text-muted-foreground">{t('formSubmissions.stage')}:</span>
                  <span className="text-foreground">{form.inspection_stage.name}</span>
                </span>
              )}
              {form?.user_role && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/80 border border-border/50 text-xs font-medium">
                  <span className="text-muted-foreground">{t('formSubmissions.userRole')}:</span>
                  <span className="text-foreground">{form.user_role}</span>
                </span>
              )}
            </div>

            {/* Progress Summary */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border/50">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {answeredQuestions} / {totalQuestions}
                </span>
                <span className="text-muted-foreground">
                  {t('formSubmissions.questionsAnswered')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections - Questionnaire Style */}
      {form?.sections.map((section, sectionIndex) => {
        const sectionAnswers = section.questions.filter(q => {
          const answer = answers.find(a => a.question_id === q.id);
          return isQuestionAnswered(answer);
        }).length;

        return (
          <div
            key={section?.id}
            className="rounded-lg md:rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden"
          >
            {/* Section Header */}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-muted/30 dark:bg-muted/10 border-b border-border/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm shrink-0">
                    {sectionIndex + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-foreground truncate">
                      {section?.title}
                    </h3>
                    {section?.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {section?.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border border-border/50 shrink-0">
                  <span className="text-xs font-semibold text-foreground">
                    {sectionAnswers}/{section.questions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-5">
              {section?.questions.map((question, questionIndex) => {
                const value = answers.find(a => a?.question_id === question?.id);
                const isAnswered = isQuestionAnswered(value);

                // Determine risk level color based on notes
                const getRiskColor = (notes?: string) => {
                  if (!notes) return 'gray';
                  if (notes === 'منخفض الخطورة') return 'green';
                  if (notes === 'عالي الخطورة') return 'red';
                  if (notes === 'متوسط الخطورة') return 'yellow';
                  return 'gray';
                };

                const riskColor = getRiskColor(question?.notes);

                // Color classes based on risk level
                const getRiskClasses = () => {
                  switch (riskColor) {
                    case 'green':
                      return {
                        border: isAnswered ? 'border-green-500/30' : 'border-green-500/20',
                        bg: 'bg-green-500/[0.03]',
                        numberBg: isAnswered ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-green-500/10 text-green-600 dark:text-green-500',
                        iconColor: 'text-green-600 dark:text-green-500',
                        divider: 'border-green-500/20'
                      };
                    case 'red':
                      return {
                        border: isAnswered ? 'border-red-500/30' : 'border-red-500/20',
                        bg: 'bg-red-500/[0.03]',
                        numberBg: isAnswered ? 'bg-red-500/15 text-red-700 dark:text-red-400' : 'bg-red-500/10 text-red-600 dark:text-red-500',
                        iconColor: 'text-red-600 dark:text-red-500',
                        divider: 'border-red-500/20'
                      };
                    case 'yellow':
                      return {
                        border: isAnswered ? 'border-yellow-500/30' : 'border-yellow-500/20',
                        bg: 'bg-yellow-500/[0.03]',
                        numberBg: isAnswered ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500',
                        iconColor: 'text-yellow-600 dark:text-yellow-500',
                        divider: 'border-yellow-500/20'
                      };
                    default:
                      return {
                        border: isAnswered ? 'border-primary/20' : 'border-border/40',
                        bg: isAnswered ? 'bg-primary/[0.02]' : 'bg-card',
                        numberBg: isAnswered ? 'bg-primary/10 text-primary' : 'bg-muted/60 text-muted-foreground',
                        iconColor: 'text-primary/70',
                        divider: 'border-border/30'
                      };
                  }
                };

                const riskClasses = getRiskClasses();

                return (
                  <div 
                    key={question?.id} 
                    className={cn(
                      "relative rounded-lg border transition-all duration-200 overflow-hidden",
                      riskClasses.border,
                      riskClasses.bg,
                      !isAnswered && riskColor === 'gray' && "hover:border-border/60"
                    )}
                  >
                    {/* Question Header */}
                    <div className="px-4 md:px-5 py-3.5 md:py-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex items-center justify-center min-w-[24px] w-6 h-6 rounded-full text-xs font-semibold shrink-0 transition-colors",
                          riskClasses.numberBg
                        )}>
                          {questionIndex + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col items-start  justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                                {question?.question}
                                {question?.is_required && (
                                  <span className="text-destructive/70 text-sm ml-1" title="Required">*</span>
                                )}
                              </h4>
                              
                              {isAnswered && (
                                <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", riskClasses.iconColor)} />
                              )}
                            </div>
                          {/* Question Notes/Help - Show risk level badge */}
                          {question?.notes && (
                            <div className="mt-2 flex items-start gap-2">
                              <div className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                riskColor === 'green' && "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
                                riskColor === 'red' && "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
                                riskColor === 'yellow' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
                                riskColor === 'gray' && "bg-muted/50 text-muted-foreground border-border/50"
                              )}>
                                <HelpCircle className="h-3 w-3" />
                                <span>{question?.notes}</span>
                              </div>
                            </div>
                          )}
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Subtle Divider */}
                    <div className="px-4 md:px-5">
                      <div className={cn("border-t", riskClasses.divider)} />
                    </div>

                    {/* Answer Section */}
                    <div className="px-4 md:px-5 py-3.5 md:py-4">
                      <QuestionRenderer
                        question={question}
                        value={value}
                        onChange={onAnswerChange}
                      />
                      
                      {/* Required Warning */}
                      {question?.is_required && !isAnswered && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
                          <AlertCircle className="h-3 w-3" />
                          <span>{t('formSubmissions.requiredField')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
