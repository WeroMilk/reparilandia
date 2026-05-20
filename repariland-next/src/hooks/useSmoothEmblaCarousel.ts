import { useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { EMBLA_SMOOTH_DURATION } from '@/lib/motionPresets';

/**
 * Carrusel Embla con scroll más fluido (tipo app nativa) y scrollTo animado en taps.
 */
export function useSmoothEmblaCarousel(options?: EmblaOptionsType) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : (options?.duration ?? EMBLA_SMOOTH_DURATION);

  const [carouselRef, emblaApi] = useEmblaCarousel({
    ...options,
    duration,
  });

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index, reduceMotion === true);
    },
    [emblaApi, reduceMotion],
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev(reduceMotion === true);
  }, [emblaApi, reduceMotion]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext(reduceMotion === true);
  }, [emblaApi, reduceMotion]);

  return [carouselRef, emblaApi, scrollTo, scrollPrev, scrollNext] as const;
}
