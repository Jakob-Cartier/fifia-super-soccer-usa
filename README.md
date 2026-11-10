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

## Team branding

The site logo and favicon use assets/crest.png.

## Player headshots and roster

Current photos are in assets/players/: kayden.png, brycen.png, tessa.png, and ruffles.png.

| Player | Position | Role | Number | Team duty |
|---|---|---|---:|---|
| Kayden | CM | Central Midfielder | 5 | Starter |
| Brycen | RW | Forward | 10 | Captain |
| Tessa | LW | Forward | 9 | Starter |
| Ruffles | RW | Attacking substitute | 6 | Substitute |

Player descriptions are position-based and do not claim unconfirmed statistics or achievements.

## Application form email delivery

The application form is on /apply/. It only requests a Roblox username and game-related details; it does not request a real name, personal email, phone number, age, school, or address.

Email delivery uses FormSubmit. Before enabling submissions, set APPLICATION_INBOX in assets/apply.js to a shared, moderator-managed team inbox. The inbox owner must complete FormSubmit's first-use email confirmation. The recipient address is placed in the public website code when using the direct email endpoint, so use a shared team inbox rather than a personal address. Keep the application inbox moderated.

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