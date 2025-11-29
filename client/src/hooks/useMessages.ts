import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../api/apiClient";

export interface Message {
  id: string;
  senderId: string;
  username: string;
  text: string;
  createdAt: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load recent messages (single unified function)
  const reloadRecent = useCallback(async () => {
    try {
      const res = await apiClient.get<Message[]>("/messages/recent");
      setMessages(res.data);
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    reloadRecent();
  }, [reloadRecent]);

  // Long-polling mechanism
  useEffect(() => {
    let active = true;

    async function poll() {
      while (active) {
        try {
          const res = await apiClient.get<Message[]>("/messages/subscribe", {
            timeout: 35000,
          });

          if (!active) return;

          // Merge new messages while preventing duplicates
          setMessages((prev) => {
            const map = new Map(prev.map((m) => [m.id, m]));
            for (const m of res.data) {
              if (!map.has(m.id)) {
                map.set(m.id, m);
              }
            }
            return Array.from(map.values());
          });
        } catch (err) {
          if (!active) return;

          // Network or timeout error → wait a bit before retry
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    poll();

    return () => {
      active = false;
    };
  }, [reloadRecent]);

  return { messages, reloadRecent };
}
