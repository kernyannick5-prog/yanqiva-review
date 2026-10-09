# Liefergebiet YANQIVA REVIEW

YANQIVA REVIEW wird nur lokal an Unternehmen geliefert und persönlich übergeben (kein Postversand). Das Liefergebiet sind die Städte Speyer, Ludwigshafen am Rhein, Mannheim und Karlsruhe plus Umland sowie ein Umkreis um den Mittelpunkt im Landkreis Germersheim (Freisbach, PLZ 67361; INTERN, nicht in öffentlichen Texten nennen).

## Öffentliche Formulierung

„im Raum Speyer, Ludwigshafen, Mannheim und Karlsruhe sowie in der Umgebung von Germersheim, Edenkoben und Neustadt an der Weinstraße“. Bewusst kein „ganze Südliche Weinstraße“ und kein „Landau“ (nur Sonder-PLZ 76825/76826/76828 im Gebiet, Kern-PLZ 76829 nicht); Neustadt a. d. Weinstraße (67433, 67434, 67435, Sonder-PLZ 67429) liegt komplett im Gebiet. Der Wohn-/Geschäftssitz wird öffentlich nicht genannt.

## Festlegung

- Quelle der Daten: GeoNames-Postleitzahlendatenbank (download.geonames.org/export/zip/DE.zip, CC BY 4.0), Stand 09.10.2026. Pro PLZ wurde der Mittelpunkt (Median der Koordinaten) berechnet.
- Regel: Eine PLZ gehört zum Liefergebiet, wenn ihr Mittelpunkt höchstens **15 km Luftlinie** vom Stadtzentrum von Speyer (49,3173 N / 8,4312 O), Ludwigshafen (49,4774 / 8,4452), Mannheim (49,4875 / 8,4660) oder Karlsruhe (49,0069 / 8,4037) entfernt liegt, zusätzlich höchstens **15 km** vom Ortszentrum Freisbach (PLZ 67361; GeoNames 49,2717 N / 8,2719 O; im JSON neutral als "Kreis Germersheim (Mitte)" geführt) (Erweiterung vom 09.10.2026, Eigentümer-Entscheidung). Bewusst enger als die genannten ca. 25 km; Heidelberg, Worms, die Kernstadt Landau (PLZ 76829), Bruchsal, Rastatt und Pforzheim liegen außerhalb.
- Geprüft wird die Lieferadresse (bei abweichender Lieferadresse deren PLZ, sonst die Rechnungs-PLZ). Die Rechnungsadresse darf überall in Deutschland liegen.
- Sonder-PLZ (Großkunden-/Postfach-PLZ) sind enthalten, wenn sie in den Radius fallen.
- Die Datei `src/order/deliveryArea.json` ist die Quelle und existiert identisch in `zugangsklar/worker/src/deliveryArea.json`. Der Worker-Test `worker/test/review-delivery-area.test.js` stellt sicher, dass beide Dateien gleich sind. Änderungen immer in beiden Repos übernehmen.
- Zusätzliche Orte nach Bedarf: PLZ in beiden JSON-Dateien ergänzen (PLZ als Schlüssel, Ortsname als Wert) und Worker deployen sowie Frontend veröffentlichen.

## PLZ nach Ort (231 PLZ)

- Altlußheim: 68804
- Altrip: 67122
- Au am Rhein: 76474
- Beindersheim, Kleinniedesheim, Großniedesheim: 67259
- Bellheim: 76756
- Birkenheide: 67134
- Bobenheim-Roxheim: 67240
- Böbingen, Freimersheim, Venningen, Altdorf: 67482
- Böhl-Iggelheim: 67459
- Brühl: 68782
- Dannstadt-Schauernheim: 67125
- Dudenhofen: 67373
- Durmersheim: 76448
- Edenkoben: 67480
- Edesheim, Großfischlingen, Kleinfischlingen: 67483
- Edingen-Neckarhausen: 68535
- Eggenstein-Leopoldshafen: 76344
- Ellerstadt: 67158
- Ettlingen: 76275
- Ettlingen (Sonder-PLZ): 76273
- Frankenthal (Pfalz): 67227
- Frankenthal (Sonder-PLZ): 67225
- Freisbach: 67361
- Fußgönheim: 67136
- Germersheim: 76726
- Germersheim (Sonder-PLZ): 76725
- Gommersheim: 67377
- Hagenbach: 76767
- Hanhofen: 67374
- Harthausen: 67376
- Haßloch: 67454
- Heddesheim: 68542
- Herxheimweyher, Herxheim bei Landau/Pfalz: 76863
- Heßheim: 67258
- Hirschberg an der Bergstraße: 69493
- Hochdorf-Assenheim: 67126
- Hockenheim: 68766
- Hockenheim (Sonder-PLZ): 68764
- Hördt: 76771
- Ilvesheim: 68549
- Jockgrim: 76751
- Karlsbad: 76307
- Karlsruhe: 76131, 76133, 76135, 76137, 76139, 76149, 76185, 76187, 76189, 76199, 76227, 76228, 76229
- Karlsruhe (Sonder-PLZ): 76006, 76070, 76073, 76088, 76089, 76097, 76098, 76107, 76109, 76110, 76111, 76112, 76113, 76114, 76115, 76117, 76118, 76119, 76120, 76121, 76122, 76123, 76124, 76125, 76126, 76127, 76128, 76147, 76150, 76180, 76181, 76182, 76225, 76230, 76240, 76243, 76245, 76246, 76247, 76248, 76249, 76253
- Ketsch: 68775
- Kirrweiler (Pfalz): 67489
- Kuhardt: 76773
- Ladenburg: 68526
- Lambsheim: 67245
- Lampertheim: 68623
- Lampertheim (Sonder-PLZ): 68619
- Landau in der Pfalz (Sonder-PLZ): 76825, 76826, 76828
- Leimersheim: 76774
- Limburgerhof: 67117
- Lingenfeld: 67360
- Linkenheim-Hochstetten: 76351
- Ludwigshafen (Sonder-PLZ): 67055, 67056, 67057, 67075, 67076, 67077, 67078, 67082
- Ludwigshafen am Rhein: 67059, 67061, 67063, 67065, 67067, 67069, 67071
- Lustadt: 67363
- Maikammer, Sankt Martin: 67487
- Malsch: 76316
- Malsch (Sonder-PLZ): 76314
- Mannheim: 68159, 68161, 68163, 68165, 68167, 68169, 68199, 68219, 68229, 68239, 68259, 68305, 68307, 68309
- Mannheim (Sonder-PLZ): 68051, 68112, 68122, 68123, 68124, 68126, 68127, 68128, 68130, 68131, 68132, 68133, 68134, 68135, 68136, 68138, 68139, 68140, 68141, 68142, 68143, 68144, 68145, 68146, 68147, 68148, 68149, 68150, 68151, 68156, 68197, 68298, 68299, 68300, 68301, 68302
- Maxdorf: 67133
- Meckenheim: 67149
- Mutterstadt: 67112
- Neuburg am Rhein: 76776
- Neuhofen: 67141
- Neulußheim: 68809
- Neupotz: 76777
- Neustadt an der Weinstraße: 67433, 67434, 67435
- Neustadt an der Weinstraße (Sonder-PLZ): 67429
- Oberhausen-Rheinhausen: 68794
- Offenbach an der Queich: 76877
- Offenbach an der Queich (Sonder-PLZ): 76878
- Oftersheim, Plankstadt, Schwetzingen: 68723
- Ottersheim, Bornheim, Knittelsheim, Hochstadt, Essingen: 76879
- Otterstadt: 67166
- Pfinztal: 76327
- Philippsburg: 76661
- Reilingen: 68799
- Remchingen: 75196
- Remchingen (Sonder-PLZ): 75194
- Rheinstetten: 76287
- Rödersheim-Gronau: 67127
- Römerberg: 67354
- Roschbach, Burrweiler, Rhodt unter Rietburg, Gleisweiler, Flemlingen, Hainfeld, Weyher in der Pfalz: 76835
- Rülzheim: 76761
- Sankt Leon-Rot: 68789
- Schifferstadt: 67105
- Schriesheim: 69198
- Schwegenheim: 67365
- Schwetzingen (Sonder-PLZ): 68721
- Siebeldingen, Böchingen, Knöringen, Frankweiler, Walsheim: 76833
- Speyer: 67346
- Speyer (Sonder-PLZ): 67340, 67342, 67343
- Stutensee: 76297
- Viernheim: 68519
- Viernheim (Sonder-PLZ): 68517
- Waghäusel: 68753
- Waldbronn: 76337
- Waldsee: 67165
- Walzbachtal: 75045
- Weingarten (Baden): 76356
- Weingarten (Pfalz): 67366
- Weisenheim am Sand: 67256
- Westheim: 67368
- Wörth am Rhein: 76744
- Wörth am Rhein (Sonder-PLZ): 76742
- Zeiskam: 67378
