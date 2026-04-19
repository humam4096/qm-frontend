// services/realtimeManager.ts

import { getEcho } from "./eco";

type Callback = (data: any) => void;

class RealtimeManager {
  private echo = getEcho();
  private channels = new Map<string, Set<Callback>>();

  subscribe(channel: string, event: string, cb: Callback) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());

      this.echo.channel(channel).listen(event, (data: any) => {
        this.channels.get(channel)?.forEach((callback) => callback(data));
      });
    }

    this.channels.get(channel)!.add(cb);
  }

  unsubscribe(channel: string, cb: Callback) {
    const set = this.channels.get(channel);
    if (!set) return;

    set.delete(cb);

    if (set.size === 0) {
      this.echo.leave(channel);
      this.channels.delete(channel);
    }
  }

  leaveAll() {
    this.channels.forEach((_, channel) => {
      this.echo.leave(channel);
    });
    this.channels.clear();
  }
}

export const realtimeManager = new RealtimeManager();