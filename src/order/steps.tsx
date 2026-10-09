import { useEffect, useState, type ReactNode } from 'react'
import {
  DASHBOARD_RENEWAL_EUR, FORMAT_LIST, FORMATS, formatEuro, PRODUCT_LIST, PRODUCTS, QTY_MAX, QTY_MIN, SHIPPING_EUR, subtotal, total, VAT_NOTE,
  shippingText,
} from './catalog'
import { CheckboxField, ErrorSummary, FieldError, Fieldset, RequiredLegend, TextField, type FormCtx } from './fields'
import { errId, fieldId } from './ids'
import { DeliveryAreaCheck, StartNotice, ZipAreaNote } from './notices'
import { beforeOrderStart, ORDER_START_LONG } from './orderStart'
import { effectiveQuantity, MAX, parseQuantity, productOf, trimmed, type FieldKey, type StepId } from './state'

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

export function StepProduct({ ctx, summaryKeys, onJump }: StepProps) {
  const { form, errors } = ctx
  const qty = parseQuantity(form.quantity)
  const qtyEff = effectiveQuantity(form.quantity)
  const bump = (d: number) => ctx.set('quantity', String(Math.min(QTY_MAX, Math.max(QTY_MIN, (qty ?? qtyEff) + d))))
  const qtyError = errors.quantity
  const prodError = errors.product
  const pid = form.product || null
  const sumText = pid
    ? `${qtyEff} × ${PRODUCTS[pid].shortName} (${FORMATS[form.format].name}), Zwischensumme ${formatEuro(subtotal(pid, qtyEff))}`
    : 'Bitte wählen Sie eine Variante, um den Preis zu sehen.'
  const announced = useDebounced(sumText, 600)
  return (
    <div className="space-y-9">
      <Summary ctx={ctx} summaryKeys={summaryKeys} onJump={onJump} />
      <RequiredLegend />
      <Fieldset legend={<>Variante<span aria-hidden className="ml-0.5 text-mint"> *</span></>}>
        <div className="grid gap-3.5">
          {PRODUCT_LIST.map((p, i) => (
            <label key={p.id} className={cardBase}>
              <input
                type="radio"
                id={i === 0 ? fieldId('product') : undefined}
                name="product"
                required
                value={p.id}
                checked={form.product === p.id}
                onChange={() => ctx.set('product', p.id)}
                aria-labelledby={`prod-${p.id}-n`}
                aria-invalid={prodError ? true : undefined}
                aria-describedby={`prod-${p.id}-d prod-${p.id}-r${prodError ? ` ${errId('product')}` : ''}`}
                className="peer sr-only"
              />
              <RadioDot />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span id={`prod-${p.id}-n`} className="font-display text-lg font-semibold text-text">{p.shortName}</span>
                  <span id={`prod-${p.id}-d`} className="shrink-0 text-right font-display text-xl font-semibold text-text">
                    {formatEuro(p.unitPrice)}
                    <span className="block text-[13px] font-normal text-muted">einmalig je Stück</span>
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
                  {p.id === 'review-dashboard' ? ' (inklusive Einrichtung des Dashboards)' : ''}.
                </span>
              </span>
            </label>
          ))}
        </div>
        <FieldError id={errId('product')} message={prodError} />
      </Fieldset>

      <Fieldset legend="Ausführung">
        <div className="grid gap-3.5 sm:grid-cols-2">
          {FORMAT_LIST.map((o) => (
            <label key={o.id} className={cardBase}>
              <input
                type="radio"
                name="format"
                value={o.id}
                checked={form.format === o.id}
                onChange={() => ctx.set('format', o.id)}
                aria-labelledby={`fmt-${o.id}-n`}
                aria-describedby={`fmt-${o.id}-d`}
                className="peer sr-only"
              />
              <RadioDot />
              <span>
                <span id={`fmt-${o.id}-n`} className="block font-display text-base font-semibold text-text">{o.name}</span>
                <span id={`fmt-${o.id}-d`} className="mt-0.5 block text-sm text-muted">{o.description}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">Beide Ausführungen kosten dasselbe.</p>
      </Fieldset>

      <div role="group" aria-labelledby="qty-label">
        <label id="qty-label" htmlFor={fieldId('quantity')} className="mb-1 block font-display text-lg font-semibold text-text">
          Stückzahl<span aria-hidden className="ml-0.5 text-mint"> *</span>
        </label>
        <p id="f-quantity-hint" className="mb-3 text-sm text-muted">
          {QTY_MIN} bis {QTY_MAX} Stück je Bestellung, alle für einen Standort. Mehr Stück oder mehrere Filialen? Schreiben Sie uns an support@yanqiva.de.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Eine Karte weniger"
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
            aria-label="Eine Karte mehr"
            aria-disabled={qty !== null && qty >= QTY_MAX}
            onClick={() => bump(1)}
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/50 bg-white/[0.05] text-2xl leading-none text-text transition-colors hover:border-mint/60 active:bg-white/[0.12] aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          >
            <span aria-hidden>+</span>
          </button>
        </div>
        <FieldError id="f-quantity-err" message={qtyError} />
        <div className="glass mt-5 rounded-2xl p-4 sm:p-5">
          <p className="flex items-baseline justify-between gap-3 text-[15px] text-muted">
            <span>{pid ? `${qtyEff} × ${PRODUCTS[pid].shortName} (${FORMATS[form.format].name}) à ${formatEuro(PRODUCTS[pid].unitPrice)}` : 'Noch keine Variante gewählt'}</span>
            <span className="shrink-0 font-display text-xl font-semibold text-text">{pid ? formatEuro(subtotal(pid, qtyEff)) : '–'}</span>
          </p>
          <p className="mt-1.5 text-[13px] text-muted">Lieferung und Übergabe vor Ort im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe inklusive. {VAT_NOTE}</p>
        </div>
        {/* Verzögerte Ansage der Zwischensumme (nicht bei jedem Tastendruck) */}
        <p role="status" aria-live="polite" className="sr-only">
          {announced}
        </p>
      </div>

      <DeliveryAreaCheck />

      <NextSteps dashboard={form.product === '' ? undefined : form.product === 'review-dashboard'} />
    </div>
  )
}

export function NextSteps({ dashboard, done = false }: { dashboard?: boolean; done?: boolean }) {
  const all = [
    'Sie senden Ihre Bestellung ab. Das ist Ihr verbindliches Angebot.',
    'Sie erhalten eine Eingangsbestätigung per E-Mail. Das ist noch keine Annahme.',
    beforeOrderStart()
      ? `Mit der Auftragsbestätigung per E-Mail kommt der Vertrag zustande. Wir nehmen unsere Tätigkeit am ${ORDER_START_LONG} auf und bestätigen Bestellungen, die vorher eingehen, ab diesem Tag. Die Rechnung folgt zusammen mit der Auftragsbestätigung.`
      : 'Mit der Auftragsbestätigung per E-Mail, in der Regel innerhalb eines Werktags, kommt der Vertrag zustande. Die Rechnung folgt zusammen mit ihr.',
    'Sie überweisen den Betrag innerhalb von 14 Tagen.',
    `Nach Zahlungseingang richten wir Ihre Karte mit Ihrem Google-Link ein, produzieren sie und übergeben sie Ihnen persönlich vor Ort, ${dashboard === undefined ? 'in der Regel innerhalb von 2–5 Werktagen (Klassik) bzw. 7 Werktagen (Dashboard).' : dashboard ? 'in der Regel innerhalb von 7 Werktagen. Den Dashboard-Zugang erhalten Sie per E-Mail mit der Übergabe.' : 'in der Regel innerhalb von 2–5 Werktagen.'}`,
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
        required
        maxLength={MAX.displayName}
        autoComplete="organization"
        hint="Dieser Name wird auf Karte oder Aufsteller gedruckt und ist für Ihre Kunden sichtbar."
        placeholder="z. B. Café Sonnenschein"
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
        hint="Zum Beispiel Gestaltungswünsche oder dass Sie ein Logo nachreichen."
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
        <p className="mt-3 text-sm text-muted">Land: Deutschland. Die Rechnungsadresse kann überall in Deutschland liegen. Geliefert wird nur im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe.</p>
        {!form.shipDifferent && !ctx.errors.billingZip && <ZipAreaNote id="zip-area-billing" zip={form.billingZip} />}
      </Fieldset>

      <Fieldset legend="Lieferadresse">
        <p className="mb-3 text-sm text-muted">Wir liefern persönlich im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe. Die Lieferadresse muss dort liegen.</p>
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
  const qty = effectiveQuantity(f.quantity)
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
            <dd className="text-right text-text">{FORMATS[f.format].name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Menge</dt>
            <dd className="text-right text-text">
              {qty} × {formatEuro(p.unitPrice)}
            </dd>
          </div>
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
              {f.product === 'review-dashboard' ? `Keine im ersten Jahr. Danach optional ${DASHBOARD_RENEWAL_EUR} € pro Monat je Standort, monatlich kündbar.` : 'Keine'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Zahlungsart</dt>
            <dd className="text-right text-text">Rechnung (Überweisung)</dd>
          </div>
        </dl>
        <p className="mt-3 text-[13px] text-muted">{VAT_NOTE}</p>
      </section>

      <ReviewBlock title="Einrichtung" step={2} onEdit={onEdit}>
        <Row k="Name auf der Karte">{f.displayName}</Row>
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

      <StartNotice />

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
