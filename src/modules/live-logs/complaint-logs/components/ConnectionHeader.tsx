import { Button } from '@/components/ui/button'

type ConnectionHeaderProps = {
  connectionState: string;
  channelName: string;
  clearLogs: () => void;
  paused: boolean;
  setPaused: (paused: any) => void;
  isConnected: boolean;
} 

export default function ConnectionHeader({ connectionState, channelName, clearLogs, paused, setPaused, isConnected }: ConnectionHeaderProps) {

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
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "failed":
        return "Connection Failed";
      default:
        return "Disconnected";
    }
  };
  
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
              Channel: {channelName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={paused ? "default" : "outline"}
          onClick={() => setPaused((p: boolean) => !p)}
        >
          {paused ? "Resume" : "Pause"}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={clearLogs}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
