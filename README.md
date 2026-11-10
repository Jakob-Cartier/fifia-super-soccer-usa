# USA National Team — Roblox FIFA Super Soccer

A responsive, multi-page website for the custom USA National Team in Roblox FIFA Super Soccer.

## Website pages

- / — Home
- /squad/ — Player profiles, headshots, roles, numbers, and descriptions
- /lineup/ — Starting group and substitute bench
- /matches/ — Live match center, scoreboard, fixtures, and results
- /standings/ — Competition table and league standings
- /reports/ — Match reports and highlights archive
- /tournaments/ — Group tables and knockout brackets
- /matchday/ — Official matchday lineup announcement and printable team sheet
- /calendar/ — Interactive monthly calendar and upcoming team events
- /stats/ — Player statistics center
- /awards/ — Player of the Match award archive
- /lineup/#formation-builder — Interactive formation builder
- /player-cards/ — Collectible-style roster card gallery
- /depth-chart/ — Current squad position coverage
- /about/ — Team purpose, Roblox expectations, and membership information
- /apply/ — Player application form
- /support/ — Website support and Tawk.to live chat

Each section is a folder with its own index.html, so page URLs do not end in .html.

## Team roster

| Player | Position | Role | Number | Team duty |
|---|---|---|---:|---|
| Mark | GK | Senior Goalkeeper | TBD | Starter |
| Kayden | CM | Central Midfielder | 5 | Starter |
| Brycen | RW | Forward | 10 | Captain |
| Tessa | LW | Forward | 9 | Starter |
| Ruffles | RW | Right-wing attacking substitute | 6 | Substitute |

Mark is listed as the senior goalkeeper. His squad number has not yet been assigned. Player portraits are stored in `assets/players/` as lowercase PNG files. Mark's portrait is `mark.png`. Player descriptions are position-based and do not claim unconfirmed statistics or achievements.

## Player application form

The application form is on /apply/. It collects a Roblox username and game-related details only. It does not ask for a real name, personal email address, phone number, age, school, or home address.

Email delivery uses Formspree's basic HTML form integration. The form posts directly to the team's Formspree endpoint using a normal browser POST, without a JavaScript fetch/AJAX request. This avoids the browser-side network failure seen with the AJAX version. The receiving inbox remains private in the Formspree dashboard; do not put a personal receiving email address in this public repository.

By default, Formspree displays its own confirmation page after a successful submission. If the form's plan includes a custom thank-you redirect, the form owner can set `/apply/thanks/` as the redirect in Formspree's dashboard. The application form keeps a `_gotcha` honeypot field for spam filtering.

The application collects game-related information only. It does not ask applicants for their real name, age, personal email, phone number, school, or home address. A team moderator should review submissions and contact applicants only through an approved Roblox/team channel.

Formspree guides: https://help.formspree.io/articles/building-your-form/building-an-html-form and https://help.formspree.io/articles/form-and-project-settings/thank-you-redirect

## Team calendar and events

The interactive calendar is at `/calendar/`. It displays month navigation, selectable dates, selected-day details, and an upcoming-events list. Confirmed events are added to `assets/events.js` in the `window.USA_TEAM_EVENTS` array. Each event uses `id`, `date` (`YYYY-MM-DD`), `title`, and optional `time`, `type`, `description`, `location`, and secure `https://` `url` fields. Keep the array empty until events are confirmed; do not invent matches or practice times.

## Team statistics and awards

The statistics center and Player of the Match archive use `assets/records.js`. Update `window.USA_TEAM_RECORDS.stats` after match records have been checked. Each player record supports `appearances`, `goals`, `assists`, `saves`, `cleanSheets`, and `rating`. Leave unknown values as `null`; the site will display a dash. Do not enter made-up totals or use zero to mean "not recorded."

Add confirmed Player of the Match winners to `window.USA_TEAM_RECORDS.awards`. An award object supports `date`, `opponent`, `score`, `player`, `position`, and `reason`. Only publish an award after the team has confirmed the winner.

## Formation builder

The formation builder is part of `/lineup/`. Visitors can preview three outfield shapes and assign the three available outfield slots to Kayden, Brycen, Tessa, or Ruffles. Mark remains fixed in goal. It is a local preview only; changing the formation does not change or save the official lineup.

## Player cards and squad depth

The player card gallery and squad depth chart use the current roster information and portrait files in `assets/players/`. Keep each position and squad status consistent with the roster page when adding or changing players.

## Match Center and competition tools

The Live Match Center, standings, match reports, tournament bracket, and matchday team sheet share the data in `assets/match-data.js`. This is a static GitHub Pages data feed: updates become visible after staff edit and commit the file, GitHub Pages deploys the change, and visitors refresh the page. The site does not provide a secure browser-based staff editor or push-based live scoring.

- `liveMatch`: current scoreboard, status, clock, venue, and match events. Set it to `null` when no match is live.
- `fixtures`: confirmed upcoming matches with date, time, competition, opponent, and venue.
- `results`: final verified scores. Each result can include a `reportId` linking to a report.
- `standings`: competition name, updated date, and team rows with played, won, drawn, lost, goalsFor, and goalsAgainst. The table calculates goal difference and points (3 for a win, 1 for a draw).
- `reports`: completed-match recaps with date, opponent, score, headline, summary, Player of the Match, and key moments.
- `tournament`: optional competition name, group tables, and knockout rounds with confirmed fixtures and scores.
- `matchday`: optional confirmed matchday announcement containing the opponent, date, kickoff, venue, formation, starters, substitutes, and note.

Leave unknown sections as `null` or empty arrays. Do not create fictional match scores, tournament teams, standings, match events, or lineup announcements. The matchday page includes a print team-sheet action.

## Website themes

The site offers Winter Midnight, Frost White, Aurora Ice, and USA Classic. The selected theme is saved in the visitor's browser.

## Support chat

Tawk.to is loaded site-wide from assets/chat-widget.js. The support inbox should be supervised by a trusted adult or designated moderator. Do not publish private player contact information.

## Publish with GitHub Pages

1. Open Settings → Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Select main and / (root), then save.
4. GitHub will show the published website URL in Pages settings.

The custom domain is stored in the root CNAME file. Manage DNS records at the domain registrar and enable HTTPS after GitHub verifies the DNS configuration.

This is a custom fan-made Roblox team website and is not affiliated with Roblox, EA SPORTS, FIFA, or U.S. Soccer.