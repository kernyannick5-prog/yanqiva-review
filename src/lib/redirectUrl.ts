import { PRODUCTION_REDIRECT_BASE } from '../config/redirects'

/** Redirect-URL, wie sie in diesem Demo-Deployment erreichbar ist (z. B. GitHub Pages). */
export const demoRedirectUrl = (slug: string) =>
  new URL(`${import.meta.env.BASE_URL}r/${slug}/`, window.location.origin).toString()

/** Redirect-URL, wie sie später auf echten Karten steht. */
export const productionRedirectUrl = (slug: string) => `${PRODUCTION_REDIRECT_BASE}${slug}`
