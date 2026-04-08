import { ContextSelectionStep } from '../components/ContextSelectionStep';
import { FormsStep } from '../components/FormsStep';
import { FormSubmissionStepper } from '../components/FormSubmissionStepper';
import { ReviewStep } from '../components/ReviewStep';
import { useFormRunner } from '../context/FormRunnerContext';


export default function SubmitNewFromPage() {  
  const { currentStep } = useFormRunner();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ContextSelectionStep />;
      case 2:
        return <FormsStep />;
      case 3:
        return <ReviewStep />;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-6">
      <FormSubmissionStepper/>
      {renderStep()}
    </div>
  )
}
