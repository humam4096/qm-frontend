import { Button } from '@/components/ui/button'
import { RefreshCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ConnectionHeaderProps = {
  connectionState: string;
  channelName: string;
  clearLogs: () => void;
  paused?: boolean;
  setPaused?: (paused: any) => void;
  refreshLogs?: () => void;
  isConnected: boolean;
  isRefreshing?: boolean;
} 

export default function ConnectionHeader({ connectionState, channelName, clearLogs, paused, setPaused, isConnected, refreshLogs, isRefreshing }: ConnectionHeaderProps) {
  const { t } = useTranslation();
  console.log(isRefreshing)
  const getConnectionColor = () => {
    switch (connectionState) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getConnectionText = () => {
    switch (connectionState) {
      case "connected":
        return t('liveLogs.connection.connected');
      case "connecting":
        return t('liveLogs.connection.connecting');
      case "failed":
        return t('liveLogs.connection.connectionFailed');
      default:
        return t('liveLogs.connection.disconnected');
    }
  };
  
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <span className={`h-2.5 w-2.5 rounded-full ${getConnectionColor()}`} />
          {isConnected && (
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full animate-ping opacity-50 bg-green-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
              {getConnectionText()}
          </span>
          {isConnected && (
            <span className="text-xs text-muted-foreground">
              {t('liveLogs.connection.channel')}: {channelName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {paused && setPaused && <Button
          size="sm"
          variant={paused ? "default" : "outline"}
          onClick={() => setPaused((p: boolean) => !p)}
        >
          {paused ? t('liveLogs.connection.resume') : t('liveLogs.connection.pause')}
        </Button>}
        <Button
          size="sm"
          variant="outline"
          onClick={refreshLogs}
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('liveLogs.connection.refreshing') : t('liveLogs.connection.refresh')}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={clearLogs}
        >
          <Trash2/>
          {t('liveLogs.connection.clear')}
        </Button>
      </div>
    </div>
  )
}
