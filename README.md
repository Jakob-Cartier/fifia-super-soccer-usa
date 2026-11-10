# USA National Team — Roblox FIFA Super Soccer

A responsive, multi-page website for the custom USA National Team in Roblox FIFA Super Soccer.

## Website pages

- / — Home
- /squad/ — Player profiles, headshots, roles, numbers, and descriptions
- /lineup/ — Starting group and substitute bench
- /matches/ — Upcoming fixtures and results
- /about/ — Team information
- /apply/ — Player application form
- /support/ — Website support and Tawk.to live chat

Each section is a folder with its own index.html, so page URLs do not end in .html.

## Team roster

| Player | Position | Role | Number | Team duty |
|---|---|---|---:|---|
| Kayden | CM | Central Midfielder | 5 | Starter |
| Brycen | RW | Forward | 10 | Captain |
| Tessa | LW | Forward | 9 | Starter |
| Ruffles | RW | Right-wing attacking substitute | 6 | Substitute |

Player descriptions are position-based and do not claim unconfirmed statistics or achievements.

## Player application form

The application form is on /apply/. It collects a Roblox username and game-related details only. It does not ask for a real name, personal email address, phone number, age, school, or home address.

Email delivery uses Formspree. A trusted adult or designated team moderator should create and supervise the Formspree project, then set the team's chosen shared inbox as the private Target Email in the Formspree dashboard. Do not put the receiving email address in this public repository.

After the form is created, copy its Form ID from the Formspree dashboard and place it in the FORMSPREE_FORM_ID setting in assets/apply.js. The public Form ID is used by the website; the receiving email remains in the Formspree dashboard. The form remains disabled while the Form ID is blank.

Formspree's official setup guide: https://help.formspree.io/articles/building-your-form/building-an-html-form

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