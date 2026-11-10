(() => {
  const data = window.USA_MATCH_HUB || {};
  const byId = (id) => document.getElementById(id);
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value === null || value === undefined || value === "" ? "—" : String(value);
    return node;
  };
  const empty = (message) => text("div", message, "match-empty");
  const formatDate = (value, options = { year: "numeric", month: "long", day: "numeric" }) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return value || "Date TBA";
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, options);
  };
  const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const statusLabel = (status) => ({
    live: "LIVE",
    halftime: "HALF TIME",
    fulltime: "FULL TIME",
    scheduled: "UPCOMING",
    postponed: "POSTPONED",
    cancelled: "CANCELLED"
  }[String(status || "").toLowerCase()] || String(status || "STATUS TBA").toUpperCase());
  const playerPhotos = {
    Mark: "/assets/players/mark.png",
    Kayden: "/assets/players/kayden.png",
    Brycen: "/assets/players/brycen.png",
    Tessa: "/assets/players/tessa.png",
    Ruffles: "/assets/players/ruffles.png"
  };

  function eventLabel(event) {
    const type = String(event.type || "update").toLowerCase();
    const labels = { goal: "GOAL", "own-goal": "OWN GOAL", "yellow-card": "YELLOW CARD", "red-card": "RED CARD", substitution: "SUBSTITUTION", penalty: "PENALTY", note: "MATCH UPDATE" };
    return labels[type] || "MATCH UPDATE";
  }

  function renderLiveMatch() {
    const status = byId("live-match-status");
    const scoreboard = byId("live-scoreboard");
    const timeline = byId("live-timeline");
    const feedUpdated = byId("match-feed-updated");
    const match = data.liveMatch;

    if (feedUpdated) feedUpdated.textContent = data.lastUpdated || "Update time not supplied";
    if (!scoreboard || !timeline) return;

    scoreboard.replaceChildren();
    timeline.replaceChildren();

    if (!match) {
      scoreboard.append(empty("No live match is currently being reported. When a confirmed match begins, its scoreboard and match events will appear here."));
      timeline.append(empty("No live match events to display."));
      if (status) {
        status.textContent = "NO LIVE MATCH";
        status.classList.remove("is-live");
      }
      return;
    }

    const state = String(match.status || "scheduled").toLowerCase();
    if (status) {
      status.textContent = statusLabel(state);
      status.classList.toggle("is-live", state === "live");
    }

    const meta = text("div", [match.competition, formatDate(match.date), match.time, match.venue].filter(Boolean).join(" · "), "live-match-meta");
    const board = document.createElement("div");
    board.className = "live-score-board";
    const home = document.createElement("div");
    home.className = "live-score-team";
    const usaCrest = document.createElement("img");
    usaCrest.src = "/assets/crest.png";
    usaCrest.alt = "USA";
    home.append(usaCrest, text("strong", match.homeName || "USA"));
    const score = document.createElement("div");
    score.className = "live-score-numbers";
    score.append(text("strong", match.homeScore), text("span", ":"), text("strong", match.awayScore));
    const away = document.createElement("div");
    away.className = "live-score-team";
    const opponent = document.createElement("div");
    opponent.className = "live-opponent-mark";
    opponent.textContent = String(match.awayName || "OPP").slice(0, 3).toUpperCase();
    away.append(opponent, text("strong", match.awayName || "Opponent"));
    board.append(home, score, away);
    scoreboard.append(meta, board);

    if (match.clock) scoreboard.append(text("p", match.clock, "live-match-clock"));
    if (match.note) scoreboard.append(text("p", match.note, "live-match-note"));

    const events = Array.isArray(match.events) ? match.events : [];
    if (!events.length) {
      timeline.append(empty("No match events have been added yet."));
    } else {
      events.slice().reverse().forEach((event) => {
        const row = document.createElement("article");
        row.className = "match-timeline-row";
        row.append(text("strong", event.minute ? String(event.minute) + "'" : "—", "match-event-minute"));
        const detail = document.createElement("div");
        detail.append(text("span", eventLabel(event), "match-event-type"));
        detail.append(text("h3", event.player || event.team || "Match update"));
        if (event.detail) detail.append(text("p", event.detail));
        row.append(detail);
        timeline.append(row);
      });
    }
  }

  function renderMatchLists() {
    const fixtureList = byId("fixture-list");
    const resultList = byId("result-list");

    if (fixtureList) {
      fixtureList.replaceChildren();
      const fixtures = Array.isArray(data.fixtures) ? data.fixtures.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))) : [];
      if (!fixtures.length) fixtureList.append(empty("No upcoming fixtures have been confirmed."));
      fixtures.forEach((fixture) => {
        const card = document.createElement("article");
        card.className = "match-list-card";
        card.append(text("span", statusLabel(fixture.status || "scheduled"), "match-state-label"));
        card.append(text("h3", fixture.opponent || "Opponent TBA"));
        card.append(text("p", [formatDate(fixture.date), fixture.time, fixture.competition].filter(Boolean).join(" · "), "match-list-meta"));
        if (fixture.venue) card.append(text("p", "Location: " + fixture.venue));
        fixtureList.append(card);
      });
    }

    if (resultList) {
      resultList.replaceChildren();
      const results = Array.isArray(data.results) ? data.results.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];
      if (!results.length) resultList.append(empty("No final scores have been published yet."));
      results.forEach((result) => {
        const card = document.createElement("article");
        card.className = "match-list-card result-card";
        card.append(text("span", "FINAL", "match-state-label"));
        card.append(text("h3", "USA " + result.usaScore + " – " + result.opponentScore + " " + (result.opponent || "Opponent")));
        card.append(text("p", [formatDate(result.date), result.competition].filter(Boolean).join(" · "), "match-list-meta"));
        if (result.reportId) {
          const link = document.createElement("a");
          link.href = "/reports/#" + encodeURIComponent(result.reportId);
          link.className = "feature-link";
          link.textContent = "READ MATCH REPORT →";
          card.append(link);
        }
        resultList.append(card);
      });
    }
  }

  function standingsValues(team) {
    const played = number(team.played);
    const won = number(team.won);
    const drawn = number(team.drawn);
    const lost = number(team.lost);
    const gf = number(team.goalsFor);
    const ga = number(team.goalsAgainst);
    return { played, won, drawn, lost, gf, ga, gd: gf - ga, points: won * 3 + drawn };
  }

  function renderStandings() {
    const body = byId("standings-body");
    const title = byId("standings-competition");
    const updated = byId("standings-updated");
    const emptyState = byId("standings-empty");
    if (title) title.textContent = data.standings?.competition || "Competition not announced";
    if (updated) updated.textContent = data.standings?.updated ? "Last updated: " + formatDate(data.standings.updated) : "No standings have been published";
    if (!body) return;
    body.replaceChildren();
    const teams = Array.isArray(data.standings?.teams) ? data.standings.teams.slice() : [];
    teams.sort((a, b) => {
      const av = standingsValues(a), bv = standingsValues(b);
      return bv.points - av.points || bv.gd - av.gd || bv.gf - av.gf || String(a.team).localeCompare(String(b.team));
    });
    teams.forEach((team, index) => {
      const values = standingsValues(team);
      const row = document.createElement("tr");
      row.append(text("td", String(index + 1), "standings-rank"));
      row.append(text("td", team.team || "Team"));
      [values.played, values.won, values.drawn, values.lost, values.gf, values.ga, values.gd, values.points].forEach((value) => row.append(text("td", value)));
      body.append(row);
    });
    if (emptyState) emptyState.hidden = teams.length > 0;
  }

  function renderReports() {
    const list = byId("reports-list");
    if (!list) return;
    list.replaceChildren();
    const reports = Array.isArray(data.reports) ? data.reports.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];
    if (!reports.length) {
      list.append(empty("No match reports have been published yet. Reports will appear here after matches are completed and reviewed."));
      return;
    }
    reports.forEach((report) => {
      const article = document.createElement("article");
      article.className = "panel match-report-card";
      article.id = String(report.id || "");
      article.append(text("div", [formatDate(report.date), report.competition].filter(Boolean).join(" · "), "match-list-meta"));
      article.append(text("h2", report.headline || ("USA vs " + (report.opponent || "Opponent"))));
      article.append(text("div", "USA " + report.usaScore + " – " + report.opponentScore + " " + (report.opponent || ""), "report-final-score"));
      if (report.summary) article.append(text("p", report.summary, "match-report-summary"));
      if (report.playerOfMatch) article.append(text("p", "PLAYER OF THE MATCH · " + report.playerOfMatch, "report-award"));
      const moments = Array.isArray(report.keyMoments) ? report.keyMoments : [];
      if (moments.length) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "MATCH HIGHLIGHTS";
        const list = document.createElement("ul");
        moments.forEach((moment) => list.append(text("li", moment)));
        details.append(summary, list);
        article.append(details);
      }
      list.append(article);
    });
  }

  function renderTournament() {
    const title = byId("tournament-name");
    const meta = byId("tournament-meta");
    const groups = byId("tournament-groups");
    const rounds = byId("tournament-rounds");
    if (!groups || !rounds) return;
    const tournament = data.tournament;
    groups.replaceChildren();
    rounds.replaceChildren();
    if (!tournament) {
      if (title) title.textContent = "No tournament announced";
      if (meta) meta.textContent = "Tournament details will appear here once confirmed.";
      groups.append(empty("No group-stage tables to show."));
      rounds.append(empty("No knockout bracket has been published."));
      return;
    }
    if (title) title.textContent = tournament.name || "Tournament";
    if (meta) meta.textContent = [tournament.season, tournament.status].filter(Boolean).join(" · ");
    const groupList = Array.isArray(tournament.groups) ? tournament.groups : [];
    if (!groupList.length) groups.append(empty("No group-stage tables have been entered."));
    groupList.forEach((group) => {
      const section = document.createElement("section");
      section.className = "panel tournament-group";
      section.append(text("h2", group.name || "Group"));
      const table = document.createElement("table");
      table.className = "records-table compact-table";
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      ["TEAM", "P", "W", "D", "L", "GD", "PTS"].forEach((value) => headRow.append(text("th", value)));
      thead.append(headRow);
      const tbody = document.createElement("tbody");
      (Array.isArray(group.teams) ? group.teams : []).slice().sort((a, b) => number(b.points) - number(a.points)).forEach((team) => {
        const v = standingsValues(team);
        const row = document.createElement("tr");
        [team.team, v.played, v.won, v.drawn, v.lost, v.gd, team.points ?? v.points].forEach((value) => row.append(text("td", value)));
        tbody.append(row);
      });
      table.append(thead, tbody);
      section.append(table);
      groups.append(section);
    });

    const roundList = Array.isArray(tournament.rounds) ? tournament.rounds : [];
    if (!roundList.length) rounds.append(empty("No knockout rounds have been published."));
    roundList.forEach((round) => {
      const section = document.createElement("section");
      section.className = "tournament-round";
      section.append(text("h2", round.name || "Round"));
      const cards = document.createElement("div");
      cards.className = "tournament-match-grid";
      (Array.isArray(round.matches) ? round.matches : []).forEach((match) => {
        const card = document.createElement("article");
        card.className = "panel tournament-match";
        card.append(text("span", statusLabel(match.status || "scheduled"), "match-list-meta"));
        const home = document.createElement("div");
        home.className = "tournament-team-line";
        home.append(text("strong", match.home || "TBA"));
        home.append(text("b", match.homeScore === null || match.homeScore === undefined ? "—" : match.homeScore));
        const away = document.createElement("div");
        away.className = "tournament-team-line";
        away.append(text("strong", match.away || "TBA"));
        away.append(text("b", match.awayScore === null || match.awayScore === undefined ? "—" : match.awayScore));
        card.append(home, away);
        if (match.date) card.append(text("p", formatDate(match.date), "match-list-meta"));
        cards.append(card);
      });
      section.append(cards);
      rounds.append(section);
    });
  }

  function renderMatchday() {
    const announcement = data.matchday;
    const title = byId("matchday-title");
    const meta = byId("matchday-meta");
    const status = byId("matchday-status");
    const starters = byId("matchday-starters");
    const substitutes = byId("matchday-substitutes");
    const note = byId("matchday-note");
    if (!starters || !substitutes) return;
    starters.replaceChildren();
    substitutes.replaceChildren();
    if (!announcement) {
      if (title) title.textContent = "LINEUP NOT ANNOUNCED";
      if (meta) meta.textContent = "The starting lineup will be published here after team staff confirm it for a specific match.";
      if (status) status.textContent = "AWAITING CONFIRMATION";
      starters.append(empty("No matchday starting lineup has been announced."));
      substitutes.append(empty("Substitute selections will appear here with the official announcement."));
      if (note) note.textContent = "The current squad page shows roster roles, not a confirmed lineup for an upcoming fixture.";
      return;
    }
    if (title) title.textContent = announcement.opponent ? "USA vs " + announcement.opponent : "USA MATCHDAY LINEUP";
    if (meta) meta.textContent = [announcement.competition, formatDate(announcement.date), announcement.kickoff, announcement.venue].filter(Boolean).join(" · ");
    if (status) status.textContent = statusLabel("scheduled") + (announcement.formation ? " · " + announcement.formation : "");
    const addPlayer = (target, player, substitute) => {
      const card = document.createElement("article");
      card.className = "matchday-player-card";
      const image = document.createElement("img");
      image.src = playerPhotos[player.name] || "";
      image.alt = player.name || "Player";
      card.append(image);
      const details = document.createElement("div");
      details.append(text("strong", player.name || "Player"));
      details.append(text("small", [player.position, player.number ? "#" + player.number : ""].filter(Boolean).join(" · ")));
      card.append(details);
      card.append(text("b", substitute ? "SUB" : "STARTER"));
      target.append(card);
    };
    (Array.isArray(announcement.starters) ? announcement.starters : []).forEach((player) => addPlayer(starters, player, false));
    (Array.isArray(announcement.substitutes) ? announcement.substitutes : []).forEach((player) => addPlayer(substitutes, player, true));
    if (note) note.textContent = announcement.note || "Official matchday selection published by team staff.";
  }

  const refresh = byId("refresh-match-feed");
  if (refresh) refresh.addEventListener("click", () => window.location.reload());

  renderLiveMatch();
  renderMatchLists();
  renderStandings();
  renderReports();
  renderTournament();
  renderMatchday();
})();
