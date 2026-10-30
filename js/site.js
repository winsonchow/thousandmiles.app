// thousandmiles.app: the header turns to glass once you scroll, blocks fade
// in once, the home page's pills open a line or a sheet, the newsroom's
// paragraph copies, and a link to a support answer opens it.
// Everything is readable without this file: the page only hides content
// to reveal it when <html> carries the "js" class set in each page's head.
(() => {
  const d = document, h = d.documentElement, IO = window.IntersectionObserver;
  const $ = s => d.querySelector(s), $$ = s => d.querySelectorAll(s);
  const hdr = $('.hdr'), sentinel = $('.sentinel');

  if (!IO) {
    // No observer: show everything as it is, and follow the scroll by hand.
    h.classList.remove('js');
    if (hdr) {
      const f = () => hdr.classList.toggle('scrolled', scrollY > 56);
      addEventListener('scroll', f, { passive: true }); f();
    }
  } else {
    if (hdr && sentinel) new IO(([e]) => hdr.classList.toggle('scrolled', !e.isIntersecting)).observe(sentinel);
    const ro = new IO(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(e => ro.observe(e));
  }

  // Home, In the moment: one pill open at a time, and the phone shows its screen.
  const pills = $$('#closer button'), shots = $$('.closer .scr img');
  pills.forEach(b => b.addEventListener('click', () => {
    pills.forEach(o => { o.setAttribute('aria-expanded', 'false'); d.getElementById(o.getAttribute('aria-controls')).hidden = true; });
    b.setAttribute('aria-expanded', 'true');
    const bub = d.getElementById(b.getAttribute('aria-controls'));
    bub.hidden = false;
    shots.forEach((img, i) => img.classList.toggle('on', i === +b.dataset.shot));
  }));

  // Home: each chapter's pill opens its sheet; the cross or a tap outside closes it.
  $$('[data-sheet]').forEach(b => b.addEventListener('click', () => {
    const s = d.getElementById(b.dataset.sheet);
    if (s && s.showModal) s.showModal();
  }));
  $$('dialog.sheet').forEach(s => {
    s.querySelector('[data-close]').addEventListener('click', () => s.close());
    s.addEventListener('click', e => { if (e.target === s) s.close(); });
  });

  // Newsroom: copy the boilerplate paragraph.
  const btn = $('#copyBtn'), status = $('#copyStatus'), text = $('#boiler');
  if (btn && text) btn.addEventListener('click', () => {
    const w = navigator.clipboard && navigator.clipboard.writeText(text.textContent.trim());
    (w || Promise.reject()).then(
      () => { status.textContent = 'Copied.'; },
      () => { status.textContent = 'Copying is blocked here. Select the paragraph to copy it.'; });
  });

  // Support: a link to an answer (support#export) opens it.
  const openTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const t = id && d.getElementById(id);
    if (t && t.tagName === 'DETAILS' && !t.open) { t.open = true; t.scrollIntoView({ behavior: 'instant' }); }
  };
  openTarget(); addEventListener('hashchange', openTarget);
})();
