// thousandmiles.app: the header turns to glass once you scroll, blocks fade
// in once, the home page's readiness card shows each zone, the newsroom's
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

  // Home: the readiness card. Each button shows that zone's headline (the
  // app's own zone lines), its colour and where the knob sits on the bar.
  const card = $('#rcard');
  if (card) {
    const zones = {
      1: ['Rest today', 'Recover', '12.5%'],
      2: ['Take a lighter day', 'Easy', '37.5%'],
      3: ['Good to go', 'Ready', '62.5%'],
      4: ['Good day for a big effort', 'Primed', '87.5%'],
    };
    const head = $('#rhead'), word = $('#zword'), buttons = card.querySelectorAll('.zones button');
    buttons.forEach(b => b.addEventListener('click', () => {
      const z = zones[b.dataset.z];
      buttons.forEach(o => o.setAttribute('aria-pressed', o === b ? 'true' : 'false'));
      card.style.setProperty('--zone', `var(--z${b.dataset.z})`);
      card.style.setProperty('--at', z[2]);
      head.textContent = z[0];
      word.textContent = z[1];
    }));
  }

  // Newsroom: copy the boilerplate paragraph.
  const btn = $('#copyBtn'), status = $('#copyStatus'), text = $('#boiler');
  if (btn && text) btn.addEventListener('click', () => {
    const w = navigator.clipboard && navigator.clipboard.writeText(text.textContent.trim());
    (w || Promise.reject()).then(
      () => { status.textContent = 'Copied.'; },
      () => { status.textContent = 'Copying is blocked here. Select the paragraph to copy it.'; });
  });

  // Support, and the home page's morning read: a link to an answer
  // (support#export, /#morning-read) opens it.
  const openTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const t = id && d.getElementById(id);
    if (t && t.tagName === 'DETAILS' && !t.open) { t.open = true; t.scrollIntoView({ behavior: 'instant' }); }
  };
  openTarget(); addEventListener('hashchange', openTarget);
})();
