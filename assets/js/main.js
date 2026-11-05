(() => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Nav: border on scroll + mobile menu
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.getElementById('nav-links');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('is-open', !open);
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    }
  });

  // Arc diagram of yeast tRNA-Phe secondary structure (dot-bracket)
  const seq = 'GCGGAUUUAGCUCAGUUGGGAGAGCGCCAGACUGAAGAUCUGGAGGUCCUGUGUUCGAUCCACAGAAUUCGCACCA';
  const db  = '(((((((..((((........)))).(((((.......))))).....(((((.......))))))))))))....';
  const svg = document.getElementById('arc-svg');
  if (svg) {
    const NS = 'http://www.w3.org/2000/svg';
    const n = db.length, W = 1000, pad = 8, step = (W - 2 * pad) / (n - 1);
    const pairs = [], stack = [], paired = new Set();
    [...db].forEach((c, i) => {
      if (c === '(') stack.push(i);
      else if (c === ')') { const j = stack.pop(); pairs.push([j, i]); paired.add(i); paired.add(j); }
    });
    const FLAT = 0.42;
    const maxR = Math.max(...pairs.map(([a, b]) => (b - a) * step / 2)) * FLAT;
    const base = maxR + 10, H = base + 18;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const el = (tag, attrs, parent = svg) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      parent.appendChild(e);
      return e;
    };
    el('line', { x1: pad, x2: W - pad, y1: base, y2: base, class: 'backbone' });
    const g = el('g', {});
    pairs.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
    pairs.forEach(([a, b], k) => {
      const x1 = pad + a * step, x2 = pad + b * step, r = (x2 - x1) / 2;
      const ry = r * FLAT;
      const p = el('path', { d: `M${x1} ${base} A${r} ${ry} 0 0 1 ${x2} ${base}`, class: 'pair' }, g);
      const len = Math.PI * Math.sqrt((r * r + ry * ry) / 2) + 2;
      p.style.setProperty('--len', len.toFixed(1));
      p.style.animationDelay = `${(k * 0.025).toFixed(3)}s`;
    });
    for (let i = 0; i < n; i++) {
      const c = el('circle', { cx: pad + i * step, cy: base, r: paired.has(i) ? 3.2 : 2.4, class: paired.has(i) ? 'base base--paired' : 'base' });
      const t = document.createElementNS(NS, 'title');
      t.textContent = `${seq[i]}${i + 1}`;
      c.appendChild(t);
    }
    svg.closest('.arc').classList.add('is-drawing');
  }

  // Reveal on scroll
  const targets = document.querySelectorAll('.section__head, .card, .repo, .tl, .pub, .event, .certs__group');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(t => { t.classList.add('reveal'); io.observe(t); });
  }
})();
