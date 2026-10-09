(function () {
  var name = new URLSearchParams(location.search).get('b');
  if (name) document.getElementById('biz').textContent = name.slice(0, 80);

  var rating = 0;
  var box = document.getElementById('stars');
  var stars = [];
  function paint() {
    stars.forEach(function (s, i) {
      s.classList.toggle('on', i < rating);
      s.setAttribute('aria-checked', String(i + 1 === rating));
      s.tabIndex = (rating ? i + 1 === rating : i === 0) ? 0 : -1;
    });
  }
  for (var i = 1; i <= 5; i++) {
    (function (n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'star';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-label', n + (n === 1 ? ' Stern' : ' Sterne'));
      b.textContent = '★';
      b.addEventListener('click', function () { rating = n; document.getElementById('msg').textContent = ''; box.removeAttribute('aria-invalid'); paint(); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        rating = Math.min(5, Math.max(1, (rating || n) + d));
        document.getElementById('msg').textContent = ''; box.removeAttribute('aria-invalid');
        paint();
        stars[rating - 1].focus();
      });
      stars.push(b);
      box.appendChild(b);
    })(i);
  }
  paint();

  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!rating) {
      document.getElementById('msg').textContent = 'Bitte wähle zuerst eine Sternebewertung.';
      box.setAttribute('aria-invalid', 'true');
      stars[0].focus();
      return;
    }
    document.getElementById('card').classList.add('sent');
    document.getElementById('done-h').focus();
  });
})();
