import { FormRunnerProvider } from '../context/FormRunnerContext';
import { FormSubmissionsPage } from './FormSubmissionsPage';

export function FormSubmissionsPageWrapper() {
  return (
    <FormRunnerProvider>
      <FormSubmissionsPage />
    </FormRunnerProvider>
  );
}
