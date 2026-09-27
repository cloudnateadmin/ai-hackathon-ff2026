/* Stylised QR renderer with a centre logo. Uses qrcode-generator (level H,
   ~30% error correction, so the logo cut-out stays scannable). */
window.drawBrandQR = function (canvas, text, opts) {
  const o = Object.assign({ dark: "#06133a", light: "#ffffff", accent: "#e32a23", logo: "assets/cloudnate-mark.svg", quiet: 4, logoScale: 0.24 }, opts || {});
  const qr = qrcode(0, "H");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  const cell = size / (n + o.quiet * 2);
  const off = o.quiet * cell;

  ctx.fillStyle = o.light;
  ctx.fillRect(0, 0, size, size);

  // area kept clear for the logo (in modules)
  const logoMods = Math.ceil(n * o.logoScale) | 1;
  const lStart = Math.floor((n - logoMods) / 2), lEnd = lStart + logoMods;
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const inLogo = (r, c) => r >= lStart && r < lEnd && c >= lStart && c < lEnd;

  // Square modules: round "dot" styles look nice but decode unreliably on older scanners.
  ctx.fillStyle = o.dark;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || inFinder(r, c) || inLogo(r, c)) continue;
      ctx.fillRect(Math.floor(off + c * cell), Math.floor(off + r * cell), Math.ceil(cell), Math.ceil(cell));
    }
  }

  // finder patterns (kept geometrically standard)
  const finder = (r, c) => {
    const x = off + c * cell, y = off + r * cell, s = 7 * cell, ch = 0; // square corners — chamfering the finder hurts decode rates
    const cham = (x, y, w, h, k) => {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + w - k, y); ctx.lineTo(x + w, y + k);
      ctx.lineTo(x + w, y + h); ctx.lineTo(x + k, y + h); ctx.lineTo(x, y + h - k); ctx.closePath();
    };
    ctx.fillStyle = o.dark; cham(x, y, s, s, ch); ctx.fill();
    ctx.fillStyle = o.light; cham(x + cell, y + cell, s - 2 * cell, s - 2 * cell, ch * 0.5); ctx.fill();
    // Solid navy core: any colour inside the finder breaks the 1:1:3:1:1 ratio scanners look for.
    ctx.fillStyle = o.dark; ctx.fillRect(x + 2 * cell, y + 2 * cell, 3 * cell, 3 * cell);
  };
  finder(0, 0); finder(0, n - 7); finder(n - 7, 0);

  // centre logo
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const box = logoMods * cell, bx = off + lStart * cell, by = off + lStart * cell;
      ctx.fillStyle = o.light;
      ctx.fillRect(bx, by, box, box);
      const w = box * 0.86, h = w * (img.naturalHeight || 33) / (img.naturalWidth || 62);
      ctx.drawImage(img, bx + (box - w) / 2, by + (box - h) / 2, w, h);
      resolve();
    };
    img.onerror = resolve;
    img.src = o.logo;
  });
};

/* The URL the QR should point at: explicit ?url=, config value, or this site's own register section. */
window.registerURL = function () {
  const p = new URLSearchParams(location.search).get("url");
  if (p) return p;
  const cfg = (window.FF_CONFIG || {}).PUBLIC_REGISTER_URL;
  if (cfg) return cfg;
  const u = new URL("index.html", location.href);
  u.search = "?src=venue-qr";
  u.hash = "register";
  return u.toString();
};
