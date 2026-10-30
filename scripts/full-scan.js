// Run in the browser console on any page of the site you are auditing.
// Works on any platform (WordPress, Shopify, Wix, Squarespace, Webflow, custom code).
// Extra on Shopify: it also scans every collection and product, including ones not in the menu.
// Runs in the background; when finished the result is stored in window.__R (read it with poll.js).
(async () => {
  const O = location.origin;
  const R = { done: false }; window.__R = R;
  const isShopify = !!window.Shopify;
  async function pool(list, n, fn) { let i = 0; await Promise.all(Array(n).fill(0).map(async () => { while (i < list.length) { const x = list[i++]; await fn(x); } })); }
  const skip = h => /customer_authentication|\/cart|\/account|\/my-account|\/checkout|wp-admin|wp-login|sort_by|filter\.|\.(pdf|zip|jpg|jpeg|png|webp|gif|svg|mp4)$/i.test(h);
  const demoRe = /lorem ipsum|Description here|>\s*Heading\s*<|TODO|Your content goes here|Liquid error|Translation missing|Fatal error|Warning:.*on line|Sample Page|Hello world!/i;
  const emptyRe = /No products found|Nothing found|No results found|no posts were found|Your cart is empty(?![\s\S]*product)/i;
  const imgs = new Map(); const pages = new Map(); const parent = {};

  async function get(u) {
    try {
      const r = await fetch(u); const t = await r.text();
      const title = ((t.match(/<title>([^<]*)/) || [])[1] || '').trim();
      const d = new DOMParser().parseFromString(t, 'text/html');
      d.querySelectorAll('script,style,noscript,template').forEach(e => e.remove());
      // Main page content, excluding header, footer and drawers
      const main = d.querySelector('main') || d.querySelector('#content, .site-content, #main') || d.body;
      const html = main.innerHTML; const m = html.match(demoRe);
      // Empty image/video slots: theme placeholder drawings and images with no source
      const ph = [...main.querySelectorAll('.placeholder, svg.placeholder-svg, [class*="placeholder-svg"], [class*="placeholder_svg"], [class*="placeholder-image"]')]
        .map(s => s.closest('[id^="shopify-section"], section, [id]')?.id?.split('__').pop() || '?');
      const emptyImg = [...main.querySelectorAll('img')].filter(i => !(i.getAttribute('src') || i.getAttribute('data-src') || i.getAttribute('srcset') || i.getAttribute('data-srcset') || i.getAttribute('data-lazy-src'))).length;
      const emptyList = emptyRe.test(main.textContent);
      main.querySelectorAll('img').forEach(i => { let s = i.getAttribute('src') || i.getAttribute('data-src') || i.getAttribute('data-lazy-src') || (i.getAttribute('srcset') || '').split(' ')[0]; if (s && !s.startsWith('data:')) { try { s = new URL(s, u).href; } catch (e) { return; } if (!imgs.has(s)) imgs.set(s, u); } });
      // Main call-to-action buttons that link nowhere (English and Turkish keywords)
      const deadBtns = [...main.querySelectorAll('a')].filter(a => { const h = a.getAttribute('href'); return (!h || h === '#' || h === 'javascript:void(0)') && /book|quote|estimate|shop|contact|call|appointment|randevu|teklif|iletişim/i.test(a.textContent) && !a.getAttribute('aria-controls'); }).map(a => a.textContent.trim().slice(0, 40));
      return {
        s: r.status, title, ph, emptyImg, emptyList, deadBtns,
        demo: m ? html.substr(Math.max(0, m.index - 60), 150).replace(/\s+/g, ' ') : null,
        links: [...d.querySelectorAll('a[href]')].map(a => { try { return new URL(a.getAttribute('href'), u).href.split('#')[0].split('?')[0]; } catch (e) { return null; } }).filter(h => h && h.startsWith(O) && !skip(h))
      };
    } catch (e) { return { s: 'ERR', ph: [], links: [], deadBtns: [] }; }
  }

  // Starting points: home page + sitemap (if any) + every collection (Shopify only)
  let start = [O + '/'];
  try {
    const sm = await (await fetch('/sitemap.xml')).text();
    const subs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1].replace(/&amp;/g, '&'));
    const pagesSm = [];
    for (const s of subs.slice(0, 20)) {
      if (/\.xml/.test(s)) { try { const t = await (await fetch(s)).text(); [...t.matchAll(/<loc>([^<]+)<\/loc>/g)].forEach(x => pagesSm.push(x[1])); } catch (e) { } }
      else pagesSm.push(s);
    }
    start = start.concat(pagesSm.filter(u => u.startsWith(O) && !/\/products\//.test(u)).slice(0, 400));
  } catch (e) { }
  let cols = [];
  if (isShopify) {
    for (let p = 1; p <= 20; p++) { try { const j = await (await fetch('/collections.json?limit=250&page=' + p)).json(); if (!j.collections.length) break; cols = cols.concat(j.collections); } catch (e) { break; } }
    start = start.concat(cols.map(c => O + '/collections/' + c.handle));
  }

  let frontier = start;
  for (let depth = 0; depth < 3; depth++) {
    const next = []; const todo = [...new Set(frontier)].filter(u => !pages.has(u)).slice(0, 600);
    await pool(todo, 8, async u => { const v = await get(u); pages.set(u, v); if (!u.includes('/products/')) (v.links || []).forEach(l => { if (!parent[l]) parent[l] = u; next.push(l); }); });
    frontier = [...new Set(next)].filter(u => !pages.has(u) && (!u.includes('/products/') || Math.random() < 0.1)).slice(0, 400);
  }

  // Shopify products
  let prods = [];
  if (isShopify) { for (let p = 1; p <= 40; p++) { try { const j = await (await fetch('/products.json?limit=250&page=' + p)).json(); if (!j.products.length) break; prods = prods.concat(j.products); } catch (e) { break; } } }

  // Do image files load? (same site and known CDNs only; others cannot be checked because of CORS)
  const bad = [];
  const checkable = [...imgs.keys()].filter(u => u.startsWith(O) || /cdn\.shopify\.com|wp-content|wixstatic\.com|squarespace-cdn\.com|website-files\.com/.test(u));
  await pool(checkable, 16, async u => { try { const r = await fetch(u, { method: 'HEAD' }); if (!r.ok) bad.push(imgs.get(u).replace(O, '') + ' :: ' + u.slice(0, 100) + ' ' + r.status); } catch (e) { } });

  const iss = [];
  for (const [u, v] of pages) {
    const notFound = v.s !== 200 || /not found|404|page can.t be found|sayfa bulunamadı/i.test(v.title);
    if (notFound || v.ph.length || v.emptyImg || v.emptyList || v.demo || (v.deadBtns || []).length)
      iss.push({ u: u.replace(O, ''), s: v.s, notFound: notFound || undefined, ph: v.ph.length ? v.ph : undefined, emptyImg: v.emptyImg || undefined, emptyList: v.emptyList || undefined, demo: v.demo || undefined, deadBtns: (v.deadBtns || []).length ? v.deadBtns : undefined, from: (parent[u] || '').replace(O, '') });
  }
  Object.assign(R, {
    done: true, platform: isShopify ? 'shopify' : document.querySelector('link[href*="wp-content"],script[src*="wp-content"]') ? 'wordpress' : document.querySelector('[src*="wixstatic.com"],meta[name="generator"][content*="Wix"]') ? 'wix' : document.querySelector('[src*="squarespace"]') ? 'squarespace' : document.querySelector('html[data-wf-site]') ? 'webflow' : 'other',
    theme: window.Shopify?.theme?.name, pages: pages.size, cols: cols.length, imgsChecked: checkable.length, badImgs: bad, issues: iss,
    products: prods.length,
    zeroPrice: prods.filter(p => p.variants.every(v => parseFloat(v.price) === 0)).map(p => p.handle),
    unavailable: prods.filter(p => p.variants.every(v => !v.available)).map(p => p.handle),
    noImg: prods.filter(p => !p.images.length).map(p => p.handle)
  });
})(); 'started';
