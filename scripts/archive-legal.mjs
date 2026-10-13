// Archiviert eine Fassung der AGB und/oder der Datenschutzerklärung als festes, versioniertes PDF unter public/dokumente/archiv/
// und pflegt die Übersicht (public/dokumente/archiv/index.html, Quelle: versionen.json). Aufruf: `npm run archive-legal -- <Optionen>`.
//
// Typischer Ablauf (siehe README, Abschnitt „Rechtstexte archivieren“): VOR einer Änderung an src/legal/agb.ts bzw. datenschutz.ts
// `npm run archive-legal` ausführen. Das Skript rendert die aktuell im Arbeitsverzeichnis stehende Fassung als PDF ins Archiv.
//
// Optionen:
//   --doc agb|datenschutz   nur ein Dokument (Standard: beide)
//   --commit <sha>          Fassung aus einem früheren Commit (temporärer git worktree, die Dateien des Commits werden unverändert
//                           geladen, gerendert wird mit dem aktuellen Renderer scripts/lib/legal-pdf.mjs)
//   --live <ISO-Zeit>       Zeitpunkt, ab dem die Fassung live war, z. B. 2026-10-13T22:51:00+02:00 (Lauf von GitHub Actions:
//                           `gh run list`, Spalte updatedAt). Standard: Commit-Zeit der Datei (nur ungefähr, es erscheint eine Warnung)
//   --fassung <n>           Nummer der Fassung an diesem Tag (Standard: nächste freie Nummer des Tages)
//   --note "<Text>"         Kernunterschied zur Vorgängerfassung für die Übersicht
//   --dry                   nichts schreiben, nur anzeigen
//   --index-only            nur die Übersicht neu erzeugen
//
// Derselbe Rechtstext (gleicher Inhalt von title/updated/callouts/sections) wird pro Dokument nur einmal archiviert. Die Fassungsnummer
// zählt die Veröffentlichungen mit geänderten Rechtstexten an einem Tag, AGB und Datenschutz gemeinsam (z. B. „Fassung 4 vom 13.10.2026“).
// Ändert sich nur eines der beiden Dokumente, fehlt für das andere diese Nummer: Es galt unverändert die Vorfassung.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderLegalPdf, SITE } from './lib/legal-pdf.mjs'

const root = resolve(import.meta.dirname, '..')
const ARCHIVE = resolve(root, 'public', 'dokumente', 'archiv')
const MANIFEST = resolve(ARCHIVE, 'versionen.json')
const DOCS = {
  agb: { title: 'Allgemeine Geschäftsbedingungen (AGB)', short: 'AGB', exportName: 'agb', page: 'agb' },
  datenschutz: { title: 'Datenschutzerklärung', short: 'Datenschutz', exportName: 'datenschutz', page: 'datenschutz' },
}

function parseArgs(argv) {
  const o = { doc: null, commit: null, live: null, fassung: null, note: '', dry: false, indexOnly: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const val = () => {
      if (i + 1 >= argv.length) throw new Error(`Option ${a} braucht einen Wert`)
      return argv[++i]
    }
    if (a === '--doc') o.doc = val()
    else if (a === '--commit') o.commit = val()
    else if (a === '--live') o.live = val()
    else if (a === '--fassung') o.fassung = Number(val())
    else if (a === '--note') o.note = val()
    else if (a === '--dry') o.dry = true
    else if (a === '--index-only') o.indexOnly = true
    else throw new Error(`Unbekannte Option ${a} (siehe Kopf von scripts/archive-legal.mjs)`)
  }
  if (o.doc && !DOCS[o.doc]) throw new Error('--doc: agb oder datenschutz')
  if (o.fassung !== null && !(Number.isInteger(o.fassung) && o.fassung >= 1)) throw new Error('--fassung: ganze Zahl >= 1')
  if (o.live && Number.isNaN(Date.parse(o.live))) throw new Error('--live: kein gültiger Zeitpunkt (ISO 8601)')
  return o
}

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
const berlin = (d, opts) => new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', ...opts }).format(d)
const berlinDate = (d) => berlin(d, { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.').reverse().join('-') // YYYY-MM-DD
const berlinDateDe = (d) => berlin(d, { year: 'numeric', month: '2-digit', day: '2-digit' })
const berlinTime = (d) => berlin(d, { hour: '2-digit', minute: '2-digit', hour12: false })
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** Hash des Rechtstexts selbst (ohne pdf/archive-Verweise, Kommentare, Zeilenenden): gleicher Text = gleiche Fassung. */
const docHash = (doc) => createHash('sha256').update(JSON.stringify({ ...doc, pdf: undefined, archive: undefined })).digest('hex')

function readManifest() {
  return existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : []
}
function writeManifest(list) {
  list.sort((a, b) => a.doc.localeCompare(b.doc) || Date.parse(a.from) - Date.parse(b.from))
  writeFileSync(MANIFEST, JSON.stringify(list, null, 2) + '\n')
}

/** Fassung laden: aus dem Arbeitsverzeichnis oder aus einem Commit (temporärer worktree). Liefert { doc, cleanup }. */
async function loadVersion(name, commit) {
  const rel = `src/legal/${name}.ts`
  if (!commit) {
    const file = resolve(root, rel)
    const mod = await import(pathToFileURL(file).href)
    return { doc: mod[DOCS[name].exportName], cleanup() {} }
  }
  const dir = mkdtempSync(join(tmpdir(), 'yanqiva-legal-wt-'))
  const wt = join(dir, 'wt')
  git('worktree', 'add', '--detach', '--force', wt, commit)
  const cleanup = () => {
    try {
      git('worktree', 'remove', '--force', wt)
    } catch {
      /* Verzeichnis wird unten ohnehin gelöscht, danach git worktree prune */
    }
    rmSync(dir, { recursive: true, force: true })
    try {
      git('worktree', 'prune')
    } catch {
      /* ignorieren */
    }
  }
  try {
    const file = join(wt, rel)
    const mod = await import(pathToFileURL(file).href)
    return { doc: mod[DOCS[name].exportName], cleanup }
  } catch (e) {
    cleanup()
    throw e
  }
}

function liveTime(o, name) {
  if (o.live) return new Date(o.live)
  const out = git('log', '-1', '--format=%cI', ...(o.commit ? [o.commit] : []), '--', `src/legal/${name}.ts`)
  if (!out) throw new Error(`Keine Commit-Zeit für src/legal/${name}.ts gefunden: bitte --live angeben`)
  console.warn(`Warnung (${name}): --live fehlt, verwende die Commit-Zeit ${out}. Maßgeblich ist der Zeitpunkt der Veröffentlichung (gh run list, updatedAt).`)
  return new Date(out)
}

async function archiveOne(name, o, manifest) {
  const info = DOCS[name]
  const v = await loadVersion(name, o.commit)
  try {
    const hash = docHash(v.doc)
    const dup = manifest.find((m) => m.doc === name && m.hash === hash)
    if (dup) {
      console.log(`${name}: dieser Inhalt ist bereits archiviert als ${dup.id} (${dup.file}), übersprungen`)
      return null
    }
    const from = liveTime(o, name)
    const date = berlinDate(from)
    // Fassungsnummer zählt die Veröffentlichungen mit geänderten Rechtstexten an einem Tag (AGB und Datenschutz gemeinsam): gleiche
    // Live-Zeit wie ein vorhandener Eintrag = gleiche Nummer, sonst nächste freie Nummer des Tages.
    const sameDay = manifest.filter((m) => m.date === date)
    const sameTime = sameDay.find((m) => m.from === from.toISOString())
    const fassung = o.fassung ?? (sameTime ? sameTime.fassung : sameDay.reduce((mx, m) => Math.max(mx, m.fassung), 0) + 1)
    if (sameDay.some((m) => m.doc === name && m.fassung === fassung)) throw new Error(`${name}: Fassung ${fassung} vom ${date} existiert bereits`)
    const id = `${name}-${date}-f${fassung}`
    const file = `${id}.pdf`
    const target = resolve(ARCHIVE, file)
    const label = `Fassung ${fassung} vom ${berlinDateDe(from)}, gültig ab ca. ${berlinTime(from)} Uhr`
    const commit = o.commit ? git('rev-parse', '--short', o.commit) : git('rev-parse', '--short', 'HEAD') + (git('status', '--porcelain', '--', `src/legal/${name}.ts`) ? '+lokale Änderung' : '')
    const entry = {
      doc: name,
      id,
      file,
      date,
      fassung,
      from: from.toISOString(),
      stand: v.doc.updated,
      commit,
      hash,
      pages: 0,
      note: o.note,
    }
    if (o.dry) {
      console.log(`${name}: würde ${file} anlegen (${label}; Stand-Text „${v.doc.updated}“; Commit ${commit})`)
      return null
    }
    mkdirSync(ARCHIVE, { recursive: true })
    const r = await renderLegalPdf({
      doc: v.doc,
      page: info.page,
      target,
      archive: { label, shortLabel: `Fassung ${fassung} vom ${berlinDateDe(from)}`, createdAt: from, currentUrl: `https://${SITE}/${info.page}/` },
    })
    entry.pages = r.pages
    manifest.push(entry)
    console.log(`${name}: ${file} (${r.pages} Seiten, ${label}; ${v.doc.updated})`)
    return entry
  } finally {
    v.cleanup()
  }
}

function indexHtml(manifest) {
  const sections = Object.entries(DOCS)
    .map(([name, info]) => {
      const list = manifest.filter((m) => m.doc === name).sort((a, b) => Date.parse(b.from) - Date.parse(a.from)) // neueste zuerst
      const rows = list
        .map((m, i) => {
          const from = new Date(m.from)
          const next = list[i - 1] // nächstjüngere Fassung
          const until = next ? `${berlinDateDe(new Date(next.from))}, ca. ${berlinTime(new Date(next.from))} Uhr` : 'bis zur aktuellen Fassung'
          return `        <tr>
          <th scope="row">Fassung ${m.fassung} vom ${berlinDateDe(from)}</th>
          <td>${berlinDateDe(from)}, ca. ${berlinTime(from)} Uhr</td>
          <td>${esc(until)}</td>
          <td>${esc(m.stand)}${m.note ? `<br><span class="note">${esc(m.note)}</span>` : ''}</td>
          <td><a href="${esc(m.file)}">PDF (${m.pages} Seiten)</a></td>
        </tr>`
        })
        .join('\n')
      return `    <section aria-labelledby="${name}">
      <h2 id="${name}">${esc(info.title)}</h2>
      <p>Aktuelle Fassung: <a href="/${info.page}/">online lesen</a> oder <a href="/dokumente/${name}.pdf">als PDF</a>.</p>
      ${list.length ? `<div class="scroll"><table>
        <thead><tr><th scope="col">Fassung</th><th scope="col">Gültig ab</th><th scope="col">Gültig bis</th><th scope="col">Stand laut Dokument und Kernunterschied</th><th scope="col">Datei</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table></div>` : '<p>Noch keine früheren Fassungen archiviert.</p>'}
    </section>`
    })
    .join('\n')
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0b2c23">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>Frühere Fassungen von AGB und Datenschutzerklärung – YANQIVA REVIEW</title>
<link rel="stylesheet" href="/dokumente/archiv/archiv.css">
</head>
<body>
<main id="main">
  <p class="back"><a href="/">YANQIVA REVIEW</a> · <a href="/agb/">AGB</a> · <a href="/datenschutz/">Datenschutzerklärung</a></p>
  <h1>Frühere Fassungen von AGB und Datenschutzerklärung</h1>
  <p class="lead">Hier finden Sie frühere Fassungen unserer AGB und der Datenschutzerklärung als PDF. Maßgeblich für einen Vertrag ist die Fassung, die bei Vertragsschluss galt. Die Zeiten geben an, ab wann eine Fassung auf yanqiva-bewertung.de veröffentlicht war (Europe/Berlin, ca.). Die Fassungsnummer zählt die Veröffentlichungen eines Tages mit geänderten Rechtstexten; fehlt sie bei einem der beiden Dokumente, galt dort unverändert die Vorfassung.</p>
${sections}
  <p class="foot">Fragen zu einer Fassung: <a href="mailto:support@yanqiva.de">support@yanqiva.de</a>. Diese Übersicht wird mit <code>npm run archive-legal</code> aus <code>versionen.json</code> erzeugt.</p>
</main>
</body>
</html>
`
}

const o = parseArgs(process.argv.slice(2))
const manifest = readManifest()
let changed = false
if (!o.indexOnly) {
  for (const name of o.doc ? [o.doc] : Object.keys(DOCS)) {
    if (await archiveOne(name, o, manifest)) changed = true
  }
}
if (!o.dry && (changed || o.indexOnly)) {
  writeManifest(manifest)
  writeFileSync(resolve(ARCHIVE, 'index.html'), indexHtml(manifest))
  console.log(`Übersicht aktualisiert: public/dokumente/archiv/index.html (${manifest.length} Einträge)`)
}
