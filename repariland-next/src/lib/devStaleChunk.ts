/** Quita ?_fresh= de la URL (restos de un bucle de recarga en dev). */
export function stripFreshFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('_fresh')) return;
  url.searchParams.delete('_fresh');
  const next = url.pathname + (url.search || '') + url.hash;
  window.history.replaceState(window.history.state, '', next);
}
