export const ErrorMsg = ({ message }: { message: string }) => {
  return (
    <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md">
      <p className="text-destructive text-sm text-center">{message}</p>
    </div>
  );
};