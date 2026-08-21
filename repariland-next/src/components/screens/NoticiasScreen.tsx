import { useCallback, useEffect, useState } from 'react';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSmoothEmblaCarousel } from '@/hooks/useSmoothEmblaCarousel';
import { assetUrl } from '@/lib/assetUrl';
import { useNoticiasMobileZone } from '@/hooks/useNoticiasMobileZone';
import { useNoticiasMobileCrtSize } from '@/hooks/useNoticiasMobileCrtSize';
import { EMBLA_FAST_DURATION_MOBILE } from '@/lib/motionPresets';

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
    id: '4',
    masthead: 'Extra — Redes',
    title: '¿Y tú, ya nos\nconoces?',
    body: 'Si todavía no has cruzado la puerta del taller-museo, este reel es tu mejor carta de presentación: en minutos te contamos quiénes somos, de dónde nace la obsesión por revivir piezas con alma y te damos un paseo express por los rincones que nos hacen únicos. ¡Dale play y descubre por qué Reparilandia no es un taller cualquiera… es una experiencia que tienes que vivir!',
    videoUrl: 'https://www.facebook.com/reel/636833111765367',
    videoLinkLabel: 'Ver video en Facebook — tour y presentación',
  },
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

const MONITO_NOTICIAS = '/assets/noticias-monito-nave.webp';

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
    <div className="flex h-full min-h-0 flex-col bg-[#f7f1e6] text-zinc-950 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
      <header className="shrink-0 border-b-[3px] border-double border-zinc-900 px-3 pb-1.5 pt-2.5 sm:px-3.5 sm:pt-3">
        <div className="flex items-end justify-between gap-1.5 border-b border-zinc-800/25 pb-1">
          <div className="min-w-0">
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-700 sm:text-[12px]">
              Hermosillo, Sonora
            </p>
            <h4 className="noticias-slide-masthead font-serif text-base font-black uppercase leading-tight tracking-tight text-zinc-950 max-lg:text-[0.9375rem] sm:text-lg lg:truncate">
              {masthead}
            </h4>
          </div>
          <span className="hidden shrink-0 font-serif text-[10px] tabular-nums text-zinc-600 sm:inline sm:text-[11px]">
            Edición · Reparilandia
          </span>
        </div>
      </header>
      <div
        className="noticias-slide-body min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-2.5 sm:px-3.5 sm:py-3"
        tabIndex={0}
        role="region"
        aria-label="Texto de la noticia"
        onWheel={(event) => event.stopPropagation()}
      >
        <h3 className="noticias-slide-title whitespace-pre-line font-serif text-[1.0625rem] font-black uppercase leading-[1.18] text-zinc-950 max-lg:text-[1.125rem] sm:text-lg">
          {title}
        </h3>
        <div className="mt-1.5 h-px w-full bg-zinc-900/80" aria-hidden />
        <p className="noticias-slide-copy mt-2.5 font-serif text-[1rem] font-medium leading-[1.5] text-[#1c1917] max-lg:text-[1.0625rem] max-lg:leading-[1.55] sm:text-[1.0625rem] sm:leading-relaxed">
          {body}
        </p>
        {videoUrl && videoLinkLabel ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex max-w-full items-center gap-1 font-serif text-[0.8125rem] font-bold uppercase tracking-wide text-red-800 underline decoration-red-800/50 underline-offset-2 transition-colors hover:text-red-950 hover:decoration-red-950 sm:text-[0.875rem]"
          >
            <span aria-hidden>▶</span>
            <span className="line-clamp-2">{videoLinkLabel}</span>
          </a>
        ) : null}
      </div>
      <footer className="shrink-0 border-t border-zinc-400/60 bg-[#ebe4d4] px-3 py-1.5 text-center font-serif text-[11px] uppercase tracking-[0.18em] text-zinc-700 sm:px-3.5 sm:py-1.5 sm:text-[12px]">
        Taller y museo · Desde 1985
      </footer>
    </div>
  );
}

export default function NoticiasScreen({ isScreenActive = true }: { isScreenActive?: boolean }) {
  useNoticiasMobileZone(isScreenActive);
  useNoticiasMobileCrtSize(isScreenActive);

  const watchDrag = useCallback((_emblaApi: unknown, event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return true;
    if (target.closest('a, button')) return false;
    /* El texto puede hacer scroll vertical; Embla solo toma el gesto horizontal. */
    return true;
  }, []);

  const [emblaRef, emblaApi, scrollTo, scrollPrev, scrollNext] = useSmoothEmblaCarousel({
    loop: true,
    axis: 'x',
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    skipSnaps: false,
    watchDrag,
    duration: EMBLA_FAST_DURATION_MOBILE,
    dragThreshold: 8,
  });
  const [slideIndex, setSlideIndex] = useState(0);

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

  useEffect(() => {
    if (!emblaApi || !isScreenActive) return;
    const screen = document.querySelector('[data-screen="noticias"]');
    if (!screen) return;

    let timer = 0;
    let didInit = false;

    const reinit = (force = false) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            const engine = emblaApi.internalEngine();
            if (engine?.dragHandler?.pointerDown?.()) return;
          } catch {
            /* ignore */
          }
          emblaApi.reInit();
          didInit = true;
        });
      }, force ? 40 : 180);
    };

    const observer = new MutationObserver(() => {
      if (screen.hasAttribute('data-noticias-layout-ready') && !didInit) reinit(true);
    });
    observer.observe(screen, {
      attributes: true,
      attributeFilter: ['data-noticias-layout-ready'],
    });
    const onResize = () => reinit(false);
    window.addEventListener('resize', onResize, { passive: true });
    if (screen.hasAttribute('data-noticias-layout-ready')) reinit(true);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [emblaApi, isScreenActive]);

  return (
    <MobileScreenLayout
      title="NOTICIAS"
      lead="Desliza en la pantalla del televisor o usa las flechas para cambiar de noticia."
      hideLeadOnMobile
      className="noticias-screen"
      data-screen="noticias"
    >
      <div className="noticias-mobile-stage-positioner max-lg:flex max-lg:min-h-0 max-lg:w-full max-lg:flex-1 max-lg:flex-col max-lg:items-center lg:contents">
        <div className="noticias-stage noticias-mobile-stage flex min-h-0 w-full max-h-full flex-col items-center max-lg:overflow-visible overflow-hidden overscroll-none px-2 pb-0 max-lg:min-h-0 max-lg:flex-1 max-lg:justify-center max-lg:gap-0 max-lg:pt-0 sm:px-5 lg:h-full lg:flex-1 lg:mt-0.5 lg:justify-start lg:gap-1 lg:translate-x-0 lg:px-6 lg:pt-0 xl:mt-1 xl:translate-x-1 xl:px-8">
          <div className="noticias-mobile-content relative flex min-h-0 w-full max-w-[min(100%,60rem)] flex-col overflow-hidden max-lg:min-h-0 max-lg:flex-none max-lg:shrink-0 max-lg:justify-start max-lg:overflow-visible sm:max-w-[62rem] lg:h-full lg:max-h-full lg:flex-none lg:shrink-0 lg:justify-start">
            <div
              className="noticias-monito pointer-events-none absolute left-[clamp(-6.5rem,-18vw,-2rem)] z-[14] hidden w-[min(58vw,32rem)] items-center justify-center overflow-hidden bg-transparent xl:left-[clamp(-5rem,-14vw,0.25rem)] xl:flex xl:w-[min(56vw,34rem)] xl:-translate-x-2 xl:-translate-y-7"
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(MONITO_NOTICIAS)}
                alt="Personaje leyendo el periódico junto a una nave LEGO espacial"
                className="block h-auto max-h-full w-full bg-transparent object-contain object-center [image-rendering:auto]"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="noticias-mobile-monitor-col relative z-[18] flex min-h-0 w-full max-w-full flex-col items-center max-lg:overflow-visible overflow-hidden max-lg:min-h-0 max-lg:flex-none max-lg:shrink-0 max-lg:items-center max-lg:justify-start lg:h-full lg:flex-1 lg:justify-start lg:translate-y-11 xl:translate-y-14">
              <div className="flex w-full max-w-[44rem] flex-col items-center max-lg:ml-0 lg:ml-[clamp(7.5rem,18vw,12.5rem)] xl:max-w-[46rem] xl:-translate-x-1">
                <div className="noticias-mobile-crt-row flex w-full items-center max-lg:justify-center max-lg:gap-0 lg:justify-center gap-3 sm:gap-3.5 lg:-translate-x-1.5 xl:-translate-x-2">
                  <button
                    type="button"
                    aria-label="Noticia anterior"
                    onClick={scrollPrev}
                    className="mobile-carousel-arrow z-30 hidden h-12 w-12 shrink-0 self-center items-center justify-center rounded-md border-2 border-[#4a433c] bg-[#ebe3d3] text-[#1c1917] shadow-[3px_4px_0_#3f3832] touch-manipulation hover:bg-[#ddd5c6] active:translate-x-px active:translate-y-px active:shadow-[2px_3px_0_#3f3832] lg:flex lg:h-14 lg:w-14"
                  >
                    <ChevronLeft className="h-6 w-6 max-lg:h-5 max-lg:w-5 lg:h-7 lg:w-7" strokeWidth={2.25} />
                  </button>

                  <div className="noticias-mobile-crt-wrap relative flex min-h-0 min-w-0 w-full max-w-full flex-col items-center max-lg:overflow-visible overflow-hidden max-lg:flex-none max-lg:shrink-0 max-lg:justify-start lg:flex-1 lg:justify-center">
                    <div className="noticias-crt-monitor-unit relative w-full max-w-full">
                      <div className="noticias-monito-mobile pointer-events-none lg:hidden" aria-hidden>
                        <div className="flex h-full w-full items-end justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={assetUrl(MONITO_NOTICIAS)}
                            alt=""
                            className="noticias-monito-mobile-img block h-auto max-h-full w-auto max-w-full bg-transparent object-contain object-bottom [image-rendering:auto]"
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="noticias-crt-bezel relative mx-auto flex w-full max-w-full flex-col rounded-[6px] bg-gradient-to-b from-[#e8dfd2] via-[#cfc4b6] to-[#b9aea2] p-[clamp(7px,1.65vw,11px)] pb-[clamp(8px,1.75vw,12px)] shadow-[inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-4px_12px_rgba(0,0,0,0.08),0_14px_28px_rgba(0,0,0,0.42)] ring-2 ring-[#7a7269]/55 max-lg:min-h-0 max-lg:shrink-0 max-lg:flex-none max-lg:p-2 lg:max-w-[42rem] lg:min-h-0 lg:max-h-[min(56cqh,54dvh)] lg:flex-none lg:shrink-0 lg:p-3 lg:pb-3.5">
                        <div className="mb-1.5 flex justify-center gap-1.5 opacity-[0.38] max-lg:mb-1" aria-hidden>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <span key={i} className="h-1 w-6 rounded-full bg-[#3f3a34]" />
                          ))}
                        </div>

                        <div className="noticias-crt-inner rounded-[4px] bg-[#141210] p-[6px] shadow-[inset_0_5px_14px_rgba(0,0,0,0.92)] ring-1 ring-black sm:p-[7px]">
                          <div className="relative overflow-hidden rounded-[3px] bg-[#080706] shadow-[inset_0_0_0_4px_rgba(28,25,22,0.96)]">
                            <div className="noticias-crt-screen relative aspect-[4/3] h-auto w-full min-h-0 shrink-0 overflow-hidden max-lg:[aspect-ratio:var(--noticias-crt-aspect,1.25)] max-lg:h-auto max-lg:max-h-none max-lg:min-h-0 max-lg:flex-none lg:aspect-auto lg:h-[min(44cqh,46dvh)] lg:max-h-none lg:flex-none">
                              <div
                                className="embla-fluid relative h-full w-full overflow-hidden bg-[#cdbfaa]"
                                ref={emblaRef}
                              >
                                <div className="flex h-full min-h-0 touch-pan-x will-change-transform">
                                  {newsItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className="h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full"
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
                                </div>
                              </div>

                              <div
                                className="noticias-crt-vignette pointer-events-none absolute inset-0 z-[12] shadow-[inset_0_0_18px_rgba(0,0,0,0.16)] max-lg:shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"
                                aria-hidden
                              />
                              <div
                                className="noticias-crt-scan pointer-events-none absolute inset-0 z-[13] opacity-[0.016] max-lg:opacity-0 bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)]"
                                aria-hidden
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between border-t border-[#a69f94]/80 px-1 pt-1 font-serif text-[9px] font-semibold uppercase tracking-[0.32em] text-[#4d4740] sm:mt-2 sm:pt-1.5 sm:text-[10px]">
                          <span className="truncate">Reparilandia</span>
                          <span className="shrink-0 tabular-nums tracking-[0.28em]">CRT‑1985</span>
                        </div>
                      </div>
                    </div>

                    <div className="noticias-mobile-crt-foot relative mx-auto mt-0 flex w-full max-w-[42rem] flex-col items-center px-1">
                      <div
                        className="noticias-crt-stand-neck h-9 max-lg:h-[clamp(1.65rem,4.5dvh,2.35rem)] max-lg:w-[92%] w-[88%] max-w-[36rem] bg-gradient-to-b from-[#a39b92] via-[#8f877e] to-[#6e6760] shadow-[inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-3px_8px_rgba(0,0,0,0.38)] [clip-path:polygon(7%_0,93%_0,100%_100%,0_100%)] lg:h-11"
                        aria-hidden
                      />
                      <div
                        className="-mt-px h-3 w-[94%] max-w-[36rem] rounded-b-md bg-gradient-to-b from-[#4a4540] to-[#2f2c28] shadow-[0_8px_18px_rgba(0,0,0,0.55)] ring-1 ring-black/45"
                        aria-hidden
                      />
                      <div className="noticias-mobile-dots mt-1.5 flex justify-center gap-2 max-lg:max-h-[1.25rem]">
                        {newsItems.map((item, i) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={`Ver noticia: ${item.title}`}
                            aria-current={i === slideIndex ? 'true' : undefined}
                            onClick={() => scrollTo(i)}
                            className={`h-3 rounded-full touch-manipulation active:scale-95 ${
                              i === slideIndex
                                ? 'w-7 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.62)] ring-1 ring-amber-900/35'
                                : 'w-2.5 bg-[#5c4f3d] ring-1 ring-black/30 hover:bg-[#6d5e49]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Noticia siguiente"
                    onClick={scrollNext}
                    className="mobile-carousel-arrow z-30 hidden h-12 w-12 shrink-0 self-center items-center justify-center rounded-md border-2 border-[#4a433c] bg-[#ebe3d3] text-[#1c1917] shadow-[3px_4px_0_#3f3832] touch-manipulation hover:bg-[#ddd5c6] active:translate-x-px active:translate-y-px active:shadow-[2px_3px_0_#3f3832] lg:flex lg:h-14 lg:w-14"
                  >
                    <ChevronRight className="h-6 w-6 max-lg:h-5 max-lg:w-5 lg:h-7 lg:w-7" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="noticias-mobile-swipe-hint pointer-events-none mx-auto max-w-[22rem] shrink-0 px-3 text-center font-space text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.14em] text-cyan-200/88 lg:hidden">
          DESLIZA PARA VER MÁS NOTICIAS
        </p>
      </div>
    </MobileScreenLayout>
  );
}
