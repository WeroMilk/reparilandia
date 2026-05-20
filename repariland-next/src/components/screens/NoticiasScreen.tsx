import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { assetUrl } from '@/lib/assetUrl';

type NewsItem = {
  id: string;
  masthead: string;
  title: string;
  body: string;
  videoUrl?: string;
  videoLinkLabel?: string;
};

const newsItems: NewsItem[] = [
  {
    id: '1',
    masthead: 'La Gaceta del Taller',
    title: '¡Al infinito…\ny de vuelta a la vida!',
    body: 'Hace cuatro años rescatamos un Buzz Lightyear que parecía perdido para siempre: sin voz, sin luz, sin misión. Tornillo a tornillo y circuito a circuito, el equipo despertó al héroe de una generación entera. El momento quedó grabado y explotó en YouTube: más de 213 mil vistas en nuestra cuenta oficial. ¡Mira cómo volvió a brillar!',
    videoUrl: 'https://www.youtube.com/watch?v=gV_AQk5wl7M',
    videoLinkLabel: 'Ver el video en YouTube (213K+ vistas)',
  },
  {
    id: '2',
    masthead: 'El Monitor Retro',
    title: 'De Televisa\na Smart TV',
    body: 'Para el Día Mundial de la Televisión, Televisa México nos eligió para un reto épico: tomar un televisor de tubo con alma de salón y convertirlo en Smart TV sin perder su encanto vintage. Restauramos su corazón electrónico, modernizamos su cerebro y lo llevamos del pasado al futuro ante las cámaras. Una pieza de museo que volvió a encender pantallas… y corazones.',
    videoUrl: 'https://www.youtube.com/watch?v=rSTy6kwVw7U&t=118s',
    videoLinkLabel: 'Ver el proyecto en YouTube',
  },
  {
    id: '3',
    masthead: 'La Voz Reparilandia',
    title: 'Tu reparación,\n¡película completa!',
    body: '¿Imaginas recibir tu artefacto reparado y, además, la película de cómo renació? En Reparilandia lo hacemos realidad: somos el único taller que documenta cada intervención de principio a fin —del primer diagnóstico al último “¡funciona!”— y te entrega el video completo. No solo recuperas tu equipo: te llevas la emoción, el sudor y el triunfo de ver cómo volvió a la vida ante tus ojos.',
  },
];

const MONITO_NOTICIAS = '/assets/noticias-monito-nave.png';

function NewspaperSlide({
  masthead,
  title,
  body,
  videoUrl,
  videoLinkLabel,
}: {
  masthead: string;
  title: string;
  body: string;
  videoUrl?: string;
  videoLinkLabel?: string;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4efe4] text-zinc-900 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
      <header className="shrink-0 border-b-[3px] border-double border-zinc-900 px-2.5 pb-1.5 pt-2 sm:px-3 sm:pt-2.5">
        <div className="flex items-end justify-between gap-1.5 border-b border-zinc-800/25 pb-1">
          <div className="min-w-0">
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-700 sm:text-[12px]">
              Hermosillo, Sonora
            </p>
            <h4 className="font-serif text-sm font-black uppercase leading-tight tracking-tight text-zinc-950 max-lg:line-clamp-2 max-lg:text-[12px] sm:text-base lg:truncate">
              {masthead}
            </h4>
          </div>
          <span className="hidden shrink-0 font-serif text-[10px] tabular-nums text-zinc-600 sm:inline sm:text-[11px]">
            Edición · Reparilandia
          </span>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-1.5 sm:px-3 sm:py-2">
        <h3 className="shrink-0 whitespace-pre-line font-serif text-xs font-black uppercase leading-[1.12] text-zinc-950 sm:text-sm">
          {title}
        </h3>
        <div className="mt-1 h-px w-full shrink-0 bg-zinc-900/80" aria-hidden />
        <p className="mt-1.5 overflow-hidden font-serif text-[12px] leading-snug text-zinc-800 max-lg:line-clamp-[8] max-lg:text-[11px] max-lg:leading-[1.35] sm:text-[14px] sm:leading-relaxed lg:line-clamp-[5]">
          {body}
        </p>
        {videoUrl && videoLinkLabel ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex max-w-full shrink-0 items-center gap-1 font-serif text-[11px] font-bold uppercase tracking-wide text-red-800 underline decoration-red-800/50 underline-offset-2 transition-colors hover:text-red-950 hover:decoration-red-950 sm:text-[12px]"
          >
            <span aria-hidden>▶</span>
            <span className="line-clamp-2">{videoLinkLabel}</span>
          </a>
        ) : null}
      </div>
      <footer className="shrink-0 border-t border-zinc-400/60 bg-[#ebe4d4] px-2.5 py-1 text-center font-serif text-[11px] uppercase tracking-[0.2em] text-zinc-600 sm:px-3 sm:py-1.5 sm:text-[11px]">
        Taller y museo · Desde 1985
      </footer>
    </div>
  );
}

export default function NoticiasScreen() {
  const reduceMotion = useReducedMotion();
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
    <MobileScreenLayout
      title="NOTICIAS"
      lead="Desliza en la pantalla del televisor o usa las flechas para cambiar de noticia."
      hideLeadOnMobile
      className="noticias-screen"
    >
      <motion.div className="noticias-stage noticias-mobile-stage flex h-full min-h-0 max-h-full flex-1 flex-col items-center justify-start overflow-hidden overscroll-none px-1 pb-0 pt-1 max-lg:mt-0 max-lg:justify-start max-lg:gap-0.5 sm:px-5 lg:mt-0.5 lg:justify-start lg:translate-x-0 lg:px-6 lg:pt-0 xl:mt-1 xl:translate-x-1 xl:px-8">
        <motion.div
          className="noticias-monito-mobile pointer-events-none relative z-[16] mx-auto flex w-full shrink-0 items-end justify-center px-1 pb-0 max-lg:flex lg:hidden"
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={assetUrl(MONITO_NOTICIAS)}
            alt=""
            className="block h-auto w-full max-w-[min(70vw,15rem)] max-h-[min(11dvh,6.25rem)] bg-transparent object-contain object-bottom drop-shadow-[0_18px_36px_rgba(0,0,0,0.42)] [image-rendering:auto]"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <motion.div
          className="relative flex min-h-0 w-full max-w-[min(100%,60rem)] flex-col justify-start overflow-hidden max-lg:h-auto max-lg:max-h-none max-lg:flex-1 sm:max-w-[62rem] lg:h-full lg:max-h-full lg:shrink-0"
          initial={false}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="noticias-monito pointer-events-none absolute left-[clamp(-6.5rem,-18vw,-2rem)] z-[14] hidden w-[min(58vw,32rem)] items-center justify-center overflow-hidden bg-transparent xl:left-[clamp(-5rem,-14vw,0.25rem)] xl:flex xl:w-[min(56vw,34rem)] xl:-translate-x-2 xl:-translate-y-7"
            animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
            transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={assetUrl(MONITO_NOTICIAS)}
              alt="Personaje leyendo el periódico junto a una nave LEGO espacial"
              className="block h-auto max-h-full w-full bg-transparent object-contain object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] [image-rendering:auto]"
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </motion.div>

          <motion.div className="noticias-mobile-monitor-col relative z-[18] flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden lg:h-full lg:justify-start lg:translate-y-11 xl:translate-y-14">
            <motion.div className="flex w-full max-w-[44rem] flex-col items-center max-lg:ml-0 lg:ml-[clamp(7.5rem,18vw,12.5rem)] xl:max-w-[46rem] xl:-translate-x-1">
              <motion.div className="flex w-full items-center justify-center gap-3 max-lg:gap-0 sm:gap-3.5 lg:-translate-x-1.5 xl:-translate-x-2">
                <button
                  type="button"
                  aria-label="Noticia anterior"
                  onClick={scrollPrev}
                  className="mobile-carousel-arrow z-30 hidden h-12 w-12 shrink-0 self-center items-center justify-center rounded-md border-2 border-[#4a433c] bg-[#ebe3d3] text-[#1c1917] shadow-[3px_4px_0_#3f3832] transition-[transform,box-shadow] touch-manipulation hover:bg-[#ddd5c6] active:translate-x-px active:translate-y-px active:shadow-[2px_3px_0_#3f3832] lg:flex lg:h-14 lg:w-14"
                >
                  <ChevronLeft className="h-6 w-6 max-lg:h-5 max-lg:w-5 lg:h-7 lg:w-7" strokeWidth={2.25} />
                </button>

                <motion.div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden">
                  <motion.div className="noticias-crt-bezel relative w-full max-w-[min(94vw,24rem)] shrink-0 rounded-[6px] bg-gradient-to-b from-[#e8dfd2] via-[#cfc4b6] to-[#b9aea2] p-[clamp(7px,1.65vw,11px)] pb-[clamp(8px,1.75vw,12px)] shadow-[inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-4px_12px_rgba(0,0,0,0.08),0_14px_28px_rgba(0,0,0,0.42)] ring-2 ring-[#7a7269]/55 max-lg:max-w-[min(98vw,40rem)] max-lg:max-h-none max-lg:p-2 lg:max-w-[42rem] lg:max-h-[min(56cqh,54dvh)] lg:p-3 lg:pb-3.5">
                    <motion.div className="mb-2 flex justify-center gap-1.5 opacity-[0.38]" aria-hidden>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} className="h-1 w-6 rounded-full bg-[#3f3a34]" />
                      ))}
                    </motion.div>

                    <motion.div className="rounded-[4px] bg-[#141210] p-[6px] shadow-[inset_0_5px_14px_rgba(0,0,0,0.92)] ring-1 ring-black sm:p-[7px]">
                      <motion.div className="relative overflow-hidden rounded-[3px] bg-[#080706] shadow-[inset_0_0_0_4px_rgba(28,25,22,0.96)]">
                        <motion.div className="noticias-crt-screen relative aspect-[4/3] h-auto w-full min-h-0 shrink-0 overflow-hidden max-lg:aspect-[16/10] max-lg:max-h-[min(40dvh,20rem)] max-lg:min-h-0 lg:aspect-auto lg:h-[min(44cqh,46dvh)] lg:max-h-none">
                          <div className="relative h-full w-full overflow-hidden bg-[#cdbfaa]" ref={emblaRef}>
                            <motion.div className="flex h-full touch-pan-x">
                              {newsItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="min-w-0 shrink-0 grow-0 basis-full"
                                  role="group"
                                  aria-roledescription="slide"
                                  aria-label={item.title}
                                >
                                  <NewspaperSlide
                                    masthead={item.masthead}
                                    title={item.title}
                                    body={item.body}
                                    videoUrl={item.videoUrl}
                                    videoLinkLabel={item.videoLinkLabel}
                                  />
                                </div>
                              ))}
                            </motion.div>
                          </div>

                          <motion.div
                            className="pointer-events-none absolute inset-0 z-[12] shadow-[inset_0_0_52px_rgba(0,0,0,0.62)]"
                            aria-hidden
                          />
                          <motion.div
                            className="pointer-events-none absolute inset-0 z-[13] opacity-[0.04] bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0.45)_0px,rgba(0,0,0,0.45)_1px,transparent_1px,transparent_3px)]"
                            aria-hidden
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <motion.div className="mt-2 flex items-center justify-between border-t border-[#a69f94]/80 px-1 pt-1.5 font-serif text-[9px] font-semibold uppercase tracking-[0.32em] text-[#4d4740] sm:text-[10px]">
                      <span className="truncate">Reparilandia</span>
                      <span className="shrink-0 tabular-nums tracking-[0.28em]">CRT‑1985</span>
                    </motion.div>
                  </motion.div>

                  <motion.div className="relative mx-auto mt-0 flex w-full max-w-[42rem] flex-col items-center px-1">
                    <motion.div
                      className="noticias-crt-stand-neck h-9 max-lg:h-[clamp(2.25rem,6dvh,3.25rem)] max-lg:w-[92%] w-[88%] max-w-[36rem] bg-gradient-to-b from-[#a39b92] via-[#8f877e] to-[#6e6760] shadow-[inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-3px_8px_rgba(0,0,0,0.38)] [clip-path:polygon(7%_0,93%_0,100%_100%,0_100%)] lg:h-11"
                      aria-hidden
                    />
                    <motion.div
                      className="-mt-px h-3 w-[94%] max-w-[36rem] rounded-b-md bg-gradient-to-b from-[#4a4540] to-[#2f2c28] shadow-[0_8px_18px_rgba(0,0,0,0.55)] ring-1 ring-black/45"
                      aria-hidden
                    />
                    <motion.div className="mt-1.5 flex justify-center gap-2 pb-0">
                      {newsItems.map((_, i) => (
                        <button
                          key={newsItems[i]?.id ?? i}
                          type="button"
                          aria-label={`Ver noticia: ${newsItems[i]?.title ?? i + 1}`}
                          aria-current={i === slideIndex ? 'true' : undefined}
                          onClick={() => emblaApi?.scrollTo(i)}
                          className={`h-3 rounded-full transition-all duration-300 touch-manipulation active:scale-95 ${
                            i === slideIndex
                              ? 'w-7 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.62)] ring-1 ring-amber-900/35'
                              : 'w-2.5 bg-[#5c4f3d] ring-1 ring-black/30 hover:bg-[#6d5e49]'
                          }`}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>

                <button
                  type="button"
                  aria-label="Noticia siguiente"
                  onClick={scrollNext}
                  className="mobile-carousel-arrow z-30 hidden h-12 w-12 shrink-0 self-center items-center justify-center rounded-md border-2 border-[#4a433c] bg-[#ebe3d3] text-[#1c1917] shadow-[3px_4px_0_#3f3832] transition-[transform,box-shadow] touch-manipulation hover:bg-[#ddd5c6] active:translate-x-px active:translate-y-px active:shadow-[2px_3px_0_#3f3832] lg:flex lg:h-14 lg:w-14"
                >
                  <ChevronRight className="h-6 w-6 max-lg:h-5 max-lg:w-5 lg:h-7 lg:w-7" strokeWidth={2.25} />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </MobileScreenLayout>
  );
}
