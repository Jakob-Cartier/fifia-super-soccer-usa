(() => {
  "use strict";

  const STORAGE_KEY = "usa-national-staff-draft-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const slug = (value) => String(value || "record").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 38) || "record";
  const makeId = (prefix, label) => prefix + "-" + slug(label) + "-" + Date.now().toString(36);
  const numberOrNull = (value, decimal = false) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = decimal ? Number.parseFloat(value) : Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const defaults = {
    events: Array.isArray(window.USA_TEAM_EVENTS) ? clone(window.USA_TEAM_EVENTS) : [],
    records: window.USA_TEAM_RECORDS ? clone(window.USA_TEAM_RECORDS) : { seasonLabel: "Team records", matchesRecorded: 0, stats: [], awards: [] },
    matches: window.USA_MATCH_HUB ? clone(window.USA_MATCH_HUB) : {}
  };
  defaults.records.stats = Array.isArray(defaults.records.stats) ? defaults.records.stats : [];
  defaults.records.awards = Array.isArray(defaults.records.awards) ? defaults.records.awards : [];
  defaults.matches.fixtures = Array.isArray(defaults.matches.fixtures) ? defaults.matches.fixtures : [];
  defaults.matches.results = Array.isArray(defaults.matches.results) ? defaults.matches.results : [];

  let state = clone(defaults);
  let toastTimer = null;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.events) && saved.records && saved.matches) {
      state = saved;
      state.records.stats = Array.isArray(state.records.stats) ? state.records.stats : [];
      state.records.awards = Array.isArray(state.records.awards) ? state.records.awards : [];
      state.matches.fixtures = Array.isArray(state.matches.fixtures) ? state.matches.fixtures : [];
      state.matches.results = Array.isArray(state.matches.results) ? state.matches.results : [];
    }
  } catch (_) {
    showToast("Saved browser draft could not be read. Published data is loaded instead.", true);
  }

  function showToast(message, isError = false) {
    const node = $("#staff-toast");
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", isError);
    node.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("is-visible"), 3200);
  }

  function persist(message = "Draft saved in this browser.") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      showToast(message);
      renderOverview();
    } catch (_) {
      showToast("Could not save this draft. Browser storage may be full or disabled.", true);
    }
  }

  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return value || "Date not set";
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function renderOverview() {
    $("#metric-events").textContent = String(state.events.length);
    $("#metric-players").textContent = String(state.records.stats.length);
    $("#metric-awards").textContent = String(state.records.awards.length);
    $("#metric-matches").textContent = state.matches.fixtures.length + " / " + state.matches.results.length;
    const target = $("#overview-events");
    target.replaceChildren();
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = state.events.filter((event) => String(event.date || "") >= today)
      .sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 5);
    if (!upcoming.length) {
      target.innerHTML = '<div class="staff-empty">No upcoming events are in the current draft.</div>';
      return;
    }
    upcoming.forEach((event) => {
      const row = document.createElement("div");
      row.className = "staff-compact-row";
      row.innerHTML = '<div><strong>' + escapeHTML(event.title) + '</strong><small>' +
        escapeHTML(formatDate(event.date)) + (event.time ? " · " + escapeHTML(event.time) : "") +
        '</small></div><span>' + escapeHTML(event.type || "Team event") + '</span>';
      target.append(row);
    });
  }

  function renderEvents() {
    const list = $("#event-list");
    list.replaceChildren();
    $("#events-total").textContent = state.events.length + " EVENTS";
    const events = state.events.slice().sort((a, b) =>
      String(a.date || "").localeCompare(String(b.date || "")) || String(a.title || "").localeCompare(String(b.title || "")));
    if (!events.length) {
      list.innerHTML = '<div class="staff-empty">No team events yet. Add the first confirmed practice, match or activity above.</div>';
      return;
    }
    events.forEach((event) => {
      const row = document.createElement("article");
      row.className = "staff-record-row";
      row.innerHTML = '<div class="staff-record-date"><b>' + escapeHTML(formatDate(event.date)) + '</b><span>' +
        escapeHTML(event.time || "TIME TBA") + '</span></div><div class="staff-record-main"><strong>' +
        escapeHTML(event.title) + '</strong><small>' + escapeHTML(event.type || "Team event") +
        (event.location ? " · " + escapeHTML(event.location) : "") + '</small>' +
        (event.description ? '<p>' + escapeHTML(event.description) + '</p>' : '') +
        '</div><button type="button" class="staff-remove-button" data-remove-event="' +
        escapeHTML(event.id) + '" aria-label="Remove ' + escapeHTML(event.title) + '">REMOVE</button>';
      list.append(row);
    });
  }

  function renderPlayers() {
    const list = $("#player-list");
    list.replaceChildren();
    $("#players-total").textContent = state.records.stats.length + " PLAYERS";
    if (!state.records.stats.length) {
      list.innerHTML = '<div class="staff-empty">No player records exist. Add a player record above.</div>';
      return;
    }
    state.records.stats.forEach((player) => {
      const stats = ["appearances", "goals", "assists", "saves", "cleanSheets", "rating"]
        .map((key) => (player[key] === null || player[key] === undefined || player[key] === "") ? "—" : player[key])
        .join("  /  ");
      const row = document.createElement("article");
      row.className = "staff-record-row";
      row.innerHTML = '<div class="staff-record-number">#' + escapeHTML(player.number || "—") + '</div>' +
        '<div class="staff-record-main"><strong>' + escapeHTML(player.name) + '</strong><small>' +
        escapeHTML(player.position || "Position not set") + '</small><p class="staff-stat-line">Apps / Goals / Assists / Saves / Clean sheets / Rating: ' +
        escapeHTML(stats) + '</p></div><div class="staff-row-actions"><button type="button" class="staff-edit-button" data-edit-player="' +
        escapeHTML(player.id) + '">EDIT</button><button type="button" class="staff-remove-button" data-remove-player="' +
        escapeHTML(player.id) + '">REMOVE</button></div>';
      list.append(row);
    });
  }

  function renderAwards() {
    const list = $("#award-list");
    list.replaceChildren();
    $("#awards-total").textContent = state.records.awards.length + " AWARDS";
    if (!state.records.awards.length) {
      list.innerHTML = '<div class="staff-empty">No awards have been confirmed yet.</div>';
      return;
    }
    state.records.awards.forEach((award, index) => {
      const row = document.createElement("article");
      row.className = "staff-record-row";
      row.innerHTML = '<div class="staff-record-number staff-award-star">★</div><div class="staff-record-main"><strong>' +
        escapeHTML(award.player || "Award winner") + '</strong><small>' +
        escapeHTML(formatDate(award.date)) + (award.opponent ? " · vs " + escapeHTML(award.opponent) : "") +
        '</small><p>' + escapeHTML(award.reason || award.position || "Player of the Match") + '</p></div>' +
        '<button type="button" class="staff-remove-button" data-remove-award="' + index + '">REMOVE</button>';
      list.append(row);
    });
  }

  function renderMatches() {
    const fixtures = $("#fixture-list");
    const results = $("#result-list");
    fixtures.replaceChildren();
    results.replaceChildren();
    $("#fixtures-total").textContent = state.matches.fixtures.length + " FIXTURES";
    $("#results-total").textContent = state.matches.results.length + " RESULTS";
    if (!state.matches.fixtures.length) fixtures.innerHTML = '<div class="staff-empty">No confirmed fixtures scheduled.</div>';
    state.matches.fixtures.forEach((fixture) => {
      const row = document.createElement("article");
      row.className = "staff-record-row";
      row.innerHTML = '<div class="staff-record-date"><b>' + escapeHTML(formatDate(fixture.date)) +
        '</b><span>' + escapeHTML(fixture.time || "KICKOFF TBA") + '</span></div><div class="staff-record-main"><strong>USA vs ' +
        escapeHTML(fixture.opponent) + '</strong><small>' + escapeHTML(fixture.competition || "Competition TBA") +
        " · " + escapeHTML(fixture.status || "scheduled") + '</small><p>' + escapeHTML(fixture.venue || "Venue TBA") +
        '</p></div><button type="button" class="staff-remove-button" data-remove-fixture="' +
        escapeHTML(fixture.id) + '">REMOVE</button>';
      fixtures.append(row);
    });
    if (!state.matches.results.length) results.innerHTML = '<div class="staff-empty">No final results published.</div>';
    state.matches.results.forEach((result) => {
      const row = document.createElement("article");
      row.className = "staff-record-row";
      row.innerHTML = '<div class="staff-record-date"><b>' + escapeHTML(formatDate(result.date)) +
        '</b><span>FINAL</span></div><div class="staff-record-main"><strong>USA ' +
        escapeHTML(result.usaScore) + ' – ' + escapeHTML(result.opponentScore) + ' ' + escapeHTML(result.opponent) +
        '</strong><small>' + escapeHTML(result.competition || "Competition not set") + '</small></div>' +
        '<button type="button" class="staff-remove-button" data-remove-result="' + escapeHTML(result.id) + '">REMOVE</button>';
      results.append(row);
    });
  }

  function renderJsonEditors() {
    $("#records-json-editor").value = JSON.stringify(state.records, null, 2);
    $("#match-json-editor").value = JSON.stringify(state.matches, null, 2);
  }

  function renderAll() {
    renderOverview();
    renderEvents();
    renderPlayers();
    renderAwards();
    renderMatches();
    renderJsonEditors();
  }

  function setActiveTab(name) {
    document.querySelectorAll(".staff-tab").forEach((button) => {
      const active = button.dataset.tab === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    document.querySelectorAll(".staff-view").forEach((view) => {
      view.classList.toggle("is-active", view.dataset.view === name);
    });
  }

  document.querySelectorAll(".staff-tab").forEach((button) =>
    button.addEventListener("click", () => setActiveTab(button.dataset.tab)));
  document.querySelectorAll("[data-open-tab]").forEach((button) =>
    button.addEventListener("click", () => setActiveTab(button.dataset.openTab)));

  $("#event-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const date = String(form.get("date") || "");
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return showToast("Enter an event title and valid date.", true);
    const url = String(form.get("url") || "").trim();
    if (url && !/^https:\/\//i.test(url)) return showToast("Event links must use HTTPS.", true);
    state.events.push({
      id: makeId("event", date + "-" + title),
      date,
      title,
      time: String(form.get("time") || "").trim(),
      type: String(form.get("type") || "Team event"),
      description: String(form.get("description") || "").trim(),
      location: String(form.get("location") || "").trim(),
      url
    });
    event.currentTarget.reset();
    persist("Team event added to the local draft.");
    renderEvents();
  });

  $("#player-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    if (!name) return showToast("Enter the player name.", true);
    const id = String(form.get("id") || slug(name));
    const player = {
      id, name,
      position: String(form.get("position") || "").trim(),
      number: String(form.get("number") || "").trim(),
      appearances: numberOrNull(form.get("appearances")),
      goals: numberOrNull(form.get("goals")),
      assists: numberOrNull(form.get("assists")),
      saves: numberOrNull(form.get("saves")),
      cleanSheets: numberOrNull(form.get("cleanSheets")),
      rating: numberOrNull(form.get("rating"), true)
    };
    const existing = state.records.stats.findIndex((item) => item.id === id);
    if (existing >= 0) state.records.stats[existing] = player;
    else state.records.stats.push(player);
    event.currentTarget.reset();
    $("#player-form [name=id]").value = "";
    $("#player-submit").innerHTML = "SAVE PLAYER RECORD <span>＋</span>";
    $("#player-cancel").hidden = true;
    persist(existing >= 0 ? "Player record updated in the local draft." : "Player record added to the local draft.");
    renderPlayers();
    renderJsonEditors();
  });

  $("#player-cancel").addEventListener("click", () => {
    $("#player-form").reset();
    $("#player-submit").innerHTML = "SAVE PLAYER RECORD <span>＋</span>";
    $("#player-cancel").hidden = true;
  });

  $("#award-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const player = String(form.get("player") || "").trim();
    const date = String(form.get("date") || "");
    if (!player || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return showToast("Enter a winner and match date.", true);
    state.records.awards.push({
      date,
      opponent: String(form.get("opponent") || "").trim(),
      player,
      position: String(form.get("position") || "").trim(),
      score: String(form.get("score") || "").trim(),
      reason: String(form.get("reason") || "").trim()
    });
    event.currentTarget.reset();
    persist("Award added to the local draft.");
    renderAwards();
    renderJsonEditors();
  });

  $("#fixture-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const opponent = String(form.get("opponent") || "").trim();
    const date = String(form.get("date") || "");
    if (!opponent || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return showToast("Enter an opponent and valid fixture date.", true);
    state.matches.fixtures.push({
      id: makeId("fixture", date + "-" + opponent),
      date,
      time: String(form.get("time") || "").trim(),
      competition: String(form.get("competition") || "").trim(),
      opponent,
      venue: String(form.get("venue") || "").trim(),
      status: String(form.get("status") || "scheduled")
    });
    event.currentTarget.reset();
    persist("Fixture added to the local draft.");
    renderMatches();
    renderJsonEditors();
  });

  $("#result-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const opponent = String(form.get("opponent") || "").trim();
    const date = String(form.get("date") || "");
    if (!opponent || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return showToast("Enter an opponent and valid result date.", true);
    state.matches.results.push({
      id: makeId("result", date + "-" + opponent),
      date,
      competition: String(form.get("competition") || "").trim(),
      opponent,
      usaScore: Number.parseInt(form.get("usaScore"), 10),
      opponentScore: Number.parseInt(form.get("opponentScore"), 10),
      reportId: String(form.get("reportId") || "").trim()
    });
    event.currentTarget.reset();
    persist("Final result added to the local draft.");
    renderMatches();
    renderJsonEditors();
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.removeEvent) {
      state.events = state.events.filter((item) => item.id !== button.dataset.removeEvent);
      persist("Event removed from the local draft."); renderEvents(); renderJsonEditors();
    } else if (button.dataset.editPlayer) {
      const player = state.records.stats.find((item) => item.id === button.dataset.editPlayer);
      if (!player) return;
      const form = $("#player-form");
      Object.entries(player).forEach(([key, value]) => {
        const input = form.elements.namedItem(key);
        if (input) input.value = value ?? "";
      });
      $("#player-submit").innerHTML = "UPDATE PLAYER RECORD <span>↻</span>";
      $("#player-cancel").hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (button.dataset.removePlayer) {
      state.records.stats = state.records.stats.filter((item) => item.id !== button.dataset.removePlayer);
      persist("Player record removed from the local draft."); renderPlayers(); renderJsonEditors();
    } else if (button.dataset.removeAward !== undefined) {
      state.records.awards.splice(Number(button.dataset.removeAward), 1);
      persist("Award removed from the local draft."); renderAwards(); renderJsonEditors();
    } else if (button.dataset.removeFixture) {
      state.matches.fixtures = state.matches.fixtures.filter((item) => item.id !== button.dataset.removeFixture);
      persist("Fixture removed from the local draft."); renderMatches(); renderJsonEditors();
    } else if (button.dataset.removeResult) {
      state.matches.results = state.matches.results.filter((item) => item.id !== button.dataset.removeResult);
      persist("Result removed from the local draft."); renderMatches(); renderJsonEditors();
    }
  });

  function applyJSONEditor(selector, target, label) {
    try {
      const parsed = JSON.parse($(selector).value);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Expected a JSON object.");
      if (target === "records" && (!Array.isArray(parsed.stats) || !Array.isArray(parsed.awards))) {
        throw new Error("Records must include stats and awards arrays.");
      }
      if (target === "matches" && (!Array.isArray(parsed.fixtures) || !Array.isArray(parsed.results))) {
        throw new Error("Match data must include fixtures and results arrays.");
      }
      state[target] = parsed;
      if (target === "records") {
        state.records.matchesRecorded = numberOrNull(state.records.matchesRecorded) ?? 0;
      }
      persist(label + " applied to the local draft.");
      renderAll();
    } catch (error) {
      showToast("JSON not applied: " + error.message, true);
    }
  }

  function formatJSON(selector) {
    try {
      const parsed = JSON.parse($(selector).value);
      $(selector).value = JSON.stringify(parsed, null, 2);
      showToast("JSON formatting checked.");
    } catch (error) {
      showToast("Invalid JSON: " + error.message, true);
    }
  }

  $("#apply-records-json").addEventListener("click", () => applyJSONEditor("#records-json-editor", "records", "Player records"));
  $("#apply-match-json").addEventListener("click", () => applyJSONEditor("#match-json-editor", "matches", "Match data"));
  $("#format-records-json").addEventListener("click", () => formatJSON("#records-json-editor"));
  $("#format-match-json").addEventListener("click", () => formatJSON("#match-json-editor"));

  function downloadFile(filename, content, type = "text/javascript") {
    const blob = new Blob([content], { type: type + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportSource(type) {
    if (type === "events") {
      downloadFile("events.js", "/* Published by USA National Team Staff Workspace. */\nwindow.USA_TEAM_EVENTS = " + JSON.stringify(state.events, null, 2) + ";\n");
    } else if (type === "records") {
      downloadFile("records.js", "/* Published by USA National Team Staff Workspace. */\nwindow.USA_TEAM_RECORDS = " + JSON.stringify(state.records, null, 2) + ";\n");
    } else if (type === "matches") {
      downloadFile("match-data.js", "/* Published by USA National Team Staff Workspace. */\nwindow.USA_MATCH_HUB = " + JSON.stringify(state.matches, null, 2) + ";\n");
    }
    showToast("Export ready. Commit the downloaded file to assets/ in GitHub.");
  }
  document.querySelectorAll("[data-export]").forEach((button) =>
    button.addEventListener("click", () => exportSource(button.dataset.export)));

  $("#export-pack").addEventListener("click", () => {
    const pack = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      events: state.events,
      records: state.records,
      matches: state.matches
    };
    downloadFile("usa-national-team-staff-backup.json", JSON.stringify(pack, null, 2), "application/json");
    showToast("Full backup downloaded.");
  });

  $("#import-pack").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        if (!Array.isArray(parsed.events) || !parsed.records || !parsed.matches) {
          throw new Error("Backup must include events, records and matches.");
        }
        state = {
          events: parsed.events,
          records: parsed.records,
          matches: parsed.matches
        };
        state.records.stats = Array.isArray(state.records.stats) ? state.records.stats : [];
        state.records.awards = Array.isArray(state.records.awards) ? state.records.awards : [];
        state.matches.fixtures = Array.isArray(state.matches.fixtures) ? state.matches.fixtures : [];
        state.matches.results = Array.isArray(state.matches.results) ? state.matches.results : [];
        persist("Backup imported into this browser's local draft.");
        renderAll();
      } catch (error) {
        showToast("Backup not imported: " + error.message, true);
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = () => showToast("Could not read the selected backup file.", true);
    reader.readAsText(file);
  });

  $("#reset-draft").addEventListener("click", () => {
    if (!window.confirm("Reset this browser's draft and reload the published website data? This cannot be undone.")) return;
    state = clone(defaults);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* Ignore unavailable browser storage. */ }
    renderAll();
    showToast("Local draft reset to the published data.");
  });

  renderAll();
  const currentTab = new URLSearchParams(window.location.search).get("tab");
  if (["overview", "events", "records", "matches", "publish"].includes(currentTab)) setActiveTab(currentTab);
})();