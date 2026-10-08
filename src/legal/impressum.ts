import type { LegalDoc } from './types'

/**
 * DEMO-Impressum für den Prototypen „YANQIVA REVIEW“.
 * Mustertext mit Platzhaltern in [eckigen Klammern]. Keine Rechtsberatung.
 * Die gültige Anbieterkennzeichnung steht unter https://yanqiva.de/impressum.
 */
export const impressum: LegalDoc = {
  title: 'Impressum',
  badge: 'Demo / Mustertext',
  updated: 'Stand: [Datum] (Demo-Fassung vom 08.10.2026)',
  callouts: [
    {
      tone: 'warning',
      title: 'Hinweis',
      text: 'Hinweis: Diese Seite ist eine Musterseite mit Platzhaltern für den Prototypen und stellt keine Rechtsberatung dar. Vor dem Produktivbetrieb müssen alle Angaben vollständig ausgefüllt und rechtlich geprüft werden.',
    },
    {
      tone: 'info',
      title: 'Anbieter dieser Demo-Website',
      text: 'Die gültige Anbieterkennzeichnung des Betreibers dieser Demo-Website steht im Impressum von YANQIVA.',
      link: { label: 'yanqiva.de/impressum', href: 'https://yanqiva.de/impressum' },
    },
  ],
  sections: [
    {
      id: 'angaben',
      heading: 'Angaben gemäß § 5 DDG',
      blocks: [
        {
          list: [
            '[Unternehmensname]',
            'Inhaber: [Inhaber]',
            '[Anschrift]',
          ],
        },
      ],
    },
    {
      id: 'kontakt',
      heading: 'Kontakt',
      blocks: [
        {
          list: ['E-Mail: [E-Mail]', 'Telefon: [Telefon]'],
        },
      ],
    },
    {
      id: 'umsatzsteuer',
      heading: 'Umsatzsteuer und weitere Pflichtangaben',
      blocks: [
        {
          p: 'Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr. – entfällt, sofern keine erteilt wurde (z. B. Kleinunternehmer nach § 19 UStG)]',
        },
        {
          p: '[weitere Pflichtangaben – je nach Rechtsform und Tätigkeit, z. B. Handelsregister und Registernummer, Vertretungsberechtigte, Wirtschafts-Identifikationsnummer, Aufsichtsbehörde oder Kammer]',
        },
      ],
    },
    {
      id: 'mstv',
      heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
      blocks: [
        {
          p: '[Nur angeben, falls journalistisch-redaktionell gestaltete Angebote (z. B. Blog, Ratgeber-Artikel) bereitgestellt werden: Name und Anschrift der verantwortlichen Person – andernfalls diesen Abschnitt entfernen]',
        },
      ],
    },
    {
      id: 'streitbeilegung',
      heading: 'Verbraucherstreitbeilegung',
      blocks: [
        {
          p: '[Angabe nach § 36 VSBG – nur erforderlich, wenn Verträge mit Verbrauchern geschlossen werden und keine Ausnahme nach § 36 Abs. 3 VSBG greift, z. B.: „Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.“ Bei ausschließlichem B2B-Angebot kann der Abschnitt entfallen.]',
        },
      ],
    },
  ],
}
