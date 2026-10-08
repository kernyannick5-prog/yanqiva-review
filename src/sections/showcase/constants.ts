/** Safari braucht das -webkit-Präfix für preserve-3d teils weiterhin. */
export const P3D = '[transform-style:preserve-3d] [-webkit-transform-style:preserve-3d]'

/** Logische Szenengröße (px); wird per Skalierung an die Bühne angepasst. */
export const SCENE_H = 500
export const SCENE_W_WIDE = 700
export const SCENE_W_NARROW = 450
/** Tatsächlich genutzte Höhe (Chip bis Bodenschatten), für die Skalierung. */
export const SCENE_H_USED = 430

/** Breite der Szenenfläche, ab der das breite Layout gilt. */
export const WIDE_BREAKPOINT = 560

/** Gold für Bewertungssterne. */
export const STAR_GOLD = '#fbbf24'

/** Mittelpunkt des NFC-Symbols auf der Platte, relativ zur Szenenmitte (px). */
export const NFC_CENTER_Y = -12

export const STEPS = [
  { title: 'Aufstellen', text: 'Aufsteller auf Tisch, Theke oder Kasse stellen.' },
  { title: 'Antippen', text: 'Gast hält das Smartphone an den NFC-Chip oder scannt den QR-Code.' },
  { title: 'Bewerten', text: 'Die Google-Bewertungsseite öffnet sich direkt, in unter 10 Sekunden.' },
] as const

/** Fortschrittsfenster (0..1) der drei Schritte. */
export const STEP_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [0, 0.35],
  [0.35, 0.68],
  [0.68, 1],
]

/** Schlüsselmomente je Schritt: Frontansicht (QR/NFC markiert), Tap (Wellen), Ergebnis. */
export const STEP_TARGETS: readonly number[] = [0.33, 0.62, 1]

/** Zeitplan der Abspiel-Animation (Touch): [Fortschritt, Sekunde]. Gleiche Werte = Haltepunkt. */
export const TIMELINE: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.33, 2.0], // Frontansicht, NFC + QR werden hervorgehoben
  [0.33, 2.6],
  [0.62, 4.0], // Tap
  [0.62, 4.6],
  [0.79, 6.0], // Sterne
  [0.79, 6.4],
  [1, 8.0], // Bestätigung, ruhige Produktansicht
]

/** Aktiver Schritt (0..2) zu einem Fortschrittswert. */
export function stepAt(v: number): number {
  return v < STEP_WINDOWS[1][0] ? 0 : v < STEP_WINDOWS[2][0] ? 1 : 2
}
