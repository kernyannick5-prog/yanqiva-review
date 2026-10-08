# YANQIVA REVIEW – Demo

**Mehr Bewertungen. Weniger Aufwand.**

Marketing-Website mit interaktiver SaaS-Dashboard-Demo für YANQIVA REVIEW: ein NFC- und QR-System, das Kunden mit einem Tap direkt zur Google-Bewertungsseite eines Unternehmens bringt.

> **Demo / Prototyp.** Alle Firmen, Zahlen und Bewertungen sind erfunden. Es werden keine echten Google-Profile verlinkt.

**Live:** https://kernyannick5-prog.github.io/yanqiva-review/

## Features

- **Hero** mit animierter Headline und schwebender NFC-Karte (3D-Neigung, Lichtreflex, Parallax)
- **3D-Produktszene „Das Produkt“**: scroll-gesteuerter NFC-Aufsteller in CSS-3D, Smartphone-Tap, Bewertungsmaske. Läuft ohne WebGL; schwache Geräte und „Bewegung reduzieren“ bekommen automatisch eine statische Variante
- **Vorher / Nachher** und **So funktioniert’s** (3 animierte Schritte)
- **Interaktives Dashboard** mit Sidebar (Übersicht, Karten, Statistiken, Bewertungen, Unternehmen, Einstellungen)
  - KPIs mit animierten Zahlen, Liniendiagramm „NFC-Taps der letzten 30 Tage“ (7/30 Tage, Hover/Touch-Tooltip)
  - Karten-Management: Link bearbeiten, Statistik, QR-Code, **neue Karte anlegen** (Validierung, wird im Browser gespeichert)
- **QR-Code-Demo** mit echtem, scanbarem QR-Code auf eine funktionierende Redirect-URL
- **Redirect-Demo** `/r/demo-baeckerei` und `/r/demo-barbershop` → simulierte Bewertungsseite
- Vorteile, Preise (Klassik 60 €, Dashboard 99 € einmalig inkl. 12 Monate Dashboard, danach optional 15 €/Monat), Call-to-Action, Footer
- Responsive (360 px bis Desktop), Tastatur- und Screenreader-freundlich, `prefers-reduced-motion`

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · `qrcode`

## Lokal starten

```bash
npm install
npm run dev        # http://localhost:5173/yanqiva-review/
npm run build      # Produktions-Build nach dist/
npm run preview    # Build lokal ansehen
```

Für eine eigene Domain ohne Unterpfad: `BASE=/ npm run build`.

## Deployment

Jeder Push auf `main` baut die Seite über GitHub Actions (`.github/workflows/deploy.yml`) und veröffentlicht sie automatisch auf GitHub Pages.

## NFC/QR-Konzept

```
NFC-Karte / QR-Code
        ↓
YANQIVA Redirect-URL   https://yanqiva.de/r/<slug>
        ↓
Google-Bewertungsseite des Unternehmens
```

Auf der physischen Karte steht **nur die Redirect-URL**, nie der Google-Link. Das Ziel wird zentral gepflegt und kann im Dashboard jederzeit geändert werden, ohne die Karte neu zu programmieren. Nebenbei lässt sich jeder Aufruf zählen (Statistiken).

**Im Code:**

| Datei | Zweck |
| --- | --- |
| `src/config/redirects.ts` | Redirect-Tabelle (Slug, Kartennummer, Ziel-URL, aktiv) |
| `plugins/redirects.ts` | Vite-Plugin: erzeugt beim Build `/r/<slug>/index.html` und bedient `/r/<slug>` im Dev-Server |
| `src/lib/redirectUrl.ts` | baut Demo- und Produktions-Redirect-URLs |
| `src/demo/types.ts`, `src/demo/data.ts` | Datenmodell des Dashboards (`Card` mit `slug`, `targetUrl`, Scans …) |
| `public/review-demo/` | simulierte Bewertungsseite als Demo-Ziel |

**Weg zur Produktion:** Die statischen Redirect-Seiten werden durch einen Edge-Worker (z. B. Cloudflare Worker unter `yanqiva.de/r/*`) ersetzt, der den Slug in einer Datenbank nachschlägt, den Scan zählt und per HTTP 302 auf die gespeicherte Google-URL (`https://search.google.com/local/writereview?placeid=…`) weiterleitet. Das Dashboard schreibt `targetUrl` dann über eine API statt in den Browser-Speicher.

## Was ist Demo, was ist vorbereitet?

| Bereich | Status |
| --- | --- |
| Redirect-Struktur `/r/<slug>` | vorbereitet und funktionsfähig (statisch) |
| QR-Code-Erzeugung | echt, scanbar |
| Datenmodell Karten/Scans | vorbereitet für ein Backend |
| Dashboard-Daten, Statistiken, Bewertungen | Demo-Daten |
| Neue Karten / Link-Änderungen | nur im Browser (localStorage bzw. Sitzung) |
| Login, Zahlung, echte NFC-Zählung | nicht enthalten |
| Preise | Klassik 60 € einmalig / Dashboard 99 € einmalig inkl. 12 Monate Dashboard, danach optional 15 €/Monat, monatlich kündbar (Karte/QR funktioniert auch ohne Dashboard weiter); Bestellung nicht angebunden |
