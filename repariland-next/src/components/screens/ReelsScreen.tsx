'use client';

import { useCallback, useMemo, useState } from 'react';
import { Loader2, Settings2 } from 'lucide-react';
import { useReels } from '@/hooks/useReels';
import ReelsFeed from '@/components/reels/ReelsFeed';
import ReelsEmptyState from '@/components/reels/ReelsEmptyState';
import ReelsAdminPanel from '@/components/reels/ReelsAdminPanel';

function readInitialReelId(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('reel');
}

type ReelsScreenProps = {
  isScreenActive?: boolean;
};

export default function ReelsScreen({ isScreenActive = true }: ReelsScreenProps) {
  const { items, storage, maxReels, maxDurationSec, loading, error, refresh, updateItem } =
    useReels();
  const [initialReelId] = useState(readInitialReelId);
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authSecret, setAuthSecret] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const blobEnabled = storage === 'blob';

  const openAdminFlow = useCallback(() => {
    if (isAdmin) {
      setAdminOpen(true);
    } else {
      setAuthOpen(true);
      setAuthError(null);
    }
  }, [isAdmin]);

  const handleAuth = useCallback(async () => {
    setAuthError(null);
    try {
      const res = await fetch('/api/reels/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: authSecret }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Clave incorrecta.');
      setIsAdmin(true);
      setAuthOpen(false);
      setAuthSecret('');
      setAdminOpen(true);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Error de autenticación.');
    }
  }, [authSecret]);

  const handleLogout = useCallback(async () => {
    await fetch('/api/reels/auth', { method: 'DELETE' });
    setIsAdmin(false);
    setAdminOpen(false);
  }, []);

  const progressLabel = useMemo(() => {
    if (!items.length) return null;
    return `${activeIndex + 1} / ${items.length}`;
  }, [activeIndex, items.length]);

  const handleLikeCountChange = useCallback(
    (id: string, likeCount: number) => {
      updateItem(id, { likeCount });
    },
    [updateItem],
  );

  return (
    <div
      className="reels-screen relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black lg:px-4"
      data-screen="reels"
    >
      <div className="reels-screen__frame relative mx-auto flex h-full min-h-0 w-full max-w-[28rem] flex-1 flex-col overflow-hidden lg:rounded-2xl lg:border lg:border-white/[0.08] lg:shadow-[0_0_80px_-20px_rgba(0,119,255,0.35)]">
        <header className="reels-screen__header pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="pointer-events-auto rounded-full border border-white/10 bg-black/45 px-3 py-1 backdrop-blur-md">
            <span className="font-space text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
              REELS
            </span>
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-2">
            {progressLabel ? (
              <span className="rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] tabular-nums text-white/75 backdrop-blur-md">
                {progressLabel}
              </span>
            ) : null}
            <button
              type="button"
              onClick={openAdminFlow}
              aria-label="Administrar reels"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0077FF]/35 bg-[#0077FF]/20 text-[#7ec8ff] backdrop-blur-md transition hover:bg-[#0077FF]/30"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="reels-screen__body relative min-h-0 flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#4DA3FF]" />
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-sm text-red-300">{error}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80"
              >
                Reintentar
              </button>
            </div>
          ) : items.length === 0 ? (
            <ReelsEmptyState onOpenAdmin={openAdminFlow} storage={storage} />
          ) : (
            <ReelsFeed
              items={items}
              initialReelId={initialReelId}
              isScreenActive={isScreenActive}
              onLikeCountChange={handleLikeCountChange}
              onActiveIndexChange={setActiveIndex}
            />
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 -left-[20vw] hidden w-[20vw] bg-gradient-to-r from-[#050508] to-transparent lg:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 -right-[20vw] hidden w-[20vw] bg-gradient-to-l from-[#050508] to-transparent lg:block"
          aria-hidden
        />
      </div>

      {authOpen ? (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reels-auth-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0e14] p-5 shadow-xl">
            <h2
              id="reels-auth-title"
              className="font-space text-sm font-semibold uppercase tracking-wider text-white"
            >
              Acceso admin
            </h2>
            <p className="mt-2 text-xs text-white/55">Introduce la clave de administración de reels.</p>
            <input
              type="password"
              value={authSecret}
              onChange={(e) => setAuthSecret(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleAuth();
              }}
              className="mt-4 w-full rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#0077FF]/50"
              autoComplete="current-password"
            />
            {authError ? <p className="mt-2 text-xs text-red-400">{authError}</p> : null}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthOpen(false);
                  setAuthSecret('');
                  setAuthError(null);
                }}
                className="flex-1 rounded-lg border border-white/12 py-2 text-xs text-white/70"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleAuth()}
                className="flex-1 rounded-lg bg-[#0077FF] py-2 text-xs font-semibold uppercase text-white"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ReelsAdminPanel
        open={adminOpen}
        items={items}
        maxReels={maxReels}
        maxDurationSec={maxDurationSec}
        blobEnabled={blobEnabled}
        onClose={() => setAdminOpen(false)}
        onRefresh={refresh}
        onLogout={handleLogout}
      />
    </div>
  );
}
