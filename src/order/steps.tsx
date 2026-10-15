import { useEffect, useState, type ReactNode } from 'react'
import { ReviewCardFace } from '../components/ReviewCardFace'
import {
  CARD_IMAGE_NOTE, COLORS, colorSummary, DASHBOARD_EXTRA_CARD_EUR, DASHBOARD_FIRST_CARD_EUR, DASHBOARD_INCLUDED_MONTHS, DASHBOARD_RENEWAL_EUR, formatEuro, KOMBI_SINGLE_EUR, PRODUCT_LABEL, PRODUCT_LIST, PRODUCTS,
  priceLines, qtyMaxFor, QTY_MIN, quantityText, PAYMENT_NOTE, SHIPPING_EUR, subtotal, total, unitWord, VAT_NOTE, shippingText, type ColorId, type Product,
} from './catalog'
import { CheckboxField, ErrorSummary, FieldError, Fieldset, RequiredLegend, TextField, type FormCtx } from './fields'
import { errId, fieldId } from './ids'
import { DeliveryAreaCheck, ZipAreaNote } from './notices'
import { cardColorList, colorCounts, effectiveQuantity, MAX, parseQuantity, productOf, qtyOf, trimmed, withCardColor, type FieldKey, type StepId } from './state'

const BASE = import.meta.env.BASE_URL

interface StepProps {
  ctx: FormCtx
  summaryKeys: readonly FieldKey[]
  onJump: (key: FieldKey) => void
}

const Summary = ({ ctx, summaryKeys, onJump }: StepProps) => <ErrorSummary errors={ctx.errors} keys={summaryKeys} onJump={onJump} />

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

const cardBase =
  'relative flex min-h-11 cursor-pointer gap-3.5 rounded-2xl border p-4 transition-colors has-[:checked]:border-mint/70 has-[:checked]:bg-mint/[0.07] has-[:checked]:shadow-[0_0_0_1px_rgb(94_234_212/0.45)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mint hover:border-mint/60 border-white/50 bg-white/[0.03] sm:p-5'

function RadioDot() {
  return (
    <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 border-white/50 peer-checked:border-mint peer-checked:[&>span]:scale-100">
      <span className="size-2.5 scale-0 rounded-full bg-mint transition-transform" />
    </span>
  )
}

/** Verzögert einen Wert, damit Live-Regionen nicht bei jedem Tastendruck ansagen. */
function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

const colorCardBase =
  'relative flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors has-[:checked]:border-mint/70 has-[:checked]:bg-mint/[0.07] has-[:checked]:shadow-[0_0_0_1px_rgb(94_234_212/0.45)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mint hover:border-mint/60 border-white/50 bg-white/[0.03]'

/** Kleine Kartenvorschau in der gewählten Farbe (dekorativ, die Farbe steht immer auch als Text daneben). */
function CardSwatch({ color }: { color: ColorId }) {
  return <ReviewCardFace variant={color} decorative className="block size-12 shrink-0 rounded-lg ring-1 ring-white/40" />
}

/** Preisunterzeile je Paket (Staffel bzw. Vergleich offen ausweisen). */
function priceCaption(p: Product): string {
  if (p.combo && p.dashboard) return `einmalig für 2 Karten (${formatEuro(DASHBOARD_FIRST_CARD_EUR)} + ${formatEuro(DASHBOARD_EXTRA_CARD_EUR)})`
  if (p.combo) return `einmalig für 2 Karten (zwei Klassik-Karten einzeln ${formatEuro(KOMBI_SINGLE_EUR)})`
  if (p.dashboard) return `für die erste Karte, jede weitere ${formatEuro(DASHBOARD_EXTRA_CARD_EUR)}`
  return 'einmalig je Karte'
}

function ProductOption({ p, index, ctx, error }: { p: Product; index: number; ctx: FormCtx; error?: string }) {
  const { form } = ctx
  const choose = () => {
    ctx.set('product', p.id)
    // Kombi: höchstens 5 Kombis (10 Karten); zu große Menge sinnvoll zurücksetzen
    const n = Number.parseInt(form.quantity, 10)
    if (Number.isFinite(n) && n > p.qtyMax) ctx.set('quantity', String(p.qtyMax))
  }
  return (
    <label className={cardBase}>
      <input
        type="radio"
        id={index === 0 ? fieldId('product') : undefined}
        name="product"
        required
        value={p.id}
        checked={form.product === p.id}
        onChange={choose}
        aria-labelledby={`prod-${p.id}-n`}
        aria-invalid={error ? true : undefined}
        aria-describedby={`prod-${p.id}-d prod-${p.id}-r${error ? ` ${errId('product')}` : ''}`}
        className="peer sr-only"
      />
      <RadioDot />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span id={`prod-${p.id}-n`} className="font-display text-lg font-semibold text-text">{p.shortName}</span>
          <span id={`prod-${p.id}-d`} className="shrink-0 text-right font-display text-xl font-semibold text-text">
            {formatEuro(p.unitPrice)}
            <span className="block max-w-[22ch] text-[13px] font-normal leading-snug text-muted">{priceCaption(p)}</span>
          </span>
        </span>
        <span id={`prod-${p.id}-t`} className="mt-0.5 block text-sm text-muted">{p.tagline}</span>
        <span id={`prod-${p.id}-f`} className="mt-3 block space-y-1.5">
          {p.features.map((f) => (
            <span key={f} className="flex items-start gap-2 text-sm leading-snug text-text">
              <Check />
              <span>{f}</span>
            </span>
          ))}
        </span>
        <span id={`prod-${p.id}-r`} className="mt-3 block rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] leading-snug text-muted">
          <span className="font-semibold text-text">Laufende Kosten: </span>
          {p.running}
          <span className="mt-1.5 block">{p.redirectNote}</span>
        </span>
        <span className="mt-2 block text-[13px] leading-snug text-muted">
          <span className="font-semibold text-text">Lieferzeit: </span>
          {shippingText(p)}
          {p.dashboard ? ' (inklusive Einrichtung des Dashboards)' : ''}.
        </span>
      </span>
    </label>
  )
}

/** Farbwahl: je Karte eine Radiogruppe (Schwarz/Weiß) mit Kartenvorschau; bei Kombi nur die Anzeige der enthaltenen Farben. */
function ColorSection({ ctx, qty }: { ctx: FormCtx; qty: number }) {
  const { form, errors } = ctx
  const pid = form.product || null
  if (!pid) return null
  const p = PRODUCTS[pid]
  const error = errors.colors
  if (p.combo) {
    return (
      <section aria-labelledby="color-h" className="rounded-2xl border border-line bg-white/[0.03] p-4 sm:p-5">
        <h3 id="color-h" className="font-display text-lg font-semibold text-text">Farben</h3>
        <p className="mt-1 text-sm text-muted">
          Im Kombi-Paket erhalten Sie je Kombi eine schwarze und eine weiße Karte. Eine Auswahl ist nicht nötig.
        </p>
        <ul className="mt-4 flex flex-wrap gap-4">
          {COLORS.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <CardSwatch color={c.id} />
              <span className="text-[15px] text-text">
                {qty} × {c.label}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-snug text-faint">{CARD_IMAGE_NOTE}</p>
      </section>
    )
  }
  const list = cardColorList(form.colors, qty)
  return (
    <Fieldset legend={<>Farbe{qty > 1 ? ' je Karte' : ''}<span aria-hidden className="ml-0.5 text-mint"> *</span></>}>
      <p id="f-colors-hint" className="mb-3 text-sm text-muted">
        Die Acrylkarte gibt es in Schwarz und Weiß. {CARD_IMAGE_NOTE} {qty > 1 ? 'Wählen Sie für jede Karte eine Farbe.' : 'Wählen Sie die Farbe Ihrer Karte.'}
      </p>
      <div className="space-y-3">
        {list.map((sel, i) => (
          <fieldset key={i} className="min-w-0 rounded-2xl border border-line p-3 sm:p-4">
            <legend className="px-1 text-[15px] font-semibold text-text">{qty > 1 ? `Karte ${i + 1}` : 'Farbe der Karte'}</legend>
            <div className="grid gap-3 min-[420px]:grid-cols-2">
              {COLORS.map((c, ci) => (
                <label key={c.id} className={colorCardBase}>
                  <input
                    type="radio"
                    id={i === 0 && ci === 0 ? fieldId('colors') : undefined}
                    name={`color-${i}`}
                    required
                    value={c.id}
                    checked={sel === c.id}
                    onChange={() => ctx.set('colors', withCardColor(form.colors, i, c.id, qty))}
                    aria-invalid={error && sel === '' ? true : undefined}
                    aria-describedby={`f-colors-hint${error ? ` ${errId('colors')}` : ''}`}
                    className="peer sr-only"
                  />
                  <RadioDot />
                  <CardSwatch color={c.id} />
                  <span className="text-[15px] font-semibold text-text">{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <FieldError id={errId('colors')} message={error} />
    </Fieldset>
  )
}

export function StepProduct({ ctx, summaryKeys, onJump }: StepProps) {
  const { form, errors } = ctx
  const pid = form.product || null
  const max = qtyMaxFor(form.product)
  const combo = pid ? PRODUCTS[pid].combo : false
  const qty = parseQuantity(form.quantity, max)
  const qtyEff = effectiveQuantity(form.quantity, max)
  const bump = (d: number) => ctx.set('quantity', String(Math.min(max, Math.max(QTY_MIN, (qty ?? qtyEff) + d))))
  const qtyError = errors.quantity
  const prodError = errors.product
  const unit = (n: number) => unitWord(form.product, n)
  const sumText = pid
    ? `${quantityText(pid, qtyEff)} ${PRODUCTS[pid].shortName} (${PRODUCT_LABEL}), Zwischensumme ${formatEuro(subtotal(pid, qtyEff))}`
    : 'Bitte wählen Sie eine Variante, um den Preis zu sehen.'
  const announced = useDebounced(sumText, 600)
  const singles = PRODUCT_LIST.filter((p) => !p.combo)
  const combos = PRODUCT_LIST.filter((p) => p.combo)
  return (
    <div className="space-y-9">
      <Summary ctx={ctx} summaryKeys={summaryKeys} onJump={onJump} />
      <RequiredLegend />
      <Fieldset legend={<>Variante<span aria-hidden className="ml-0.5 text-mint"> *</span></>}>
        <p className="mb-3 text-sm text-muted">Einzelkarten: Sie wählen die Farbe (Schwarz oder Weiß). Kombi: je eine schwarze und eine weiße Karte.</p>
        <div className="grid gap-3.5">
          {singles.map((p, i) => (
            <ProductOption key={p.id} p={p} index={i} ctx={ctx} error={prodError} />
          ))}
          <p className="mt-2 font-display text-base font-semibold text-text">Kombi-Paket: eine schwarze und eine weiße Karte</p>
          {combos.map((p, i) => (
            <ProductOption key={p.id} p={p} index={singles.length + i} ctx={ctx} error={prodError} />
          ))}
        </div>
        <FieldError id={errId('product')} message={prodError} />
      </Fieldset>

      <p className="text-sm text-muted">
        Geliefert wird die {PRODUCT_LABEL}, 3 mm stark, im Standarddesign ohne individuellen Aufdruck, in Schwarz oder Weiß.
      </p>

      <div role="group" aria-labelledby="qty-label">
        <label id="qty-label" htmlFor={fieldId('quantity')} className="mb-1 block font-display text-lg font-semibold text-text">
          {combo ? 'Anzahl Kombis' : 'Stückzahl'}<span aria-hidden className="ml-0.5 text-mint"> *</span>
        </label>
        <p id="f-quantity-hint" className="mb-3 text-sm text-muted">
          {combo
            ? `${QTY_MIN} bis ${max} Kombis je Bestellung (je Kombi eine schwarze und eine weiße Karte), alle für einen Standort. `
            : `${QTY_MIN} bis ${max} Karten je Bestellung, alle für einen Standort. `}
          Mehr oder mehrere Filialen? Schreiben Sie uns an support@yanqiva.de.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Eine ${unit(1)} weniger`}
            aria-disabled={qty !== null && qty <= QTY_MIN}
            onClick={() => bump(-1)}
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/50 bg-white/[0.05] text-2xl leading-none text-text transition-colors hover:border-mint/60 active:bg-white/[0.12] aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          >
            <span aria-hidden>−</span>
          </button>
          <input
            id={fieldId('quantity')}
            name="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            required
            maxLength={3}
            value={form.quantity}
            onChange={(e) => ctx.set('quantity', e.target.value)}
            aria-invalid={qtyError ? true : undefined}
            aria-describedby={`f-quantity-hint${qtyError ? ' f-quantity-err' : ''}`}
            className={`block min-h-12 w-20 rounded-xl border bg-white/[0.05] px-2 text-center text-lg font-semibold text-text focus-visible:border-mint ${qtyError ? 'border-red-300' : 'border-white/50'}`}
          />
          <button
            type="button"
            aria-label={`Eine ${unit(1)} mehr`}
            aria-disabled={qty !== null && qty >= max}
            onClick={() => bump(1)}
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/50 bg-white/[0.05] text-2xl leading-none text-text transition-colors hover:border-mint/60 active:bg-white/[0.12] aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          >
            <span aria-hidden>+</span>
          </button>
        </div>
        <FieldError id="f-quantity-err" message={qtyError} />
      </div>

      <ColorSection ctx={ctx} qty={qtyEff} />

      <div>
        <div className="glass rounded-2xl p-4 sm:p-5">
          {pid ? (
            <>
              <p className="text-[15px] text-muted">{quantityText(pid, qtyEff)} {PRODUCTS[pid].shortName}</p>
              <ul className="mt-2 space-y-1.5">
                {priceLines(pid, qtyEff).map((l) => (
                  <li key={l.label} className="flex items-baseline justify-between gap-3 text-[15px] text-muted">
                    <span>{l.label}</span>
                    <span className="shrink-0 text-text">{formatEuro(l.amount)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3 text-[15px] text-muted">
                <span>Zwischensumme</span>
                <span className="shrink-0 font-display text-xl font-semibold text-text">{formatEuro(subtotal(pid, qtyEff))}</span>
              </p>
            </>
          ) : (
            <p className="flex items-baseline justify-between gap-3 text-[15px] text-muted">
              <span>Noch keine Variante gewählt</span>
              <span className="shrink-0 font-display text-xl font-semibold text-text">–</span>
            </p>
          )}
          <p className="mt-1.5 text-[13px] text-muted">Lieferung und Übergabe vor Ort im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe sowie in der Umgebung von Germersheim, Edenkoben und Neustadt an der Weinstraße inklusive. {VAT_NOTE}</p>
        </div>
        {/* Verzögerte Ansage der Zwischensumme (nicht bei jedem Tastendruck) */}
        <p role="status" aria-live="polite" className="sr-only">
          {announced}
        </p>
      </div>

      <DeliveryAreaCheck />

      <NextSteps dashboard={form.product === '' ? undefined : PRODUCTS[form.product].dashboard} />
    </div>
  )
}

export function NextSteps({ dashboard, done = false }: { dashboard?: boolean; done?: boolean }) {
  const all = [
    'Sie senden Ihre Bestellung ab. Das ist Ihr verbindliches Angebot.',
    'Sie erhalten eine Eingangsbestätigung per E-Mail. Das ist noch keine Annahme.',
    'Mit der Auftragsbestätigung per E-Mail, in der Regel innerhalb eines Werktags, kommt der Vertrag zustande. Mit ihr erhalten Sie eine Rechnung oder eine Zahlungsaufforderung (keine Rechnung; diese folgt dann gesondert).',
    'Sie zahlen per Vorkasse: Sie überweisen den Betrag innerhalb von 14 Tagen.',
    `Nach Zahlungseingang richten wir Ihre Karte mit Ihrem Google-Link ein, produzieren sie und übergeben sie Ihnen persönlich vor Ort, ${dashboard === undefined ? 'in der Regel innerhalb von 2–5 Werktagen (Klassik und Kombi) bzw. 7 Werktagen (Dashboard, auch als Kombi).' : dashboard ? 'in der Regel innerhalb von 7 Werktagen. Den Dashboard-Zugang erhalten Sie per E-Mail mit der Übergabe.' : 'in der Regel innerhalb von 2–5 Werktagen.'}`,
  ]
  const items = done ? all.slice(1) : all
  return (
    <section aria-labelledby="next-h" className="rounded-2xl border border-line bg-white/[0.03] p-4 sm:p-5">
      <h3 id="next-h" className="font-display text-lg font-semibold text-text">
        So geht es weiter
      </h3>
      <ol className="mt-3 space-y-3">
        {items.map((t, i) => (
          <li key={t} className="flex gap-3 text-[15px] leading-snug text-muted">
            <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full border border-mint/40 bg-mint/10 text-[13px] font-semibold text-mint">
              {i + 1}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function StepSetup({ ctx, summaryKeys, onJump }: StepProps) {
  return (
    <div className="space-y-8">
      <Summary ctx={ctx} summaryKeys={summaryKeys} onJump={onJump} />
      <RequiredLegend />
      <TextField
        ctx={ctx}
        name="displayName"
        maxLength={MAX.displayName}
        autoComplete="off"
        hint="Optional. Erscheint nur in Ihrem Dashboard und in unseren Unterlagen, nicht auf der Karte. Ohne Angabe verwenden wir den Firmennamen."
        placeholder="z. B. Filiale Hauptstraße"
      />
      <Fieldset legend="Ihr Google-Unternehmensprofil">
        <p id="profile-help" className="mb-4 text-sm leading-snug text-muted">
          Dorthin leitet die Karte Ihre Kunden. Mindestens eine der beiden Angaben ist erforderlich<span aria-hidden className="font-semibold text-mint"> *</span>.
        </p>
        <div className="space-y-5">
          <TextField
            ctx={ctx}
            name="reviewLink"
            type="url"
            inputMode="url"
            autoComplete="off"
            maxLength={MAX.reviewLink}
            label="Google-Bewertungslink"
            placeholder="https://g.page/r/…"
            hint="Im Google-Unternehmensprofil auf „Bewertungen erhalten“ tippen und den Link kopieren."
          />
          <p aria-hidden className="text-center text-sm font-medium uppercase tracking-widest text-faint">
            oder
          </p>
          <TextField
            ctx={ctx}
            name="profileQuery"
            describedBy={ctx.errors.reviewLink ? errId('reviewLink') : undefined}
            autoComplete="off"
            maxLength={MAX.profileQuery}
            label="Name und Ort Ihres Unternehmens"
            placeholder="z. B. Café Sonnenschein, Kaiserslautern"
            hint="So, wie Ihr Unternehmen bei Google angezeigt wird. Wir suchen den Link dann für Sie heraus."
          />
        </div>
      </Fieldset>
      <TextField
        ctx={ctx}
        name="notes"
        multiline
        rows={4}
        maxLength={MAX.notes}
        hint="Allgemeine Hinweise zu Ihrer Bestellung, zum Beispiel zur Übergabe oder zu Ihrem Standort."
      />
    </div>
  )
}

export function StepData({ ctx, summaryKeys, onJump }: StepProps) {
  const { form } = ctx
  return (
    <div className="space-y-9">
      <Summary ctx={ctx} summaryKeys={summaryKeys} onJump={onJump} />
      <RequiredLegend />
      <Fieldset legend="Unternehmen und Ansprechpartner">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField ctx={ctx} name="company" required maxLength={MAX.company} autoComplete="organization" className="sm:col-span-2" />
          <TextField ctx={ctx} name="firstName" required maxLength={MAX.firstName} autoComplete="given-name" />
          <TextField ctx={ctx} name="lastName" required maxLength={MAX.lastName} autoComplete="family-name" />
          <TextField
            ctx={ctx}
            name="email"
            required
            type="email"
            inputMode="email"
            maxLength={MAX.email}
            autoComplete="email"
            placeholder="name@firma.de"
            hint="Hierhin senden wir Eingangs- und Auftragsbestätigung."
            className="sm:col-span-2"
          />
          <TextField
            ctx={ctx}
            name="phone"
            type="tel"
            inputMode="tel"
            maxLength={MAX.phone}
            autoComplete="tel"
            hint="Nur für Rückfragen zur Lieferung."
            className="sm:col-span-2"
          />
        </div>
      </Fieldset>

      <Fieldset legend="Rechnungsadresse">
        <div className="grid gap-5 sm:grid-cols-6">
          <TextField ctx={ctx} name="billingStreet" required maxLength={MAX.billingStreet} autoComplete="billing street-address" className="sm:col-span-6" />
          <TextField ctx={ctx} name="billingZip" required inputMode="numeric" maxLength={5} autoComplete="billing postal-code" className="sm:col-span-2" />
          <TextField ctx={ctx} name="billingCity" required maxLength={MAX.billingCity} autoComplete="billing address-level2" className="sm:col-span-4" />
        </div>
        <p className="mt-3 text-sm text-muted">Land: Deutschland. Die Rechnungsadresse kann überall in Deutschland liegen. Geliefert wird nur im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe sowie in der Umgebung von Germersheim, Edenkoben und Neustadt an der Weinstraße.</p>
        {!form.shipDifferent && !ctx.errors.billingZip && <ZipAreaNote id="zip-area-billing" zip={form.billingZip} />}
      </Fieldset>

      <Fieldset legend="Lieferadresse">
        <p className="mb-3 text-sm text-muted">Wir liefern persönlich im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe sowie in der Umgebung von Germersheim, Edenkoben und Neustadt an der Weinstraße. Die Lieferadresse muss dort liegen.</p>
        <CheckboxField ctx={ctx} name="shipDifferent">
          Die Lieferadresse weicht von der Rechnungsadresse ab
        </CheckboxField>
        {form.shipDifferent && (
          <div className="mt-5 grid gap-5 sm:grid-cols-6">
            <TextField ctx={ctx} name="shipName" maxLength={MAX.shipName} label="Firma oder Empfänger" autoComplete="shipping organization" className="sm:col-span-6" />
            <TextField ctx={ctx} name="shipStreet" required maxLength={MAX.shipStreet} label="Straße und Hausnummer" autoComplete="shipping street-address" className="sm:col-span-6" />
            <TextField ctx={ctx} name="shipZip" required inputMode="numeric" maxLength={5} label="Postleitzahl" autoComplete="shipping postal-code" className="sm:col-span-2" />
            <TextField ctx={ctx} name="shipCity" required maxLength={MAX.shipCity} label="Ort" autoComplete="shipping address-level2" className="sm:col-span-4" />
            {!ctx.errors.shipZip && (
              <div className="sm:col-span-6">
                <ZipAreaNote id="zip-area-ship" zip={form.shipZip} />
              </div>
            )}
          </div>
        )}
      </Fieldset>
    </div>
  )
}

function ReviewBlock({ title, step, onEdit, children }: { title: string; step: StepId; onEdit: (s: StepId) => void; children: ReactNode }) {
  return (
    <section className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-text">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="-mr-2 inline-flex min-h-11 items-center rounded-lg px-2 text-[15px] font-medium text-mint underline underline-offset-2 hover:text-white"
        >
          Ändern<span className="sr-only">: {title}</span>
        </button>
      </div>
      <dl className="mt-2 grid grid-cols-1 gap-x-4 text-[15px] sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-y-2">{children}</dl>
    </section>
  )
}

const Row = ({ k, children }: { k: string; children: ReactNode }) => (
  <>
    <dt className="mt-2 text-sm text-muted sm:mt-0 sm:text-[15px]">{k}</dt>
    <dd className="break-words text-text">{children}</dd>
  </>
)

export function StepReview({ ctx, summaryKeys, onJump, onEdit }: StepProps & { onEdit: (s: StepId) => void }) {
  const f = trimmed(ctx.form)
  const qty = qtyOf(f)
  const pid = productOf(f)
  const p = PRODUCTS[pid]
  return (
    <div className="space-y-6">
      <Summary ctx={ctx} summaryKeys={summaryKeys} onJump={onJump} />
      <RequiredLegend />
      <section className="glass-accent rounded-2xl p-4 sm:p-5" aria-labelledby="order-sum-h">
        <div className="flex items-center justify-between gap-3">
          <h3 id="order-sum-h" className="font-display text-base font-semibold text-text">
            Ihre Bestellung
          </h3>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="-mr-2 inline-flex min-h-11 items-center rounded-lg px-2 text-[15px] font-medium text-mint underline underline-offset-2 hover:text-white"
          >
            Ändern<span className="sr-only">: Ihre Bestellung</span>
          </button>
        </div>
        <dl className="mt-2 space-y-2 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Produkt</dt>
            <dd className="text-right text-text">{p.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Ausführung</dt>
            <dd className="text-right text-text">{PRODUCT_LABEL}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Farbe</dt>
            <dd className="text-right text-text">{colorSummary(colorCounts(f))}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Menge</dt>
            <dd className="text-right text-text">{quantityText(pid, qty)}</dd>
          </div>
          {priceLines(pid, qty).map((l) => (
            <div key={l.label} className="flex justify-between gap-4">
              <dt className="max-w-[26ch] text-muted sm:max-w-[40ch]">{l.label}</dt>
              <dd className="text-right text-text">{formatEuro(l.amount)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Zwischensumme</dt>
            <dd className="text-right text-text">{formatEuro(subtotal(pid, qty))}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Lieferung vor Ort</dt>
            <dd className="text-right text-text">{formatEuro(SHIPPING_EUR)} (inklusive)</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Lieferzeit</dt>
            <dd className="max-w-[26ch] text-right text-text sm:max-w-[40ch]">{shippingText(p)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <dt className="font-display text-base font-semibold text-text">Gesamtbetrag einmalig</dt>
            <dd className="font-display text-2xl font-semibold text-mint">{formatEuro(total(pid, qty))}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Laufende Kosten</dt>
            <dd className="max-w-[26ch] text-right text-text sm:max-w-[40ch]">
              {p.dashboard ? `Keine in den ersten ${DASHBOARD_INCLUDED_MONTHS} Monaten (Dashboard inklusive). Danach optional ${DASHBOARD_RENEWAL_EUR} € pro Monat je Standort, monatlich kündbar.` : 'Keine'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Zahlungsart</dt>
            <dd className="max-w-[26ch] text-right text-text sm:max-w-[40ch]">Vorkasse per Überweisung (Zahlungsaufforderung bzw. Rechnung)</dd>
          </div>
        </dl>
        <p className="mt-3 text-[13px] text-muted">{VAT_NOTE}</p>
      </section>

      <ReviewBlock title="Einrichtung" step={2} onEdit={onEdit}>
        <Row k="Bezeichnung des Standorts">{f.displayName.trim() || f.company.trim()}</Row>
        {f.reviewLink && <Row k="Bewertungslink">{f.reviewLink}</Row>}
        {f.profileQuery && <Row k="Name und Ort">{f.profileQuery}</Row>}
        {f.notes && <Row k="Hinweise">{f.notes}</Row>}
      </ReviewBlock>

      <ReviewBlock title="Ihre Daten" step={3} onEdit={onEdit}>
        <Row k="Unternehmen">{f.company}</Row>
        <Row k="Ansprechpartner">
          {f.firstName} {f.lastName}
        </Row>
        <Row k="E-Mail">{f.email}</Row>
        {f.phone && <Row k="Telefon">{f.phone}</Row>}
        <Row k="Rechnungsadresse">
          {f.billingStreet}, {f.billingZip} {f.billingCity}, Deutschland
        </Row>
        <Row k="Lieferadresse">
          {f.shipDifferent ? `${f.shipName ? `${f.shipName}, ` : ''}${f.shipStreet}, ${f.shipZip} ${f.shipCity}, Deutschland` : 'wie Rechnungsadresse'}
        </Row>
      </ReviewBlock>

      <div className="space-y-3">
        <CheckboxField ctx={ctx} name="confirmB2B" required>
          Ich bestelle als Unternehmer im Sinne von § 14 BGB in Ausübung meiner gewerblichen oder selbständigen beruflichen Tätigkeit und nicht als Verbraucher.
        </CheckboxField>
        <CheckboxField ctx={ctx} name="acceptAgb" required>
          Ich habe die{' '}
          <a
            href={`${BASE}agb/`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-mint underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            AGB<span className="sr-only"> (öffnet in neuem Tab)</span>
          </a>{' '}
          gelesen und akzeptiere sie.
        </CheckboxField>
      </div>

      <p data-testid="payment-note" className="rounded-2xl border border-mint/40 bg-mint/[0.07] p-4 text-[15px] leading-snug text-muted sm:p-5">
        <strong className="font-semibold text-text">Zahlungsweise: </strong>
        {PAYMENT_NOTE}
      </p>

      <p className="text-sm leading-relaxed text-muted">
        Mit „Zahlungspflichtig bestellen“ geben Sie ein verbindliches Angebot ab. Die Eingangsbestätigung ist noch keine Annahme; der Vertrag kommt erst mit unserer
        Auftragsbestätigung zustande. Wir verarbeiten Ihre Angaben, um Ihre Bestellung abzuwickeln; die Eingangsbestätigung versenden wir über unseren
        Dienstleister Resend (USA). Einzelheiten finden Sie in unserer{' '}
        <a href={`${BASE}datenschutz/`} target="_blank" rel="noopener noreferrer" className="text-mint underline underline-offset-2">
          Datenschutzerklärung<span className="sr-only"> (öffnet in neuem Tab)</span>
        </a>
        .
      </p>
    </div>
  )
}
