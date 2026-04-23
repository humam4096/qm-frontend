import { useEffect, useRef, useState } from "react";
import { getEcho } from "@/lib/echo";
import type { Channel } from "laravel-echo";

type EventCallback<T = any> = (data: T) => void;

interface UseEchoChannelOptions {
  onSubscribed?: () => void;
  onError?: (error: any) => void;
}

export const useEchoChannel = <T = any>(
  channelName: string,
  eventName: string,
  callback: EventCallback<T>,
  options?: UseEchoChannelOptions
) => {
  const channelRef = useRef<Channel | null>(null);
  const callbackRef = useRef(callback);
  const onSubscribedRef = useRef(options?.onSubscribed);
  const onErrorRef = useRef(options?.onError);
  const [subscriptionState, setSubscriptionState] = useState<"idle" | "subscribing" | "subscribed" | "error">("idle");

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    onSubscribedRef.current = options?.onSubscribed;
  }, [options?.onSubscribed]);

  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  useEffect(() => {
    if (!channelName) {
      setSubscriptionState("idle");
      return;
    }

    setSubscriptionState("subscribing");

    const echo = getEcho();
    const channel = echo.private(channelName);
    channelRef.current = channel;

    const handler = (data: T) => {
      callbackRef.current(data);
    };

    channel.listen(eventName, handler);

    channel.subscribed(() => {
      setSubscriptionState("subscribed");
      onSubscribedRef.current?.();
    });

    channel.error((error: any) => {
      setSubscriptionState("error");
      onErrorRef.current?.(error);
    });

    return () => {
      channel.stopListening(eventName, handler);
      // echo.leave(`private-${channelName}`);
      echo.leave(channelName);
      channelRef.current = null;
      setSubscriptionState("idle");
    };
  }, [channelName, eventName]);

  return {
    channel: channelRef.current,
    subscriptionState,
    isSubscribed: subscriptionState === "subscribed",
  };
};
