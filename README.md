# USA National Team — Roblox FIFA Super Soccer

A responsive, multi-page website for the custom USA National Team in Roblox FIFA Super Soccer.

## Website pages

The pages use clean URLs (no .html in navigation):

- / — Home
- /squad/ — Player profiles, headshots, roles, numbers, and descriptions
- /lineup/ — Tactical lineup overview
- /matches/ — Upcoming fixtures and results
- /about/ — Team information
- /support/ — Website support and chat status

Each section is its own folder containing an index.html file, which GitHub Pages serves at the folder URL.

## Player headshots

The current player images are in assets/players/:

- kayden.png
- brycen.png
- tessa.png
- ruffles.png

Use lowercase filenames if replacing these images. Recommended image dimensions: portrait 3:4 ratio, ideally 600 × 800 pixels or larger.

## Team roster

| Player | Position | Role | Number | Team duty |
|---|---|---|---:|---|
| Kayden | CM | Central Midfielder | 5 | Midfield |
| Brycen | RW | Forward | 10 | Captain |
| Tessa | LW | Forward | 9 | Forward |
| Ruffles | GK | Goalkeeper | 6 | Goalkeeper |

Player descriptions are based on each player's listed position; no match statistics or unconfirmed achievements are claimed.

## Website themes

The header theme selector offers four themes, including three winter designs:

- Winter Midnight
- Frost White
- Aurora Ice
- USA Classic

The selected theme is saved in the visitor's browser and stays selected while moving between pages.

## Support chat

The support page is ready for a website chat widget, but the widget is intentionally inactive until a trusted adult or designated team moderator configures and supervises the support inbox. The shared integration file is assets/chat-widget.js; the provider's official, account-specific widget code must be added there before chat can go live. Do not publish private player contact information.

## Publish with GitHub Pages

1. Open Settings → Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Select main and / (root), then save.
4. GitHub will show the published website URL in Pages settings.

The custom domain is stored in the repository's root CNAME file. Manage its DNS records at the domain registrar and enable HTTPS after GitHub verifies the DNS configuration.

This is a custom fan-made Roblox team website and is not affiliated with Roblox, EA SPORTS, FIFA, or U.S. Soccer.