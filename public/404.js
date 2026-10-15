// Störungs-Hinweis für /r/<slug>: GitHub Pages liefert 404.html für jeden unbekannten Pfad. Produktionskarten laufen über
// den Worker (yanqiva-redirect, Route "Fail open"); landet ein Scan hier, ist der Worker gerade nicht erreichbar.
// Es findet keine Weiterleitung statt (kein Karten-Snapshot im Build). Wir zeigen statt "Seite nicht gefunden" eine Hinweis-Seite mit höchstens 3 automatischen
// Neuversuchen (je 5 s). Zähler im URL-Fragment (#t1..#t3): wird nie an einen Server gesendet, kein Browser-Speicher.
// Alle anderen Pfade zeigen unverändert die normale 404.
(function () {
  if (!/^\/r\/[^/]+\/?$/.test(location.pathname)) return
  var MAX = 3
  var DELAY = 5
  var m = /^#t(\d)$/.exec(location.hash)
  var n = m ? Math.min(parseInt(m[1], 10), MAX) : 0
  var $ = function (id) { return document.getElementById(id) }
  $('notfound').hidden = true
  $('retry').hidden = false
  document.title = 'Kurz nicht erreichbar \u2013 YANQIVA REVIEW'
  var status = $('retry-status')
  $('retry-now').addEventListener('click', function (e) {
    e.preventDefault()
    location.reload()
  })
  if (n >= MAX) {
    status.textContent = 'Die automatischen Versuche sind beendet. Bitte versuchen Sie es in einer Minute erneut.'
    return
  }
  status.textContent = 'Wir versuchen es in ' + DELAY + ' Sekunden automatisch erneut (Versuch ' + (n + 1) + ' von ' + MAX + ').'
  setTimeout(function () {
    history.replaceState(null, '', location.pathname + '#t' + (n + 1))
    location.reload()
  }, DELAY * 1000)
})()
