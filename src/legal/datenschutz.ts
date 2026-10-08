import type { LegalDoc } from './types'

/**
 * Datenschutzerklärung von yanqiva-bewertung.de.
 * Anbieterdaten, Formulierungen und Aufsichtsbehörde deckungsgleich mit https://yanqiva.de/datenschutz halten.
 * Bei jeder Änderung der Verarbeitung (z. B. Start des Echtbetriebs mit Zählung) vorher anpassen.
 */
export const datenschutz: LegalDoc = {
  title: 'Datenschutzerklärung',
  badge: 'Rechtliches',
  updated: 'Stand: 8. Oktober 2026',
  callouts: [
    {
      tone: 'info',
      title: 'Kurz zusammengefasst',
      text: 'Diese Website setzt keine Cookies, kein Tracking, keine Analyse-Werkzeuge und keine externen Schriftarten oder Skripte von Drittanbietern ein und hat keine Formulare, die Daten versenden. Beim Aufruf verarbeiten unsere Dienstleister für Auslieferung und Hosting (Cloudflare, GitHub Pages) technisch notwendige Verbindungsdaten wie Ihre IP-Adresse. Wir selbst speichern keine Zugriffsprotokolle. Das vorgestellte Produkt und das Dashboard sind eine Demo mit erfundenen Beispieldaten; Weiterleitungen und Statistiken der Demo werden nicht gezählt oder gespeichert.',
    },
  ],
  sections: [
    {
      id: 'verantwortlicher',
      heading: '1. Verantwortlicher',
      blocks: [
        {
          p: 'Verantwortlich für die Datenverarbeitung auf dieser Website (yanqiva-bewertung.de) ist:',
        },
        {
          list: ['Yannick Kern, Yanqiva, Waldstr. 3, 67361 Freisbach', 'E-Mail: support@yanqiva.de'],
        },
        {
          p: 'Einen Datenschutzbeauftragten haben wir nicht benannt, weil die gesetzlichen Voraussetzungen dafür nicht vorliegen.',
        },
      ],
    },
    {
      id: 'ueberblick',
      heading: '2. Überblick',
      blocks: [
        {
          p: 'Auf dieser Website stellen wir das Produkt „YANQIVA REVIEW“ (NFC-Karten und QR-Codes, die zur Google-Bewertungsseite eines Unternehmens führen) als Demo bzw. Prototyp vor. Das Dashboard, die Statistiken, Unternehmensnamen und Bewertungstexte in der Demo sind erfundene Beispieldaten. Die Bewertungstexte enthalten keine Namen. Es werden keine echten Kundendaten angezeigt oder verarbeitet.',
        },
        {
          p: 'Wir setzen keine Cookies, keine Analyse- oder Tracking-Werkzeuge und keine externen Schriftarten oder Skripte von Drittanbietern ein; alle Schriften werden von dieser Website selbst ausgeliefert. Es gibt keine Formulare, die Daten an uns oder Dritte senden, kein Login und keinen Newsletter. Zur Auslieferung und zum Schutz der Website nutzen wir Dienstleister (siehe Abschnitt 3); zu einer möglichen Sicherheitsabfrage durch Cloudflare siehe ebenfalls Abschnitt 3. Personenbezogene Daten verarbeiten wir nur in den unten beschriebenen Fällen.',
        },
        {
          p: 'Website und Produkt sind nach den Grundsätzen der Datenminimierung (Art. 5 Abs. 1 lit. c DSGVO) und des Datenschutzes durch Technikgestaltung (Art. 25 DSGVO) konzipiert: Personen, die eine Karte antippen oder einen QR-Code scannen, sollen nicht identifiziert, nicht wiedererkannt und nicht über Websites hinweg verfolgt werden. Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO findet nicht statt.',
        },
      ],
    },
    {
      id: 'hosting',
      heading: '3. Hosting und Auslieferung (GitHub Pages, Cloudflare)',
      blocks: [
        {
          p: 'Cloudflare (Auslieferung und Schutz): Alle Aufrufe der Domain yanqiva-bewertung.de laufen über das Netzwerk von Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA (Reverse-Proxy und Content Delivery Network); Cloudflare betreibt auch die Nameserver der Domain. Cloudflare nimmt Ihre Anfrage entgegen, leitet sie an unseren Hoster weiter, liefert die Seiten aus und schützt die Website vor Überlastung und Angriffen. Dabei verarbeitet Cloudflare technisch notwendige Verbindungs- und Anfragedaten, insbesondere Ihre IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, Browserkennung (User-Agent) und Referrer-URL. Cloudflare verarbeitet diese Daten in unserem Auftrag auf Grundlage seines Vertrags zur Auftragsverarbeitung (Art. 28 DSGVO), der Bestandteil der Cloudflare-Vertragsbedingungen ist. Einzelne Zugriffe werten wir nicht aus; Cloudflare Web Analytics nutzen wir nicht.',
        },
        {
          p: 'Erkennt Cloudflare verdächtigen Datenverkehr, kann im Einzelfall eine automatische Sicherheitsabfrage erscheinen. Dabei kann Cloudflare ein technisch notwendiges Cookie setzen (zum Beispiel cf_clearance), damit die Abfrage nicht bei jedem Aufruf wiederholt wird. Dieser Zugriff auf Ihr Endgerät ist für den sicheren Betrieb der Website unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Außerdem kann Ihr Browser auf Anweisung von Cloudflare Fehlerberichte über fehlgeschlagene Verbindungen an Cloudflare senden (Network Error Logging). Nach Angaben von Cloudflare wird die IP-Adresse dabei nur kurzzeitig zur Verarbeitung des Berichts genutzt und nicht gespeichert.',
        },
        {
          p: 'GitHub Pages (Hosting): Die Dateien dieser Website liegen bei GitHub Pages. Anbieter ist GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. GitHub erhält die Anfragen über Cloudflare und verarbeitet dabei technisch notwendige Daten in Server-Logfiles, insbesondere die aufgerufene Seite, Datum und Uhrzeit, Browsertyp und Referrer-URL sowie Ihre IP-Adresse, soweit Cloudflare sie in der Anfrage weitergibt. Soweit GitHub dabei in unserem Auftrag tätig wird, gilt dessen Vereinbarung zur Auftragsverarbeitung (Art. 28 DSGVO), die Bestandteil der GitHub-Vertragsbedingungen ist. Wir haben keinen Zugriff auf diese Logs.',
        },
        {
          p: 'Speicherdauer: Wie lange Cloudflare und GitHub diese technischen Zugriffsdaten aufbewahren, richtet sich nach deren Datenschutzhinweisen. Wir selbst speichern keine Zugriffsprotokolle der Website und werten keine aus.',
        },
        {
          p: 'Rechtsgrundlage ist jeweils Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren, schnellen und stabilen Bereitstellung der Website. Eine Übermittlung in die USA kann stattfinden. Sie stützt sich auf den Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy Framework (Art. 45 DSGVO), nach dem Cloudflare und GitHub zertifiziert sind, und ergänzend auf Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).',
        },
        {
          p: 'Weitere Informationen: Datenschutzerklärung von Cloudflare (https://www.cloudflare.com/de-de/privacypolicy/) und GitHub-Datenschutzerklärung (https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement). Wechseln wir den Hoster oder einen dieser Dienstleister, passen wir diesen Abschnitt vorher an.',
        },
        {
          p: 'Domain: Die Domain yanqiva-bewertung.de ist bei der IONOS SE, Elgendorfer Straße 57, 56410 Montabaur, Deutschland, registriert. IONOS ist nur Registrar; die Website wird nicht über IONOS ausgeliefert, und beim Aufruf der Website erhält IONOS keine Daten von Ihnen.',
        },
      ],
    },
    {
      id: 'kontakt',
      heading: '4. Kontakt per E-Mail',
      blocks: [
        {
          p: 'Wenn Sie uns per E-Mail an support@yanqiva.de schreiben, verarbeiten wir Ihre E-Mail-Adresse, Ihren Namen (falls angegeben) und den Inhalt Ihrer Nachricht, um Ihr Anliegen zu bearbeiten. Dafür nutzen wir den E-Mail-Dienst der IONOS SE, Elgendorfer Straße 57, 56410 Montabaur, Deutschland. IONOS verarbeitet dabei die Inhalte und Metadaten der E-Mails (Absender, Empfänger, Zeitpunkt) in unserem Auftrag auf Grundlage einer Vereinbarung zur Auftragsverarbeitung (Art. 28 DSGVO), die Bestandteil der IONOS-AGB ist; die Verarbeitung erfolgt nach Angaben von IONOS in Rechenzentren in der EU.',
        },
        {
          p: 'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertragsschluss gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (unser berechtigtes Interesse an der Beantwortung von Anfragen). Wir löschen Ihre Nachricht, sobald Ihr Anliegen abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten (zum Beispiel für Geschäftsbriefe) entgegenstehen (dann Art. 6 Abs. 1 lit. c DSGVO); Anfragen ohne Vertragsschluss spätestens nach 12 Monaten. Weitere Informationen: Datenschutzerklärung von IONOS (https://www.ionos.de/terms-gtc/datenschutzerklaerung/).',
        },
        {
          p: 'Für das Kontaktformular auf yanqiva.de gilt die Datenschutzerklärung unter yanqiva.de/datenschutz.',
        },
      ],
    },
    {
      id: 'lokaler-speicher',
      heading: '5. Speicher im Browser (localStorage) in der Dashboard-Demo',
      blocks: [
        {
          p: 'Nur wenn Sie in der Dashboard-Demo selbst eine Demo-Karte anlegen, legen wir Ihre Eingaben (Unternehmensname, Link, Kartennummer) im lokalen Speicher (localStorage) Ihres Browsers unter dem Schlüssel yanqiva-demo-cards-v1 ab. Das ist kein Cookie. Die Daten verlassen Ihr Gerät nicht; sie werden weder an uns noch an Dritte übertragen, und wir haben keinen Zugriff darauf. Die Daten bleiben gespeichert, bis Sie in der Demo „Demo zurücksetzen“ wählen oder die Website-Daten in Ihrem Browser löschen.',
        },
        {
          p: 'Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 2 Nr. 2 TDDDG: Die Speicherung erfolgt nur, wenn Sie die Funktion selbst nutzen, und ist unbedingt erforderlich, damit die von Ihnen ausdrücklich gewünschte Funktion (Ihre angelegte Demo-Karte bleibt beim Neuladen und Seitenwechsel erhalten) bereitgestellt werden kann. Eine Einwilligung ist dafür nicht erforderlich. Soweit dabei überhaupt personenbezogene Daten verarbeitet werden, ist Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer funktionsfähigen Demo.',
        },
        {
          p: 'Bitte geben Sie in der Demo keine vertraulichen oder personenbezogenen Daten ein.',
        },
      ],
    },
    {
      id: 'weiterleitung',
      heading: '6. NFC- und QR-Weiterleitungen',
      blocks: [
        {
          p: 'Beim Antippen einer Karte oder beim Scannen eines QR-Codes wird zunächst eine Weiterleitungsadresse dieser Website aufgerufen (/r/ gefolgt von einer Kartenkennung). Diese Seiten sind statische Seiten ohne Skripte von Drittanbietern; sie weisen Ihren Browser an, keine Referrer-Angabe weiterzugeben (no-referrer).',
        },
        {
          p: 'Heute (Demo): Die Weiterleitungsseiten leiten auf eine simulierte Bewertungsseite dieser Website (/review-demo/) weiter. Dabei wird nichts gezählt, protokolliert oder gespeichert; es findet nur die in Abschnitt 3 beschriebene technische Verarbeitung durch Cloudflare und GitHub statt. Die simulierte Bewertungsseite zeigt den Namen des Demo-Unternehmens aus der aufgerufenen Adresse an und sendet keine Daten: Sternebewertung und Text bleiben in Ihrem Browser und werden beim Verlassen der Seite verworfen. Alle Statistiken im Dashboard sind erfundene Beispieldaten.',
        },
        {
          p: 'Späterer Echtbetrieb: Im Echtbetrieb sollen Aufrufe der Weiterleitung ausschließlich als aggregierte Tageszähler je Karte gezählt werden, getrennt nach NFC und QR-Code. Gespeichert würde nur die Zahl der Aufrufe; keine IP-Adressen, keine Browserkennungen, keine Besucher-IDs, keine Standortdaten. Diese Zählung findet derzeit nicht statt. Vor dem Start des Echtbetriebs aktualisieren wir diese Datenschutzerklärung.',
        },
      ],
    },
    {
      id: 'google',
      heading: '7. Google-Bewertungslink und Weiterleitung zu Google',
      blocks: [
        {
          p: 'Im Echtbetrieb hinterlegt ein Unternehmen als Ziel seiner Karten den Link zu seiner Google-Bewertungsseite. Dieser Link ist eine geschäftliche Ziel-URL des Unternehmens. Nach der Weiterleitung verlassen Sie unsere Website. Für die Verarbeitung auf den Seiten von Google ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, verantwortlich; es gelten deren Datenschutzbestimmungen (https://policies.google.com/privacy). Wir erhalten von Google keine Daten über Personen, die die Bewertungsseite aufrufen oder eine Bewertung abgeben.',
        },
        {
          p: 'In der Demo findet keine Weiterleitung zu Google statt; Ziel ist die simulierte Bewertungsseite dieser Website (siehe Abschnitt 6).',
        },
      ],
    },
    {
      id: 'links',
      heading: '8. Externe Links',
      blocks: [
        {
          p: 'Unsere Seiten enthalten Links zu anderen Websites, zum Beispiel zu yanqiva.de. Beim Anklicken gilt die Datenschutzerklärung des jeweiligen Anbieters. Wir binden keine Inhalte von Dritten ein.',
        },
      ],
    },
    {
      id: 'rechte',
      heading: '9. Ihre Rechte',
      blocks: [
        {
          p: 'Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:',
        },
        {
          list: [
            'Auskunft (Art. 15 DSGVO),',
            'Berichtigung (Art. 16 DSGVO),',
            'Löschung (Art. 17 DSGVO),',
            'Einschränkung der Verarbeitung (Art. 18 DSGVO),',
            'Datenübertragbarkeit (Art. 20 DSGVO),',
            'Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).',
          ],
        },
        {
          p: 'Widerspruchsrecht (Art. 21 DSGVO): Verarbeiten wir Ihre Daten auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO), können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.',
        },
        {
          p: 'Schreiben Sie dazu an support@yanqiva.de. Da wir selbst keine IP-Adressen, Zugriffsprotokolle oder Besucher-IDs speichern, können wir Aufrufe dieser Website in der Regel keiner Person zuordnen (vgl. Art. 11 DSGVO).',
        },
      ],
    },
    {
      id: 'beschwerde',
      heading: '10. Beschwerderecht',
      blocks: [
        {
          p: 'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig ist die Aufsichtsbehörde Ihres Wohnorts oder die für uns zuständige Behörde: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz, Hintere Bleiche 34, 55116 Mainz.',
        },
      ],
    },
    {
      id: 'aenderungen',
      heading: '11. Datensicherheit und Änderungen',
      blocks: [
        {
          p: 'Die Übertragung erfolgt verschlüsselt über HTTPS. Wir passen diese Erklärung an, wenn sich unsere Verarbeitung ändert, insbesondere vor dem Start des Echtbetriebs. Es gilt die jeweils aktuelle Fassung.',
        },
      ],
    },
  ],
}
