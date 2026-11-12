(() => {
  const body = document.body;

  // Scheduled three-stage launch gate. Times are fixed to Eastern Time in November 2026.
  const launchStart = Date.parse("2026-11-12T03:30:00Z"); // Nov 11, 10:30 PM EST
  const previewEnd = Date.parse("2026-11-12T03:40:00Z"); // Nov 11, 10:40 PM EST
  const fullRelease = Date.parse("2026-11-12T20:45:00Z"); // Nov 12, 3:45 PM EST

  function installLaunchGate() {
    if (document.querySelector(".launch-gate")) return;

    // Eastern Standard Time (UTC-5): Nov 11 preview 10:50-11:00 PM;
    // full website release Nov 12 at 6:00 PM EST.
    const launchStart = Date.parse("2026-11-12T03:50:00Z");
    const previewEnd = Date.parse("2026-11-12T04:00:00Z");
    const fullRelease = Date.parse("2026-11-12T23:00:00Z");
    const allowedTeaserPaths = new Set(["/", "/squad/", "/lineup/", "/about/"]);

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
        <div class="launch-count-label">SNEAK PEEK OPENS IN</div>
        <div class="launch-countdown" aria-live="off">
          <div><b data-count-days>00</b><span>DAYS</span></div>
          <div><b data-count-hours>00</b><span>HOURS</span></div>
          <div><b data-count-minutes>00</b><span>MINUTES</span></div>
          <div><b data-count-seconds>00</b><span>SECONDS</span></div>
        </div>
        <div class="launch-progress"><span></span></div>
        <div class="launch-foot"><span>ONE TEAM. ONE NATION.</span><span>EST. FOR THE GAME</span></div>
      </div>`;
    document.body.append(gate);

    const lockedNodes = Array.from(document.body.children)
      .filter((node) => node !== gate)
      .map((node) => ({
        node,
        wasInert: node.inert,
        hadAriaHidden: node.hasAttribute("aria-hidden"),
        ariaHidden: node.getAttribute("aria-hidden")
      }));
    const pad = (n) => String(n).padStart(2, "0");
    const countdown = gate.querySelector(".launch-countdown");
    const heading = gate.querySelector(".launch-title");
    const message = gate.querySelector(".launch-message");
    const label = gate.querySelector(".launch-count-label");
    const progress = gate.querySelector(".launch-progress");
    let mode = "";
    let pageLock = null;
    let pageLockSaved = [];

    function normalizePath(path) {
      if (!path || path === "/") return "/";
      return path.endsWith("/") ? path : path + "/";
    }
    function isTeaserRestrictedPath(path) {
      return !allowedTeaserPaths.has(normalizePath(path));
    }
    function blockTeaserLink(event) {
      if (event.currentTarget.dataset.teaserLocked === "true") {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
    function setTeaserLocks(enabled) {
      document.querySelectorAll("a[href]").forEach((item) => {
        let url;
        try { url = new URL(item.href, window.location.href); } catch (_) { return; }
        if (url.origin !== window.location.origin) return;

        const restricted = enabled && isTeaserRestrictedPath(url.pathname);
        item.classList.toggle("teaser-restricted", restricted);
        if (restricted) {
          item.setAttribute("aria-disabled", "true");
          item.dataset.teaserLocked = "true";
          item.addEventListener("click", blockTeaserLink, true);
        } else {
          item.removeAttribute("aria-disabled");
          delete item.dataset.teaserLocked;
          item.removeEventListener("click", blockTeaserLink, true);
        }
      });
    }
    function setTeaserPageLock(enabled) {
      const shouldLock = enabled && isTeaserRestrictedPath(window.location.pathname);
      if (!shouldLock) {
        if (pageLock) {
          pageLockSaved.forEach(({ node, inert, hadAriaHidden, ariaHidden }) => {
            if (!node.isConnected) return;
            node.inert = inert;
            if (hadAriaHidden) node.setAttribute("aria-hidden", ariaHidden);
            else node.removeAttribute("aria-hidden");
          });
          pageLock.remove();
          pageLock = null;
          pageLockSaved = [];
        }
        body.classList.remove("teaser-page-locked");
        return;
      }
      if (pageLock) return;

      pageLock = document.createElement("section");
      pageLock.className = "teaser-page-lock";
      pageLock.setAttribute("role", "dialog");
      pageLock.setAttribute("aria-modal", "true");
      pageLock.setAttribute("aria-label", "Feature locked until full website release");
      pageLock.innerHTML = `
        <div class="teaser-page-lock-card">
          <div class="teaser-page-lock-icon" aria-hidden="true">🔒</div>
          <div class="teaser-page-lock-kicker">LIMITED SNEAK PEEK ACCESS</div>
          <h1>THIS AREA IS<br><em>LOCKED.</em></h1>
          <p>This section will become available with the full USA National Team website release.</p>
          <div class="teaser-page-lock-time">FULL RELEASE · NOVEMBER 12 · 6:00 PM EST</div>
          <a href="/" class="teaser-return-link">RETURN TO SNEAK PEEK</a>
        </div>`;
      pageLockSaved = Array.from(document.body.children).map((node) => ({
        node,
        inert: node.inert,
        hadAriaHidden: node.hasAttribute("aria-hidden"),
        ariaHidden: node.getAttribute("aria-hidden")
      }));
      document.body.append(pageLock);
      pageLockSaved.forEach(({ node }) => {
        node.inert = true;
        node.setAttribute("aria-hidden", "true");
      });
      body.classList.add("teaser-page-locked");
      pageLock.tabIndex = -1;
      pageLock.focus({ preventScroll: true });
    }
    function lockPage() {
      lockedNodes.forEach(({ node }) => {
        node.inert = true;
        node.setAttribute("aria-hidden", "true");
      });
      document.documentElement.classList.add("launch-locked");
      body.classList.add("launch-locked");
      gate.style.display = "grid";
      gate.tabIndex = -1;
      gate.focus({ preventScroll: true });
    }
    function unlockPage() {
      lockedNodes.forEach(({ node, wasInert, hadAriaHidden, ariaHidden }) => {
        node.inert = wasInert;
        if (hadAriaHidden) node.setAttribute("aria-hidden", ariaHidden);
        else node.removeAttribute("aria-hidden");
      });
      document.documentElement.classList.remove("launch-locked");
      body.classList.remove("launch-locked");
    }
    function updateCountdown(ms) {
      const seconds = Math.max(0, Math.floor(ms / 1000));
      gate.querySelector("[data-count-days]").textContent = pad(Math.floor(seconds / 86400));
      gate.querySelector("[data-count-hours]").textContent = pad(Math.floor((seconds % 86400) / 3600));
      gate.querySelector("[data-count-minutes]").textContent = pad(Math.floor((seconds % 3600) / 60));
      gate.querySelector("[data-count-seconds]").textContent = pad(seconds % 60);
    }
    function tick() {
      const now = Date.now();
      if (now >= fullRelease) {
        setTeaserPageLock(false);
        setTeaserLocks(false);
        body.classList.remove("teaser-unlocked");
        unlockPage();
        gate.classList.add("launch-gate-exit");
        window.setTimeout(() => gate.remove(), 850);
        window.clearInterval(timer);
        return;
      }

      if (now >= launchStart && now < previewEnd) {
        if (mode !== "teaser") {
          mode = "teaser";
          unlockPage();
          gate.style.display = "none";
          body.classList.add("teaser-unlocked");
        }
        // Reapply on each tick so nav links created later by site.js are restricted too.
        setTeaserLocks(true);
        setTeaserPageLock(true);
        return;
      }

      if (mode !== "locked") {
        mode = "locked";
        setTeaserPageLock(false);
        setTeaserLocks(false);
        body.classList.remove("teaser-unlocked");
        lockPage();
      }
      if (now < launchStart) {
        heading.innerHTML = "A NEW ERA<br><em>IS COMING.</em>";
        message.textContent = "The next chapter of the USA National Team is almost ready.";
        label.textContent = "SNEAK PEEK OPENS IN";
        countdown.setAttribute("aria-label", "Countdown to sneak peek");
        updateCountdown(launchStart - now);
        progress.style.setProperty("--progress", Math.max(0, Math.min(100, (now / launchStart) * 100)) + "%");
      } else {
        heading.innerHTML = "THE FULL<br><em>REVEAL AWAITS.</em>";
        message.textContent = "The sneak peek has closed. The complete website opens November 12 at 6:00 PM EST.";
        label.textContent = "FULL WEBSITE RELEASE IN";
        countdown.setAttribute("aria-label", "Countdown to full website release");
        updateCountdown(fullRelease - now);
        progress.style.setProperty("--progress", Math.max(0, Math.min(100, ((now - previewEnd) / (fullRelease - previewEnd)) * 100)) + "%");
      }
    }
    lockPage();
    const timer = window.setInterval(tick, 200);
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