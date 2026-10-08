import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Background } from '../sections/Background'
import { Footer } from '../sections/Footer'
import { Navbar } from '../sections/Navbar'
import { ApiError, mailtoUrl, PowSession, submitLead } from './api'
import { Confirmation } from './Confirmation'
import { PRODUCT_LIST } from './catalog'
import { type FormCtx } from './fields'
import { fieldId } from './ids'
import { buildFields, buildMailBody, buildMessage, mailSubject } from './message'
import { StepData, StepProduct, StepReview, StepSetup } from './steps'
import {
  clearDraft, FIELD_ORDER, firstIncompleteStep, initialForm, loadDraft, mapServerCode, newOrderKey, saveDraft, STEPS, stepFromUrl, stepUrl, trimmed, validateStep,
  type Errors, type FieldKey, type OrderForm, type StepId,
} from './state'
import { MobileBar, OrderSidebar } from './summary'

const BASE = import.meta.env.BASE_URL
const ORDER_FORM_ID = 'order-form'

function computeInitial(): { form: OrderForm; step: StepId } {
  const draft = loadDraft()
  const form = draft?.form ?? initialForm()
  const params = new URLSearchParams(window.location.search)
  const paket = params.get('paket')
  const preset = PRODUCT_LIST.find((p) => p.param === paket)
  if (preset) form.product = preset.id
  const wanted = stepFromUrl() ?? (preset ? 1 : (draft?.step ?? 1))
  return { form, step: Math.min(wanted, firstIncompleteStep(form)) as StepId }
}

type SendProblem = { kind: 'network' | 'api'; message: string } | null

/** Bestell-Checkout: vier Schritte plus Bestätigung. */
export function OrderApp() {
  const [initial] = useState(computeInitial)
  const [form, setForm] = useState<OrderForm>(initial.form)
  const [step, setStep] = useState<StepId>(initial.step)
  const [attempted, setAttempted] = useState<readonly StepId[]>([])
  const [summaryKeys, setSummaryKeys] = useState<readonly FieldKey[]>([])
  const [sending, setSending] = useState(false)
  const [problem, setProblem] = useState<SendProblem>(null)
  const [done, setDone] = useState<{ id: string; form: OrderForm } | null>(null)
  const [copied, setCopied] = useState(false)
  const [focusReq, setFocusReq] = useState<{ key: FieldKey; n: number } | null>(null)
  const [serverErrors, setServerErrors] = useState<Errors>({})
  const [pow] = useState(() => new PowSession())
  const [startedAt] = useState(() => Date.now())

  const headingRef = useRef<HTMLHeadingElement>(null)
  const problemRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const firstRender = useRef(true)
  const formLatest = useRef(form)
  const sendingRef = useRef(false)
  const doneRef = useRef(false)
  // Schritte der History-Eintraege dieser Sitzung (Position = history.state.idx)
  const trail = useRef<StepId[]>([initial.step])
  const pos = useRef(0)

  const errors: Errors = { ...(attempted.includes(step) ? validateStep(step, form) : {}), ...serverErrors }

  const set: FormCtx['set'] = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setServerErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
    setProblem(null)
  }, [])
  const ctx: FormCtx = { form, errors, set }

  // Schritt in der URL: Zurück/Vor des Browsers wechseln den Schritt.
  useEffect(() => {
    window.history.replaceState({ step: initial.step, idx: 0 }, '', stepUrl(initial.step))
    const onPop = (ev: PopStateEvent) => {
      const st = ev.state as { idx?: number } | null
      if (doneRef.current) {
        // Nach erfolgreicher Bestellung: frische Bestellung ab Schritt 1 statt eines inkonsistenten Zustands
        doneRef.current = false
        trail.current = [1]
        pos.current = 0
        window.history.replaceState({ step: 1, idx: 0 }, '', stepUrl(1))
        setDone(null)
        setForm(initialForm())
        setAttempted([])
        setServerErrors({})
        setStep(1)
        return
      }
      const wanted = stepFromUrl() ?? 1
      const clamped = Math.min(wanted, firstIncompleteStep(formLatest.current)) as StepId
      if (typeof st?.idx === 'number') pos.current = st.idx
      if (clamped !== wanted) window.history.replaceState({ step: clamped, idx: pos.current }, '', stepUrl(clamped))
      trail.current[pos.current] = clamped
      setStep(clamped)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [initial.step])

  // Zwischenstand in sessionStorage
  useEffect(() => {
    formLatest.current = form
    doneRef.current = done !== null
    if (!done) saveDraft(form, step)
  }, [form, step, done])

  // Dokumenttitel je Zustand (WCAG 2.4.2)
  useEffect(() => {
    document.title = done
      ? 'Bestellung eingegangen – YANQIVA REVIEW'
      : `Schritt ${step} von ${STEPS.length}: ${STEPS[step - 1].label} – Bestellen – YANQIVA REVIEW`
  }, [step, done])

  // Fokus auf die Schritt-Überschrift bei jedem Schrittwechsel
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setSummaryKeys([])
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  // Fokus auf das erste fehlerhafte Feld
  useEffect(() => {
    if (focusReq) document.getElementById(fieldId(focusReq.key))?.focus()
  }, [focusReq])

  useEffect(() => {
    if (problem) problemRef.current?.focus()
  }, [problem])

  const goTo = (next: StepId) => {
    if (next === step) return
    const idx = pos.current + 1
    trail.current = [...trail.current.slice(0, idx), next]
    pos.current = idx
    window.history.pushState({ step: next, idx }, '', stepUrl(next))
    setStep(next)
  }

  /** Zurück: per history.back(), wenn der vorige Eintrag dieser Schritt ist, sonst als Sprung. */
  const goBack = () => {
    const target = (step - 1) as StepId
    if (pos.current > 0 && trail.current[pos.current - 1] === target) window.history.back()
    else goTo(target)
  }

  const jump = (key: FieldKey) => setFocusReq((r) => ({ key, n: (r?.n ?? 0) + 1 }))

  const reject = (target: StepId, errs: Errors) => {
    const keys = FIELD_ORDER.filter((k) => errs[k])
    setAttempted((a) => (a.includes(target) ? a : [...a, target]))
    setSummaryKeys(keys)
    if (keys[0]) jump(keys[0])
  }

  const send = async () => {
    if (sendingRef.current) return
    sendingRef.current = true
    setSending(true)
    setProblem(null)
    const f = trimmed(form)
    try {
      const res = await submitLead({ email: f.email, message: buildMessage(f), fields: buildFields(f) }, formRef.current, startedAt, pow)
      clearDraft()
      window.history.replaceState({ step: 1, idx: 0 }, '', window.location.pathname)
      trail.current = [1]
      pos.current = 0
      doneRef.current = true
      setDone({ id: res.id, form: f })
      setForm((cur) => ({ ...cur, orderKey: newOrderKey() }))
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError('network', 'Netzwerkfehler')
      const mapped = e.kind === 'api' ? mapServerCode(e.code) : null
      if (mapped) {
        setServerErrors({ [mapped.field]: e.message })
        setAttempted((a) => (a.includes(mapped.step) ? a : [...a, mapped.step]))
        goTo(mapped.step)
        jump(mapped.field)
      } else {
        if (e.code === 'invalid_order_key') setForm((cur) => ({ ...cur, orderKey: newOrderKey() }))
        setProblem({ kind: e.kind, message: e.message })
      }
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (sending || sendingRef.current) return
    const errs = validateStep(step, form)
    if (Object.keys(errs).length > 0) return reject(step, errs)
    if (step < 4) return goTo((step + 1) as StepId)
    const incomplete = firstIncompleteStep(form)
    if (incomplete < 4) {
      goTo(incomplete)
      return
    }
    void send()
  }

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage(form))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const stepInfo = STEPS[step - 1]
  const primaryLabel = step < 4 ? 'Weiter' : sending ? 'Bestellung wird gesendet …' : 'Zahlungspflichtig bestellen'
  const primary = (
    <Button type="submit" form={ORDER_FORM_ID} aria-disabled={sending || undefined} className="w-full aria-disabled:pointer-events-none aria-disabled:opacity-60">
      {primaryLabel}
    </Button>
  )

  const props = { ctx, summaryKeys, onJump: jump }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-full focus:bg-mint focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink-950">
        Zum Inhalt springen
      </a>
      <Background />
      <Navbar anchorBase={BASE} />
      <main id="main" tabIndex={-1} className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-28 outline-none sm:px-8 sm:pt-32">
        <header className="mb-8 max-w-2xl">
          <p className="chip">Bestellen</p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance">YANQIVA REVIEW bestellen</h1>
          <p className="mt-3 text-base text-muted">Für Unternehmen. Zahlung bequem per Rechnung, Versand innerhalb Deutschlands inklusive.</p>
        </header>

        <p role="status" aria-live="polite" className="sr-only">
          {sending ? 'Bestellung wird gesendet …' : ''}
        </p>

        {done ? (
          <Confirmation orderId={done.id} form={done.form} />
        ) : (
          <>
            <div role="group" aria-label="Fortschritt" className="mb-6">
              <ol className="grid grid-cols-4 gap-2 sm:gap-3">
                {STEPS.map((s) => {
                  const state = s.id < step ? 'done' : s.id === step ? 'current' : 'todo'
                  return (
                    <li key={s.id} aria-current={state === 'current' ? 'step' : undefined} className="min-w-0">
                      <span className={`block h-1.5 rounded-full ${state === 'todo' ? 'bg-white/15' : 'bg-mint'}`} aria-hidden />
                      <span className={`mt-2 flex items-start gap-1.5 text-[13px] leading-tight sm:text-sm ${state === 'current' ? 'font-semibold text-text' : 'text-muted'}`}>
                        <span
                          aria-hidden
                          className={`hidden size-5 shrink-0 place-items-center rounded-full text-[11px] sm:grid font-bold ${state === 'todo' ? 'border border-white/30 text-muted' : 'bg-mint text-ink-950'}`}
                        >
                          {state === 'done' ? '✓' : s.id}
                        </span>
                        <span className="min-w-0">
                          <span className="sr-only">
                            Schritt {s.id} von {STEPS.length}:{' '}
                          </span>
                          {s.label}
                          {state === 'done' && <span className="sr-only"> (erledigt)</span>}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className={step === 4 ? 'lg:mx-auto lg:max-w-3xl' : 'lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-10'}>
              <div className="glass min-w-0 rounded-3xl p-5 sm:p-8">
                <h2 ref={headingRef} tabIndex={-1} className="mb-6 font-display text-2xl font-semibold tracking-tight text-text outline-none sm:text-[1.75rem]">
                  <span className="sr-only">
                    Schritt {step} von {STEPS.length}:{' '}
                  </span>
                  {stepInfo.title}
                </h2>

                <form id={ORDER_FORM_ID} ref={formRef} noValidate onSubmit={onSubmit} onFocus={() => pow.start()} autoComplete="on">
                  <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                    <label>
                      Bitte leer lassen
                      <input type="text" name="homepage" tabIndex={-1} autoComplete="off" defaultValue="" />
                    </label>
                  </div>

                  {step === 1 && <StepProduct {...props} />}
                  {step === 2 && <StepSetup {...props} />}
                  {step === 3 && <StepData {...props} />}
                  {step === 4 && <StepReview {...props} onEdit={goTo} />}

                  {problem && (
                    <div ref={problemRef} tabIndex={-1} role="alert" className="mt-6 rounded-2xl border border-red-300/60 bg-red-300/[0.08] p-4 outline-none sm:p-5">
                      {problem.kind === 'api' ? (
                        <>
                          <p className="font-display text-base font-semibold text-red-200">Ihre Bestellung wurde nicht gesendet.</p>
                          <p className="mt-1.5 text-[15px] leading-snug text-red-100">{problem.message}</p>
                          <p className="mt-2 text-[15px] leading-snug text-muted">Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut. Alternativ senden Sie die Bestellung per E-Mail.</p>
                        </>
                      ) : (
                        <>
                          <p className="font-display text-base font-semibold text-red-200">Ihre Bestellung konnte nicht automatisch übermittelt werden.</p>
                          <p className="mt-1.5 text-[15px] leading-snug text-red-100">
                            Wir haben keine Bestätigung vom Server erhalten. Möglicherweise ist Ihre Bestellung trotzdem angekommen. Bitte prüfen Sie zuerst Ihr E-Mail-Postfach (auch den Spam-Ordner) auf die Eingangsbestätigung.
                            „Erneut senden“ ist sicher und erzeugt keine doppelte Bestellung. Ihre Angaben sind noch vollständig im Formular.
                          </p>
                        </>
                      )}
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <a
                          href={mailtoUrl(mailSubject(form.company), buildMailBody(form))}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-red-200/60 bg-red-200/10 px-5 text-[15px] font-medium text-red-50 hover:bg-red-200/20"
                        >
                          Bestellung per E-Mail senden
                        </a>
                        <button
                          type="button"
                          onClick={() => void send()}
                          aria-disabled={sending || undefined}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-mint/50 bg-mint/10 px-5 text-[15px] font-medium text-mint hover:bg-mint/20 aria-disabled:opacity-60"
                        >
                          Erneut senden
                        </button>
                        <button
                          type="button"
                          onClick={() => void copyOrder()}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 text-[15px] font-medium text-text hover:border-mint/50"
                        >
                          Bestelltext kopieren
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-snug text-muted">
                        Die E-Mail enthält die wichtigsten Angaben. Mit „Bestelltext kopieren“ erhalten Sie den vollständigen Bestelltext.
                      </p>
                      <p role="status" className="mt-1 min-h-5 text-sm text-muted">
                        {copied ? 'Der Bestelltext wurde in die Zwischenablage kopiert.' : ''}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {step > 1 ? (
                      <Button type="button" variant="ghost" onClick={goBack} className="w-full sm:w-auto">
                        <span aria-hidden>←</span> Zurück
                      </Button>
                    ) : (
                      <span />
                    )}
                    <div className="hidden lg:block">
                      <Button type="submit" form={ORDER_FORM_ID} aria-disabled={sending || undefined} className="aria-disabled:pointer-events-none aria-disabled:opacity-60">
                        {primaryLabel}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              {step !== 4 && (
                <div className="hidden lg:sticky lg:top-24 lg:block">
                  <OrderSidebar form={form} />
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <div className={done ? '' : 'pb-28 lg:pb-0'}>
        <Footer onLegalPage />
      </div>
      {!done && <MobileBar form={form}>{primary}</MobileBar>}
    </>
  )
}
