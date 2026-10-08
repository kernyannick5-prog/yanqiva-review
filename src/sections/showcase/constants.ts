/** Safari braucht das -webkit-Präfix für preserve-3d teils weiterhin. */
export const P3D = '[transform-style:preserve-3d] [-webkit-transform-style:preserve-3d]'

/** Logische Szenengröße (px); wird per Skalierung an die Bühne angepasst. */
export const SCENE_H = 500
export const SCENE_W_WIDE = 700
export const SCENE_W_NARROW = 392

/** Breite der Szenenfläche, ab der das breite Layout gilt. */
export const WIDE_BREAKPOINT = 560

/** Gold für Sterne (Google-Bewertungssterne). */
export const STAR_GOLD = '#fbbf24'

/** Mittelpunkt des NFC-Symbols auf der Platte, relativ zur Szenenmitte (px). */
export const NFC_CENTER_Y = -12

export const STEPS = [
  { title: 'Aufstellen', text: 'Aufsteller auf Tisch, Theke oder Kasse stellen.' },
  { title: 'Antippen', text: 'Gast hält das Smartphone an den NFC-Chip oder scannt den QR-Code.' },
  { title: 'Bewerten', text: 'Die Google-Bewertungsseite öffnet sich direkt, in unter 10 Sekunden.' },
] as const

/** Scroll-Fenster (0..1) der drei Schritte. */
export const STEP_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [0, 0.35],
  [0.35, 0.62],
  [0.62, 1],
]
