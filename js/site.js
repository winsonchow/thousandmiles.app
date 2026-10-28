// thousandmiles.app: the header turns to glass once you scroll, the home
// page's pinned phone follows the three reads, blocks fade in once, the
// newsroom's paragraph copies, and a link to a support answer opens it.
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
    const reads = $('.reads');
    if (reads) {
      const so = new IO(es => es.forEach(e => {
        if (e.isIntersecting) reads.dataset.active = e.target.dataset.step;
      }), { rootMargin: '-45% 0px -45% 0px' });
      $$('[data-step]').forEach(e => so.observe(e));
    }
  }

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
