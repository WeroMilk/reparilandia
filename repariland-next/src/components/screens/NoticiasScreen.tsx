import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { assetUrl } from '@/lib/assetUrl';

const newsItems = [
  {
    id: '1',
    title: 'Horario ampliado en verano',
    body: 'Ajustamos turnos para dar cabida a más reparaciones urgentes en consolas y laptops.',
  },
  {
    id: '2',
    title: 'Taller + museo',
    body: 'Visita guiada los sábados: piezas icónicas y cómo restauramos cada proyecto.',
  },
  {
    id: '3',
    title: 'Carritos montables',
    body: 'Seguimos con carritos y juguetes electrónicos con el mismo cuidado de siempre.',
  },
];

const MONITO_NOTICIAS = '/assets/monito-noticias.png';

export default function NoticiasScreen() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, axis: 'x', duration: 22 });
  const [slideIndex, setSlideIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSlideIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="screen-shell flex min-h-0 flex-1 flex-col overflow-hidden">
      <h2 className="shrink-0 text-center font-orbitron text-lg tracking-[0.32em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] sm:text-xl md:text-2xl">
        NOTICIAS
      </h2>
      <p className="mx-auto mt-1 max-w-md shrink-0 px-2 text-center font-space text-[10px] text-white/55 sm:text-[11px]">
        Desliza en la pantalla del equipo o usa las flechas para cambiar de noticia.
      </p>

      <div className="mt-2 flex min-h-0 flex-1 flex-col-reverse items-center justify-center gap-4 px-2 pb-2 sm:mt-3 sm:gap-5 lg:flex-row lg:items-end lg:gap-10 lg:px-6 lg:pb-3">
        <motion.div
          className="relative flex shrink-0 items-end justify-center lg:w-[min(40%,22rem)] lg:max-w-none lg:items-end"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative w-[min(58vw,17rem)] sm:w-[min(50vw,19rem)] lg:w-full lg:max-w-[19.5rem] xl:max-w-[21rem]">
            <motion.img
              src={assetUrl(MONITO_NOTICIAS)}
              alt="Leyendo las noticias de Reparilandia"
              className="mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_28px_55px_rgba(0,0,0,0.55)]"
              draggable={false}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        <motion.div
          className="relative flex w-full max-w-[min(98vw,36rem)] flex-1 flex-col items-center justify-center sm:max-w-[38rem] lg:max-w-[42rem]"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative w-full drop-shadow-[0_38px_95px_rgba(0,0,0,0.78)]">
            {/* Tapa / pantalla */}
            <div className="rounded-t-[1.1rem] border-x border-t border-zinc-400/30 bg-gradient-to-b from-zinc-400/85 via-zinc-600/92 to-zinc-700 p-[0.5rem] pb-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] sm:rounded-t-[1.25rem] sm:p-[0.6rem]">
              <div className="overflow-hidden rounded-t-[0.6rem] bg-zinc-950 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.85),0_4px_24px_rgba(0,0,0,0.45)] ring-1 ring-black/60">
                <div className="flex items-center gap-3 border-b border-black/60 bg-zinc-900 px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5f57] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.35)]" />
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#febc2e] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.35)]" />
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28c840] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.35)]" />
                  </div>
                  <div className="mx-auto hidden h-2 w-20 rounded-full bg-zinc-800/95 ring-1 ring-black/40 sm:block" aria-hidden />
                </div>

                <div className="relative aspect-[16/10] w-full min-h-[13.5rem] overflow-hidden sm:min-h-[15.5rem] md:min-h-[17.5rem] lg:min-h-[19rem]">
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black"
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute inset-[1px] rounded-sm bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent opacity-50" aria-hidden />

                  <div className="relative h-full w-full overflow-hidden" ref={emblaRef}>
                    <div className="flex h-full touch-pan-x">
                      {newsItems.map((item) => (
                        <div
                          key={item.id}
                          className="min-w-0 shrink-0 grow-0 basis-full px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4 md:px-6"
                          role="group"
                          aria-roledescription="slide"
                          aria-label={item.title}
                        >
                          <h3 className="font-orbitron text-sm font-semibold tracking-wide text-cyan-100 sm:text-base md:text-lg">
                            {item.title}
                          </h3>
                          <p className="mt-2.5 font-space text-[11px] leading-relaxed text-white/90 sm:mt-3 sm:text-sm md:text-[0.9375rem] md:leading-relaxed">
                            {item.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Noticia anterior"
                    onClick={scrollPrev}
                    className="absolute bottom-3 left-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/95 shadow-lg backdrop-blur-md touch-manipulation hover:bg-black/72 sm:bottom-auto sm:left-3 sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Noticia siguiente"
                    onClick={scrollNext}
                    className="absolute bottom-3 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/95 shadow-lg backdrop-blur-md touch-manipulation hover:bg-black/72 sm:bottom-auto sm:right-3 sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bisagra */}
            <div
              className="h-[5px] w-full bg-gradient-to-b from-zinc-500 via-zinc-700 to-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35)]"
              aria-hidden
            />

            {/* Base / teclado */}
            <div className="rounded-b-[1rem] border-x border-b border-zinc-500/35 bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-900 px-4 pb-3 pt-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-b-[1.15rem] sm:px-5 sm:pb-4 sm:pt-3">
              <div className="flex justify-center gap-2 pb-2 sm:pb-2.5" aria-hidden>
                {newsItems.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-5 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.55)]' : 'w-1.5 bg-white/20'}`}
                  />
                ))}
              </div>
              <div
                className="mx-auto h-11 max-w-[68%] rounded-xl bg-zinc-950/50 shadow-[inset_0_3px_10px_rgba(0,0,0,0.55)] ring-1 ring-black/50 sm:h-12 sm:max-w-[65%]"
                aria-hidden
              />
              <div className="mx-auto mt-2.5 h-1 w-[32%] rounded-full bg-zinc-950/80 shadow-inner ring-1 ring-white/5" aria-hidden />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
