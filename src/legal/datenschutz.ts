import type { LegalDoc } from './types'

/**
 * DEMO-Datenschutzerklärung für den Prototypen „YANQIVA REVIEW“.
 * Mustertext mit Platzhaltern in [eckigen Klammern]. Keine Rechtsberatung.
 * Vor Produktivbetrieb an die tatsächlichen Verarbeitungen anpassen und rechtlich prüfen lassen.
 */
export const datenschutz: LegalDoc = {
  title: 'Datenschutzerklärung',
  badge: 'Demo / Mustertext',
  updated: 'Stand: [Datum] (Demo-Fassung vom 08.10.2026)',
  callouts: [
    {
      tone: 'warning',
      title: 'Hinweis',
      text: 'Hinweis: Diese Datenschutzerklärung dient ausschließlich als Demo-/Mustertext für den Prototypen und stellt keine Rechtsberatung dar. Vor dem produktiven Einsatz müssen die tatsächlichen Datenverarbeitungen, eingesetzten Dienste und Verantwortlichen geprüft und die Datenschutzhinweise entsprechend angepasst werden.',
    },
    {
      tone: 'info',
      title: 'Was diese Demo tatsächlich verarbeitet',
      text: 'Diese Demo-Website setzt kein Tracking, keine Analyse-Tools, keine Cookies und keine externen Schriften oder Google-Dienste ein und versendet keine Formulardaten. Beim Aufruf verarbeiten die Dienstleister für Auslieferung und Sicherheit (Cloudflare und GitHub Pages) zwangsläufig Ihre IP-Adresse; der Betreiber selbst speichert keine IP-Adressen. Nur wenn Sie in der Dashboard-Demo selbst eine Demo-Karte anlegen, werden diese Eingaben im lokalen Speicher Ihres Browsers abgelegt und nicht übertragen. Weiterleitungen und Statistiken in der Demo sind simuliert; es wird nichts gezählt oder gespeichert.',
    },
  ],
  sections: [
    {
      id: 'verantwortlicher',
      heading: '1. Verantwortlicher',
      blocks: [
        {
          p: 'Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO für die Datenverarbeitung auf dieser Website ist:',
        },
        {
          list: [
            '[Name des Unternehmens]',
            '[Verantwortlicher]',
            '[Anschrift]',
            'E-Mail: [E-Mail-Adresse]',
          ],
        },
        {
          p: 'Ein Datenschutzbeauftragter ist [benannt: Kontaktdaten des Datenschutzbeauftragten / nicht benannt, da keine Benennungspflicht nach Art. 37 DSGVO und § 38 BDSG besteht].',
        },
      ],
    },
    {
      id: 'grundsatz',
      heading: '2. Grundsatz: Datensparsamkeit und Privacy by Design',
      blocks: [
        {
          p: 'Diese Website und das zugrunde liegende Produkt sind nach dem Grundsatz der Datenminimierung (Art. 5 Abs. 1 lit. c DSGVO) und des Datenschutzes durch Technikgestaltung und datenschutzfreundliche Voreinstellungen (Art. 25 DSGVO) konzipiert. Es werden nur die Daten verarbeitet, die für die Bereitstellung der Website technisch erforderlich sind. Personen, die eine NFC-Karte antippen oder einen QR-Code scannen, sollen nicht identifiziert, nicht wiedererkannt und nicht über Websites hinweg verfolgt werden.',
        },
      ],
    },
    {
      id: 'verarbeitete-daten',
      heading: '3. Verarbeitete Daten, Zwecke und Rechtsgrundlagen',
      blocks: [
        {
          p: 'Im Demo-Betrieb finden ausschließlich die folgenden Verarbeitungen statt:',
        },
        {
          table: {
            head: ['Daten und Zweck', 'Rechtsgrundlage'],
            rows: [
              [
                'IP-Adresse, Zeitpunkt, aufgerufene URL, Browser-Kennung (User-Agent) und ähnliche technische Verbindungsdaten – verarbeitet durch die Dienstleister für Auslieferung und Hosting (Cloudflare, GitHub Pages; siehe Abschnitt 5) zur Auslieferung der Website, zur Abwehr von Angriffen (z. B. DDoS) und zur Gewährleistung der Betriebssicherheit (Server- und Sicherheitsprotokolle).',
                'Art. 6 Abs. 1 lit. f DSGVO; berechtigtes Interesse an einer sicheren, stabilen und schnellen Bereitstellung der Website.',
              ],
              [
                'Selbst eingegebene Demo-Daten in der Dashboard-Demo (Unternehmensname, Link, Kartennummer) – Speicherung ausschließlich lokal im Browser (localStorage), damit die Demo zwischen Seitenaufrufen funktioniert.',
                'Speichern und Auslesen im Endgerät: § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich für den ausdrücklich gewünschten Dienst); im Übrigen Art. 6 Abs. 1 lit. f DSGVO. Eine Übertragung an den Betreiber findet nicht statt.',
              ],
              [
                'Kontaktaufnahme per E-Mail (falls Sie uns schreiben): E-Mail-Adresse, Name und Inhalt der Nachricht zur Bearbeitung Ihres Anliegens.',
                'Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Anfragen) bzw. Art. 6 Abs. 1 lit. f DSGVO (sonstige Anfragen).',
              ],
            ],
          },
        },
      ],
    },
    {
      id: 'nicht-erhoben',
      heading: '4. Daten, die nicht erhoben werden',
      blocks: [
        {
          p: 'Auf dieser Demo-Website findet insbesondere Folgendes nicht statt:',
        },
        {
          list: [
            'kein Tracking und keine Reichweitenanalyse (keine Analytics-Dienste)',
            'keine Cookies (Ausnahme: ein mögliches Sicherheits-Cookie von Cloudflare bei verdächtigem Datenverkehr, siehe Ziffer 5)',
            'keine Werbe- oder Tracking-IDs, keine Besucher-IDs',
            'kein Browser- oder Geräte-Fingerprinting',
            'keine Standortdaten',
            'keine Speicherung von IP-Adressen durch den Betreiber selbst',
            'keine externen Schriftarten (alle Schriften werden lokal von dieser Website ausgeliefert)',
            'keine eingebundenen Google-Dienste (z. B. keine Google Fonts, Maps oder Analytics)',
            'keine Formulare, die Daten an den Betreiber oder Dritte versenden',
            'keine Daten über Personen, die über die Weiterleitung eine Bewertung abgeben',
          ],
        },
      ],
    },
    {
      id: 'hosting',
      heading: '5. Hosting und Domain',
      blocks: [
        {
          p: 'Diese Website ist eine statische Website. Für ihre Bereitstellung werden folgende Dienstleister eingesetzt:',
        },
        {
          list: [
            'Hosting: GitHub Pages, ein Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. St, San Francisco, CA 94107, USA. GitHub stellt die Dateien der Website bereit, erhält die Anfragen über Cloudflare und verarbeitet dabei technisch Verbindungsdaten, u. a. in Server- und Sicherheitsprotokollen, einschließlich Ihrer IP-Adresse, soweit Cloudflare sie in der Anfrage weitergibt.',
            'Auslieferung, Schutz und Namensauflösung: Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Alle Aufrufe der Domain yanqiva-bewertung.de laufen über das Netzwerk von Cloudflare (Reverse-Proxy und Content Delivery Network); Cloudflare betreibt außerdem die DNS-Server der Domain. Cloudflare nimmt Ihre Anfrage entgegen, leitet sie an GitHub Pages weiter, liefert die Seiten aus und schützt die Website vor Überlastung und Angriffen. Dabei verarbeitet Cloudflare technisch notwendige Verbindungsdaten, insbesondere IP-Adresse, Zeitpunkt, aufgerufene URL, Browser-Kennung (User-Agent) und Referrer-URL. Erkennt Cloudflare verdächtigen Datenverkehr, kann im Einzelfall eine automatische Sicherheitsabfrage erscheinen; dabei kann ein technisch notwendiges Cookie (z. B. cf_clearance) gesetzt werden (§ 25 Abs. 2 Nr. 2 TDDDG).',
            'Domain-Registrierung: IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland. IONOS ist Registrar der Domain yanqiva-bewertung.de. Die Website selbst wird nicht über IONOS ausgeliefert.',
          ],
        },
        {
          p: 'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in einer sicheren, zuverlässigen und performanten Bereitstellung der Website. Soweit die Anbieter als Auftragsverarbeiter tätig werden, erfolgt die Verarbeitung auf Grundlage eines Vertrags nach Art. 28 DSGVO [Bestehen der Auftragsverarbeitungsverträge prüfen und ergänzen].',
        },
        {
          p: 'Drittlandübermittlung: Cloudflare und GitHub haben ihren Sitz in den USA; eine Übermittlung personenbezogener Daten in die USA ist daher nicht auszuschließen. Nach Angaben der Anbieter sind beide Unternehmen unter dem EU-US Data Privacy Framework zertifiziert. Für zertifizierte Unternehmen besteht ein Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO). Ergänzend können Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) Anwendung finden. [Aktuellen Zertifizierungsstatus unter dataprivacyframework.gov prüfen und Angaben bestätigen.]',
        },
        {
          p: 'Wechseln wir einen dieser Dienstleister, wird dieser Abschnitt vorher angepasst. Weitere Informationen: Datenschutzhinweise von Cloudflare (cloudflare.com/privacypolicy), GitHub (docs.github.com, „GitHub General Privacy Statement“) und IONOS (ionos.de/terms-gtc/datenschutzerklaerung).',
        },
      ],
    },
    {
      id: 'weiterleitung',
      heading: '6. NFC- und QR-Weiterleitung',
      blocks: [
        {
          p: 'Beim Antippen einer NFC-Karte oder beim Scannen eines QR-Codes wird zunächst eine Weiterleitungsadresse dieser Website (/r/<Kennung>) aufgerufen, die anschließend auf den vom jeweiligen Unternehmen hinterlegten Bewertungslink weiterleitet.',
        },
        {
          p: 'Demo-Betrieb (aktueller Stand): Die Weiterleitungsseiten der Demo sind statische Seiten und leiten auf eine simulierte Bewertungsseite dieser Demo (/review-demo/) weiter. Es wird dabei nichts gezählt, protokolliert oder gespeichert. Die simulierte Bewertungsseite sendet keine Daten. Alle im Dashboard angezeigten Statistiken sind simulierte Beispieldaten. Es findet lediglich die unter Ziffer 5 beschriebene technische Verarbeitung durch Proxy-/CDN- und Hosting-Anbieter statt.',
        },
        {
          p: 'Geplanter Produktivbetrieb (noch nicht umgesetzt): Es ist vorgesehen, Aufrufe der Weiterleitung ausschließlich aggregiert pro Karte zu zählen (Zählerstand +1, gegebenenfalls je Kalendertag). Dabei sollen keine IP-Adressen, keine Browser-Kennungen (User-Agent), keine Besucher-IDs und keine Standortdaten gespeichert werden. Vor Aufnahme des Produktivbetriebs wird diese Datenschutzerklärung entsprechend ergänzt [Rechtsgrundlage und technische Umsetzung der Zählung prüfen].',
        },
      ],
    },
    {
      id: 'bewertungslink',
      heading: '7. Google-Bewertungslink als geschäftliche Ziel-URL',
      blocks: [
        {
          p: 'Im geplanten Produktivbetrieb hinterlegen Unternehmenskunden im Dashboard den Link zu ihrer Google-Bewertungsseite. Dieser Link ist eine geschäftliche Ziel-URL des Unternehmens. Zusammen mit Firmenname, Kartendaten und den Zugangsdaten des Kundenkontos wird er zur Erfüllung des Vertrags mit dem Unternehmenskunden verarbeitet (Art. 6 Abs. 1 lit. b DSGVO). Soweit dabei Daten natürlicher Personen betroffen sind (z. B. Ansprechpartner, Einzelunternehmer), gilt dies entsprechend.',
        },
        {
          p: 'In der Demo werden keine Kundendaten an den Betreiber übertragen; selbst eingegebene Demo-Daten verbleiben im Browser (siehe Ziffer 9).',
        },
      ],
    },
    {
      id: 'google',
      heading: '8. Weiterleitung zu Google',
      blocks: [
        {
          p: 'Nach der Weiterleitung auf eine Bewertungsseite von Google verlassen Sie diese Website. Für die Verarbeitung auf den Seiten von Google ist Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) verantwortlich; es gelten deren Datenschutzbestimmungen (policies.google.com/privacy). Der Betreiber dieser Website erhält von Google keine Daten über Personen, die eine Bewertung abgeben oder die Bewertungsseite aufrufen.',
        },
        {
          p: 'In der Demo erfolgt keine Weiterleitung zu Google; Ziel ist die simulierte Bewertungsseite dieser Demo.',
        },
      ],
    },
    {
      id: 'lokaler-speicher',
      heading: '9. Lokaler Speicher (localStorage) in der Dashboard-Demo',
      blocks: [
        {
          p: 'Nur wenn Sie in der Dashboard-Demo selbst eine Demo-Karte anlegen, werden die von Ihnen eingegebenen Angaben (Unternehmensname, Link, Kartennummer) im lokalen Speicher (localStorage) Ihres Browsers abgelegt. Die Daten verbleiben auf Ihrem Gerät und werden nicht an den Betreiber oder Dritte übertragen.',
        },
        {
          p: 'Die Speicherung ist unbedingt erforderlich, damit die von Ihnen ausdrücklich genutzte Demo-Funktion zwischen Seitenaufrufen erhalten bleibt (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können die Daten jederzeit über die Funktion „Demo zurücksetzen“ oder durch Löschen der Website-Daten in Ihrem Browser entfernen.',
        },
        {
          p: 'Bitte geben Sie in der Demo keine echten personenbezogenen oder vertraulichen Daten ein.',
        },
      ],
    },
    {
      id: 'cookies',
      heading: '10. Cookies und Einwilligung',
      blocks: [
        {
          p: 'Diese Website setzt keine Cookies und greift – abgesehen von dem unter Ziffer 9 beschriebenen lokalen Speicher – nicht auf Informationen in Ihrem Endgerät zu. Ausnahme: Erkennt Cloudflare verdächtigen Datenverkehr, kann im Einzelfall ein technisch notwendiges Sicherheits-Cookie gesetzt werden (siehe Ziffer 5, § 25 Abs. 2 Nr. 2 TDDDG). Ein Cookie-Banner ist daher derzeit nicht erforderlich.',
        },
        {
          p: 'Sollten künftig optionale Analyse- oder andere nicht unbedingt erforderliche Funktionen eingesetzt werden, geschieht dies nur nach Ihrer vorherigen Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO) über eine gesonderte Einwilligungslösung. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).',
        },
      ],
    },
    {
      id: 'externe-dienste',
      heading: '11. Externe Dienste',
      blocks: [
        {
          p: 'Über die unter Ziffer 5 genannten Dienstleister hinaus werden auf dieser Demo-Website keine externen Dienste eingebunden. Weitere eingesetzte Dienste: [weitere eingesetzte Dienste – im Produktivbetrieb z. B. Server/Datenbank für Dashboard und Zähler, Authentifizierung, E-Mail-Versand, Zahlungsabwicklung; jeweils mit Anbieter, Zweck, Rechtsgrundlage und ggf. Drittlandübermittlung ergänzen].',
        },
      ],
    },
    {
      id: 'speicherdauer',
      heading: '12. Speicherdauer',
      blocks: [
        {
          list: [
            'Technische Verbindungsdaten beim Hosting-Anbieter: nach den Vorgaben der jeweiligen Anbieter, in der Regel nur kurzfristig für Auslieferung und Sicherheitszwecke [Speicherdauer laut Anbieterdokumentation ergänzen].',
            'Lokaler Speicher der Dashboard-Demo: bis Sie die Demo zurücksetzen oder die Website-Daten in Ihrem Browser löschen.',
            'E-Mail-Anfragen: bis zur abschließenden Bearbeitung; darüber hinaus nur, soweit gesetzliche Aufbewahrungspflichten (z. B. § 257 HGB, § 147 AO) bestehen.',
            'Geplanter Produktivbetrieb – Kundendaten im Dashboard: für die Dauer des Vertragsverhältnisses und danach, soweit gesetzliche Aufbewahrungspflichten bestehen [konkrete Fristen ergänzen].',
          ],
        },
      ],
    },
    {
      id: 'rechte',
      heading: '13. Ihre Rechte',
      blocks: [
        {
          p: 'Ihnen stehen nach Maßgabe der gesetzlichen Voraussetzungen folgende Rechte zu:',
        },
        {
          list: [
            'Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)',
            'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
            'Löschung (Art. 17 DSGVO)',
            'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
            'Datenübertragbarkeit (Art. 20 DSGVO)',
            'Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aus Gründen, die sich aus Ihrer besonderen Situation ergeben (Art. 21 DSGVO)',
            'Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)',
            'Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Zuständig für den Betreiber ist: [zuständige Aufsichtsbehörde]',
          ],
        },
        {
          p: 'Zur Ausübung Ihrer Rechte genügt eine Nachricht an [E-Mail-Adresse]. Da der Betreiber selbst keine IP-Adressen oder Besucher-IDs speichert, können Aufrufe der Website in der Regel keiner Person zugeordnet werden (vgl. Art. 11 DSGVO).',
        },
      ],
    },
    {
      id: 'profiling',
      heading: '14. Keine automatisierte Entscheidungsfindung',
      blocks: [
        {
          p: 'Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO findet nicht statt.',
        },
      ],
    },
    {
      id: 'aenderungen',
      heading: '15. Änderungen dieser Datenschutzerklärung',
      blocks: [
        {
          p: 'Diese Datenschutzerklärung wird angepasst, sobald sich die Website, die eingesetzten Dienste oder die rechtlichen Anforderungen ändern – insbesondere vor Aufnahme des Produktivbetriebs. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.',
        },
      ],
    },
  ],
}
