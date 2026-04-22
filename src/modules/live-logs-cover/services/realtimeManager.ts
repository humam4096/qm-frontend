// services/realtimeManager.ts


import type Echo from "laravel-echo";
import { getEcho, resetEcho } from "./eco";

type Callback = (data: any) => void;

/**
 * Whether a channel requires Laravel broadcasting auth.
 *
 * - "public"  → echo.channel()        — no auth, anyone can subscribe
 * - "private" → echo.private()        — requires Bearer token + /broadcasting/auth
 *
 * Laravel Reverb naming conventions:
 *   Public:  "complaints.public"
 *   Private: "private-complaints.global", "private-complaints.branch.1"
 *   Presence: "presence-..." (not used here)
 *
 * We expose this as an explicit param rather than inferring from the name
 * so callers are always intentional about auth requirements.
 */
export type ChannelType = "public" | "private";

interface SubscribeOptions {
  channelType?: ChannelType; // defaults to "private"
}

/**
 * Manages WebSocket channel subscriptions via Laravel Echo / Reverb.
 *
 * Key design decisions:
 * - Echo is lazily initialized so it's never created before a token exists.
 * - Subscriptions are keyed by `channel::event` to support multiple events
 *   on the same channel independently.
 * - Ref-counting: the underlying Echo channel is only left when the last
 *   subscriber for that channel unsubscribes.
 * - Public channels skip the /broadcasting/auth handshake entirely.
 */
class RealtimeManager {
  // Lazy Echo accessor — never touches the instance at class creation time
  private get echo(): Echo<any> {
    return getEcho();
  }

  // Map of "channelName::EventName" → set of callbacks
  private subscriptions = new Map<string, Set<Callback>>();

  // Track which raw channel names are currently joined (for ref-counting)
  private joinedChannels = new Set<string>();

  private makeKey(channel: string, event: string): string {
    return `${channel}::${event}`;
  }

  /**
   * Joins the correct Echo channel type.
   * Public channels call echo.channel(); private channels call echo.private().
   */
  private joinChannel(channel: string, channelType: ChannelType) {
    return channelType === "public"
      ? this.echo.channel(channel)
      : this.echo.private(channel);
  }

  subscribe(
    channel: string,
    event: string,
    cb: Callback,
    { channelType = "private" }: SubscribeOptions = {}
  ): void {
    const key = this.makeKey(channel, event);

    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());

      if (!this.joinedChannels.has(channel)) {
        this.joinedChannels.add(channel);
      }

      this.joinChannel(channel, channelType).listen(event, (data: any) => {
        this.subscriptions.get(key)?.forEach((fn) => fn(data));
      });
    }

    this.subscriptions.get(key)!.add(cb);
  }

  unsubscribe(channel: string, event: string, cb: Callback): void {
    const key = this.makeKey(channel, event);
    const set = this.subscriptions.get(key);
    if (!set) return;

    set.delete(cb);

    if (set.size === 0) {
      this.subscriptions.delete(key);
    }

    // Only leave the raw channel if no subscriptions remain for it at all
    const channelStillUsed = [...this.subscriptions.keys()].some((k) =>
      k.startsWith(`${channel}::`)
    );

    if (!channelStillUsed) {
      this.echo.leave(channel);
      this.joinedChannels.delete(channel);
    }
  }

  /** Leave all channels and clear state. Call on logout. */
  leaveAll(): void {
    this.joinedChannels.forEach((channel) => {
      this.echo.leave(channel);
    });
    this.subscriptions.clear();
    this.joinedChannels.clear();
    resetEcho();
  }
}

// Singleton — shared across the entire app
export const realtimeManager = new RealtimeManager();


// import type Echo from "laravel-echo";
// import { getEcho, resetEcho } from "./eco";

// type Callback = (data: any) => void;

// /**
//  * Manages WebSocket channel subscriptions via Laravel Echo / Reverb.
//  *
//  * Key design decisions:
//  * - Echo is lazily initialized so it's never created before a token exists.
//  * - Subscriptions are keyed by `channel::event` to support multiple events
//  *   on the same channel independently.
//  * - Ref-counting: the underlying Echo channel is only left when the last
//  *   subscriber for a given channel unsubscribes.
//  */

// class RealtimeManager {
//   // Lazy Echo accessor — never touches the instance at class creation time
//   private get echo(): Echo<any> {
//     return getEcho();
//   }

//   // Map of "channelName::EventName" → set of callbacks
//   private subscriptions = new Map<string, Set<Callback>>();

//   // Track which raw channel names are currently joined (for ref-counting)
//   private joinedChannels = new Set<string>();

//   private makeKey(channel: string, event: string): string {
//     return `${channel}::${event}`;
//   }

//   subscribe(channel: string, event: string, cb: Callback): void {
//     const key = this.makeKey(channel, event);

//     if (!this.subscriptions.has(key)) {
//       this.subscriptions.set(key, new Set());

//       // Join the underlying channel only once per channel name
//       if (!this.joinedChannels.has(channel)) {
//         this.joinedChannels.add(channel);
//       }

//       this.echo.channel(channel).listen(event, (data: any) => {
//         this.subscriptions.get(key)?.forEach((fn) => fn(data));
//       });
//     }

//     this.subscriptions.get(key)!.add(cb);
//   }

//   unsubscribe(channel: string, event: string, cb: Callback): void {
//     const key = this.makeKey(channel, event);
//     const set = this.subscriptions.get(key);
//     if (!set) return;

//     set.delete(cb);

//     if (set.size === 0) {
//       this.subscriptions.delete(key);
//     }

//     // Only leave the raw channel if no subscriptions remain for it
//     const channelStillUsed = [...this.subscriptions.keys()].some((k) =>
//       k.startsWith(`${channel}::`)
//     );

//     if (!channelStillUsed) {
//       this.echo.leave(channel);
//       this.joinedChannels.delete(channel);
//     }
//   }

//   /** Leave all channels and clear state. Call on logout. */
//   leaveAll(): void {
//     this.joinedChannels.forEach((channel) => {
//       this.echo.leave(channel);
//     });
//     this.subscriptions.clear();
//     this.joinedChannels.clear();
//     resetEcho();
//   }
// }

// // Singleton — shared across the entire app
// export const realtimeManager = new RealtimeManager();


// import { getEcho } from "./eco";

// type Callback = (data: any) => void;

// class RealtimeManager {
//   private echo = getEcho();
//   private channels = new Map<string, Set<Callback>>();

//   subscribe(channel: string, event: string, cb: Callback) {
//     if (!this.channels.has(channel)) {
//       this.channels.set(channel, new Set());

//       this.echo.channel(channel).listen(event, (data: any) => {
//         this.channels.get(channel)?.forEach((callback) => callback(data));
//       });
//     }

//     this.channels.get(channel)!.add(cb);
//   }

//   unsubscribe(channel: string, cb: Callback) {
//     const set = this.channels.get(channel);
//     if (!set) return;

//     set.delete(cb);

//     if (set.size === 0) {
//       this.echo.leave(channel);
//       this.channels.delete(channel);
//     }
//   }

//   leaveAll() {
//     this.channels.forEach((_, channel) => {
//       this.echo.leave(channel);
//     });
//     this.channels.clear();
//   }
// }

// export const realtimeManager = new RealtimeManager();