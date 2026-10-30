---
name: customer-eye-website-audit
description: Audits any website (Shopify, WordPress, custom) through a customer's eyes and reports what a real visitor would run into - broken links, empty image slots, empty pages, misleading labels like "Sold Out", popups covering the screen on mobile, leftover demo text, broken booking and contact forms. Use when asked to check, audit, QA or review a website, "look at it like a customer", "find problems on the site" or "check it again".
---

# Customer-Eye Website Audit

The goal is not to find code errors. It is to find what a customer **sees on screen** that could confuse them or make them leave. Report it that way: what the customer sees, where, and how to fix it.

If a `references/<domain>.md` file exists for the site being audited, read it first. It holds the site's structure, past findings and the places to check every time. After the audit, offer to update it (template: `references/site-notes-template.md`).

## The golden rule
Before reporting a problem, **confirm it is visible on the live page** (screenshot or a visibility check). Something present in the HTML or in product data does not mean the customer sees it.
Example: products priced at $0 carried "$0.00" in the HTML, but the theme hid all prices. The only thing customers saw was a "SOLD OUT" badge on the product card. Reporting "shows $0.00" would have been wrong.

## Get to know the site first
- Identify the platform: Shopify (`window.Shopify`, `/cdn/shop/`), WordPress (`/wp-content/`) or other. Shopify-specific steps are listed separately below.
- Read the home page, menu and footer. List the main jobs a customer comes to do (book an appointment, request a quote, call, browse products, buy). Those jobs working is the top priority.

## Steps (any website)

1. **Open the browser**, one tab per site.
2. **Bulk scan** (`scripts/full-scan.js`): run it in the page console, read the result with `scripts/poll.js`. It works on any platform and starts from the home page, the sitemap and (on Shopify) every collection. It finds:
   - pages that fail to load / 404, and which page links to them,
   - **empty image slots** (theme placeholder drawings, images with no source) and the section they sit in,
   - empty listing pages ("No products found", "Nothing found"),
   - leftover demo or template text (lorem ipsum, "Description here", "Heading", Liquid/PHP errors),
   - call-to-action buttons (Book, Quote, Contact...) that link nowhere,
   - image files that fail to load.
3. **Confirm findings on screen**: open each suspicious page, scroll to the element, take a screenshot. Placeholders can be transparent; then check the section height and whether it contains real media.
4. **Mobile check** (375x812): clear storage and cookies, reload as a first-time visitor. Take screenshots after 3 s and 12 s:
   - does a chat window or popup cover the screen, and how many stack up,
   - do rating badges, chat bubbles or sticky bars cover the main buttons,
   - are the headline, menu and main button visible.
   Animated sections can look blank when scrolling fast; scroll slowly and wait before reporting them.
5. **Hidden demo content**: search theme drawers and dropdowns (announcement bar dropdown, help drawer, compare panel, cart drawer) for default text such as "Get 30% off on your first order". Check which click opens it and whether a customer can see it.
6. **The customer's main jobs**:
   - contact, booking and quote forms and embedded calendars (Zoho, Calendly...) actually load (**never submit** a form),
   - phone links use `tel:`, email links use `mailto:`, directions links point to the right address,
   - main buttons ("Book", "Get Quote", "Shop now") don't lead to empty or unrelated pages.
7. **Consistency**: the same store or branch under different names, addresses or phone numbers that differ between pages, a home page promise that the offer page contradicts, copyright year.
8. **Console errors**: check them, but only report ones that affect the customer (something not loading, a button not working).

## Shopify-specific steps
- Read the **live theme name** with `Shopify.theme`. If it contains BACKUP, copy or test, always mention it in the report.
- On Shopify, `full-scan.js` also scans **every collection** (including ones not in the menu) via `/collections.json` and **every product** via `/products.json`: zero price, out of stock, no image.
- For zero-price or out-of-stock products, use `scripts/product-status.js` to find what the customer actually sees ("Sold Out" badge, "Price on request", a booking button) and confirm with a screenshot.
- Good to know: images set in the theme editor sections (e.g. offer cards) belong to the **theme**; collection images and metafield videos belong to the **collection**. If a fix disappears, check the live theme name first; publishing a backup theme rolls theme-level fixes back.
- If some pages using the same template have empty media and others don't, the problem is in those pages' own settings, not in the template.

## Lessons learned
- An empty image slot is not a "broken image"; the theme draws a gray placeholder instead. Searching only for broken files misses it.
- Checking only pages in the menu is not enough. Scan every page and collection; sub-categories are often reachable only from links inside content.
- When asked where a link is, describe the page, the section and the sentence it sits in (e.g. "in the description text at the very bottom of the Kitchen Cabinets page").
- The same video reused on unrelated pages (e.g. countertops and cabinets) is worth flagging for a check.
- Don't state things you can't see from outside (admin panel, who changed what) as facts; label them as likely causes.
- If the user disputes a finding, don't defend it. Re-check the live page and say clearly what is true.

## Report format
- In the user's language, short and non-technical (the reader may not know code).
- Start with scope and summary: how many pages and images were scanned, any 404s or broken images.
- Then per site: **Important**, **Worth checking**, **Minor**.
- On a re-check: ✅ Fixed / ❌ Still open / New findings.
- Each item: what the customer sees + page URL + how to fix it (which admin menu).
- End with the one or two highest-priority items.
