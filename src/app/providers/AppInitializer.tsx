import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// Optional: A global loader component that covers the whole screen
// To be displayed only during the very first initialization of the app
const FullScreenLoader = () => (
  <div className="flex h-screen-mobile items-center justify-center bg-gray-50 flex-col gap-4">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <div className='flex flex-col '>
        <p className="text-xl font-bold tracking-tight">QM System</p>
        <p className="text-sm text-gray-500">Initializing Workspace...</p>
      </div>
    </div>
  </div>
);


export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Give priority to the loader during the hard refresh
  if (!isInitialized) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};
