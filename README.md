# USA National Team — Roblox FIFA Super Soccer

A responsive, multi-page website for the custom USA National Team in Roblox FIFA Super Soccer.

## Website pages

- / — Home
- /squad/ — Player profiles, headshots, roles, numbers, and descriptions
- /lineup/ — Starting group and substitute bench
- /matches/ — Upcoming fixtures and results
- /calendar/ — Interactive monthly calendar and upcoming team events
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