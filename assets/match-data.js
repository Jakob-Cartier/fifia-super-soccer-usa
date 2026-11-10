/*
 * USA National Team match hub data.
 *
 * This is a static GitHub Pages feed. Update it with confirmed details and
 * commit the change. Visitors can refresh the page to see the latest deploy.
 * Never invent a fixture, score, live event, standings row, report, bracket,
 * or matchday selection. Keep unavailable pages/sections empty or null.
 *
 * Dates: YYYY-MM-DD. Scores and times should only be published when confirmed.
 *
 * DATA SHAPES (examples only — these are NOT real fixtures or results):
 *
 * liveMatch:
 * {
 *   status: "live", // live | halftime | fulltime | scheduled
 *   date: "YYYY-MM-DD", time: "7:00 PM ET", competition: "Competition",
 *   venue: "Roblox FIFA Super Soccer", homeName: "USA", awayName: "Opponent",
 *   homeScore: 0, awayScore: 0, clock: "32:15", note: "",
 *   events: [{ minute: "12", team: "USA", type: "goal", player: "Player",
 *              detail: "Confirmed event description" }]
 * }
 *
 * fixtures: [{ id, date, time, competition, opponent, venue, status }]
 * results: [{ id, date, competition, opponent, usaScore, opponentScore, reportId }]
 *
 * standings:
 * {
 *   competition: "Competition name", updated: "YYYY-MM-DD",
 *   teams: [{ team, played, won, drawn, lost, goalsFor, goalsAgainst }]
 * }
 * Points are calculated automatically: 3 for a win, 1 for a draw.
 *
 * reports: [{
 *   id, date, competition, opponent, usaScore, opponentScore,
 *   headline, summary, playerOfMatch, keyMoments: ["Confirmed moment"]
 * }]
 *
 * tournament:
 * {
 *   name, season, status,
 *   groups: [{ name, teams: [{ team, played, won, drawn, lost,
 *                              goalsFor, goalsAgainst, points }] }],
 *   rounds: [{ name, matches: [{ home, away, homeScore, awayScore,
 *                                  status, winner, date }] }]
 * }
 *
 * matchday:
 * {
 *   status: "announced", opponent, competition, date, kickoff, venue,
 *   formation, starters: [{ name, position, number }],
 *   substitutes: [{ name, position, number }], note
 * }
 *
 * After editing this file, increase the match-data.js query version in the
 * five Match Hub pages so browsers request the new published data.
 */
window.USA_MATCH_HUB = {
  lastUpdated: "Awaiting first confirmed match update",
  liveMatch: null,
  fixtures: [],
  results: [],
  standings: {
    competition: "",
    updated: "",
    teams: []
  },
  reports: [],
  tournament: null,
  matchday: null
};
