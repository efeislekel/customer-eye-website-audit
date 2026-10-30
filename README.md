# Customer-Eye Website Audit: a Claude Skill for website QA and UX audits

[![Latest release](https://img.shields.io/github/v/release/efeislekel/customer-eye-website-audit?label=release)](https://github.com/efeislekel/customer-eye-website-audit/releases/latest) [![Downloads](https://img.shields.io/github/downloads/efeislekel/customer-eye-website-audit/total?label=downloads)](https://github.com/efeislekel/customer-eye-website-audit/releases) [![GitHub stars](https://img.shields.io/github/stars/efeislekel/customer-eye-website-audit?style=flat&label=stars)](https://github.com/efeislekel/customer-eye-website-audit/stargazers) [![License: MIT](https://img.shields.io/github/license/efeislekel/customer-eye-website-audit)](LICENSE)

**Customer-Eye Website Audit** is a free, open-source [Claude Skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) that audits any website the way a real customer experiences it. It finds the problems that cost you leads and sales: broken links, empty image slots, empty category pages, misleading "Sold Out" badges, popups covering the screen on mobile, leftover template demo text and broken booking or contact forms.

Works on **any website**: business and service sites, online stores, portfolios, landing pages. Platform doesn't matter: WordPress, Shopify, Wix, Squarespace, Webflow or custom code. Built from real audits of live sites.

> Not a code linter. It reports what a visitor **sees on screen**, where they see it, and how to fix it.

## What it checks

| Check | What the customer would experience |
|---|---|
| Broken links / 404 pages | "Page not found" after clicking a menu item or button |
| Empty image and video slots | Gray placeholder drawings instead of photos (templates, page builders) |
| Empty listing pages | "No products found" on an offer or category page |
| Leftover demo text | Template defaults like "Get 30% off on your first order", "Heading", "Description here", lorem ipsum |
| Dead call-to-action buttons | "Book", "Get Quote", "Contact" buttons that go nowhere |
| Broken image files | Images that fail to load |
| Mobile first impression | Chat windows and popups covering the screen, badges hiding the main button |
| Forms and booking | Contact forms and embedded calendars (Zoho, Calendly) that don't load |
| Consistency | Different store names, phone numbers or addresses across pages; offers that contradict each other |
| Prices and stock labels | Zero or missing prices, "Sold Out" on items that should be available, products without images |
| Hidden pages | Sub-pages and categories only reachable from links inside content, not from the menu |

The skill's golden rule: **every finding is confirmed on the live page** (screenshot or visibility check) before it is reported, so you don't get false alarms from hidden HTML.

## Installation

### Claude.ai / Claude desktop app
1. Download **[customer-eye-website-audit.zip](https://github.com/efeislekel/customer-eye-website-audit/releases/latest/download/customer-eye-website-audit.zip)** (always the latest version).
2. In Claude, go to **Settings > Capabilities > Skills** and upload the ZIP. Keep it zipped.

### Claude Code
```bash
git clone https://github.com/efeislekel/customer-eye-website-audit.git ~/.claude/skills/customer-eye-website-audit
```

Claude needs a browser tool (Claude in Chrome or the built-in browser) to run the audit.

## Usage

Just ask:

- "Audit example.com through a customer's eyes."
- "Check my online store for anything broken a customer would notice."
- "Check the site again and tell me what was fixed."

You get a short, non-technical report grouped into **Important**, **Worth checking** and **Minor**, with the page URL and the fix for each item. On a re-check you get **Fixed / Still open / New findings**.

## What's inside

```
customer-eye-website-audit/
├── SKILL.md                         # Audit procedure, lessons learned, report format
├── scripts/
│   ├── full-scan.js                 # Crawls the site in the browser and flags customer-facing problems
│   ├── poll.js                      # Reads the scan result
│   └── product-labels.js            # Price and stock labels customers actually see on listing pages
└── references/
    └── site-notes-template.md       # Per-site notes to make repeat audits faster
```

The scripts run inside the browser page (read-only `fetch` requests to the same site). They never submit forms, add to cart or change anything.

## Tips
- Keep a `references/<domain>.md` file for sites you audit often (copy the template). Keep client-specific notes private.
- Re-run the audit after every design change or bulk edit. Publishing an older version or backup of a design can silently undo earlier fixes.
- A few platform-specific extras (WordPress, Shopify, Wix, Squarespace, Webflow) are listed at the end of `SKILL.md`.

## Contributing
Issues and pull requests are welcome: new checks, platform-specific tips, or false-positive fixes.

## License
MIT. See [LICENSE](LICENSE).

---

Made by [Anemon Creative](https://anemoncreative.com).

**Keywords:** website audit, UX audit, customer experience audit, website QA checklist, small business website audit, online store audit, Shopify audit, WordPress audit, Wix audit, broken link checker, ecommerce QA, conversion rate optimization, Claude skill, Claude Code skill, Anthropic agent skills, AI website review.
