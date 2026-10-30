// Shopify: finds what zero-price or out-of-stock products actually SHOW the customer.
// Usage: run in the console on a collection page. Change COLLECTION.
// "visible" tells whether the label is really on screen, not just in the HTML.
// Cards may only render after scrolling; if visible is false, scroll to the card,
// run it again and confirm with a screenshot.
const COLLECTION = 'shower-doors';

let zero = [];
for (let p = 1; p <= 10; p++) {
  const j = await (await fetch(`/collections/${COLLECTION}/products.json?limit=250&page=${p}`)).json();
  if (!j.products.length) break;
  zero = zero.concat(j.products.filter(x => x.variants.every(v => parseFloat(v.price) === 0 || !v.available)).map(x => x.handle));
}

// Which page each product is on and what its card says (HTML)
const found = [];
for (let p = 1; p <= 15; p++) {
  const t = await (await fetch(`/collections/${COLLECTION}?page=${p}`)).text();
  const d = new DOMParser().parseFromString(t, 'text/html');
  d.querySelectorAll('script,style,template').forEach(e => e.remove());
  for (const h of zero) {
    const a = d.querySelector(`main a[href*="/products/${h}"]`);
    if (!a) continue;
    const card = a.closest('.product-card, .card, li, article') || a.parentElement;
    found.push({ handle: h, page: p, cardText: card.textContent.replace(/\s+/g, ' ').trim().slice(0, 160) });
  }
}

// Labels actually visible on the cards of the page currently open
const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0' && s.display !== 'none'; };
const shown = zero.map(h => {
  const a = document.querySelector(`main a[href*="/products/${h}"]`);
  if (!a) return null;
  const card = a.closest('.product-card, .card, li, article') || a.parentElement;
  return { handle: h, labels: [...card.querySelectorAll('*')].filter(e => e.children.length === 0 && /\$|sold out|price on request|unavailable|appointment/i.test(e.textContent)).map(e => ({ t: e.textContent.trim().slice(0, 40), visible: vis(e) })) };
}).filter(Boolean);

({ total: zero.length, where: found, visibleOnThisPage: shown })
