import { useSyncExternalStore } from 'react'
import { PRODUCTION_REDIRECT_BASE } from '../config/redirects'

/** Origin der Live-Seite: Grundlage beim Prerender (kein window); der Client nimmt danach die tatsächliche Origin. */
const SITE_ORIGIN = 'https://yanqiva-bewertung.de'

/** Redirect-URL, wie sie in diesem Demo-Deployment erreichbar ist (z. B. GitHub Pages). */
export const demoRedirectUrl = (slug: string) =>
  new URL(`${import.meta.env.BASE_URL}r/${slug}/`, typeof window === 'undefined' ? SITE_ORIGIN : window.location.origin).toString()

const noopSubscribe = () => () => {}

/** Hydration-sicher: Server/erster Client-Render nutzen die Live-Origin, danach die echte. */
export function useDemoRedirectUrl(slug: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => demoRedirectUrl(slug),
    () => new URL(`${import.meta.env.BASE_URL}r/${slug}/`, SITE_ORIGIN).toString(),
  )
}

/** Redirect-URL, wie sie später auf echten Karten steht. */
export const productionRedirectUrl = (slug: string) => `${PRODUCTION_REDIRECT_BASE}${slug}`
