import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useContractBuilder } from "./context/ContractBuilderContext";

export function Stepper() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { currentStep, highestStep, setCurrentStep } = useContractBuilder();

  const STEPS = [
    { id: 1, label: t('contracts.basicInfo') },
    { id: 2, label: t('contracts.serviceDates') },
    { id: 3, label: t('contracts.timeWindows') },
    { id: 4, label: t('contracts.meals') },
    { id: 5, label: t('contracts.reviewPublish') },
  ];

  return (
    <div className="hidden md:flex w-full items-center justify-between mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide" dir={isRTL ? 'rtl' : 'ltr'}>
      {STEPS.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLocked = step.id > highestStep;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => {
                if (!isLocked) setCurrentStep(step.id);
              }}
              disabled={isLocked}
              className={cn(
                "group flex flex-col items-center gap-1 md:gap-2 transition-colors min-w-0",
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
                  "text-[10px] md:text-xs font-medium text-center leading-tight max-w-[60px] md:max-w-[80px]",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 md:mx-4 h-[2px] w-8 sm:w-12 md:w-16 lg:w-20 transition-colors duration-200 mt-[-20px] md:mt-[-24px]", // align bar to circle centers
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
