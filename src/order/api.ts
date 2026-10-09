/**
 * Anbindung an den Worker yanqiva-api: Spamschutz (Honeypot, Startzeit, Proof of Work), POST /api/lead
 * und mailto-Rückfall. Portiert aus yanqiva.de (site/js/config.js), hier typisiert und ohne DOM-Seiteneffekte.
 */
import { CONTACT_EMAIL } from './catalog'

export const API_BASE = 'https://yanqiva-api.yanqiva-api.workers.dev'

export type ApiErrorKind = 'network' | 'api'

/** Fehler der API: 'network' = nicht erreichbar/ungültige Antwort/Zeitüberschreitung, 'api' = Server hat abgelehnt (Meldung auf Deutsch). */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly code?: string
  readonly status?: number
  constructor(kind: ApiErrorKind, message: string, extra: { code?: string; status?: number } = {}) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.code = extra.code
    this.status = extra.status
  }
}

interface ErrorBody {
  error?: unknown
  code?: unknown
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return (await res.json()) as unknown
  } catch {
    return null
  }
}

async function request(path: string, init: RequestInit, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let res: Response
    try {
      res = await fetch(API_BASE + path, { ...init, signal: controller.signal })
    } catch {
      throw new ApiError('network', 'Netzwerkfehler')
    }
    const data = await readJson(res)
    const body = (typeof data === 'object' && data !== null ? data : null) as ErrorBody | null
    const message = body && typeof body.error === 'string' && body.error ? body.error : ''
    if (!res.ok || message) {
      const code = body && typeof body.code === 'string' ? body.code : undefined
      const kind: ApiErrorKind = message ? 'api' : res.status >= 500 ? 'network' : 'api'
      throw new ApiError(kind, message || `Die Anfrage konnte nicht verarbeitet werden (Status ${res.status}).`, { code, status: res.status })
    }
    if (data === null) throw new ApiError('network', 'Keine gültige Antwort vom Server.') // z. B. WLAN-Anmeldeseite
    return data
  } finally {
    clearTimeout(timer)
  }
}

export const getJson = (path: string, timeoutMs = 30000) => request(path, { headers: { Accept: 'application/json' } }, timeoutMs)

export const postJson = (path: string, payload: unknown, timeoutMs = 60000) =>
  request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, timeoutMs)

// ---- Proof of Work (SHA-256, selbst gehostet, keine Cookies) ----

export interface PowSolution {
  salt: string
  difficulty: number
  expires: unknown
  sig: unknown
  nonce: string
}

interface Challenge {
  algorithm: string
  salt: string
  difficulty: number
  expires?: unknown
  sig?: unknown
}

const POW_MAX_WAIT = 25000
const POW_MAX_AGE = 8 * 60 * 1000
const POW_SLICE_MS = 8

// prettier-ignore
const SHA_K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]

export function powSupported(): boolean {
  return typeof Uint32Array !== 'undefined' && typeof Math.imul === 'function' && typeof fetch === 'function'
}

/** Erstes 32-Bit-Wort von SHA-256(salt + String(counter)); salt = 32 ASCII-Zeichen, die Nachricht passt in einen Block. */
function powHash0(w: Int32Array, k: Int32Array, saltWords: Int32Array, counter: number): number {
  const digits: number[] = []
  let n = counter
  do {
    digits.push(48 + (n % 10))
    n = (n - (n % 10)) / 10
  } while (n > 0)
  const len = 32 + digits.length
  let i: number
  for (i = 0; i < 8; i++) w[i] = saltWords[i]
  for (i = 8; i < 15; i++) w[i] = 0
  for (i = 0; i < digits.length; i++) {
    const pos = 32 + i
    w[pos >> 2] |= digits[digits.length - 1 - i] << (24 - 8 * (pos & 3))
  }
  w[len >> 2] |= 0x80 << (24 - 8 * (len & 3))
  w[15] = len * 8
  for (i = 16; i < 64; i++) {
    const x = w[i - 15]
    const y = w[i - 2]
    w[i] = (w[i - 16] + (((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)) + w[i - 7] + (((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10))) | 0
  }
  let a = 0x6a09e667
  let b = 0xbb67ae85
  let c = 0x3c6ef372
  let d = 0xa54ff53a
  let e = 0x510e527f
  let f = 0x9b05688c
  let g = 0x1f83d9ab
  let h = 0x5be0cd19
  for (i = 0; i < 64; i++) {
    const t1 = (h + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & g)) + k[i] + w[i]) | 0
    const t2 = ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) + ((a & b) ^ (a & c) ^ (b & c))) | 0
    h = g
    g = f
    f = e
    e = (d + t1) | 0
    d = c
    c = b
    b = a
    a = (t1 + t2) | 0
  }
  return (0x6a09e667 + a) | 0
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof MessageChannel === 'function') {
      const ch = new MessageChannel()
      ch.port1.onmessage = () => {
        ch.port1.close()
        resolve()
      }
      ch.port2.postMessage(0)
    } else setTimeout(resolve, 0)
  })
}

/** Sucht die nonce (als String) in Zeitscheiben von ca. 8 ms; wirft nach 30 s. */
export async function powSolve(ch: { salt: string; difficulty: number }): Promise<string> {
  const bits = ch.difficulty
  const salt = String(ch.salt)
  const deadline = Date.now() + 30000
  const w = new Int32Array(64)
  const k = new Int32Array(SHA_K)
  const saltWords = new Int32Array(8)
  for (let i = 0; i < 32; i++) saltWords[i >> 2] |= salt.charCodeAt(i) << (24 - 8 * (i & 3))
  let counter = 0
  await yieldToBrowser()
  for (;;) {
    const start = performance.now()
    do {
      for (let j = 0; j < 128; j++, counter++) {
        if (powHash0(w, k, saltWords, counter) >>> (32 - bits) === 0) return String(counter)
      }
    } while (performance.now() - start <= POW_SLICE_MS)
    if (Date.now() > deadline) throw new Error('pow timeout')
    await yieldToBrowser()
  }
}

const isChallenge = (c: unknown): c is Challenge => {
  if (typeof c !== 'object' || c === null) return false
  const o = c as Record<string, unknown>
  return o.algorithm === 'SHA-256' && typeof o.salt === 'string' && /^[0-9a-f]{32}$/.test(o.salt) && typeof o.difficulty === 'number' && o.difficulty >= 1 && o.difficulty <= 24
}

/**
 * Rechenaufgabe: wird beim ersten Fokus/Tippen im Formular vorab gestartet, damit beim Absenden nichts wartet.
 * Fehler sind nie sichtbar: ohne Lösung wird ohne `pow` gesendet.
 */
export class PowSession {
  private job: { at: number; promise: Promise<PowSolution | null> } | null = null

  start(): void {
    if (this.job || !powSupported()) return
    this.job = { at: Date.now(), promise: this.run() }
  }

  private async run(): Promise<PowSolution | null> {
    try {
      const ch = await Promise.race([
        getJson('/api/challenge'),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('challenge timeout')), 10000)),
      ])
      if (!isChallenge(ch)) return null
      const nonce = await powSolve(ch)
      return { salt: ch.salt, difficulty: ch.difficulty, expires: ch.expires, sig: ch.sig, nonce }
    } catch {
      return null
    }
  }

  /** Liefert die Lösung (jede gilt nur einmal) oder null nach höchstens 25 s. */
  async take(): Promise<PowSolution | null> {
    if (!powSupported()) return null
    if (!this.job || Date.now() - this.job.at > POW_MAX_AGE) this.job = { at: Date.now(), promise: this.run() }
    const { promise } = this.job
    this.job = null
    return Promise.race([promise, new Promise<null>((resolve) => setTimeout(() => resolve(null), POW_MAX_WAIT))])
  }
}

/** Honeypot (leer bei Menschen) und Startzeit des Formulars. */
export function guard(form: HTMLFormElement | null, startedAt: number): { hp: string; ts: number } {
  const hp = form?.querySelector<HTMLInputElement>('input[name="homepage"]')
  return { hp: hp ? hp.value : '', ts: startedAt }
}

// ---- Lead ----

export interface LeadPayload {
  email: string
  message: string
  fields: Record<string, string>
}

export interface LeadResult {
  /** Bestellnummer; leer, wenn der Server die Bestellung als bereits angenommen bestätigt, ohne eine Nummer zu nennen. */
  id: string
}

/** Sendet die Bestellung. Wirft ApiError ('network' oder 'api'). */
export async function submitLead(payload: LeadPayload, form: HTMLFormElement | null, startedAt: number, pow: PowSession): Promise<LeadResult> {
  const body: Record<string, unknown> = {
    ...guard(form, startedAt),
    email: payload.email,
    url: '',
    consent: true,
    source: 'review-bestellung',
    message: payload.message,
    fields: payload.fields,
  }
  const solution = await pow.take()
  if (solution) body.pow = solution
  const data = await postJson('/api/lead', body)
  const rec = (typeof data === 'object' && data !== null ? data : {}) as { ok?: unknown; id?: unknown }
  if (rec.ok !== true) throw new ApiError('network', 'Keine gültige Antwort vom Server.')
  // {ok:true} ohne id: dieselbe Bestellung (orderKey) wurde bereits angenommen, z. B. bei parallelem Doppel-Absenden. Gilt als Erfolg, nur ohne Bestellnummer.
  return { id: typeof rec.id === 'string' ? rec.id : '' }
}

// ---- mailto-Rückfall ----

export function mailtoUrl(subject: string, body: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
