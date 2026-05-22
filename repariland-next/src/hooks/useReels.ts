'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadReelsForClient, type LoadReelsOptions } from '@/lib/reels/clientManifest';
import type { ReelItem, ReelsApiResponse } from '@/lib/reels/types';

type UseReelsState = {
  items: ReelItem[];
  storage: ReelsApiResponse['storage'] | null;
  maxReels: number;
  maxDurationSec: number;
  loading: boolean;
  error: string | null;
  refresh: (options?: LoadReelsOptions) => Promise<void>;
  updateItem: (id: string, patch: Partial<ReelItem>) => void;
};

export function useReels(enabled = true): UseReelsState {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [storage, setStorage] = useState<ReelsApiResponse['storage'] | null>(null);
  const [maxReels, setMaxReels] = useState(5);
  const [maxDurationSec, setMaxDurationSec] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyPayload = useCallback((data: ReelsApiResponse) => {
    setItems(data.manifest.items);
    setStorage(data.storage);
    setMaxReels(data.maxReels);
    setMaxDurationSec(data.maxDurationSec);
    setError(null);
  }, []);

  const refresh = useCallback(async (options?: LoadReelsOptions) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadReelsForClient(options);
      applyPayload(data);
    } catch {
      setError('No se pudieron cargar los reels.');
    } finally {
      setLoading(false);
    }
  }, [applyPayload]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [enabled, refresh]);

  const updateItem = useCallback((id: string, patch: Partial<ReelItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  return {
    items,
    storage,
    maxReels,
    maxDurationSec,
    loading,
    error,
    refresh,
    updateItem,
  };
}
