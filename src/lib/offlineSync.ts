import { supabase } from "@/integrations/supabase/client";

const OFFLINE_QUEUE_KEY = "offline_sync_queue";

interface OfflineItem {
  id: string;
  table: string;
  payload: Record<string, any>;
  createdAt: string;
}

export function getOfflineQueue(): OfflineItem[] {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getOfflineQueueCount(): number {
  return getOfflineQueue().length;
}

export function enqueueOffline(table: string, payload: Record<string, any>) {
  const queue = getOfflineQueue();
  queue.push({
    id: crypto.randomUUID(),
    table,
    payload,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  window.dispatchEvent(new Event("offline-queue-changed"));
}

export async function syncOfflineQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  const remaining: OfflineItem[] = [];
  let synced = 0;

  for (const item of queue) {
    try {
      const { error } = await (supabase.from(item.table as any) as any).insert(item.payload);
      if (error) {
        console.error(`[offlineSync] Failed to sync ${item.table}:`, error.message);
        remaining.push(item);
      } else {
        synced++;
      }
    } catch (err) {
      remaining.push(item);
    }
  }

  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
  window.dispatchEvent(new Event("offline-queue-changed"));
  return { synced, failed: remaining.length };
}

export function initOfflineSync() {
  window.addEventListener("online", async () => {
    const result = await syncOfflineQueue();
    if (result.synced > 0) {
      console.log(`[offlineSync] Synced ${result.synced} items on reconnect`);
    }
  });
}
