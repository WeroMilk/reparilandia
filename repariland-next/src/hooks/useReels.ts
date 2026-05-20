'use client';

import { useCallback, useEffect, useState } from 'react';
import { MAX_REEL_DURATION_SEC, MAX_REELS } from '@/lib/reels/constants';
import type { ReelItem, ReelsApiResponse } from '@/lib/reels/types';

type UseReelsState = {
  items: ReelItem[];
  storage: ReelsApiResponse['storage'] | null;
  maxReels: number;
  maxDurationSec: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateItem: (id: string, patch: Partial<ReelItem>) => void;
};

export function useReels(): UseReelsState {
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

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reels', { cache: 'no-store' });
      if (res.ok) {
        applyPayload((await res.json()) as ReelsApiResponse);
        return;
      }
      const staticRes = await fetch('/data/reels-manifest.json', { cache: 'no-store' });
      if (!staticRes.ok) throw new Error('No se pudieron cargar los reels.');
      const manifest = (await staticRes.json()) as ReelsApiResponse['manifest'];
      applyPayload({
        manifest,
        storage: 'static',
        maxReels: MAX_REELS,
        maxDurationSec: MAX_REEL_DURATION_SEC,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar reels.');
    } finally {
      setLoading(false);
    }
  }, [applyPayload]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
