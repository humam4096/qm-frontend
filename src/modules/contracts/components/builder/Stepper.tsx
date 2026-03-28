import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContractBuilder } from "./context/ContractBuilderContext";

export const STEPS = [
  { id: 1, label: "Basic Info & Kitchens" },
  { id: 2, label: "Dates" },
  { id: 3, label: "Time Windows" },
  { id: 4, label: "Meals" },
  { id: 5, label: "Review & Publish" },
];

export function Stepper() {
  const { currentStep, highestStep, setCurrentStep } = useContractBuilder();

  return (
    <div className="flex w-full items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
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
                "group flex flex-col items-center gap-2 transition-colors",
                isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground border border-border"
                )}
              >
                {isCompleted ? <CheckIcon className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-[2px] w-12 sm:w-16 md:w-20 lg:w-24 transition-colors duration-200 mt-[-24px]", // align bar to circle centers
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
