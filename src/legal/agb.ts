import type { LegalDoc } from './types'

/**
 * Allgemeine Geschäftsbedingungen für YANQIVA REVIEW (nur B2B), Seite /agb/.
 * Ablauf und Preise deckungsgleich mit dem Bestellformular (/bestellen/) und dem Worker-Katalog halten.
 * Anbieterdaten deckungsgleich mit impressum.ts. Bei Änderungen „updated“ anpassen und die
 * bisherige Fassung archivieren (Kunden müssen die bei Vertragsschluss geltende Fassung erhalten können).
 */
export const agb: LegalDoc = {
  title: 'Allgemeine Geschäftsbedingungen',
  badge: 'Rechtliches',
  updated: 'Stand: 9. Oktober 2026',
  callouts: [
    {
      tone: 'info',
      title: 'Nur für Unternehmer',
      text: 'YANQIVA REVIEW richtet sich ausschließlich an Unternehmer im Sinne von § 14 BGB sowie an juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen. Verbraucher können nicht bestellen.',
    },
  ],
  sections: [
    {
      id: 'geltungsbereich',
      heading: '1. Geltungsbereich und Anbieter',
      blocks: [
        {
          p: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über das Produkt „YANQIVA REVIEW“, die über die Website yanqiva-bewertung.de, insbesondere über das Bestellformular, zwischen Yannick Kern, Einzelunternehmen „Yanqiva“, Waldstr. 3, 67361 Freisbach, E-Mail: support@yanqiva.de (nachfolgend „wir“), und dem Kunden geschlossen werden. Für Leistungen, die wir auf yanqiva.de anbieten, gelten die dortigen AGB.',
        },
        {
          p: 'Unsere Angebote richten sich ausschließlich an Unternehmer im Sinne von § 14 BGB, juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen. Verbraucher im Sinne von § 13 BGB sind vom Vertragsschluss ausgeschlossen. Der Kunde bestätigt bei der Bestellung, dass er als Unternehmer für sein Unternehmen handelt. Bestellungen, die erkennbar von Verbrauchern stammen, nehmen wir nicht an.',
        },
        {
          p: 'Abweichende, entgegenstehende oder ergänzende Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, wir stimmen ihrer Geltung ausdrücklich in Textform zu. Individuelle Vereinbarungen mit dem Kunden haben Vorrang vor diesen AGB (§ 305b BGB).',
        },
      ],
    },
    {
      id: 'vertragsschluss',
      heading: '2. Vertragsschluss',
      blocks: [
        {
          p: 'Die Darstellung der Produkte und Preise auf der Website ist kein bindendes Angebot, sondern eine Aufforderung zur Bestellung.',
        },
        {
          p: 'Technischer Ablauf: Im Bestellformular wählt der Kunde Variante, Ausführung und Menge, macht die Angaben zur Einrichtung sowie seine Kontakt- und Adressdaten. Im letzten Schritt zeigt das Formular eine Übersicht aller Angaben und Preise. Bis zum Absenden kann der Kunde jeden Schritt über „Ändern“ oder die Zurück-Funktion erneut aufrufen und seine Eingaben korrigieren; Pflichtfelder werden vor dem Absenden auf Vollständigkeit geprüft. Mit Klick auf die Schaltfläche „Zahlungspflichtig bestellen“ gibt der Kunde ein verbindliches Angebot zum Kauf der gewählten Produkte ab (Bestellung).',
        },
        {
          p: 'Den Eingang der Bestellung bestätigen wir unverzüglich automatisch per E-Mail (Eingangsbestätigung). Die Eingangsbestätigung ist noch keine Annahme der Bestellung.',
        },
        {
          p: 'Der Vertrag kommt erst zustande, wenn wir die Bestellung durch eine Auftragsbestätigung per E-Mail annehmen. Mit der Auftragsbestätigung erhält der Kunde die Rechnung. In der Regel senden wir die Auftragsbestätigung innerhalb eines Werktags, frühestens jedoch am 15. Oktober 2026 (siehe nächster Absatz). An seine Bestellung ist der Kunde bis zum Ablauf von fünf Werktagen nach dem Absenden bzw., bei Bestellungen vor dem 15. Oktober 2026, nach dem 15. Oktober 2026 gebunden, je nachdem, was später eintritt; nehmen wir sie bis dahin nicht an, ist er nicht mehr gebunden. Lässt sich das angegebene Google-Unternehmensprofil nicht eindeutig zuordnen oder sind Angaben unklar, fragen wir vor der Auftragsbestätigung nach.',
        },
        {
          p: 'Aufnahme der Tätigkeit: Wir nehmen unsere Tätigkeit am 15. Oktober 2026 auf. Ein Vertrag kommt daher frühestens am 15. Oktober 2026 zustande. Bestellungen, die vor diesem Tag eingehen, prüfen und bestätigen wir ab dem 15. Oktober 2026. Fristen für die Lieferung (Ziffer 6) beginnen nicht vor der Auftragsbestätigung bzw. dem Zahlungseingang.',
        },
        {
          p: 'Kann das Bestellformular wegen einer technischen Störung nicht übermittelt werden, bietet es an, die Bestellung als vorbereitete E-Mail an support@yanqiva.de zu senden. Diese E-Mail gilt als Bestellung; für die Annahme gilt der vorstehende Absatz.',
        },
        {
          p: 'Wir speichern den Vertragstext (die Bestelldaten). Der Kunde erhält die Bestelldaten mit der Eingangsbestätigung und der Auftragsbestätigung per E-Mail. Nach Vertragsschluss ist der Vertragstext nicht über die Website abrufbar. Diese AGB kann der Kunde jederzeit unter yanqiva-bewertung.de/agb/ abrufen, ausdrucken und speichern, zum Beispiel über die Druck- oder Speicherfunktion seines Browsers. Vertragssprache ist Deutsch. Einem Verhaltenskodex haben wir uns nicht unterworfen.',
        },
      ],
    },
    {
      id: 'leistung',
      heading: '3. Leistungsumfang',
      blocks: [
        {
          p: 'Wir liefern die bestellte Anzahl NFC-Produkte in der gewählten Ausführung (Lieferung nur im Liefergebiet nach Ziffer 6), entweder als NFC-Karte im Kartenformat oder als NFC-Aufsteller für Theke oder Tisch, jeweils mit NFC-Chip und aufgedrucktem QR-Code, und richten sie ein. Tippt eine Person das Produkt mit einem Smartphone an oder scannt sie den QR-Code, wird sie über eine Weiterleitungsadresse von uns (Ziffer 9) zum Google-Bewertungsformular des Unternehmensprofils des Kunden geleitet. Es gibt zwei Varianten:',
        },
        {
          list: [
            'YANQIVA REVIEW Klassik: Lieferung und Einrichtung der Produkte mit Weiterleitung zum Google-Bewertungsformular. Laufende Kosten fallen nicht an.',
            'YANQIVA REVIEW Dashboard: Leistungen wie Klassik und zusätzlich ein Zugang zu einem Online-Dashboard für 12 Monate (Ziffer 8). Das Dashboard zeigt Statistiken zur Zahl der Aufrufe der Weiterleitung über NFC und QR-Code und ermöglicht es dem Kunden, das Ziel der Weiterleitung jederzeit selbst zu ändern. Ein Google-Bewertungslink als Ziel ist sofort aktiv; ein anderes https-Ziel wird erst nach Freigabe durch uns wirksam.',
          ],
        },
        {
          p: 'Je Bestellung können 1 bis 10 Stück bestellt werden. Alle Stücke einer Bestellung sind für einen Standort und ein Google-Unternehmensprofil bestimmt. Größere Mengen und mehrere Standorte bieten wir auf Anfrage an support@yanqiva.de gesondert an.',
        },
        {
          p: 'Wir bedrucken die Produkte nach unserer Standardgestaltung mit dem vom Kunden angegebenen Anzeigenamen. Gestaltungswünsche und Logos, die der Kunde in den Hinweisen nennt oder nachreicht, setzen wir um, soweit dies im Rahmen der Standardgestaltung möglich ist; andernfalls sprechen wir den Kunden vor der Produktion an. Handelsübliche, geringfügige Abweichungen in Farbe, Material und Druckbild gegenüber Abbildungen auf der Website bleiben vorbehalten, soweit sie für den Kunden zumutbar sind.',
        },
        {
          p: 'NFC funktioniert nur mit Smartphones, die NFC unterstützen und bei denen die Funktion eingeschaltet ist; für alle anderen Geräte trägt jedes Produkt den QR-Code. Eine Funktion mit jedem Endgerät schulden wir nicht.',
        },
        {
          p: 'Die Statistiken im Dashboard zählen Aufrufe der Weiterleitung, nicht abgegebene Bewertungen. Mehrfache Aufrufe derselben Person, automatische Vorschauabrufe von Apps oder technische Störungen können dazu führen, dass die Zahlen von der tatsächlichen Nutzung abweichen.',
        },
      ],
    },
    {
      id: 'einrichtung',
      heading: '4. Einrichtung und Angaben des Kunden',
      blocks: [
        {
          p: 'Wir richten die Produkte anhand der Angaben des Kunden in der Bestellung ein: Anzeigename, Google-Bewertungslink oder, wenn kein Link angegeben ist, Name und Ort des Unternehmens, wie bei Google angezeigt. Im letzten Fall ermitteln wir den Bewertungslink des Profils; ist das Profil nicht eindeutig zu finden, fragen wir nach. Vor der Übergabe prüfen wir, dass die Weiterleitung zu dem angegebenen oder ermittelten Bewertungsformular führt.',
        },
        {
          p: 'Der Kunde ist dafür verantwortlich, dass seine Angaben richtig und vollständig sind, insbesondere dass der Anzeigename richtig geschrieben ist und dass der angegebene Link bzw. das genannte Profil das Google-Unternehmensprofil seines eigenen Unternehmens ist oder eines Unternehmens, für das er handeln darf. Abweichungen, die auf unrichtigen oder unvollständigen Angaben des Kunden beruhen, sind kein Mangel. Ein falsches Weiterleitungsziel korrigieren wir in diesem Fall ohne Rücksendung; eine Neuanfertigung bedruckter Produkte erfolgt nach vorheriger Absprache gegen Entgelt.',
        },
        {
          p: 'Der Kunde versichert, dass er berechtigt ist, den angegebenen Namen, Logos und sonstige Gestaltungsvorgaben zu verwenden und auf die Produkte drucken zu lassen, und dass diese keine Rechte Dritter (zum Beispiel Marken-, Namens- oder Urheberrechte) und keine gesetzlichen Vorschriften verletzen. Er räumt uns die für die Herstellung erforderlichen Nutzungsrechte ein. Wir prüfen die Angaben nicht auf Rechte Dritter. Erkennbar rechtsverletzende Inhalte drucken wir nicht. Der Kunde stellt uns von Ansprüchen Dritter frei, die auf einer Verletzung dieser Pflichten beruhen, soweit er die Verletzung zu vertreten hat; die Freistellung umfasst die angemessenen Kosten der Rechtsverteidigung.',
        },
      ],
    },
    {
      id: 'preise',
      heading: '5. Preise und Zahlung',
      blocks: [
        {
          p: 'Es gelten die zum Zeitpunkt der Bestellung im Bestellformular genannten Preise. Alle Preise sind Endpreise in Euro je Stück; der Gesamtbetrag ergibt sich aus dem Preis je Stück und der Menge. Lieferung und Übergabe vor Ort im Liefergebiet (Ziffer 6) sind im Preis enthalten. Weitere Kosten fallen für die Bestellung nicht an; zur optionalen Verlängerung des Dashboards siehe Ziffer 8.',
        },
        {
          p: 'Wir sind Kleinunternehmer im Sinne von § 19 UStG. Es wird keine Umsatzsteuer berechnet und in Rechnungen keine Umsatzsteuer ausgewiesen. Entfallen die Voraussetzungen der Kleinunternehmerregelung, können wir für Verlängerungszeiträume des Dashboards, die danach beginnen, die gesetzliche Umsatzsteuer zusätzlich berechnen. Wir informieren den Kunden darüber mindestens einen Monat vorher in Textform.',
        },
        {
          p: 'Zahlung erfolgt per Rechnung. Die Rechnung erhält der Kunde mit der Auftragsbestätigung per E-Mail. Sie ist innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug per Überweisung zu zahlen. Mit der Einrichtung, der Produktion und der Lieferung beginnen wir nach Zahlungseingang.',
        },
        {
          p: 'Geht die Zahlung nicht fristgerecht ein, können wir dem Kunden eine angemessene Nachfrist setzen und nach deren erfolglosem Ablauf vom Vertrag zurücktreten. Die gesetzlichen Rechte bei Zahlungsverzug bleiben unberührt.',
        },
      ],
    },
    {
      id: 'lieferung',
      heading: '6. Lieferung, Übergabe und Gefahrübergang',
      blocks: [
        {
          p: 'Wir liefern ausschließlich lokal an Unternehmen im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe (Liefergebiet). Die Übergabe und Einrichtung erfolgen persönlich vor Ort; einen Postversand gibt es nicht. Maßgeblich ist die Postleitzahl der Lieferadresse, also der Rechnungsadresse oder der in der Bestellung angegebenen abweichenden Lieferadresse. Sie wird im Bestellformular geprüft. Bestellungen mit einer Lieferadresse außerhalb des Liefergebiets nehmen wir nicht an. Auf Anfrage an support@yanqiva.de prüfen wir im Einzelfall, ob eine Lieferung möglich ist.',
        },
        {
          p: 'Wir übergeben die Produkte in der Regel innerhalb von 2 bis 5 Werktagen (Variante Klassik) bzw. innerhalb von 7 Werktagen (Variante Dashboard, einschließlich Einrichtung des Dashboards) nach Zahlungseingang. Den Übergabetermin vereinbaren wir mit dem Kunden. Die voraussichtliche Lieferzeit bestätigen wir zusätzlich in der Auftragsbestätigung. Sie beginnt mit dem Zahlungseingang, frühestens jedoch mit der Auftragsbestätigung (Ziffer 2) und frühestens, wenn Rückfragen zur Einrichtung (Ziffer 4) geklärt sind. Verbindlich ist ein Liefertermin nur, wenn er ausdrücklich als verbindlich vereinbart ist. Überschreiten wir die genannte Lieferzeit, kann der Kunde uns eine angemessene Nachfrist setzen; seine gesetzlichen Rechte bleiben unberührt.',
        },
        {
          p: 'Die Produkte werden ohne Versandverpackung übergeben. Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht mit der Übergabe an den Kunden oder an eine von ihm benannte Person am vereinbarten Ort über. Kann die Übergabe aus Gründen, die der Kunde zu vertreten hat, nicht stattfinden, vereinbaren wir einen neuen Termin; die gesetzlichen Regeln zum Annahmeverzug bleiben unberührt. Äußerlich erkennbare Schäden soll der Kunde bei der Übergabe anzeigen.',
        },
        {
          p: 'Bei der Variante Dashboard senden wir die Zugangsdaten zum Dashboard mit der Übergabe per E-Mail.',
        },
      ],
    },
    {
      id: 'eigentumsvorbehalt',
      heading: '7. Eigentumsvorbehalt',
      blocks: [
        {
          p: 'Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises unser Eigentum.',
        },
      ],
    },
    {
      id: 'dashboard',
      heading: '8. Dashboard: Laufzeit, Verlängerung und Verfügbarkeit',
      blocks: [
        {
          p: 'Bei der Variante Dashboard ist der Zugang zum Dashboard für 12 Monate im einmaligen Preis enthalten. Die 12 Monate beginnen mit dem Tag, an dem wir die Zugangsdaten per E-Mail senden. Der Zugang gilt für den Standort und das Google-Unternehmensprofil der Bestellung und für die mit der Bestellung gelieferten Produkte.',
        },
        {
          p: 'Nach Ablauf der 12 Monate endet der Zugang automatisch, ohne dass es einer Kündigung bedarf. Es gibt keine automatische Verlängerung und kein automatisches Abonnement; ohne aktive Verlängerung auf Wunsch des Kunden entstehen keine weiteren Kosten. Vor Ablauf erinnern wir den Kunden per E-Mail an das Ende und die Möglichkeit der Verlängerung.',
        },
        {
          p: 'Ohne Verlängerung funktionieren die Produkte weiter: Die Weiterleitung führt dann wie bei der Variante Klassik direkt zum zuletzt eingestellten Google-Bewertungsformular. Statistiken und die Änderung des Ziels im Dashboard stehen nicht mehr zur Verfügung; Änderungen des Ziels nehmen wir dann auf Anfrage nach Ziffer 9 vor. Nach dem Ende des Zugangs sind wir nicht verpflichtet, die Statistiken weiter vorzuhalten.',
        },
        {
          p: 'Verlängerung: Der Kunde kann das Dashboard verlängern, indem er die Verlängerung ausdrücklich in Textform (zum Beispiel per E-Mail) beauftragt und wir sie bestätigen. Die Verlängerung kostet 15 € pro Monat je Standort (Endpreis, keine Umsatzsteuer nach § 19 UStG, vorbehaltlich Ziffer 5) und wird monatlich im Voraus in Rechnung gestellt; Zahlungsziel sind 14 Tage. Sie läuft auf unbestimmte Zeit und kann von beiden Seiten jederzeit zum Ende des laufenden Kalendermonats gekündigt werden. Kündigungen bedürfen der Textform; eine E-Mail genügt. Das Recht zur Kündigung aus wichtigem Grund bleibt unberührt.',
        },
        {
          p: 'Ändern wir den Preis der Verlängerung, teilen wir das dem Kunden mindestens einen Monat vor Wirksamwerden in Textform mit. Der Kunde kann die Verlängerung bis dahin zum Ende des Kalendermonats kündigen, in dem die Änderung wirksam wird.',
        },
        {
          p: 'Wir stellen das Dashboard mit der Sorgfalt eines ordentlichen Kaufmanns über das Internet bereit. Eine ununterbrochene Verfügbarkeit schulden wir nicht. Vorübergehende Einschränkungen, etwa durch Wartung, Sicherheitsupdates oder Störungen bei technischen Dienstleistern oder im Internet, sind möglich. Geplante Wartungen führen wir nach Möglichkeit außerhalb üblicher Geschäftszeiten durch. Störungen beheben wir in angemessener Frist, nachdem wir von ihnen Kenntnis erlangt haben.',
        },
        {
          p: 'Der Kunde hält seine Zugangsdaten vertraulich und gibt sie nur an Personen weiter, die für ihn auf das Dashboard zugreifen sollen. Als Ziel der Weiterleitung darf er Google-Bewertungslinks einstellen (sofort aktiv) sowie andere https-Seiten, die zu seinem Unternehmen gehören und deren Inhalt rechtmäßig ist (diese werden erst nach unserer Freigabe wirksam); Ziffer 10 gilt auch für selbst eingestellte Ziele. Leitet ein Ziel offensichtlich auf rechtswidrige Inhalte, Schadsoftware oder Seiten zum Abgreifen von Zugangsdaten, können wir die Weiterleitung bis zur Klärung auf das zuvor eingestellte Ziel zurücksetzen oder vorübergehend sperren; wir informieren den Kunden darüber unverzüglich.',
        },
      ],
    },
    {
      id: 'weiterleitung',
      heading: '9. Weiterleitung über YANQIVA',
      blocks: [
        {
          p: 'Auf dem NFC-Chip und im QR-Code der Produkte ist nicht der Google-Link selbst gespeichert, sondern eine Weiterleitungsadresse von uns (unter der Domain yanqiva-bewertung.de im Pfad /r/ mit einer Kennung des Produkts). Wir leiten Aufrufe dieser Adresse an das hinterlegte Ziel weiter. So kann das Ziel geändert werden, ohne das Produkt neu zu beschreiben.',
        },
        {
          p: 'Die Weiterleitung ist bei beiden Varianten im einmaligen Preis enthalten und verursacht keine laufenden Kosten. Wir betreiben sie unabhängig davon, ob ein Dashboard gebucht oder verlängert ist.',
        },
        {
          p: 'Wir betreiben die Weiterleitung, solange wir YANQIVA REVIEW anbieten, mindestens jedoch 24 Monate ab Lieferung. Eine zeitlich unbegrenzte Funktion können wir nicht zusagen, weil sie vom Betrieb unserer Systeme, der Domain und von technischen Dienstleistern abhängt. Stellen wir den Betrieb der Weiterleitung ein, kündigen wir das dem Kunden mindestens sechs Monate vorher per E-Mail an und teilen ihm den direkten Link zu seinem Google-Bewertungsformular mit, damit er ihn weiter nutzen kann, zum Beispiel in einem eigenen QR-Code. Für die Verfügbarkeit der Weiterleitung gilt die Regelung zur Verfügbarkeit des Dashboards in Ziffer 8 entsprechend.',
        },
        {
          p: 'Ändert sich das Google-Unternehmensprofil des Kunden oder der Bewertungslink, passen wir das Ziel auf Anfrage per E-Mail an support@yanqiva.de in angemessener Frist an. Kunden mit aktivem Dashboard können das Ziel selbst ändern.',
        },
      ],
    },
    {
      id: 'google',
      heading: '10. Google-Bewertungen und Pflichten des Kunden',
      blocks: [
        {
          p: 'YANQIVA REVIEW ist ein eigenständiges Produkt von Yanqiva. Wir stehen in keiner Verbindung zu Google und werden von Google weder unterstützt noch beauftragt. Google ist eine Marke der Google LLC.',
        },
        {
          p: 'Die Produkte führen Personen zum Bewertungsformular. Ob, wie viele und welche Bewertungen abgegeben werden, entscheiden allein diese Personen. Wir schulden keine bestimmte Zahl von Bewertungen, keine bestimmte Sternebewertung und keine Verbesserung der Sichtbarkeit bei Google. Auf die Veröffentlichung, Darstellung, Prüfung oder Löschung von Bewertungen durch Google, auf Änderungen der Dienste von Google und auf Einschränkungen oder Sperrungen von Unternehmensprofilen haben wir keinen Einfluss. Ändert Google das Format von Bewertungslinks, passen wir das Ziel der Weiterleitung in angemessener Frist an, soweit das technisch möglich ist.',
        },
        {
          p: 'Der Kunde setzt die Produkte im Einklang mit den jeweils geltenden Richtlinien von Google für Bewertungen und mit dem Gesetz gegen den unlauteren Wettbewerb (UWG) ein. Insbesondere',
        },
        {
          list: [
            'bietet er keine Gegenleistung für Bewertungen an, zum Beispiel Rabatte, Gutscheine, Geschenke oder Teilnahme an Gewinnspielen,',
            'bittet er nicht selektiv nur zufriedene Kunden um Bewertungen und filtert Bewertungen nicht vor (kein sogenanntes Review-Gating), zum Beispiel durch eine vorgeschaltete Zufriedenheitsabfrage, die nur zufriedene Kunden zu Google weiterleitet,',
            'gibt er keine Bewertungen über sein eigenes Unternehmen ab, lässt keine durch Mitarbeitende oder beauftragte Dritte abgeben und kauft keine Bewertungen,',
            'stellt er Bewertungen in seiner Werbung nicht falsch oder irreführend dar.',
          ],
        },
        {
          p: 'Für Folgen eines Verstoßes des Kunden gegen diese Pflichten, etwa die Löschung von Bewertungen, Einschränkungen seines Unternehmensprofils durch Google oder Ansprüche von Mitbewerbern, haften wir nicht. Der Kunde stellt uns von Ansprüchen Dritter frei, die auf einem solchen Verstoß beruhen, soweit er ihn zu vertreten hat; die Freistellung umfasst die angemessenen Kosten der Rechtsverteidigung. Unsere Hinweise zum Umgang mit Bewertungen sind allgemeine Informationen und keine Rechtsberatung.',
        },
      ],
    },
    {
      id: 'maengel',
      heading: '11. Mängelrechte',
      blocks: [
        {
          p: 'Es gelten die gesetzlichen Mängelrechte mit den folgenden Maßgaben.',
        },
        {
          p: 'Ist der Kauf für beide Seiten ein Handelsgeschäft, gilt die Untersuchungs- und Rügeobliegenheit nach § 377 HGB. Im Übrigen prüft der Kunde nach Erhalt, ob Anzahl, Ausführung, Aufdruck, NFC-Funktion, QR-Code und die Weiterleitung zum richtigen Google-Unternehmensprofil stimmen, und zeigt offensichtliche Mängel innerhalb von 14 Tagen nach Lieferung in Textform an support@yanqiva.de an. Zeigt er einen offensichtlichen Mangel nicht rechtzeitig an, sind Mängelansprüche wegen dieses Mangels ausgeschlossen; das gilt nicht, wenn wir den Mangel arglistig verschwiegen haben, und nicht für Schadensersatzansprüche nach Ziffer 12.',
        },
        {
          p: 'Bei Mängeln leisten wir zunächst nach unserer Wahl Nacherfüllung durch Beseitigung des Mangels oder durch Lieferung einer mangelfreien Sache. Fehler der Weiterleitung beheben wir in der Regel zentral, ohne dass der Kunde das Produkt zurücksenden muss. Schlägt die Nacherfüllung fehl, kann der Kunde nach den gesetzlichen Vorschriften mindern oder vom Vertrag zurücktreten. Schadensersatz und Ersatz vergeblicher Aufwendungen richten sich nach Ziffer 12.',
        },
        {
          p: 'Kein Mangel sind insbesondere Abweichungen, die auf Angaben des Kunden beruhen (Ziffer 4), die fehlende NFC-Funktion von Endgeräten ohne NFC oder mit ausgeschalteter Funktion (Ziffer 3) sowie übliche Gebrauchsspuren und Schäden durch unsachgemäße Behandlung.',
        },
        {
          p: 'Mängelansprüche verjähren in 12 Monaten ab Ablieferung. Das gilt nicht für Schadensersatzansprüche, für Ansprüche wegen arglistig verschwiegener Mängel und für Ansprüche aus einer Garantie; insoweit gelten die gesetzlichen Fristen.',
        },
      ],
    },
    {
      id: 'haftung',
      heading: '12. Haftung',
      blocks: [
        {
          p: 'Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit, bei Übernahme einer Garantie, bei arglistigem Verschweigen eines Mangels sowie nach dem Produkthaftungsgesetz.',
        },
        {
          p: 'Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist unsere Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Wesentliche Vertragspflichten sind Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf. Im Übrigen ist die Haftung bei leichter Fahrlässigkeit ausgeschlossen.',
        },
        {
          p: 'Diese Haftungsregeln gelten auch für die persönliche Haftung unserer Mitarbeitenden, Vertreter und Erfüllungsgehilfen.',
        },
      ],
    },
    {
      id: 'datenschutz',
      heading: '13. Datenschutz',
      blocks: [
        {
          p: 'Informationen zur Verarbeitung personenbezogener Daten bei der Bestellung und bei der Nutzung der Produkte finden Sie in unserer Datenschutzerklärung unter yanqiva-bewertung.de/datenschutz/.',
        },
      ],
    },
    {
      id: 'schluss',
      heading: '14. Schlussbestimmungen',
      blocks: [
        {
          p: 'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).',
        },
        {
          p: 'Ist der Kunde Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag unser Sitz in Freisbach. Wir sind berechtigt, auch am allgemeinen Gerichtsstand des Kunden zu klagen.',
        },
        {
          p: 'Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.',
        },
      ],
    },
  ],
}
