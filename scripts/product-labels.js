// Works on any platform. Run in the browser console on a product, service or category
// listing page. Lists the price and stock labels on each card and whether a customer can
// really see them ("visible"), so you report what is on screen, not what is in the HTML.
// Cards may only render after scrolling: if a label shows visible:false, scroll to the card,
// run it again and confirm with a screenshot.
(() => {
  const labelRe = /sold out|out of stock|unavailable|price on request|call for price|coming soon|pre-?order|[$€£₺]\s?0(?:[.,]00)?(?!\d)|(?<![\d.,])0(?:[.,]00)?\s?(?:TL|USD|EUR|GBP)\b/i;
  const priceRe = /[$€£₺]\s?\d|\d[\d.,]*\s?(?:TL|USD|EUR|GBP)\b/i;
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0' && s.display !== 'none'; };
  const chrome = 'header, nav, footer, aside, [role="dialog"], [role="navigation"], [class*="header"], [class*="footer"], [class*="menu"], [class*="drawer"]';

  // A card: a small container around a content link, with an image, short text and few links.
  const cards = new Map();
  for (const a of document.querySelectorAll('a[href]')) {
    if (!a.href.startsWith(location.origin) || a.closest(chrome)) continue;
    const path = new URL(a.href).pathname;
    if (path === '/' || /\/(cart|account|checkout|login|search)\b/.test(path)) continue;
    const card = a.closest('.product-card, .product, .card, article, li, [class*="product"], [class*="item"], [class*="card"]');
    if (!card || cards.has(card) || card.closest(chrome)) continue;
    const text = card.textContent.replace(/\s+/g, ' ').trim();
    const linkCount = new Set([...card.querySelectorAll('a[href]')].map(x => x.href.split('?')[0])).size;
    if (!card.querySelector('img, picture') || text.length > 400 || linkCount > 3) continue;
    cards.set(card, path);
  }

  const rows = [...cards].map(([card, path]) => {
    const leaves = [...card.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim());
    const labels = leaves.filter(e => labelRe.test(e.textContent)).map(e => ({ text: e.textContent.trim().slice(0, 40), visible: vis(e) }));
    const img = card.querySelector('img');
    return {
      link: path,
      title: ((card.querySelector('h2,h3,h4,[class*="title"],[class*="name"]') || {}).textContent || card.textContent || (img && img.alt) || '').replace(/\s+/g, ' ').trim().slice(0, 60) || (img && img.alt) || '',
      hasImage: !!(img && (img.currentSrc || img.src) && (img.naturalWidth > 1 || !img.complete)),
      priceShown: leaves.some(e => priceRe.test(e.textContent) && vis(e)),
      labels,
    };
  });

  // Flag cards with a visible warning label or a missing image. "No visible price" alone is
  // not flagged (many sites hide prices on purpose); it is only counted.
  const flagged = rows.filter(r => r.labels.some(l => l.visible) || !r.hasImage);
  return {
    cards: rows.length,
    cardsWithoutVisiblePrice: rows.filter(r => !r.priceShown).length,
    flagged: flagged.length,
    items: flagged,
  };
})()
