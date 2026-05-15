import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { assetUrl } from '@/lib/assetUrl';

const newsItems = [
  {
    id: '1',
    masthead: 'La Gaceta del Taller',
    title: 'Horario ampliado en verano',
    body: 'Ajustamos turnos para dar cabida a más reparaciones urgentes en consolas y laptops.',
  },
  {
    id: '2',
    masthead: 'El Monitor Retro',
    title: 'Taller + museo',
    body: 'Visita guiada los sábados: piezas icónicas y cómo restauramos cada proyecto.',
  },
  {
    id: '3',
    masthead: 'La Voz Reparilandia',
    title: 'Carritos montables',
    body: 'Seguimos con carritos y juguetes electrónicos con el mismo cuidado de siempre.',
  },
];

const MONITO_NOTICIAS = '/assets/monito-noticias.png';

function NewspaperSlide({ masthead, title, body }: { masthead: string; title: string; body: string }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4efe4] text-zinc-900 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
      <header className="shrink-0 border-b-[3px] border-double border-zinc-900 px-3 pb-2 pt-2.5 sm:px-4 sm:pt-3">
        <div className="flex items-end justify-between gap-2 border-b border-zinc-800/25 pb-1.5">
          <div>
            <p className="font-serif text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-700 sm:text-[11px]">Hermosillo, Sonora</p>
            <h4 className="font-serif text-lg font-black uppercase leading-none tracking-tight text-zinc-950 sm:text-xl">{masthead}</h4>
          </div>
          <span className="shrink-0 font-serif text-[9px] tabular-nums text-zinc-600 sm:text-[10px]">Edición del día · Reparilandia</span>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        <h3 className="font-serif text-base font-black uppercase leading-[1.15] text-zinc-950 sm:text-lg">{title}</h3>
        <div className="mt-2 h-px w-full bg-zinc-900/80" aria-hidden />
        <p className="mt-3 columns-1 gap-x-4 font-serif text-[11px] leading-relaxed text-zinc-800 sm:columns-2 sm:text-[12px] sm:leading-snug">
          {body}
        </p>
      </div>
      <footer className="shrink-0 border-t border-zinc-400/60 bg-[#ebe4d4] px-3 py-1 text-center font-serif text-[8px] uppercase tracking-[0.25em] text-zinc-600 sm:text-[9px]">
        Taller y museo · Desde 1985
      </footer>
    </div>
  );
}

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
    <div className="screen-shell flex min-h-0 flex-1 flex-col !overflow-x-visible overflow-y-hidden !pt-[clamp(2rem,5dvh,3.5rem)] lg:!pt-[clamp(2.25rem,5.5dvh,3.75rem)]">
      <h2 className="shrink-0 text-center font-orbitron text-lg tracking-[0.32em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] sm:text-xl md:text-2xl">
        NOTICIAS
      </h2>
      <p className="mx-auto mt-0.5 max-w-md shrink-0 px-2 text-center font-space text-[10px] text-white/55 sm:text-[11px]">
        Desliza en la pantalla del televisor o usa las flechas para cambiar de noticia.
      </p>

      <div className="mt-1 flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-1 pt-0 sm:mt-2 sm:px-5 lg:px-6">
        {/* CRT centrado en la fila; caricatura más grande; columna del CRT con ml para hueco respecto al monito */}
        <motion.div
          className="relative w-full max-w-[min(100vw,56rem)] shrink-0 -translate-y-[clamp(0.75rem,3.5vh,2.25rem)] overflow-visible sm:max-w-[58rem] sm:-translate-y-[clamp(1rem,4.5vh,2.75rem)] lg:-translate-y-[clamp(1.25rem,5vh,3.25rem)]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute z-[14] w-[min(78vw,24rem)] sm:w-[min(74vw,27rem)] md:w-[min(68vw,30rem)] lg:w-[min(58vw,33rem)] xl:w-[min(52vw,36rem)]"
            style={{
              left: 'clamp(-10rem, -28vw, -4.75rem)',
              bottom: 'clamp(1.25rem, 9vmin, 3.25rem)',
            }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={assetUrl(MONITO_NOTICIAS)}
              alt="Leyendo las noticias de Reparilandia"
              className="h-auto w-full max-h-[min(58vh,30rem)] object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.52)] [image-rendering:auto] sm:max-h-[min(62vh,33rem)] md:max-h-[min(64vh,36rem)] lg:max-h-[min(68vh,40rem)] xl:max-h-[min(74vh,44rem)]"
              draggable={false}
            />
          </motion.div>

          <div className="relative z-[18] flex w-full min-h-0 flex-col items-center justify-center">
            {/* Flechas alineadas al centro vertical del CRT (sin pedestal ni puntos); todo el bloque con ml para separar la caricatura */}
            <div className="flex w-full max-w-[38rem] flex-col items-center lg:max-w-[36rem] xl:max-w-[38rem] ml-[clamp(4rem,13vw,7rem)] sm:ml-[clamp(4.75rem,14vw,8.5rem)] md:ml-[clamp(5.25rem,15vw,9.5rem)] lg:ml-[clamp(6rem,16vw,11rem)]">
              <div className="flex w-full items-center justify-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  aria-label="Noticia anterior"
                  onClick={scrollPrev}
                  className="z-30 flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-md border-2 border-[#4a433c] bg-[#ebe3d3] text-[#1c1917] shadow-[3px_4px_0_#3f3832] transition-[transform,box-shadow] touch-manipulation hover:bg-[#ddd5c6] active:translate-x-px active:translate-y-px active:shadow-[2px_3px_0_#3f3832] sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                </button>

                <div className="relative flex min-w-0 flex-1 justify-center drop-shadow-[0_32px_85px_rgba(0,0,0,0.78)]">
            {/* CRT vintage — marco beige, bisel oscuro (solo cuerpo del televisor; pedestal abajo) */}
            <div className="relative w-full max-w-[34rem] rounded-[6px] bg-gradient-to-b from-[#e8dfd2] via-[#cfc4b6] to-[#b9aea2] p-[11px] pb-[14px] shadow-[inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-4px_12px_rgba(0,0,0,0.08),0_14px_28px_rgba(0,0,0,0.42)] ring-2 ring-[#7a7269]/55">
              <div className="mb-2.5 flex justify-center gap-1.5 opacity-[0.38]" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="h-1 w-6 rounded-full bg-[#3f3a34]" />
                ))}
              </div>

              <div className="rounded-[4px] bg-[#141210] p-[7px] shadow-[inset_0_5px_14px_rgba(0,0,0,0.92)] ring-1 ring-black">
                <div className="relative overflow-hidden rounded-[3px] bg-[#080706] shadow-[inset_0_0_0_4px_rgba(28,25,22,0.96)]">
                  <div className="relative aspect-[16/10] w-full min-h-[13.5rem] overflow-hidden sm:min-h-[15.5rem] md:min-h-[17rem] lg:min-h-[18rem]">
                    <div className="relative h-full w-full overflow-hidden bg-[#cdbfaa]" ref={emblaRef}>
                      <div className="flex h-full touch-pan-x">
                        {newsItems.map((item) => (
                          <div
                            key={item.id}
                            className="min-w-0 shrink-0 grow-0 basis-full"
                            role="group"
                            aria-roledescription="slide"
                            aria-label={item.title}
                          >
                            <NewspaperSlide masthead={item.masthead} title={item.title} body={item.body} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className="pointer-events-none absolute inset-0 z-[12] shadow-[inset_0_0_52px_rgba(0,0,0,0.62)]"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 z-[13] opacity-[0.04] bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0.45)_0px,rgba(0,0,0,0.45)_1px,transparent_1px,transparent_3px)]"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#a69f94]/80 px-1 pt-2 font-serif text-[8px] font-semibold uppercase tracking-[0.38em] text-[#4d4740] sm:text-[9px]">
                <span className="truncate">Reparilandia</span>
                <span className="shrink-0 tabular-nums tracking-[0.28em]">CRT‑1985</span>
              </div>
            </div>
                </div>

                <button
                  type="button"
                  aria-label="Noticia siguiente"
                  onClick={scrollNext}
                  className="z-30 flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-md border-2 border-[#4a433c] bg-[#ebe3d3] text-[#1c1917] shadow-[3px_4px_0_#3f3832] transition-[transform,box-shadow] touch-manipulation hover:bg-[#ddd5c6] active:translate-x-px active:translate-y-px active:shadow-[2px_3px_0_#3f3832] sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>

              <div className="relative mx-auto mt-0 flex w-full max-w-[34rem] flex-col items-center px-1">
                <div
                  className="h-9 w-[88%] max-w-[28rem] bg-gradient-to-b from-[#a39b92] via-[#8f877e] to-[#6e6760] shadow-[inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-3px_8px_rgba(0,0,0,0.38)] [clip-path:polygon(7%_0,93%_0,100%_100%,0_100%)]"
                  aria-hidden
                />
                <div
                  className="-mt-px h-2.5 w-[94%] max-w-[28rem] rounded-b-md bg-gradient-to-b from-[#4a4540] to-[#2f2c28] shadow-[0_8px_18px_rgba(0,0,0,0.55)] ring-1 ring-black/45"
                  aria-hidden
                />
                <div className="mt-3 flex justify-center gap-2 pb-0.5">
                  {newsItems.map((_, i) => (
                    <button
                      key={newsItems[i]?.id ?? i}
                      type="button"
                      aria-label={`Ver noticia: ${newsItems[i]?.title ?? i + 1}`}
                      aria-current={i === slideIndex ? 'true' : undefined}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${
                        i === slideIndex
                          ? 'w-6 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.62)] ring-1 ring-amber-900/35'
                          : 'w-2 bg-[#5c4f3d] ring-1 ring-black/30 hover:bg-[#6d5e49]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
