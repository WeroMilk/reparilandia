'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReelItem } from '@/lib/reels/types';
import ReelSlide from '@/components/reels/ReelSlide';

type ReelsFeedProps = {
  items: ReelItem[];
  initialReelId?: string | null;
  isScreenActive: boolean;
  onActiveIndexChange?: (index: number) => void;
};

export default function ReelsFeed({
  items,
  initialReelId,
  isScreenActive,
  onActiveIndexChange,
}: ReelsFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const didScrollToInitial = useRef(false);

  useEffect(() => {
    if (!items.length) {
      setActiveId(null);
      return;
    }
    if (!activeId || !items.some((i) => i.id === activeId)) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  useEffect(() => {
    if (!initialReelId || didScrollToInitial.current || !feedRef.current) return;
    const el = slideRefs.current.get(initialReelId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(initialReelId);
      didScrollToInitial.current = true;
    }
  }, [initialReelId, items]);

  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.55)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target) return;
        const id = (visible.target as HTMLElement).dataset.reelId;
        if (id) {
          setActiveId(id);
          const idx = items.findIndex((item) => item.id === id);
          if (idx >= 0) onActiveIndexChange?.(idx);
        }
      },
      { root, threshold: [0.45, 0.55, 0.7, 0.85] },
    );

    slideRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, onActiveIndexChange]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      const el = slideRefs.current.get(item.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [items],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const idx = items.findIndex((i) => i.id === activeId);
      if (idx < 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'ArrowDown' && idx < items.length - 1) scrollToIndex(idx + 1);
      if (e.key === 'ArrowUp' && idx > 0) scrollToIndex(idx - 1);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [activeId, items, scrollToIndex]);

  return (
    <div
      ref={feedRef}
      className="reels-feed native-scroll h-full min-h-0 w-full overflow-y-auto overscroll-y-contain"
      role="feed"
      aria-label="Reels de Reparilandia"
    >
      {items.map((reel) => (
        <div
          key={reel.id}
          ref={(node) => {
            if (node) slideRefs.current.set(reel.id, node);
            else slideRefs.current.delete(reel.id);
          }}
          className="reels-feed__item h-full min-h-full w-full"
          data-reel-id={reel.id}
        >
          <ReelSlide reel={reel} isActive={activeId === reel.id} isScreenActive={isScreenActive} />
        </div>
      ))}
    </div>
  );
}
