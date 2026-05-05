import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormQuestion } from '@/modules/forms/types';
import type { Answer } from '../types';
import { cn } from '@/lib/utils';
import { Check, MessageSquare, X } from 'lucide-react';

interface QuestionRendererProps {
  question: FormQuestion;
  value: Answer | undefined;
  onChange: (answer: Answer) => void;
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const { t } = useTranslation();
  const [showNotes, setShowNotes] = useState(false);

  const handleTextChange = (text: string) =>
    onChange({ ...value, question_id: question.id, answer_text: text });

  const handleNumberChange = (num: string) =>
    onChange({ ...value, question_id: question.id, answer_number: num ? parseFloat(num) : undefined });

  const handleBooleanChange = (checked: boolean) =>
    onChange({ ...value, question_id: question.id, answer_boolean: checked });

  const handleSingleSelectChange = (optionId: string) =>
    onChange({ ...value, question_id: question.id, selected_options: [optionId] });

  const handleMultiSelectChange = (optionId: string) => {
    const currentSelections = value?.selected_options || [];
    const isSelected = currentSelections.includes(optionId);
    
    const updatedSelections = isSelected
      ? currentSelections.filter(id => id !== optionId)
      : [...currentSelections, optionId];
    
    onChange({ ...value, question_id: question.id, selected_options: updatedSelections });
  };

  const handleNotesChange = (notes: string) => {
    onChange({ ...value, question_id: question.id, notes: notes || undefined });
  };

  const hasNotes = value?.notes && value.notes.trim() !== '';

  const renderNotesSection = () => (
    <>
      {/* Notes Toggle Button */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "border focus:outline-none focus:ring-2 focus:ring-primary/20",
            hasNotes || showNotes
              ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15"
              : "bg-muted/30 text-foreground border-border hover:bg-muted/50 hover:border-border/80"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{t('formSubmissions.addNotes')}</span>
          {hasNotes && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {value?.notes?.length || 0}
            </span>
          )}
        </button>
      </div>

      {/* Notes Input Area */}
      {showNotes && (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              {t('formSubmissions.notesLabel')}
            </label>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <textarea
            className={cn(
              "w-full min-h-[60px] p-2 rounded-lg",
              "bg-background/80 dark:bg-background/50 border-2 border-border/50",
              "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
              "transition-all duration-200 resize-y",
              "text-sm text-foreground placeholder:text-muted-foreground/60"
            )}
            value={value?.notes || ''}
            onChange={e => handleNotesChange(e.target.value)}
            placeholder={t('formSubmissions.notesPlaceholder')}
          />
        </div>
      )}
    </>
  );

  switch (question.question_type) {
    case 'text':
      return (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              className={cn(
                "w-full min-h-[60px] md:min-h-[70px] p-2 md:p-2.5 rounded-lg",
                "bg-background/80 dark:bg-background/50 border-2 border-border/50",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                "transition-all duration-200 resize-y",
                "text-sm md:text-base text-foreground placeholder:text-muted-foreground/60",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              value={value?.answer_text || ''}
              onChange={e => handleTextChange(e.target.value)}
              placeholder={t('formSubmissions.enterAnswer')}
            />
            {value?.answer_text && value.answer_text.trim() !== '' && (
              <div className="absolute top-3 right-3 p-1 rounded-full bg-primary/10">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
          </div>
          {renderNotesSection()}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <div className="relative max-w-xs">
            <input
              type="number"
              className={cn(
                "w-full h-8 md:h-9 px-2.5 md:px-3 rounded-lg",
                "bg-background/80 dark:bg-background/50 border-2 border-border/50",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                "transition-all duration-200",
                "text-sm md:text-base text-foreground placeholder:text-muted-foreground/60",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              value={value?.answer_number ?? ''}
              onChange={e => handleNumberChange(e.target.value)}
              placeholder={t('formSubmissions.enterNumber')}
            />
            {value?.answer_number !== undefined && value?.answer_number !== null && (
              <div className="absolute top-1/2 -translate-y-1/2 right-3 p-1 rounded-full bg-primary/10">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
          </div>
          {renderNotesSection()}
        </div>
      );

    case 'boolean':
      return (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {[
              { label: t('formSubmissions.yes'), value: true },
              { label: t('formSubmissions.no'), value: false }
            ].map(({ label, value: boolValue }) => {
              const isSelected = value?.answer_boolean === boolValue;
              
              return (
                <label 
                  key={String(boolValue)} 
                  className={cn(
                    "flex items-center gap-2.5 p-2 md:p-2.5 rounded-lg border cursor-pointer transition-all duration-200 flex-1",
                    isSelected
                      ? "bg-primary/6 border-primary/30"
                      : "bg-background border-border/40 hover:border-border/60 hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all shrink-0",
                    isSelected 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground/40"
                  )}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name={question.id}
                    checked={isSelected}
                    onChange={() => handleBooleanChange(boolValue)}
                    className="sr-only"
                  />
                  <span className={cn(
                    "text-sm md:text-base transition-colors",
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary/70 ml-auto shrink-0" />
                  )}
                </label>
              );
            })}
          </div>
          {renderNotesSection()}
        </div>
      );

    case 'single_select':
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            {question.options && question.options.length > 0 ? (
              question.options.map(opt => {
                const isSelected = value?.selected_options?.[0] === opt.id;
                
                return (
                  <label 
                    key={opt.id} 
                    className={cn(
                      "flex items-center gap-2.5 p-2 md:p-2.5 rounded-lg border cursor-pointer transition-all duration-200",
                      isSelected
                        ? "bg-primary/6 border-primary/30"
                        : "bg-background border-border/40 hover:border-border/60 hover:bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all shrink-0",
                      isSelected 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/40"
                    )}>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name={question.id}
                      checked={isSelected}
                      onChange={() => handleSingleSelectChange(opt.id)}
                      className="sr-only"
                    />
                    <span className={cn(
                      "text-sm md:text-base transition-colors flex-1",
                      isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {opt.option}
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                    )}
                  </label>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
                {t('formSubmissions.noOptionsAvailable')}
              </div>
            )}
          </div>
          {renderNotesSection()}
        </div>
      );

    case 'multi_select':
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            {question.options && question.options.length > 0 ? (
              question.options.map(opt => {
                const isChecked = value?.selected_options?.includes(opt.id) || false;
                
                return (
                  <label 
                    key={opt.id} 
                    className={cn(
                      "flex items-center gap-2.5 p-2 md:p-2.5 rounded-lg border cursor-pointer transition-all duration-200",
                      isChecked
                        ? "bg-primary/6 border-primary/30"
                        : "bg-background border-border/40 hover:border-border/60 hover:bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "relative flex items-center justify-center w-4 h-4 rounded border-2 transition-all shrink-0",
                      isChecked 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/40"
                    )}>
                      {isChecked && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMultiSelectChange(opt.id)}
                      className="sr-only"
                    />
                    <span className={cn(
                      "text-sm md:text-base transition-colors flex-1",
                      isChecked ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {opt.option}
                    </span>
                    {isChecked && (
                      <Check className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                    )}
                  </label>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
                {t('formSubmissions.noOptionsAvailable')}
              </div>
            )}
          </div>
          {renderNotesSection()}
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
          {t('formSubmissions.unsupportedQuestionType')}
        </div>
      );
  }
}