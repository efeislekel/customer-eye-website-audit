// Run after starting full-scan.js. Returns done:false if the scan is still running; run it again.
for (let i = 0; i < 8 && !(window.__R && window.__R.done); i++) await new Promise(r => setTimeout(r, 5000));
const R = window.__R || {};
({
  done: R.done, platform: R.platform, theme: R.theme, pages: R.pages, cols: R.cols, imgsChecked: R.imgsChecked,
  badImgs: R.badImgs, issues: R.issues, products: R.products,
  zeroPrice: R.zeroPrice?.length, zeroSample: R.zeroPrice?.slice(0, 10),
  unavailable: R.unavailable?.length, noImg: R.noImg?.length
})
