import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { Button } from '../../components/Button'
import { useMotionPaused } from '../../lib/motionPause'
import { guardSmoothness } from '../../lib/perfGuard'
import { saveDataEnabled, usePrefersReducedMotion } from '../../lib/reducedMotion'
import { POSTER_TIME, VIDEO_DURATION } from './constants'
import type { TimeSync } from './TimeSync'

const MEDIA = `${import.meta.env.BASE_URL}media/`
const SRC = { desktop: `${MEDIA}showcase-desktop.mp4`, mobile: `${MEDIA}showcase-mobile.mp4` } as const
const POSTER = { desktop: `${MEDIA}showcase-desktop-poster.webp`, mobile: `${MEDIA}showcase-mobile-poster.webp` } as const

export interface ShowcasePlayerHandle {
  /** Springt im Video zu t (Sekunden). Bei erlaubter Bewegung läuft es dort weiter, sonst bleibt das Standbild stehen. */
  jumpTo: (t: number) => void
}

interface ShowcasePlayerProps {
  /** Wird bei Zeitänderungen (ca. 4x pro Sekunde beim Abspielen) mit der Videozeit in Sekunden aufgerufen. Muss billig sein. */
  onTime: (t: number) => void
  /** Gemeinsame Zeitsteuerung der Fortschrittsanzeigen (Balken des Players und der Schritte). */
  timeline: TimeSync
  ref?: Ref<ShowcasePlayerHandle>
}

const clock = (s: number) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`

const iconProps = { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const
const PlayIcon = ({ className }: { className: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
)
const PauseIcon = ({ className }: { className: string }) => (
  <svg {...iconProps} className={className}>
    <rect x="6" y="5" width="4" height="14" rx="1.2" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" />
  </svg>
)

/**
 * Produktvideo (Smartphone + NFC-Karte) mit eigener, tastaturbedienbarer Steuerung.
 * - Autoplay (stumm) ab 50 % Sichtbarkeit; außerhalb des Sichtfensters oder im Hintergrund-Tab wird pausiert.
 * - Kein Autoplay bei „Bewegung reduzieren“, beim Schalter „Animationen anhalten“ und im Datensparmodus: dann Poster + Abspielen-Knopf.
 * - Das Video wird erst in Nähe des Viewports geladen (kein Einfluss auf LCP); das Seitenverhältnis ist per CSS reserviert (kein Layout-Shift).
 */
export function ShowcasePlayer({ onTime, timeline, ref }: ShowcasePlayerProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const motionPaused = useMotionPaused()
  const autoOk = !reduced && !motionPaused

  const [src, setSrc] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [duration, setDuration] = useState(VIDEO_DURATION)

  // Zustand, der keine Darstellung ändert, bleibt in einem Ref (kein Re-Render).
  const s = useRef({ halfVisible: false, userPaused: false, heldByAuto: false, wantPlay: false, guarded: false, pendingSeek: null as number | null, autoOk })
  useEffect(() => {
    s.current.autoOk = autoOk
  }, [autoOk])

  /** Uhr und (unsichtbarer) Regler: nur einmal pro Sekunde, direkt im DOM statt per React-State. */
  const paint = useCallback(
    (t: number) => {
      const whole = Math.floor(t)
      const r = rangeRef.current
      if (!r || Number(r.dataset.whole) === whole) return
      r.dataset.whole = String(whole)
      r.value = String(Math.min(t, duration))
      r.setAttribute('aria-valuetext', `${whole} von ${Math.floor(duration)} Sekunden`)
      if (clockRef.current) clockRef.current.textContent = clock(t)
    },
    [duration],
  )

  // Fortschrittsbalken: beim Abspielen eine Compositor-Animation im Gleichlauf mit dem Video, im Stillstand ein fester Wert.
  useEffect(() => timeline.add(fillRef.current, (t) => `scaleX(${Math.min(1, t / VIDEO_DURATION)})`), [timeline])

  /** Quelle wählen und laden: breites Video ab 1024 px, sonst das schmale (passt zum CSS-Seitenverhältnis). */
  const arm = useCallback(() => {
    setSrc((cur) => cur ?? (window.matchMedia('(min-width: 1024px)').matches ? SRC.desktop : SRC.mobile))
  }, [])

  const play = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    void v.play().catch(() => {
      // Autoplay vom Browser abgelehnt (z. B. Stromsparmodus): Poster + Knopf bleiben, Nutzer startet selbst.
    })
  }, [])

  /** Automatisch abspielen, wenn erlaubt, sichtbar und nicht vom Nutzer pausiert. */
  const tryAutoplay = useCallback(() => {
    const c = s.current
    if (!c.autoOk || c.userPaused || !c.halfVisible || document.hidden) return
    c.heldByAuto = false
    if (!videoRef.current?.src) arm()
    else if (videoRef.current.paused) play()
  }, [arm, play])

  const autoPause = useCallback(() => {
    const v = videoRef.current
    if (v && !v.paused) {
      v.pause()
      s.current.heldByAuto = true
    }
  }, [])

  // Nahe am Viewport: Video vorladen (nur wenn Autoplay erlaubt ist und kein Datensparmodus aktiv ist). Erst nach dem Laden der Seite im Leerlauf,
  // damit die ca. 0,5 bis 0,7 MB nicht mit Schrift, Skripten und Hero um die Leitung konkurrieren (große Desktop-Fenster sehen den Abschnitt sofort).
  useEffect(() => {
    const el = boxRef.current
    if (!el || !autoOk || saveDataEnabled()) return
    let near = false
    let timer = 0
    const armIdle = () => {
      if (!near) return
      if (typeof window.requestIdleCallback === 'function') timer = window.requestIdleCallback(arm, { timeout: 2500 })
      else timer = window.setTimeout(arm, 300)
    }
    const onLoad = () => armIdle()
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting
        if (near && document.readyState === 'complete') armIdle()
      },
      { rootMargin: '150px 0px' },
    )
    io.observe(el)
    window.addEventListener('load', onLoad, { once: true })
    return () => {
      io.disconnect()
      window.removeEventListener('load', onLoad)
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(timer)
      window.clearTimeout(timer)
    }
  }, [autoOk, arm])

  // Ab 50 % sichtbar abspielen, komplett außer Sicht pausieren.
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1] // bei mehreren gebündelten Einträgen zählt der neueste
        s.current.halfVisible = e.intersectionRatio >= 0.5
        if (e.intersectionRatio >= 0.5) tryAutoplay()
        else if (!e.isIntersecting) autoPause()
      },
      { threshold: [0, 0.5] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [tryAutoplay, autoPause])

  // Tab im Hintergrund: pausieren, danach (falls automatisch pausiert) fortsetzen.
  useEffect(() => {
    const onVis = () => (document.hidden ? autoPause() : s.current.heldByAuto && tryAutoplay())
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [autoPause, tryAutoplay])

  // „Animationen anhalten“ / „Bewegung reduzieren“ ändern sich: laufendes Video anhalten bzw. bei Freigabe fortsetzen.
  useEffect(() => {
    if (!autoOk) autoPause()
    else tryAutoplay()
  }, [autoOk, autoPause, tryAutoplay])

  const seekTo = useCallback(
    (t: number, andPlay: boolean) => {
      const c = s.current
      c.wantPlay = andPlay
      if (andPlay) c.userPaused = false
      const v = videoRef.current
      if (v && v.src && v.readyState >= 1) {
        v.currentTime = t
        if (andPlay) play()
        else v.pause()
      } else {
        c.pendingSeek = t
        arm()
      }
      paint(t)
      timeline.sync(t, andPlay)
      onTime(t)
    },
    [arm, play, onTime, paint, timeline],
  )

  useImperativeHandle(ref, () => ({ jumpTo: (t) => seekTo(t, s.current.autoOk) }), [seekTo])

  const toggle = () => {
    const v = videoRef.current
    const c = s.current
    if (!v || !v.src) {
      c.userPaused = false
      c.wantPlay = true
      arm()
    } else if (v.paused) {
      c.userPaused = false
      play()
    } else {
      c.userPaused = true
      v.pause()
    }
  }

  const onLoadedData = () => {
    const v = videoRef.current
    const c = s.current
    if (v && c.pendingSeek !== null) {
      v.currentTime = c.pendingSeek
      c.pendingSeek = null
    }
    if (c.wantPlay) {
      c.wantPlay = false
      play()
    } else tryAutoplay()
  }

  const initialFrac = POSTER_TIME / VIDEO_DURATION

  return (
    <div className="w-full">
      <div
        ref={boxRef}
        onClick={toggle}
        className="relative aspect-[5/4] w-full cursor-pointer select-none overflow-hidden rounded-3xl border border-line bg-white shadow-card lg:aspect-[16/10]"
      >
        <video
          ref={videoRef}
          src={src ?? undefined}
          muted
          loop
          playsInline
          preload={src ? 'auto' : 'none'}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-describedby="produkt-video-text"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPlaying={(e) => {
            setStarted(true)
            if (!s.current.guarded) {
              s.current.guarded = true
              window.setTimeout(() => void guardSmoothness(), 1500) // Läuft das Video zäh, werden die dekorativen Loops abgeschaltet
            }
            timeline.sync(e.currentTarget.currentTime, true)
          }}
          onWaiting={(e) => timeline.sync(e.currentTarget.currentTime, false)}
          onPause={(e) => {
            setPlaying(false)
            timeline.sync(e.currentTarget.currentTime, false)
          }}
          onSeeked={(e) => {
            setStarted(true)
            timeline.sync(e.currentTarget.currentTime, !e.currentTarget.paused)
          }}
          onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onLoadedData={onLoadedData}
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            const t = v.currentTime
            paint(t)
            if (!v.paused && timeline.drift(t) > 0.3) timeline.sync(t, true)
            onTime(t)
          }}
        />
        {/* Poster: bis das Video läuft bzw. ein Bild zeigt; alt leer, die Beschreibung steht im Text darunter. */}
        <picture aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${started ? 'opacity-0' : 'opacity-100'}`}>
          <source media="(min-width: 1024px)" srcSet={POSTER.desktop} />
          <img src={POSTER.mobile} alt="" width={800} height={640} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </picture>
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-200 ${playing ? 'opacity-0' : 'opacity-100'}`}
        >
          <span className="grid size-16 place-items-center rounded-full bg-white/90 text-[#0b2c23] shadow-card ring-1 ring-black/5 sm:size-20">
            <PlayIcon className="ml-0.5 size-7 sm:size-9" />
          </span>
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 sm:gap-4">
        <Button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Video pausieren' : 'Video abspielen'}
          aria-pressed={playing}
          className="size-14 shrink-0 !px-0"
        >
          {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="ml-0.5 size-6" />}
        </Button>
        <div className="relative h-11 min-w-0 flex-1">
          <input
            ref={rangeRef}
            type="range"
            min={0}
            max={duration}
            step={0.1}
            defaultValue={POSTER_TIME}
            aria-label="Videoposition"
            aria-valuetext={`${Math.floor(POSTER_TIME)} von ${Math.floor(VIDEO_DURATION)} Sekunden`}
            onChange={(e) => seekTo(Number(e.target.value), !(videoRef.current?.paused ?? true))}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-edge-weak peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-mint">
            <div ref={fillRef} className="h-full origin-left rounded-full bg-mint" style={{ transform: `scaleX(${initialFrac})` }} />
          </div>
        </div>
        <span aria-hidden className="w-[5.25rem] shrink-0 whitespace-nowrap text-right text-sm tabular-nums text-faint">
          <span ref={clockRef}>{clock(POSTER_TIME)}</span> / {clock(duration)}
        </span>
      </div>

      <p id="produkt-video-text" className="sr-only">
        Video ohne Ton, ca. 9 Sekunden, wiederholt sich. Eine quadratische Acrylkarte mit blauem Kopfbereich, Bewertungssternen, NFC-Symbol und QR-Code
        steht auf einem Aufsteller und dreht sich nach vorn. Von rechts fährt ein Smartphone heran und wird an das NFC-Symbol gehalten, farbige Wellen
        breiten sich aus. Auf dem Display öffnet sich die Bewertungsseite mit fünf Sternen und der Schaltfläche Senden. Zum Schluss erscheint die
        Bestätigung Danke, Ihre Bewertung wurde gesendet, und ein Hinweis plus eins Bewertung.
      </p>
    </div>
  )
}
