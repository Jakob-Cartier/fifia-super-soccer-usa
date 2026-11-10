(() => {
  const body = document.body;
  const themePicker = document.querySelector("#theme-picker");

  // Site-wide player recruitment banner.
  const announcementBar = document.querySelector(".announcement-bar");
  if (announcementBar && !document.querySelector(".top-recruitment-banner")) {
    const banner = document.createElement("div");
    banner.className = "top-recruitment-banner";
    const label = document.createElement("span");
    label.className = "top-recruitment-label";
    label.textContent = "PLAYER RECRUITMENT OPEN";
    const message = document.createElement("strong");
    message.textContent = "WE'RE LOOKING FOR NEW PLAYERS";
    const link = document.createElement("a");
    link.href = "/apply/";
    link.textContent = "CLICK HERE TO APPLY →";
    banner.append(label, message, link);
    announcementBar.insertAdjacentElement("afterend", banner);
  }
  const themeKey = "usa-national-team-theme";
  const allowedThemes = ["winter-midnight", "frost-white", "aurora-ice", "usa-classic"];

  function setTheme(theme, save = true) {
    const safeTheme = allowedThemes.includes(theme) ? theme : "winter-midnight";
    body.dataset.theme = safeTheme;
    if (themePicker) themePicker.value = safeTheme;
    if (save) {
      try { localStorage.setItem(themeKey, safeTheme); } catch (_) { /* Storage may be disabled. */ }
    }
  }

  let savedTheme = "winter-midnight";
  try { savedTheme = localStorage.getItem(themeKey) || savedTheme; } catch (_) { /* Use default theme. */ }
  setTheme(savedTheme, false);
  if (themePicker) themePicker.addEventListener("change", () => setTheme(themePicker.value));

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (nav) {
    const matchLink = nav.querySelector('a[href="/matches/"]');
    if (matchLink && !nav.querySelector('a[href="/calendar/"]')) {
      const calendarLink = document.createElement("a");
      calendarLink.href = "/calendar/";
      calendarLink.textContent = "Calendar";
      if (window.location.pathname.startsWith("/calendar")) {
        calendarLink.setAttribute("aria-current", "page");
      }
      matchLink.insertAdjacentElement("afterend", calendarLink);
    }
  }
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("open", !open);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("open");
    }));
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".player-card[data-position]");
  const empty = document.querySelector("#filter-empty");
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    let shown = 0;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      const show = button.dataset.filter === "all" || button.dataset.filter === card.dataset.position;
      card.hidden = !show;
      if (show) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }));

  const copyButton = document.querySelector("#copy-roster");
  const toast = document.querySelector("#toast");
  let toastTimer;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  }
  if (copyButton) copyButton.addEventListener("click", async () => {
    const roster = [
      "USA NATIONAL TEAM — ROBLOX FIFA SUPER SOCCER",
      "Mark — Senior Goalkeeper — Number TBD",
      "Kayden — CM — Central Midfielder — #5",
      "Brycen — RW — Captain — #10",
      "Tessa — LW — Forward — #9",
      "Ruffles — RW — Attacking Substitute — #6"
    ].join("\\n");
    try {
      await navigator.clipboard.writeText(roster);
      notify("Roster copied.");
    } catch (_) {
      notify("Copy is unavailable in this browser.");
    }
  });

  const year = document.querySelectorAll("[data-current-year]");
  year.forEach((node) => node.textContent = String(new Date().getFullYear()));

  // The live-chat widget is activated only after the team has its own account-specific embed code.
  // Do not put personal contact details or private player information in this public website.
  const chatState = document.querySelector("[data-chat-state]");
  if (chatState) chatState.textContent = "Live chat is available in the Tawk.to bubble on this page.";
})();