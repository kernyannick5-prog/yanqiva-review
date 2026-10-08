import type { ReactNode } from 'react'
import type { LegalCallout, LegalDoc } from '../legal/types'
import { Footer } from '../sections/Footer'

const BASE = import.meta.env.BASE_URL
const PLACEHOLDER = /(\[[^\]]+\])/g
const PLACEHOLDER_HINT = 'Platzhalter – vor Produktivbetrieb ergänzen'

/** Hebt jede [Platzhalter]-Stelle als <mark> hervor. */
function renderText(text: string): ReactNode[] {
  return text.split(PLACEHOLDER).map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <mark
        key={i}
        title={PLACEHOLDER_HINT}
        className="cursor-help rounded bg-amber-300/20 px-1 text-amber-200 underline decoration-amber-300/50 decoration-dotted underline-offset-2"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

const resolveHref = (href: string) => (href.startsWith('/') && !href.startsWith('//') ? BASE + href.slice(1) : href)

function Callout({ c }: { c: LegalCallout }) {
  const warn = c.tone === 'warning'
  return (
    <aside
      className={`rounded-2xl border p-4 text-[15px] leading-relaxed sm:p-5 ${
        warn ? 'border-amber-300/35 bg-amber-300/[0.07] text-amber-50/90' : 'border-mint/30 bg-mint/[0.06] text-text'
      }`}
    >
      <p className={`font-display text-sm font-semibold uppercase tracking-wider ${warn ? 'text-amber-300' : 'text-mint'}`}>{c.title}</p>
      <p className="mt-1.5">{renderText(c.text)}</p>
      {c.link && (
        <a
          href={resolveHref(c.link.href)}
          className={`mt-2.5 inline-flex min-h-11 items-center font-medium underline underline-offset-2 ${warn ? 'text-amber-300' : 'text-mint'}`}
        >
          {c.link.label}
        </a>
      )}
    </aside>
  )
}

/** Gemeinsamer Renderer für Datenschutz und Impressum. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <header className="border-b border-line bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href={BASE} className="flex min-h-11 items-center gap-2.5 active:opacity-70" aria-label="YANQIVA REVIEW – zur Startseite">
            <span className="font-display text-lg font-bold tracking-[0.12em] text-text">YANQIVA</span>
            <span className="rounded-full border border-mint/40 bg-mint/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-mint">Review</span>
          </a>
          <a
            href={BASE}
            className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-muted transition-colors hover:border-mint/40 hover:text-text active:bg-white/[0.08]"
          >
            <span aria-hidden className="mr-1.5">←</span>
            Zurück zur Demo
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <article className="mx-auto max-w-[70ch]">
          <p className="inline-flex rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-mint">{doc.badge}</p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance">{doc.title}</h1>
          <p className="mt-3 text-sm text-faint">{renderText(doc.updated)}</p>

          {doc.callouts.length > 0 && (
            <div className="mt-8 space-y-3">
              {doc.callouts.map((c) => (
                <Callout key={c.title} c={c} />
              ))}
            </div>
          )}

          <nav aria-label="Inhaltsverzeichnis" className="mt-8 rounded-2xl border border-line bg-white/[0.03] p-4 sm:p-5">
            <p className="font-display text-sm font-semibold text-text">Inhalt</p>
            <ol className="mt-2 columns-1 gap-8 sm:columns-2">
              {doc.sections.map((s) => (
                <li key={s.id} className="break-inside-avoid">
                  <a href={`#${s.id}`} className="inline-flex min-h-11 items-center text-[15px] text-muted transition-colors hover:text-mint sm:min-h-8">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-6">
                <h2 id={`${s.id}-h`} className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl">
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-4 text-[15px] leading-[1.75] text-muted sm:text-base sm:leading-[1.75]">
                  {s.blocks.map((b, i) => (
                    <div key={i} className="space-y-4">
                      {b.p && <p className="break-words">{renderText(b.p)}</p>}
                      {b.list && (
                        <ul className="list-disc space-y-1.5 pl-5 marker:text-mint/70">
                          {b.list.map((item, j) => (
                            <li key={j} className="break-words pl-1">
                              {renderText(item)}
                            </li>
                          ))}
                        </ul>
                      )}
                      {b.table && (
                        <div className="overflow-hidden rounded-xl border border-line">
                          <table className="w-full table-fixed border-collapse text-left text-sm">
                            <thead className="bg-white/[0.05] text-text">
                              <tr>
                                {b.table.head.map((h) => (
                                  <th key={h} scope="col" className="px-3 py-2.5 font-semibold">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                              {b.table.rows.map((row, r) => (
                                <tr key={r} className="align-top">
                                  <th scope="row" className="break-words px-3 py-2.5 font-medium text-text">
                                    {renderText(row[0])}
                                  </th>
                                  <td className="break-words px-3 py-2.5">{renderText(row[1])}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer onLegalPage />
    </>
  )
}
