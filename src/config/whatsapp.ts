/** WhatsApp-Kontakt (Geschäftsnummer +49 15567 455901). Es wird nur ein wa.me-Link gebaut; vor dem Klick findet keine Verbindung zu WhatsApp statt. */
export const WHATSAPP_NUMBER = '4915567455901'
export const WHATSAPP_LABEL = 'Per WhatsApp schreiben'
export const WHATSAPP_ARIA_LABEL = 'Per WhatsApp schreiben (öffnet WhatsApp)'

/** Vorausgefüllte Nachricht (Sie-Form). `topic` belegt die Klammer vor, sonst bleibt die Auswahl als Platzhalter stehen. */
export function whatsappMessage(topic?: string): string {
  return `Hallo YANQIVA REVIEW, ich interessiere mich für die NFC-Bewertungskarte (${topic ?? 'Klassik / mit Dashboard / Kombi'}).\n\nMein Betrieb: …\nOrt: …\nMeine Frage: …`
}

export function whatsappHref(topic?: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage(topic))}`
}
