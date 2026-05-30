import { redirect } from 'react-router';

// mdkit's docs site is docs-only (no marketing landing). SPA mode prerenders the
// root as a static shell, so the redirect runs client-side to avoid emitting a
// 302 during prerender of the SPA fallback.
export function clientLoader() {
  throw redirect('/docs');
}
clientLoader.hydrate = true as const;

export default function Index() {
  return null;
}
