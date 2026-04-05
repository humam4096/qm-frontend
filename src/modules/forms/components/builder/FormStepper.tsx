import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export const FormStepper = () => {
  const { t, i18n } = useTranslation();
  
    const STEPS = [
    { id: 1, label: t('forms.info') },
    { id: 2, label: t('forms.builder.title') },
    { id: 3, label: t('forms.preview') },
  ];

  const {
    currentStep,
    setCurrentStep,
  } = useFormBuilderContext();
  const isRTL = i18n.language === "ar";

  return (
     <div className="flex w-full items-center justify-between overflow-x-auto scrollbar-hide" dir={isRTL ? 'rtl' : 'ltr'}>
      {STEPS.map((  step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLocked = step.id > currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => {
                if (!isLocked) setCurrentStep(step.id);
              }}
              disabled={isLocked}
              className={cn(
                "group flex flex-col items-center gap-1 md:gap-2 transition-colors min-w-0 m-2",
                isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full text-xs md:text-sm font-medium transition-all duration-200 shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground border border-border"
                )}
              >
                {isCompleted ? <CheckIcon className="h-3 w-3 md:h-4 md:w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium text-center leading-tight max-w-[60px] md:max-w-[70px]",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 md:mx-4 h-[2px] w-30 sm:w-40 md:w-50 lg:w-80 transition-colors duration-200 mt-[-20px] md:mt-[-24px]", // align bar to circle centers
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};