import { WHATSAPP_ARIA_LABEL, WHATSAPP_LABEL, whatsappHref } from '../config/whatsapp'

/** WhatsApp-Logo (Sprechblase mit Hörer) als Inline-SVG, einfarbig über currentColor. Kein externes Bild. */
function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24ZM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47Z" />
    </svg>
  )
}

/** Schwebender, runder WhatsApp-Button unten rechts (echter Link, kein Skript, keine Cookies). Im Druck ausgeblendet. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={WHATSAPP_ARIA_LABEL}
      title={WHATSAPP_LABEL}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#25d366] text-ink-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_0_0_1px_rgb(11_44_35/0.35),0_10px_28px_-6px_rgb(0_0_0/0.5)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-95 print:hidden"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}

/** Gut sichtbarer Button „Per WhatsApp schreiben“ für Kontakt- und Abschlussbereiche. `topic` belegt das Paket in der Vorlage vor. */
export function WhatsAppButton({ topic, className = '' }: { topic?: string; className?: string }) {
  return (
    <a
      href={whatsappHref(topic)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={WHATSAPP_ARIA_LABEL}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-5 text-[15px] font-semibold text-ink-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_0_0_1px_rgb(11_44_35/0.3),0_8px_30px_-8px_rgb(37_211_102/0.55)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 active:scale-[0.97] sm:px-6 print:hidden ${className}`}
    >
      <WhatsAppIcon className="size-5 shrink-0" />
      {WHATSAPP_LABEL}
    </a>
  )
}

/** Kleiner Datenschutzhinweis neben dem WhatsApp-Button. */
export function WhatsAppNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[13px] leading-snug print:hidden ${className}`}>
      Mit Klick öffnen Sie WhatsApp (Meta). Hinweise in der{' '}
      <a href={`${import.meta.env.BASE_URL}datenschutz/#whatsapp`} className="underline underline-offset-2 hover:text-text">Datenschutzerklärung</a>.
    </p>
  )
}
