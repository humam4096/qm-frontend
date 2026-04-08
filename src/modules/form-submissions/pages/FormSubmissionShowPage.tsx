import { useParams } from 'react-router-dom';
import { useGetFormSubmissionById } from '../hooks/useFormSubmissions';
import { FormSubmissionDisplay } from '../components/FormSubmissionDisplay';
import { Skeleton } from '@/components/ui/skeleton';

export function FormSubmissionShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetFormSubmissionById(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-4 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <FormSubmissionDisplay data={data?.data} />;
}
