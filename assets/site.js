(() => {
  const body = document.body;

  // Scheduled three-stage launch gate. Times are fixed to Eastern Time in November 2026.
  const launchStart = Date.parse("2026-11-12T03:30:00Z"); // Nov 11, 10:30 PM EST
  const previewEnd = Date.parse("2026-11-12T03:40:00Z"); // Nov 11, 10:40 PM EST
  const fullRelease = Date.parse("2026-11-12T20:45:00Z"); // Nov 12, 3:45 PM EST

  function installLaunchGate() {
    if (document.querySelector(".launch-gate")) return;
    const gate = document.createElement("section");
    gate.className = "launch-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Website launch countdown");
    gate.innerHTML = `
      <div class="launch-stars" aria-hidden="true"></div>
      <div class="launch-gate-inner">
        <div class="launch-mark"><img src="/assets/crest.png" alt="USA National Team crest"></div>
        <div class="launch-kicker"><span class="launch-live-dot"></span> USA NATIONAL TEAM · WEBSITE UPDATE</div>
        <h1 class="launch-title">A NEW ERA<br><em>IS COMING.</em></h1>
        <p class="launch-message">The next chapter of the USA National Team is almost ready.</p>
        <div class="launch-count-label">OFFICIAL REVEAL IN</div>
        <div class="launch-countdown" aria-live="off">
          <div><b data-count-days>00</b><span>DAYS</span></div>
          <div><b data-count-hours>00</b><span>HOURS</span></div>
          <div><b data-count-minutes>00</b><span>MINUTES</span></div>
          <div><b data-count-seconds>00</b><span>SECONDS</span></div>
        </div>
        <div class="launch-progress"><span></span></div>
        <div class="launch-foot"><span>ONE TEAM. ONE NATION.</span><span>EST. FOR THE GAME</span></div>
      </div>
      <div class="launch-preview" hidden>
        <div class="preview-orbit preview-orbit-a"></div><div class="preview-orbit preview-orbit-b"></div>
        <div class="preview-scan"></div>
        <div class="preview-crest"><img src="/assets/crest.png" alt="USA crest"></div>
        <div class="preview-kicker">THE FUTURE OF THE SQUAD</div>
        <h2>THE WAIT<br><em>IS ALMOST OVER.</em></h2>
        <p>A first look at what's next.</p>
        <div class="preview-build"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="preview-lock-note">PREVIEW WINDOW · LIMITED REVEAL</div>
      </div>`;
    document.body.append(gate);
    document.documentElement.classList.add("launch-locked");
    body.classList.add("launch-locked");

    const countdown = gate.querySelector(".launch-countdown");
    const preview = gate.querySelector(".launch-preview");
    const heading = gate.querySelector(".launch-title");
    const message = gate.querySelector(".launch-message");
    const label = gate.querySelector(".launch-count-label");
    const foot = gate.querySelector(".launch-foot");
    const progress = gate.querySelector(".launch-progress");
    let released = false;

    const pad = (n) => String(n).padStart(2, "0");
    function tick() {
      const now = Date.now();
      if (now >= fullRelease) {
        released = true;
        gate.classList.add("launch-gate-exit");
        document.documentElement.classList.remove("launch-locked");
        body.classList.remove("launch-locked");
        window.setTimeout(() => gate.remove(), 850);
        window.clearInterval(timer);
        return;
      }
      if (now >= launchStart && now < previewEnd) {
        gate.classList.add("is-preview");
        countdown.hidden = true;
        label.hidden = true;
        progress.hidden = true;
        heading.hidden = true;
        message.hidden = true;
        foot.hidden = true;
        preview.hidden = false;
        return;
      }
      gate.classList.remove("is-preview");
      preview.hidden = true;
      countdown.hidden = false;
      label.hidden = false;
      progress.hidden = false;
      heading.hidden = false;
      message.hidden = false;
      foot.hidden = false;
      if (now < launchStart) {
        heading.innerHTML = "A NEW ERA<br><em>IS COMING.</em>";
        message.textContent = "The next chapter of the USA National Team is almost ready.";
        label.textContent = "FIRST REVEAL IN";
        countdown.setAttribute("aria-label", "Countdown to first reveal");
        updateCountdown(launchStart - now);
        progress.style.setProperty("--progress", String(Math.max(0, Math.min(100, (now / launchStart) * 100)) ) + "%");
      } else {
        heading.innerHTML = "THE FULL<br><em>REVEAL AWAITS.</em>";
        message.textContent = "The preview has closed. The complete team website opens tomorrow.";
        label.textContent = "FULL WEBSITE RELEASE IN";
        countdown.setAttribute("aria-label", "Countdown to full website release");
        updateCountdown(fullRelease - now);
        progress.style.setProperty("--progress", String(Math.max(0, Math.min(100, ((now - previewEnd) / (fullRelease - previewEnd)) * 100))) + "%");
      }
    }
    function updateCountdown(ms) {
      const seconds = Math.max(0, Math.floor(ms / 1000));
      gate.querySelector("[data-count-days]").textContent = pad(Math.floor(seconds / 86400));
      gate.querySelector("[data-count-hours]").textContent = pad(Math.floor((seconds % 86400) / 3600));
      gate.querySelector("[data-count-minutes]").textContent = pad(Math.floor((seconds % 3600) / 60));
      gate.querySelector("[data-count-seconds]").textContent = pad(seconds % 60);
    }
    const timer = window.setInterval(tick, 250);
    tick();
  }
  installLaunchGate();
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

    if (!nav.querySelector(".nav-dropdown")) {
      const hub = document.createElement("div");
      hub.className = "nav-dropdown";
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-dropdown-toggle";
      toggle.textContent = "Team Hub ▾";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-haspopup", "true");

      const menu = document.createElement("div");
      menu.className = "nav-dropdown-menu";
      const hubLinks = [
        ["/stats/", "Statistics Center"],
        ["/awards/", "Player of the Match"],
        ["/lineup/#formation-builder", "Formation Builder"],
        ["/player-cards/", "Player Cards"],
        ["/depth-chart/", "Squad Depth Chart"],
        ["/standings/", "League Standings"],
        ["/reports/", "Match Reports"],
        ["/tournaments/", "Tournament Bracket"],
        ["/matchday/", "Matchday Lineup"]
      ];
      hubLinks.forEach(([href, label]) => {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        if (window.location.pathname.startsWith(href.split("#")[0]) && href.split("#")[0] !== "/") {
          link.setAttribute("aria-current", "page");
        }
        menu.append(link);
      });

      toggle.addEventListener("click", () => {
        const open = hub.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      hub.append(toggle, menu);
      const calendarLink = nav.querySelector('a[href="/calendar/"]') || matchLink;
      calendarLink.insertAdjacentElement("afterend", hub);
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
      const dropdown = nav.querySelector(".nav-dropdown");
      if (dropdown) {
        dropdown.classList.remove("open");
        dropdown.querySelector("button")?.setAttribute("aria-expanded", "false");
      }
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
      "Mark — Senior Goalkeeper — #1",
      "Kayden — CM — Central Midfielder — #5",
      "Brycen — RW — Captain — #10",
      "Tessa — LW — Forward — #9",
      "Ruffles — RW — Attacking Substitute — #6"
    ].join("\n");
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