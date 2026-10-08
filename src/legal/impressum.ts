import type { LegalDoc } from './types'

/**
 * Impressum von yanqiva-bewertung.de (Anbieterkennzeichnung nach § 5 DDG).
 * Angaben deckungsgleich mit https://yanqiva.de/impressum halten.
 */
export const impressum: LegalDoc = {
  title: 'Impressum',
  badge: 'Rechtliches',
  updated: 'Stand: 8. Oktober 2026',
  callouts: [],
  sections: [
    {
      id: 'angaben',
      heading: 'Angaben gemäß § 5 DDG',
      blocks: [
        {
          p: 'Anbieter dieser Website (yanqiva-bewertung.de):',
        },
        {
          list: ['Yannick Kern (Einzelunternehmen „Yanqiva“)', 'Waldstr. 3', '67361 Freisbach'],
        },
      ],
    },
    {
      id: 'kontakt',
      heading: 'Kontakt',
      blocks: [
        {
          list: [
            'E-Mail: support@yanqiva.de',
            'Weitere Kontaktmöglichkeit: Kontaktformular unter yanqiva.de/kontakt',
          ],
        },
      ],
    },
    {
      id: 'umsatzsteuer',
      heading: 'Umsatzsteuer',
      blocks: [
        {
          p: 'Kleinunternehmer im Sinne von § 19 Umsatzsteuergesetz. Es wird keine Umsatzsteuer berechnet.',
        },
      ],
    },
    {
      id: 'mstv',
      heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      blocks: [
        {
          p: 'Yannick Kern, Waldstr. 3, 67361 Freisbach',
        },
      ],
    },
    {
      id: 'streitbeilegung',
      heading: 'Streitbeilegung',
      blocks: [
        {
          p: 'Unsere Angebote richten sich ausschließlich an Unternehmer. Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.',
        },
      ],
    },
    {
      id: 'demo',
      heading: 'Hinweis zu dieser Website',
      blocks: [
        {
          p: 'Auf dieser Website stellen wir das Produkt „YANQIVA REVIEW“ (NFC-Karten und QR-Codes für Google-Bewertungen) als Demo bzw. Prototyp vor. Das Dashboard, Statistiken, Unternehmensnamen und Bewertungen in der Demo sind erfundene Beispieldaten; es werden keine echten Kundendaten angezeigt. Weitere Informationen zu Yanqiva finden Sie unter yanqiva.de.',
        },
      ],
    },
  ],
}
