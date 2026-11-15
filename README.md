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
- /staff/ — Staff Workspace for local calendar, records, awards, fixtures and match-data drafts

Each section is a folder with its own index.html, so page URLs do not end in .html.

## Team roster

| Player | Position | Role | Number | Team duty |
|---|---|---|---:|---|
| Mark | GK | Senior Goalkeeper | 1 | Starter |
| Kayden | CM | Central Midfielder | 5 | Starter |
| Brycen | RW | Forward | 10 | Captain |
| Tessa | LW | Forward | 9 | Starter |
| Ruffles | RW | Right-wing attacking substitute | 6 | Substitute |

Mark is listed as the senior goalkeeper wearing squad number 1. Player portraits are stored in `assets/players/` as lowercase PNG files. Mark's portrait is `mark.png`. Player descriptions are position-based and do not claim unconfirmed statistics or achievements.

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

The Live Match Center, standings, match reports, tournament bracket, and matchday team sheet share the data in `assets/match-data.js`. This is a static GitHub Pages data feed: staff can prepare edits in the local Staff Workspace, export the data file, and commit it; GitHub Pages deploys the change, and visitors use **Refresh Feed** or reload the page to see it. The site does not provide secure browser-based sign-in or push-based live scoring.

- `liveMatch`: current scoreboard. Use `null` when no match is live. For a live game, set `status`, `date`, `competition`, `homeName`, `awayName`, `homeScore`, `awayScore`, and optional `clock`, `venue`, `note`, and `events`. Event types include `goal`, `own-goal`, `yellow-card`, `red-card`, `substitution`, `penalty`, and `note`. Status values: `live`, `halftime`, `fulltime`, or `scheduled`.
- `fixtures`: an array of confirmed upcoming matches: `id`, `date` (YYYY-MM-DD), `time`, `competition`, `opponent`, `venue`, and `status`.
- `results`: an array of final verified scores: `id`, `date`, `competition`, `opponent`, `usaScore`, `opponentScore`, and optional `reportId`.
- `standings`: `competition`, `updated`, and `teams`. Each team has `team`, `played`, `won`, `drawn`, `lost`, `goalsFor`, and `goalsAgainst`. The table sorts by points, then goal difference, then goals scored; points are calculated as 3 for a win and 1 for a draw.
- `reports`: completed-match recaps with `id`, `date`, `competition`, `opponent`, `usaScore`, `opponentScore`, `headline`, `summary`, optional `playerOfMatch`, and `keyMoments`.
- `tournament`: optional `name`, `season`, `status`, `groups` (each with `name` and `teams`), and `rounds` (each with `name` and `matches` including home/away teams, scores, status, winner, and date).
- `matchday`: optional confirmed announcement with `status`, `opponent`, `competition`, `date`, `kickoff`, `venue`, `formation`, `starters`, `substitutes`, and `note`. Only add it after a specific matchday team sheet is approved.

Leave unknown sections as `null` or empty arrays. Do not create fictional match scores, tournament teams, standings, match events, reports, or lineup announcements. The matchday page includes a printable team-sheet button.

**Publishing process:** Edit `assets/match-data.js`, commit the changes to `main`, then increase the `?v=` number for `assets/match-data.js` in `matches/index.html`, `standings/index.html`, `reports/index.html`, `tournaments/index.html`, and `matchday/index.html`. This cache-bust makes visitors load the new feed after GitHub Pages deploys.

## Staff Workspace

The staff workspace is available at `/staff/`. It provides forms to add/remove calendar events, edit player statistics, add/remove Player of the Match awards, and manage fixtures and final results. Advanced JSON editors cover the complete records and match-data objects, including standings, reports, tournaments, live-match details and matchday announcements.

**Publishing limits:** the staff workspace is protected by Firebase Authentication and an administrator custom claim. Its editor still keeps drafts in the administrator's browser and exports `events.js`, `records.js`, and `match-data.js`; an administrator must replace those files in `assets/` and commit them to publish. The account system does not put a GitHub token or repository write key in the browser.

## Accounts, Google sign-in, and administrator access

- Member front screen: `/account/` — Google sign-in, email/password sign-up and sign-in, password reset, account profile, and sign-out.
- Admin console: `/admin/` — accessible only to a verified Firebase account with the server-assigned `admin: true` custom claim.
- Staff management: `/staff/` — checks the same admin claim before loading the staff editor.
- Firebase client configuration: `assets/firebase-config.js`. The web-app config is public client configuration; never put service-account JSON, private keys, GitHub tokens, or other server credentials in it.

### One-time Firebase setup

1. Create a Firebase project and register a Web app. Copy its Firebase web configuration into `assets/firebase-config.js` (replace the empty strings). The config values identify the project; they are not administrator credentials.
2. In Firebase Authentication, enable **Google** and **Email/Password** sign-in methods.
3. In Authentication settings, add `fifasupersoccer-usnational.futbol` to Authorized domains. Add another hostname only if it actually serves the website.
4. Create a Cloud Firestore database. Deploy the repository rules from `firestore.rules` using Firebase CLI: `firebase login`, `firebase use --add`, then `firebase deploy --only firestore:rules`. The rules let users access only their own basic profile and let only admin-claim accounts write to `siteContent`.
5. Commit the Firebase web config and deploy GitHub Pages. Test Google and email/password account creation at `/account/`.

### Grant the first administrator

1. Create the intended owner account through `/account/` and complete email verification. For Google sign-in, use the intended owner Google account.
2. In Firebase Console → Authentication → Users, copy that account's **UID**. Do not use a display name as the identifier.
3. A trusted project owner should install the Admin SDK locally with `npm install firebase-admin`, download a Firebase service-account credential, and keep that credential outside the repository in a secure local folder.
4. Run the grant script locally from the repository root. PowerShell example:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\secure\firebase-service-account.json"
$env:ADMIN_UID="PASTE_THE_TARGET_FIREBASE_UID"
$env:CONFIRM_ADMIN_GRANT="YES"
node scripts/grant-admin.mjs
```

5. Sign out and sign back in. The account page will show **Staff Admin Access**, and `/admin/` and `/staff/` will open for that account.
6. To revoke the role later, set `ADMIN_UID` and `GOOGLE_APPLICATION_CREDENTIALS`, set `CONFIRM_ADMIN_REVOKE=YES`, and run `node scripts/revoke-admin.mjs`.

**Credential safety:** never upload the service-account JSON or share its contents in chat. The repository `.gitignore` blocks common service-account JSON filenames, but keep the file outside the repository anyway. The admin grant/revoke scripts use Firebase's privileged Admin SDK and should only be run by the project owner or a trusted adult who manages the project. No self-service admin button exists in the public site.

## Website visual system

The site uses the Fieldhouse Edition design: warm paper backgrounds, deep navy editorial sections, USA red accents, stronger typography and squared-off sports-broadcast panels. The countdown remains a separate dark launch overlay.

## Support chat

Tawk.to is loaded site-wide from assets/chat-widget.js. The support inbox should be supervised by a trusted adult or designated moderator. Do not publish private player contact information.

## Publish with GitHub Pages

1. Open Settings → Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Select main and / (root), then save.
4. GitHub will show the published website URL in Pages settings.

The custom domain is stored in the root CNAME file. Manage DNS records at the domain registrar and enable HTTPS after GitHub verifies the DNS configuration.

This is a custom fan-made Roblox team website and is not affiliated with Roblox, EA SPORTS, FIFA, or U.S. Soccer.