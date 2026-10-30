---
name: customer-eye-website-audit
description: Audits any website through a customer's eyes and reports what a real visitor would run into - broken links, empty image slots, empty pages, misleading labels like "Sold Out", popups covering the screen on mobile, leftover demo or template text, broken booking and contact forms. Works on any platform (WordPress, Shopify, Wix, Squarespace, Webflow, custom code). Use when asked to check, audit, QA or review a website, "look at it like a customer", "find problems on the site" or "check it again".
---

# Customer-Eye Website Audit

The goal is not to find code errors. It is to find what a customer **sees on screen** that could confuse them or make them leave. Report it that way: what the customer sees, where, and how to fix it.

If a `references/<domain>.md` file exists for the site being audited, read it first. It holds the site's structure, past findings and the places to check every time. After the audit, offer to update it (template: `references/site-notes-template.md`).

## The golden rule
Before reporting a problem, **confirm it is visible on the live page** (screenshot or a visibility check). Something present in the HTML or in the site's data does not mean the customer sees it.
Example: some products had a price of 0 in the page's HTML, but the design hid all prices. The only thing customers saw was a "SOLD OUT" label on the product card. Reporting "shows a zero price" would have been wrong.

## Get to know the site first
- Note the platform if it is easy to tell (it helps phrase the fix), but the audit itself is the same everywhere. See "Platform notes" at the end for a few extra checks.
- Read the home page, menu and footer. List the main jobs a customer comes to do (book an appointment, request a quote, call, read about a service, browse products, buy). Those jobs working is the top priority.

## Steps

1. **Open the browser**, one tab per site.
2. **Bulk scan** (`scripts/full-scan.js`): run it in the page console, read the result with `scripts/poll.js`. It starts from the home page and the sitemap, follows internal links, and finds:
   - pages that fail to load / 404, and which page links to them,
   - **empty image slots** (placeholder drawings, images with no source) and the section they sit in,
   - empty listing pages ("No products found", "Nothing found", "No results"),
   - leftover demo or template text (lorem ipsum, "Description here", "Heading", template or server errors),
   - call-to-action buttons (Book, Quote, Contact...) that link nowhere,
   - image files that fail to load.
3. **Confirm findings on screen**: open each suspicious page, scroll to the element, take a screenshot. Placeholders can be transparent; then check the section height and whether it contains real media.
4. **Mobile check** (375x812): clear storage and cookies, reload as a first-time visitor. Take screenshots after 3 s and 12 s:
   - does a chat window, cookie banner or popup cover the screen, and how many stack up,
   - do rating badges, chat bubbles or sticky bars cover the main buttons,
   - are the headline, menu and main button visible.
   Animated sections can look blank when scrolling fast; scroll slowly and wait before reporting them.
5. **Hidden demo content**: search drawers, dropdowns and popups (announcement bars, help panels, side menus, cart or quote drawers) for default template text such as "Get 30% off on your first order". Check which click opens it and whether a customer can see it.
6. **The customer's main jobs**:
   - contact, booking and quote forms and embedded calendars (Calendly, Zoho...) actually load (**never submit** a form),
   - phone links use `tel:`, email links use `mailto:`, directions links point to the right address,
   - main buttons ("Book", "Get Quote", "Shop now", "Learn more") don't lead to empty or unrelated pages.
7. **Product and price labels** (only if the site lists products or services with prices): look for items showing zero or missing prices, "Sold Out" / "Unavailable" on things that should be available, or items without images. On a listing page, `scripts/product-labels.js` lists the price and stock labels on each card and whether they are really visible. Confirm with a screenshot.
8. **Consistency**: the same business or branch under different names, addresses or phone numbers that differ between pages, a home page promise that another page contradicts, an outdated copyright year.
9. **Console errors**: check them, but only report ones that affect the customer (something not loading, a button not working).

## Lessons learned
- An empty image slot is not a "broken image"; many templates and page builders draw a gray placeholder instead. Searching only for broken files misses it.
- Checking only pages in the menu is not enough. Scan every page; sub-pages are often reachable only from links inside content.
- When asked where a link is, describe the page, the section and the sentence it sits in (e.g. "in the description text at the very bottom of the Services page").
- The same image or video reused on unrelated pages is worth flagging for a check.
- If a fix "disappears" after it was made, suspect that an older version, backup or draft of the design was published over it.
- If some pages using the same template have empty media and others don't, the problem is in those pages' own settings, not in the template.
- Don't state things you can't see from outside (admin panel, who changed what) as facts; label them as likely causes.
- If the user disputes a finding, don't defend it. Re-check the live page and say clearly what is true.

## Report format
- In the user's language, short and non-technical (the reader may not know code).
- Start with scope and summary: how many pages and images were scanned, any 404s or broken images.
- Then per site: **Important**, **Worth checking**, **Minor**.
- On a re-check: ✅ Fixed / ❌ Still open / New findings.
- Each item: what the customer sees + page URL + how to fix it (which part of the site's admin or editor).
- End with the one or two highest-priority items.

## Platform notes (optional extras)
The steps above cover every site. These are small additions when the platform is known:
- **WordPress / WooCommerce** (`/wp-content/` in the page): leftover "Sample Page" or "Hello world!" posts, plugin error messages on the page, empty shop or category pages.
- **Shopify** (`window.Shopify` exists): `Shopify.theme.name` shows the live theme; if it says backup, copy or test, mention it. `full-scan.js` also scans every collection and product here, including ones not in the menu, and reports zero-price, out-of-stock and image-less products.
- **Wix / Squarespace / Webflow**: unpublished draft changes are a common reason a fix "isn't showing"; check the live page, not the editor preview.
