// assets/js/main.js
// Navegação interna com loader + sidebar "Sobre mim" (quando existir).
(function () {
  const loader = document.getElementById('page-loader');

  function isInternalLink(a) {
    const href = a.getAttribute('href');
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (a.target === '_blank') return false;
    if (href.startsWith('http')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    return true;
  }

  // Loader só para links internos
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !loader) return;
    if (!isInternalLink(a)) return;

    e.preventDefault();
    loader.classList.add('active');

    // Curto o suficiente para "polimento" sem atrapalhar
    setTimeout(() => {
      window.location.href = a.getAttribute('href');
    }, 550);
  });

  // Sidebar "Sobre mim" (se existir na página)
  const sidebar = document.getElementById('analiz-sidebar');
  const btn = document.querySelector('.btn-analiz');

  function setBtnState(isOpen) {
    if (!btn) return;
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    const text = btn.querySelector('.btn-text');
    if (text) text.textContent = isOpen ? '✕' : 'Sobre mim';
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    setBtnState(false);
  }

  if (btn && sidebar) {
    // A11y
    btn.setAttribute('aria-controls', 'analiz-sidebar');
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      setBtnState(isOpen);
    });

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    // Fecha clicando fora
    document.addEventListener('click', (e) => {
      if (!sidebar.classList.contains('open')) return;
      const clickedInside = sidebar.contains(e.target) || btn.contains(e.target);
      if (!clickedInside) closeSidebar();
    });
  }
})();
