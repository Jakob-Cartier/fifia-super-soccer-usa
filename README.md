# USA National Team — Roblox FIFA Super Soccer

A responsive, multi-page website for the custom USA National Team in Roblox FIFA Super Soccer.

## Website pages

- / — Home
- /squad/ — Player profiles, headshots, roles, numbers, and descriptions
- /lineup/ — Starting group and substitute bench
- /matches/ — Upcoming fixtures and results
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

Mark is listed as the senior goalkeeper. His squad number has not yet been assigned. Player descriptions are position-based and do not claim unconfirmed statistics or achievements.

## Player application form

The application form is on /apply/. It collects a Roblox username and game-related details only. It does not ask for a real name, personal email address, phone number, age, school, or home address.

Email delivery uses Formspree's Vanilla JS (Ajax) integration, which fits this static HTML/JavaScript site and does not require React or a build step. The form posts to the public Formspree endpoint configured for this team. The public form ID is stored in assets/apply.js; the receiving inbox remains private in the Formspree dashboard. Do not put a personal receiving email address in this public repository.

The application collects game-related information only. It does not ask applicants for their real name, age, personal email, phone number, school, or home address. A team moderator should review submissions and contact applicants only through an approved Roblox/team channel.

Formspree's AJAX guide: https://help.formspree.io/hc/en-us/articles/360013470814-Submit-forms-with-JavaScript-AJAX

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