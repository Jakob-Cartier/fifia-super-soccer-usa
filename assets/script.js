(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('open');
      });
    });
  }

  const filterButtons = document.querySelectorAll('.filter-button');
  const playerCards = document.querySelectorAll('.player-card');
  const emptyMessage = document.getElementById('filter-empty');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      playerCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.position === filter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    });
  });

  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2500);
  }

  const copyButton = document.getElementById('copy-roster');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const roster = [
        'USA NATIONAL TEAM — ROBLOX FIFA SUPER SOCCER',
        'Kayden — CM — Central Midfielder — #5',
        'Brycen — RW — Right Wing / Forward — #10',
        'Tessa — LW — Left Wing / Forward — #9',
        'Ruffles — GK — Goalkeeper — #6'
      ].join('\n');

      try {
        await navigator.clipboard.writeText(roster);
        showToast('Squad roster copied.');
      } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = roster;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand('copy');
        textArea.remove();
        showToast(copied ? 'Squad roster copied.' : 'Copy unavailable in this browser.');
      }
    });
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
