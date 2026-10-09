import type { LegalDoc } from './types'

/**
 * Datenschutzerklärung von yanqiva-bewertung.de.
 * Anbieterdaten, Formulierungen und Aufsichtsbehörde deckungsgleich mit https://yanqiva.de/datenschutz halten.
 * Bei jeder Änderung der Verarbeitung vorher anpassen. Abschnitte 7 und 8 beschreiben den geplanten Stand mit Zählung und Dashboard-Login: vor der ersten Lieferung gegen die tatsächliche Umsetzung prüfen.
 */
export const datenschutz: LegalDoc = {
  title: 'Datenschutzerklärung',
  badge: 'Rechtliches',
  updated: 'Stand: 9. Oktober 2026',
  callouts: [
    {
      tone: 'info',
      title: 'Kurz zusammengefasst',
      text: 'Diese Website setzt keine Tracking- oder Analyse-Werkzeuge und keine externen Schriftarten oder Skripte von Drittanbietern ein. Das einzige Formular für Besucher, das Daten versendet, ist das Bestellformular (Abschnitt 5); Kunden mit der Variante Dashboard melden sich zusätzlich im Dashboard an (Abschnitt 8). Beim Aufruf verarbeiten unsere Dienstleister für Auslieferung und Hosting (Cloudflare, GitHub Pages) technisch notwendige Verbindungsdaten wie Ihre IP-Adresse. Wir selbst speichern keine Zugriffsprotokolle. Das Dashboard auf der Startseite ist eine Demo mit erfundenen Beispieldaten; Weiterleitungen der Demo-Karten werden nicht gezählt oder gespeichert. Beim Antippen einer echten Karte zählen wir nur die Zahl der Aufrufe, ohne Personenbezug (Abschnitt 7).',
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
          p: 'Auf dieser Website stellen wir das Produkt „YANQIVA REVIEW“ (NFC-Karten und QR-Codes, die zur Google-Bewertungsseite eines Unternehmens führen) vor und bieten es Unternehmern über ein Bestellformular zum Kauf an (Abschnitt 5). Das Dashboard auf der Startseite ist eine Demo: Die Statistiken und Unternehmensnamen darin sind erfundene Beispieldaten. In der Demo werden keine echten Kundendaten angezeigt oder verarbeitet. Das echte Dashboard für Kunden der Variante Dashboard beschreiben wir in Abschnitt 8.',
        },
        {
          p: 'Wir setzen auf den Seiten für Besucher keine Cookies (Ausnahme: das technisch notwendige Cookie der Cloudflare-Sicherheitsabfrage, Abschnitt 3), keine Analyse- oder Tracking-Werkzeuge und keine externen Schriftarten oder Skripte von Drittanbietern ein; alle Schriften werden von dieser Website selbst ausgeliefert. Außer dem Bestellformular (Abschnitt 5) gibt es für Besucher keine Formulare, die Daten an uns oder Dritte senden; es gibt keinen Newsletter. Ein Login gibt es nur für Kunden der Variante Dashboard (Abschnitt 8). Zur Auslieferung und zum Schutz der Website nutzen wir Dienstleister (siehe Abschnitt 3); zu einer möglichen Sicherheitsabfrage durch Cloudflare siehe ebenfalls Abschnitt 3. Personenbezogene Daten verarbeiten wir nur in den unten beschriebenen Fällen.',
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
      id: 'bestellung',
      heading: '5. Bestellungen über das Bestellformular',
      blocks: [
        {
          p: 'Über das Bestellformular unter yanqiva-bewertung.de/bestellen/ können Unternehmer YANQIVA REVIEW bestellen. Dabei verarbeiten wir folgende Angaben:',
        },
        {
          table: {
            head: ['Daten', 'Zweck'],
            rows: [
              ['Gewählte Variante (Klassik oder Dashboard), Ausführung (Karte oder Aufsteller), Menge', 'Bestellung, Preisberechnung, Herstellung'],
              ['Anzeigename für den Aufdruck, Google-Bewertungslink oder Name und Ort des Unternehmens laut Google, freiwillige Hinweise (zum Beispiel Gestaltungswunsch)', 'Einrichtung und Gestaltung der Karten bzw. Aufsteller'],
              ['Firma, Vor- und Nachname der Ansprechperson, E-Mail-Adresse', 'Vertragsabwicklung, Eingangs- und Auftragsbestätigung, Rechnung, Rückfragen'],
              ['Telefonnummer (freiwillig)', 'Rückfragen zur Lieferung'],
              ['Rechnungsadresse, gegebenenfalls abweichende Lieferadresse mit Empfänger', 'Rechnung und Lieferung'],
              ['Bestellnummer, Zeitpunkt des Eingangs, Kennung Ihres Browsers (User-Agent), aus der Verbindung abgeleitetes Land, Ergebnis der automatischen Spam-Prüfung', 'Zuordnung der Bestellung, Erkennung von Missbrauch und Fehlern'],
            ],
          },
        },
        {
          p: 'Die Pflichtfelder sind im Formular gekennzeichnet. Ohne diese Angaben können wir die Bestellung nicht annehmen und ausführen; Telefonnummer und Hinweise sind freiwillig. Die Angaben betreffen in der Regel Ihr Unternehmen; personenbezogen sind sie, soweit sie sich auf eine Person beziehen, etwa Name und E-Mail-Adresse der Ansprechperson oder eine Firma, die einen Personennamen enthält.',
        },
        {
          p: 'Übermittlung und Speicherung (Cloudflare): Beim Absenden übermittelt Ihr Browser die Angaben verschlüsselt an unsere Schnittstelle (API) unter yanqiva-api.yanqiva-api.workers.dev, die auf Cloudflare Workers läuft. Die Bestellung speichern wir im Speicherdienst Cloudflare Workers KV. Anbieter ist Cloudflare, Inc. (siehe Abschnitt 3). Cloudflare verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO) und beim Aufruf der API technisch notwendige Verbindungsdaten wie Ihre IP-Adresse. Eine Übermittlung in die USA kann stattfinden. Sie stützt sich auf den Angemessenheitsbeschluss zum EU-US Data Privacy Framework (Art. 45 DSGVO), nach dem Cloudflare zertifiziert ist, und ergänzend auf Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Dieselbe Schnittstelle nutzen wir auch für yanqiva.de.',
        },
        {
          p: 'Eingangsbestätigung und interne Benachrichtigung (Resend): Nach dem Absenden senden wir Ihnen automatisch eine Eingangsbestätigung an die angegebene E-Mail-Adresse. Sie gibt Ihre Bestellung wieder (Variante, Ausführung, Menge, Preise, Angaben zur Einrichtung sowie Kontakt- und Adressdaten), nennt die Bestellnummer und den Zeitpunkt des Eingangs und verlinkt unsere AGB und diese Datenschutzerklärung. Zusätzlich benachrichtigt uns das System per E-Mail an support@yanqiva.de mit allen Angaben der Bestellung, damit keine Bestellung unbemerkt bleibt. Den Versand beider E-Mails übernimmt Resend als Auftragsverarbeiter (Art. 28 DSGVO). Anbieter ist Plus Five Five, Inc. (Resend), 2261 Market Street #5039, San Francisco, CA 94114, USA. Resend verarbeitet dabei Empfängeradresse, Betreff, Inhalt und Zustelldaten (Zeitpunkt, Zustellstatus) und speichert diese Daten in den USA. Die Übermittlung stützt sich auf den Angemessenheitsbeschluss zum EU-US Data Privacy Framework, nach dem Resend zertifiziert ist, und ergänzend auf die Standardvertragsklauseln im Auftragsverarbeitungsvertrag von Resend. Rechtsgrundlage für die Eingangsbestätigung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) in Verbindung mit unserer gesetzlichen Pflicht aus § 312i BGB (Art. 6 Abs. 1 lit. c DSGVO); für die interne Benachrichtigung unser berechtigtes Interesse an der zeitnahen Bearbeitung von Bestellungen (Art. 6 Abs. 1 lit. f DSGVO). Zum Schutz vor Missbrauch begrenzen wir den Versand an dieselbe Adresse auf wenige E-Mails pro Tag; dafür speichern wir höchstens 24 Stunden lang einen Zähler zu einem Hash der Adresse (nicht die Adresse selbst). Weitere Informationen: Datenschutzerklärung von Resend (https://resend.com/legal/privacy-policy).',
        },
        {
          p: 'Auftragsbestätigung, Rechnung und Zahlung: Auftragsbestätigung, Rechnung, gegebenenfalls die Zugangsdaten zum Dashboard und Rückfragen senden wir von support@yanqiva.de über den E-Mail-Dienst der IONOS SE (siehe Abschnitt 4). Ihre Zahlung per Überweisung wickeln die beteiligten Kreditinstitute ab; wir erhalten dabei die Angaben der Überweisung (Name des Kontoinhabers, IBAN, Betrag, Verwendungszweck).',
        },
        {
          p: 'Lieferung: Wir liefern nur lokal und übergeben die Produkte persönlich. Einen Versanddienstleister setzen wir nicht ein; Lieferadresse, E-Mail-Adresse und Telefonnummer geben wir dafür an niemanden weiter. Die Postleitzahl der Lieferadresse wird im Formular und auf unserer Schnittstelle mit der Liste der Postleitzahlen unseres Liefergebiets abgeglichen; dabei wird nichts zusätzlich gespeichert.',
        },
        {
          p: 'Missbrauchs- und Spamschutz: Zum Schutz vor automatisierten Einsendungen setzen wir keine Dienste von Drittanbietern und keine Cookies ein, sondern folgende Maßnahmen:',
        },
        {
          list: [
            'Rechenaufgabe im Browser: Ihr Browser ruft von unserer Schnittstelle eine kleine Rechenaufgabe ab und löst sie ohne Ihr Zutun. Die Aufgabe enthält nur einen Zufallswert und keine Angaben zu Ihrer Person; der Zufallswert wird höchstens 10 Minuten gespeichert, damit jede Lösung nur einmal gilt.',
            'Unsichtbares Prüffeld und Zeitstempel: Das Formular enthält ein für Menschen nicht sichtbares Feld, das automatisierte Programme häufig ausfüllen, und übermittelt den Zeitpunkt, zu dem Sie mit dem Ausfüllen begonnen haben. Beides dient nur der Erkennung automatisierter Einsendungen.',
            'Inhaltsprüfung: Wir prüfen Eingaben automatisch auf typische Spam-Merkmale und speichern das Ergebnis (Punktzahl und Gründe) zur Bestellung. Auffällige Einsendungen erhalten keine automatische Eingangsbestätigung; offensichtlicher Spam wird nach 30 Tagen gelöscht. Über die Annahme einer Bestellung entscheiden wir selbst; die automatische Prüfung entscheidet nur über den automatischen Versand der Eingangsbestätigung. Erhalten Sie keine Eingangsbestätigung, schreiben Sie uns bitte an support@yanqiva.de.',
            'Zähler mit Prüfwerten: Zur Begrenzung von Einsendungen bilden wir aus Ihrer IP-Adresse (bei IPv6 aus dem Netzpräfix), einem täglich wechselnden Wert und einem geheimen Schlüssel einen nicht umkehrbaren Prüfwert (gesalzener Hash) und zählen damit die Einsendungen; ebenso zählen wir Einsendungen je Hash der E-Mail-Adresse und wiederholte identische Einsendungen. Ihre IP-Adresse speichern wir nicht. Die Zähler werden nach spätestens 24 Stunden automatisch gelöscht.',
            'Prüfung der E-Mail-Domain: Vor dem Versand der Eingangsbestätigung fragen wir bei Cloudflare (DNS-over-HTTPS) ab, ob die Domain Ihrer E-Mail-Adresse E-Mails annehmen kann. Übermittelt wird nur der Teil nach dem @, nicht Ihre vollständige Adresse. Das Ergebnis speichern wir je Domain als Hash für 24 Stunden.',
          ],
        },
        {
          p: 'Rechtsgrundlage für diese Schutzmaßnahmen sowie für Browserkennung und Land ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im Schutz vor Missbrauch, Spam und Überlastung des Formulars und des E-Mail-Versands sowie in der Erkennung technischer Fehler.',
        },
        {
          p: 'Zwischenstand im Browser (sessionStorage): Damit Ihre Eingaben beim Wechsel zwischen den Schritten, beim Neuladen der Seite oder beim Zurückgehen im Browser nicht verloren gehen, speichert das Formular den Zwischenstand Ihrer Eingaben im Sitzungsspeicher (sessionStorage) Ihres Browsers. Das ist kein Cookie; dabei werden keine Daten an uns übertragen. Nach erfolgreichem Absenden löscht das Formular den Zwischenstand; im Übrigen löscht ihn Ihr Browser, wenn Sie den Tab oder das Fenster schließen. Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 2 Nr. 2 TDDDG, weil die Speicherung unbedingt erforderlich ist, um das von Ihnen gewünschte mehrstufige Bestellformular bereitzustellen; für die Verarbeitung der Daten Art. 6 Abs. 1 lit. b DSGVO.',
        },
        {
          p: 'Bestellung per E-Mail: Erreicht das Formular unsere Schnittstelle nicht, bietet es an, die Bestellung als vorbereitete E-Mail über Ihr E-Mail-Programm an support@yanqiva.de zu senden. Für diese E-Mail gilt Abschnitt 4; eine automatische Eingangsbestätigung über Resend erfolgt dann nicht.',
        },
        {
          p: 'Rechtsgrundlage und Speicherdauer: Rechtsgrundlage für die Verarbeitung der Bestelldaten ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung und -erfüllung). Den Eintrag der Bestellung im Cloudflare-KV-Speicher löscht der Speicher nach 12 Monaten automatisch. Daten, die wir für einen geschlossenen Vertrag weiter benötigen (zum Beispiel für Lieferung, Dashboard, Weiterleitung oder Mängelansprüche), übernehmen wir vorher in unsere Vertrags- und Buchhaltungsunterlagen. Danach bewahren wir nur noch die handels- und steuerrechtlich erforderlichen Unterlagen auf: Handels- und Geschäftsbriefe (zum Beispiel Bestellung und Auftragsbestätigung) sechs Jahre, Rechnungen und Buchungsbelege acht Jahre, Bücher und Aufzeichnungen zehn Jahre (§ 147 AO, § 14b UStG und, soweit anwendbar, § 257 HGB; Art. 6 Abs. 1 lit. c DSGVO). Die Fristen beginnen mit dem Ende des Kalenderjahres, in dem die Unterlage entstanden ist. Bestellungen, die nicht zu einem Vertrag führen, löschen wir spätestens nach 12 Monaten.',
        },
      ],
    },
    {
      id: 'lokaler-speicher',
      heading: '6. Speicher im Browser (sessionStorage) in der Dashboard-Demo',
      blocks: [
        {
          p: 'Nur wenn Sie in der Dashboard-Demo selbst eine Demo-Karte anlegen, legen wir Ihre Eingaben (Unternehmensname, Link, Kartennummer) im Sitzungsspeicher (sessionStorage) Ihres Browsers unter dem Schlüssel yanqiva-demo-cards-v1 ab. Das ist kein Cookie. Die Daten verlassen Ihr Gerät nicht; sie werden weder an uns noch an Dritte übertragen, und wir haben keinen Zugriff darauf. Die Daten werden automatisch gelöscht, sobald Sie den Browser-Tab schließen, oder vorher, wenn Sie in der Demo „Demo zurücksetzen“ wählen.',
        },
        {
          p: 'Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 2 Nr. 2 TDDDG: Die Speicherung erfolgt nur, wenn Sie die Funktion selbst nutzen, und ist unbedingt erforderlich, damit die von Ihnen ausdrücklich gewünschte Funktion (Ihre angelegte Demo-Karte bleibt beim Neuladen innerhalb desselben Tabs erhalten) bereitgestellt werden kann. Eine Einwilligung ist dafür nicht erforderlich. Soweit dabei überhaupt personenbezogene Daten verarbeitet werden, ist Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer funktionsfähigen Demo.',
        },
        {
          p: 'Bitte geben Sie in der Demo keine vertraulichen oder personenbezogenen Daten ein.',
        },
      ],
    },
    {
      id: 'weiterleitung',
      heading: '7. NFC- und QR-Weiterleitungen',
      blocks: [
        {
          p: 'Beim Antippen einer Karte oder beim Scannen eines QR-Codes wird zunächst eine Weiterleitungsadresse dieser Website aufgerufen (/r/ gefolgt von einer Kartenkennung). Diese Seiten sind statische Seiten ohne Skripte von Drittanbietern; sie weisen Ihren Browser an, keine Referrer-Angabe weiterzugeben (no-referrer).',
        },
        {
          p: 'Karten und QR-Codes unserer Kunden: Die Weiterleitungsadresse führt Ihren Browser zum Google-Bewertungsformular des jeweiligen Unternehmens (siehe Abschnitt 9). Dabei zählen wir den Aufruf: Gezählt werden ausschließlich aggregierte Tageszähler je Karte, getrennt nach NFC und QR-Code. Gespeichert wird nur die Zahl der Aufrufe; wir speichern keine IP-Adressen, Browserkennungen, Besucher-IDs oder Standortdaten und erkennen Personen nicht wieder. Die Zähler stehen Kunden der Variante Dashboard im Dashboard zur Verfügung (Abschnitt 8). Bei dieser Verarbeitung werden technisch bedingt die in Abschnitt 3 beschriebenen Verbindungsdaten durch Cloudflare verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt darin, unseren Kunden die vertraglich zugesagten Zahlen bereitzustellen und die Weiterleitung sicher zu betreiben.',
        },
        {
          p: 'Demo-Adressen: Die Demo-Weiterleitungen (zum Beispiel /r/demo-baeckerei) führen auf eine simulierte Bewertungsseite dieser Website (/review-demo/). Dabei wird nichts gezählt oder gespeichert. Die simulierte Bewertungsseite zeigt den Namen des Demo-Unternehmens aus der aufgerufenen Adresse an und sendet keine Daten: Sternebewertung und Text bleiben in Ihrem Browser und werden beim Verlassen der Seite verworfen. Alle Statistiken in der Dashboard-Demo sind erfundene Beispieldaten.',
        },
      ],
    },
    {
      id: 'dashboard',
      heading: '8. Dashboard für Kunden (Variante Dashboard)',
      blocks: [
        {
          p: 'Kunden der Variante Dashboard erhalten Zugangsdaten für einen geschützten Bereich, in dem sie ihre Karten verwalten, die Zahl der Aufrufe je Karte ansehen und den Ziel-Link ändern können. Dabei verarbeiten wir:',
        },
        {
          list: [
            'Anmeldedaten: die E-Mail-Adresse der Ansprechperson. Die Anmeldung erfolgt ohne Passwort per Magic-Link: Wir senden einen einmalig nutzbaren, zeitlich begrenzten Anmeldelink per E-Mail (Versand über Resend, siehe Abschnitt 5),',
            'Karten: Kartennummer, Anzeigename, die vom Kunden hinterlegte Ziel-URL (in der Regel der Google-Bewertungslink des Unternehmens) und den Zeitpunkt der letzten Änderung,',
            'aggregierte Zähler: je Karte und Tag zwei Zahlen (Aufrufe über NFC und über QR-Code). Diese Zähler enthalten keine personenbezogenen Daten über Personen, die eine Karte antippen oder einen QR-Code scannen (Abschnitt 7).',
          ],
        },
        {
          p: 'Zweck ist die Bereitstellung des Dashboards nach Ziffer 3 und 8 unserer AGB. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Nach der Anmeldung speichert Ihr Browser ein Sitzungs-Token im Browser-Speicher (kein Cookie); es dient nur der Anmeldung, nicht der Analyse (§ 25 Abs. 2 Nr. 2 TDDDG), und wird beim Abmelden gelöscht. Die Daten verarbeiten wir in unserem Auftrag bei Cloudflare (Workers und Datenbank Cloudflare D1 mit EU-Jurisdiktion, siehe Abschnitt 3). Die Zähler werden ohne IP-Adressen und ohne Cookies erfasst.',
        },
        {
          p: 'Speicherdauer: Konto, Karten und Ziel-URLs speichern wir, solange der Dashboard-Zugang besteht (12 Monate ab Freischaltung; eine Verlängerung erfolgt nur auf Wunsch des Kunden). Tageszähler zeigen wir bis zu 25 Monate rückwirkend und löschen sie sowie das Konto 90 Tage nach dem Ende des Dashboard-Zugangs; die Ziel-URL je Karte speichern wir für die Weiterleitung weiter (Abschnitt 7), solange wir diese nach Ziffer 9 der AGB betreiben. Gesetzliche Aufbewahrungspflichten für Vertragsunterlagen (Abschnitt 5) bleiben unberührt.',
        },
      ],
    },
    {
      id: 'google',
      heading: '9. Google-Bewertungslink und Weiterleitung zu Google',
      blocks: [
        {
          p: 'Ein Unternehmen hinterlegt als Ziel seiner Karten den Link zu seiner Google-Bewertungsseite. Dieser Link ist eine geschäftliche Ziel-URL des Unternehmens. Nach der Weiterleitung verlassen Sie unsere Website. Für die Verarbeitung auf den Seiten von Google ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, verantwortlich; es gelten deren Datenschutzbestimmungen (https://policies.google.com/privacy). Wir erhalten von Google keine Daten über Personen, die die Bewertungsseite aufrufen oder eine Bewertung abgeben.',
        },
        {
          p: 'Bei den Demo-Adressen findet keine Weiterleitung zu Google statt (siehe Abschnitt 7).',
        },
      ],
    },
    {
      id: 'links',
      heading: '10. Externe Links',
      blocks: [
        {
          p: 'Unsere Seiten enthalten Links zu anderen Websites, zum Beispiel zu yanqiva.de. Beim Anklicken gilt die Datenschutzerklärung des jeweiligen Anbieters. Wir binden keine Inhalte von Dritten ein.',
        },
      ],
    },
    {
      id: 'rechte',
      heading: '11. Ihre Rechte',
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
      heading: '12. Beschwerderecht',
      blocks: [
        {
          p: 'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig ist die Aufsichtsbehörde Ihres Wohnorts oder die für uns zuständige Behörde: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz, Hintere Bleiche 34, 55116 Mainz.',
        },
      ],
    },
    {
      id: 'aenderungen',
      heading: '13. Datensicherheit und Änderungen',
      blocks: [
        {
          p: 'Die Übertragung erfolgt verschlüsselt über HTTPS. Wir passen diese Erklärung an, wenn sich unsere Verarbeitung ändert. Es gilt die jeweils aktuelle Fassung.',
        },
      ],
    },
  ],
}
