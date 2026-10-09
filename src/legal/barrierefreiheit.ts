import type { LegalDoc } from './types'

/**
 * Erklärung zur Barrierefreiheit von yanqiva-bewertung.de.
 * Struktur und Tonalität angelehnt an https://yanqiva.de/barrierefreiheit.
 * Aussagen nur so weit, wie sie geprüft sind. Bei Änderungen an der Website (z. B. Bestellprozess,
 * Video, neue Formulare) Abschnitte „bestellung“ und „einschraenkungen“ anpassen und das Datum erneuern.
 */
export const barrierefreiheit: LegalDoc = {
  title: 'Erklärung zur Barrierefreiheit',
  badge: 'Rechtliches',
  updated: 'Stand: 9. Oktober 2026',
  callouts: [
    {
      tone: 'info',
      title: 'Barriere gefunden? Sagen Sie uns Bescheid.',
      text: 'Schreiben Sie uns an support@yanqiva.de. Nennen Sie bitte die Seite, das Problem und – wenn Sie möchten – Ihr Gerät, Ihren Browser und ggf. Ihre Hilfstechnik. Wir bemühen uns, innerhalb von 5 Werktagen zu antworten.',
      link: { label: 'E-Mail schreiben', href: 'mailto:support@yanqiva.de?subject=Barriere%20auf%20yanqiva-bewertung.de' },
    },
  ],
  sections: [
    {
      id: 'einleitung',
      heading: '1. Worum es geht',
      blocks: [
        {
          p: 'Yanqiva stellt auf dieser Website das Produkt „YANQIVA REVIEW“ (NFC-Karten und QR-Codes für Google-Bewertungen) vor und verkauft es an Unternehmen. Wir möchten, dass möglichst viele Menschen die Website nutzen können – auch mit Tastatur, Screenreader (Vorleseprogramm), Vergrößerung oder auf kleinen Bildschirmen.',
        },
        {
          p: 'Unser Angebot richtet sich ausschließlich an Unternehmer. Nach unserer Einschätzung sind wir deshalb nicht verpflichtet, eine solche Erklärung zu veröffentlichen. Wir stellen sie freiwillig bereit, damit Sie wissen, was funktioniert und wo es noch Lücken gibt.',
        },
      ],
    },
    {
      id: 'geltungsbereich',
      heading: '2. Für welche Seiten gilt die Erklärung?',
      blocks: [
        {
          p: 'Die Erklärung gilt für yanqiva-bewertung.de. Das sind:',
        },
        {
          list: [
            'die Startseite mit allen Abschnitten, einschließlich der interaktiven Dashboard-Demo (Übersicht, Karten, Statistiken, Einstellungen) und dem Formular „Neue Karte hinzufügen“',
            'die Seiten Impressum, Datenschutz, AGB und diese Erklärung',
            'den Bestellprozess unter /bestellen/ (siehe Abschnitt 8)',
            'die Demo-Weiterleitungen unter /r/… und die simulierte Bewertungsseite (/review-demo/), zu der sie führen',
            'die Fehlerseite „Seite nicht gefunden“',
          ],
        },
        {
          p: 'Nicht erfasst sind andere Websites, auf die wir verlinken, zum Beispiel yanqiva.de (dort gibt es eine eigene Erklärung) oder Google.',
        },
      ],
    },
    {
      id: 'standards',
      heading: '3. Maßstab',
      blocks: [
        {
          p: 'Wir orientieren uns an den Web Content Accessibility Guidelines (WCAG) 2.2, Konformitätsstufe AA, und an der europäischen Norm EN 301 549 (Kapitel 9, Web). Das sind die gängigen Regelwerke für barrierefreie Websites. „Orientieren“ heißt: Es ist unser Ziel und unser Prüfmaßstab. Wir behaupten damit nicht, dass jede einzelne Anforderung erfüllt ist.',
        },
      ],
    },
    {
      id: 'stand',
      heading: '4. Stand der Vereinbarkeit',
      blocks: [
        {
          p: 'Nach unserer Einschätzung ist die Website mit den genannten Anforderungen teilweise vereinbar. Bei unserer Prüfung am 8. und 9. Oktober 2026 haben automatische Werkzeuge keine Verstöße gemeldet, und wir haben die wichtigsten Abläufe selbst mit der Tastatur und bei schmaler Fensterbreite geprüft. Das schließt Barrieren nicht aus, die solche Prüfungen nicht finden. Die bekannten Einschränkungen stehen in Abschnitt 7.',
        },
      ],
    },
    {
      id: 'umsetzung',
      heading: '5. Was wir umgesetzt haben',
      blocks: [
        {
          list: [
            'Die Seiten sind mit HTML-Landmarken (Kopfbereich, Navigation, Hauptinhalt, Fußbereich), einer logischen Überschriftenstruktur und Listen aufgebaut. Ein Sprunglink „Zum Inhalt springen“ führt direkt zum Hauptinhalt.',
            'Alle Bedienelemente lassen sich mit der Tastatur erreichen und bedienen. Der Fokus (die Markierung, wo Sie gerade sind) ist als farbige Umrandung sichtbar; die Navigationsleiste der Dashboard-Demo scrollt bei schmaler Breite mit dem Fokus mit.',
            'Fenster in der Demo („Neue Karte hinzufügen“, „Link bearbeiten“, QR-Code) nehmen den Tastaturfokus beim Öffnen auf, halten ihn darin, schließen sich mit der Esc-Taste und geben den Fokus danach zurück.',
            'Im Formular „Neue Karte hinzufügen“ hat jedes Feld eine sichtbare Beschriftung. Pflichtfelder sind benannt. Fehler stehen als Text direkt am Feld und sind mit dem Feld verknüpft. Der Fokus springt zum ersten fehlerhaften Feld.',
            'Statusmeldungen („Karte erstellt“, „Link kopiert“) und die Auswahl im Diagramm werden Screenreadern über Live-Regionen mitgeteilt.',
            'Die Diagramme haben eine Textzusammenfassung (Summe, Durchschnitt, höchster und niedrigster Wert) und lassen sich mit den Pfeiltasten Tag für Tag durchgehen. In der Heatmap und in den Balken stehen die Zahlen als Text.',
            'Zustände wie „Aktiv“, „Pausiert“ oder ausgewählte Filter sind nicht nur durch Farbe erkennbar, sondern auch durch Text oder Form.',
            'Wir haben die Farbkontraste gemessen: Text mindestens 4,5 : 1, Bedienelemente und Eingabefelder mindestens 3 : 1 (siehe Abschnitt 6).',
            'Die Seiten passen sich schmalen Bildschirmen an (geprüft ab 320 Pixel Breite) und lassen sich vergrößern, ohne dass Sie in zwei Richtungen scrollen müssen. Klickflächen sind mindestens 24 × 24 Pixel groß, die meisten mindestens 44 × 44.',
            'Wenn Ihr Gerät „Bewegung reduzieren“ eingestellt hat, laufen keine Endlos-Animationen, und die Produktanimation erscheint als ruhige Standansicht. Zusätzlich können Sie auf der Startseite direkt unter den Schaltflächen am Seitenanfang und im Seitenfuß über „Animationen anhalten“ alle Endlos-Animationen, die automatische Produktanimation auf Touch-Geräten und die simulierte Live-Aktivität selbst stoppen.',
            'Wir setzen keine Cookies, kein Tracking, keine Overlay-Widgets und keine externen Schriftarten ein.',
          ],
        },
      ],
    },
    {
      id: 'pruefung',
      heading: '6. Wie wir geprüft haben',
      blocks: [
        {
          p: 'Die Prüfung haben wir selbst durchgeführt (Selbstbewertung). Es gab keine Prüfung durch eine externe Stelle.',
        },
        {
          list: [
            'Automatische Tests mit den Prüfwerkzeugen axe-core und Lighthouse (Browser Chrome) für alle oben genannten Seiten. axe-core lief in den Fensterbreiten 320, 390 und 1280 Pixel, außerdem für jede Ansicht der Dashboard-Demo und für das Formular mit Fehlermeldungen.',
            'Manuelle Prüfung mit der Tastatur (Tab-Reihenfolge, Fokus, Fenster, Esc), mit der Einstellung „Bewegung reduzieren“ und bei schmaler Fensterbreite von 320 Pixel (entspricht 400 % Vergrößerung auf einem Bildschirm mit 1280 Pixel Breite). Wir haben dabei auf waagerechtes Scrollen geachtet.',
            'Eine Messung der Farbkontraste anhand der tatsächlich dargestellten Farben, weil automatische Werkzeuge bei Verläufen und Glasflächen oft keine Aussage treffen.',
          ],
        },
        {
          p: 'Ein Test mit echten Screenreadern (zum Beispiel NVDA, JAWS, VoiceOver, TalkBack) und ein Test mit Menschen mit Behinderungen haben noch nicht stattgefunden. Aussagen zur Screenreader-Nutzung beruhen deshalb auf dem Aufbau des Codes und auf automatischen Tests. Diese Prüfung wollen wir nachholen.',
        },
      ],
    },
    {
      id: 'einschraenkungen',
      heading: '7. Bekannte Einschränkungen',
      blocks: [
        {
          list: [
            'Produktanimation (Abschnitt „Das Produkt“): Die 3D-Szene mit Aufsteller und Smartphone ist rein bildlich und für Screenreader ausgeblendet. Den Ablauf beschreiben die drei Schritte und die Kurztexte daneben als normaler Text. Am Computer läuft die Szene mit dem Scrollen, auf Touch-Geräten einmal automatisch und lässt sich dort mit einer Schaltfläche oder über „Animationen anhalten“ anhalten. Auf Geräten mit „Bewegung reduzieren“ oder schwacher Leistung zeigen wir eine ruhige Standansicht. Die Szene selbst ist nicht für Tastatur oder Screenreader erlebbar.',
            'Dashboard-Demo: Alle Daten und Firmen sind erfunden. Die Demo ist nur teilweise auf Screenreadern getestet (siehe Abschnitt 6).',
            'Diagramme: Die Diagramme sind eigene Zeichnungen. Sie haben eine Textzusammenfassung und Tastaturbedienung, aber keine vollständige Datentabelle. Hinweisfelder am Mauszeiger sind kein Ersatz für die Tastaturbedienung.',
            'Kurze Meldungen („Karte erstellt“) verschwinden nach wenigen Sekunden. Sie werden vorgelesen; das Ergebnis (z. B. die neue Karte) bleibt sichtbar.',
            'Die Weiterleitungsseiten unter /r/… leiten sofort weiter und sind nur für Sekundenbruchteile sichtbar. Die simulierte Bewertungsseite ist eine einfache Demo-Seite.',
            'Dekorative Elemente (Glanz, Verläufe, Hintergrund) wechseln die Hintergrundfarbe unter dem Text. Wir haben die Kontraste gemessen; einzelne Stellen können trotzdem knapp ausfallen.',
          ],
        },
        {
          p: 'Wenn Sie auf eine dieser Einschränkungen stoßen und Inhalte in einer anderen Form brauchen, schreiben Sie uns. Wir stellen die Informationen dann auf anderem Weg bereit, zum Beispiel per E-Mail.',
        },
      ],
    },
    {
      id: 'bestellung',
      heading: '8. Bestellprozess',
      blocks: [
        {
          p: 'Seit dem 9. Oktober 2026 können Sie YANQIVA REVIEW über den Bestellprozess unter /bestellen/ bestellen. Er besteht aus vier Schritten (Produkt, Einrichtung, Ihre Daten, Prüfen) und einer Bestätigungsseite. Wir haben ihn am 9. Oktober 2026 selbst geprüft: mit dem Prüfwerkzeug axe-core in den Breiten 320, 390 und 1280 Pixel für jeden Schritt, auch mit Fehlermeldungen und für die Bestätigung, und von Hand nur mit der Tastatur bis zur Bestellübersicht.',
        },
        {
          list: [
            'Jedes Feld hat eine sichtbare Beschriftung. Pflichtfelder sind mit * und im Quelltext als Pflichtfeld gekennzeichnet, freiwillige Angaben mit „(freiwillig)“. Zusammengehörende Auswahlmöglichkeiten (Variante, Ausführung, Adressen) sind als Gruppe mit Überschrift ausgezeichnet. Ihr Browser kann Name, E-Mail, Telefon und Adresse automatisch ausfüllen. Die Produktvariante ist nicht vorausgewählt, Sie wählen sie selbst.',
            'Eine Fortschrittsanzeige nennt den aktuellen Schritt auch als Text („Schritt 2 von 4“). Bei jedem Schrittwechsel setzt die Seite den Tastaturfokus auf die Überschrift des neuen Schritts. Der Seitentitel nennt den Schritt.',
            'Wenn Angaben fehlen oder nicht stimmen, nennt eine Zusammenfassung oben alle Fehler mit Links zu den Feldern. Der Fokus springt zum ersten fehlerhaften Feld, und jede Fehlermeldung steht als Text direkt am Feld und ist nicht nur durch Farbe erkennbar.',
            'Vor dem verbindlichen Absenden sehen Sie eine Übersicht aller Angaben mit „Ändern“-Links. Ihre Eingaben bleiben beim Zurückgehen und beim Neuladen der Seite in dieser Sitzung erhalten. Mit der Zurück-Taste des Browsers kommen Sie zum vorigen Schritt.',
            'Das Absenden wird als Status mitgeteilt („Bestellung wird gesendet …“). Die Bestätigung nimmt den Fokus auf. Wenn die Übermittlung nicht klappt, erhalten Sie eine Meldung mit den Möglichkeiten „Erneut senden“, „Bestellung per E-Mail senden“ und „Bestelltext kopieren“.',
            'Es gibt keine Zeitlimits. Der Bestellprozess ist bis 320 Pixel Breite ohne waagerechtes Scrollen bedienbar, Bedienelemente sind mindestens 24 × 24 Pixel groß, und eine fixierte Leiste am unteren Rand verdeckt auf dem Smartphone nicht das Feld, in dem Sie gerade sind.',
          ],
        },
        {
          p: 'Bekannte Einschränkungen: Die Ansagen für Screenreader (zum Beispiel bei Fehlern, beim Absenden und beim Zwischenpreis, der nach einer kurzen Pause angesagt wird) haben wir nicht mit echten Screenreadern geprüft (siehe Abschnitt 6). Ob Meldungen dort nicht doppelt vorgelesen werden, wissen wir deshalb nicht sicher.',
        },
        {
          p: 'Wenn Sie beim Bestellen auf eine Barriere stoßen, schreiben Sie uns an support@yanqiva.de. Wir nehmen Ihre Bestellung dann auch gern per E-Mail entgegen.',
        },
        {
          p: 'Eine Anmeldung (Login) und ein Video gibt es auf dieser Website nicht.',
        },
      ],
    },
    {
      id: 'feedback',
      heading: '9. Feedback und Kontakt',
      blocks: [
        {
          p: 'Haben Sie eine Barriere bemerkt oder brauchen Sie Inhalte in einer anderen Form? Schreiben Sie uns an support@yanqiva.de oder nutzen Sie das Kontaktformular unter yanqiva.de/kontakt.',
        },
        {
          p: 'Bitte schreiben Sie uns:',
        },
        {
          list: [
            'auf welcher Seite oder in welchem Bereich das Problem auftritt,',
            'was nicht funktioniert hat und was Sie erwartet hätten,',
            'welchen Browser, welches Gerät und ggf. welche Hilfstechnik Sie nutzen (freiwillig).',
          ],
        },
        {
          p: 'Wir bemühen uns, innerhalb von 5 Werktagen zu antworten. Wir lesen jede Meldung, prüfen sie und teilen Ihnen mit, ob und wann wir das Problem beheben. Ihre Angaben verwenden wir nur, um Ihre Meldung zu bearbeiten (siehe Datenschutzerklärung, Abschnitt „Kontakt per E-Mail“).',
        },
        {
          p: 'Anbieter: Yannick Kern (Einzelunternehmen „Yanqiva“), Waldstr. 3, 67361 Freisbach.',
        },
      ],
    },
    {
      id: 'marktueberwachung',
      heading: '10. Marktüberwachungsbehörde',
      blocks: [
        {
          p: 'Für die Barrierefreiheitsanforderungen an Produkte und Dienstleistungen nach dem BFSG ist in Deutschland die Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen (MLBF AöR), Carl-Miller-Straße 6, 39112 Magdeburg, zuständig. Kontakt und aktuelle Informationen: mlbf-barrierefrei.de.',
        },
      ],
    },
    {
      id: 'erstellung',
      heading: '11. Erstellung dieser Erklärung',
      blocks: [
        {
          p: 'Diese Erklärung wurde am 9. Oktober 2026 erstellt. Grundlage ist die oben beschriebene Selbstbewertung vom selben Tag. Wir überprüfen die Erklärung, wenn sich die Website wesentlich ändert, und erneuern dann das Datum.',
        },
      ],
    },
  ],
}
