(() => {
  const records = window.USA_TEAM_RECORDS || { stats: [], awards: [], matchesRecorded: 0 };
  const statsBody = document.querySelector("#stats-table-body");
  const statNote = document.querySelector("#stats-note");
  const matchCount = document.querySelector("#matches-recorded");
  const awardList = document.querySelector("#awards-list");
  const awardCount = document.querySelector("#awards-count");

  const addCell = (row, value, className = "") => {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = value === null || value === undefined || value === "" ? "—" : String(value);
    row.append(cell);
  };

  if (statsBody) {
    statsBody.replaceChildren();
    (Array.isArray(records.stats) ? records.stats : []).forEach((player) => {
      const row = document.createElement("tr");
      addCell(row, player.name || "Unknown", "stats-player");
      addCell(row, player.position || "—");
      addCell(row, player.number ? "#" + player.number : "—");
      addCell(row, player.appearances);
      addCell(row, player.goals);
      addCell(row, player.assists);
      addCell(row, player.saves);
      addCell(row, player.cleanSheets);
      addCell(row, player.rating === null || player.rating === undefined ? "—" : Number(player.rating).toFixed(1));
      statsBody.append(row);
    });
    const hasRecordedStats = (records.stats || []).some((player) =>
      ["appearances", "goals", "assists", "saves", "cleanSheets", "rating"]
        .some((key) => player[key] !== null && player[key] !== undefined)
    );
    if (statNote) {
      statNote.textContent = hasRecordedStats
        ? "Only values entered from verified match records are shown. A dash means no verified value has been entered."
        : "No verified match statistics have been entered yet. Player totals will appear here after match records are confirmed. A dash does not mean zero.";
    }
  }

  if (matchCount) {
    matchCount.textContent = Number.isFinite(records.matchesRecorded) && records.matchesRecorded > 0
      ? String(records.matchesRecorded)
      : "—";
  }

  if (awardList) {
    awardList.replaceChildren();
    const awards = Array.isArray(records.awards) ? records.awards.slice() : [];
    awards.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    if (awardCount) awardCount.textContent = String(awards.length);
    if (!awards.length) {
      const empty = document.createElement("div");
      empty.className = "records-empty";
      empty.textContent = "No Player of the Match awards have been recorded yet. The archive will appear here after the first confirmed match and award.";
      awardList.append(empty);
    } else {
      awards.forEach((award) => {
        const card = document.createElement("article");
        card.className = "award-card";
        const top = document.createElement("div");
        top.className = "award-card-top";
        top.textContent = [award.date, award.opponent ? "vs " + award.opponent : ""].filter(Boolean).join(" · ");
        const trophy = document.createElement("div");
        trophy.className = "award-trophy";
        trophy.textContent = "★";
        const heading = document.createElement("h2");
        heading.textContent = award.player || "Award winner";
        const position = document.createElement("div");
        position.className = "award-position";
        position.textContent = award.position || "USA National Team";
        card.append(top, trophy, heading, position);
        if (award.score) {
          const score = document.createElement("p");
          score.className = "award-score";
          score.textContent = "FINAL SCORE · " + award.score;
          card.append(score);
        }
        if (award.reason) {
          const reason = document.createElement("p");
          reason.className = "award-reason";
          reason.textContent = award.reason;
          card.append(reason);
        }
        awardList.append(card);
      });
    }
  }
})();
