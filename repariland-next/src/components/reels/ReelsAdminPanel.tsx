'use client';

import { useCallback, useRef, useState } from 'react';
import { Loader2, Trash2, Upload, X } from 'lucide-react';
import type { ReelItem } from '@/lib/reels/types';
import { validateVideoFile } from '@/lib/reels/client-validation';

type ReelsAdminPanelProps = {
  open: boolean;
  items: ReelItem[];
  maxReels: number;
  maxDurationSec: number;
  blobEnabled: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  onLogout: () => Promise<void>;
};

export default function ReelsAdminPanel({
  open,
  items,
  maxReels,
  maxDurationSec,
  blobEnabled,
  onClose,
  onRefresh,
  onLogout,
}: ReelsAdminPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [replaceId, setReplaceId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const slotsLeft = maxReels - items.length;

  const resetForm = useCallback(() => {
    setTitle('');
    setCaption('');
    setReplaceId('');
    setFile(null);
    setDurationSec(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const handleFile = useCallback(
    async (picked: File | null) => {
      setError(null);
      setFile(null);
      setDurationSec(null);
      if (!picked) return;
      const result = await validateVideoFile(picked);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setFile(picked);
      setDurationSec(result.durationSec);
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    if (!blobEnabled) {
      setError('Configura BLOB_READ_WRITE_TOKEN para subir desde el panel.');
      return;
    }
    if (!file || durationSec === null) {
      setError('Selecciona un video válido.');
      return;
    }
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!replaceId && slotsLeft <= 0) {
      setError(`Máximo ${maxReels} reels. Elimina o reemplaza uno.`);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('video', file);
      form.append('title', title.trim());
      if (caption.trim()) form.append('caption', caption.trim());
      form.append('durationSec', String(durationSec));
      if (replaceId) form.append('replaceId', replaceId);

      const res = await fetch('/api/reels/upload', { method: 'POST', body: form });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error al subir.');
      resetForm();
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir.');
    } finally {
      setUploading(false);
    }
  }, [
    blobEnabled,
    file,
    durationSec,
    title,
    caption,
    replaceId,
    slotsLeft,
    maxReels,
    resetForm,
    onRefresh,
  ]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!blobEnabled) return;
      setDeletingId(id);
      setError(null);
      try {
        const res = await fetch(`/api/reels/${encodeURIComponent(id)}`, { method: 'DELETE' });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? 'No se pudo eliminar.');
        if (replaceId === id) setReplaceId('');
        await onRefresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al eliminar.');
      } finally {
        setDeletingId(null);
      }
    },
    [blobEnabled, replaceId, onRefresh],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reels-admin-title"
    >
      <div className="flex max-h-[min(92dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0c0e14] shadow-2xl sm:rounded-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 id="reels-admin-title" className="font-space text-sm font-semibold uppercase tracking-wider text-white">
            Administrar REELS
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void onLogout()}
              className="text-xs text-white/50 hover:text-white/80"
            >
              Salir
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="native-scroll flex-1 space-y-4 overflow-y-auto p-4">
          {!blobEnabled ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
              Subida en la nube desactivada. Añade BLOB_READ_WRITE_TOKEN en Vercel o usa archivos en{' '}
              <code className="text-white/80">public/reels/</code>.
            </p>
          ) : null}

          <p className="text-xs text-white/55">
            Hasta {maxReels} videos · máx. {maxDurationSec}s · MP4 o WebM · {items.length}/{maxReels}{' '}
            publicados
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-white/70">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#0077FF]/50"
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-white/70">Descripción (opcional)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#0077FF]/50"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-white/70">Reemplazar reel existente</label>
            <select
              value={replaceId}
              onChange={(e) => setReplaceId(e.target.value)}
              className="w-full rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <option value="">Nuevo reel</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/webm"
              className="sr-only"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#0077FF]/40 bg-[#0077FF]/10 py-6 text-sm text-[#7ec8ff] transition hover:bg-[#0077FF]/18"
            >
              <Upload className="h-4 w-4" />
              {file ? file.name : 'Seleccionar video'}
            </button>
            {durationSec !== null ? (
              <p className="text-xs text-emerald-400/90">Duración: {durationSec}s</p>
            ) : null}
          </div>

          {error ? <p className="text-xs text-red-400">{error}</p> : null}

          <button
            type="button"
            disabled={uploading || !blobEnabled}
            onClick={() => void handleUpload()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4DA3FF] via-[#0077FF] to-[#0055CC] py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Subiendo…' : replaceId ? 'Reemplazar video' : 'Publicar reel'}
          </button>

          {items.length > 0 ? (
            <ul className="space-y-2 border-t border-white/10 pt-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{item.title}</p>
                    <p className="text-[11px] text-white/45">
                      {item.durationSec}s · {item.likeCount} likes
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!blobEnabled || deletingId === item.id}
                    onClick={() => void handleDelete(item.id)}
                    aria-label={`Eliminar ${item.title}`}
                    className="shrink-0 rounded-lg p-2 text-red-400/90 hover:bg-red-500/10 disabled:opacity-40"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
