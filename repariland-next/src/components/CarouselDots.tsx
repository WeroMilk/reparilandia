'use client';

interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}

export default function CarouselDots({ count, active, onSelect, className = '' }: CarouselDotsProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`} role="tablist" aria-label="Paginación">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`Ir al elemento ${i + 1} de ${count}`}
          onClick={() => onSelect(i)}
          className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${
            i === active
              ? 'w-6 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
              : 'w-2 bg-white/25 hover:bg-white/45'
          }`}
        />
      ))}
    </div>
  );
}
