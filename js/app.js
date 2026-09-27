(function () {
  const D = window.FF_DATA, C = window.FF_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- boot ---------- */
  setTimeout(() => $("#boot").classList.add("done"), reduced ? 0 : 1300);

  /* ---------- nav ---------- */
  const hud = $("#hud");
  addEventListener("scroll", () => hud.classList.toggle("solid", scrollY > 30), { passive: true });
  $("#menuBtn").addEventListener("click", (e) => {
    const open = $("#navlinks").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  $("#navlinks").addEventListener("click", (e) => { if (e.target.tagName === "A") $("#navlinks").classList.remove("open"); });

  /* ---------- cursor glow ---------- */
  const glow = $("#glow");
  if (matchMedia("(pointer:fine)").matches) addEventListener("pointermove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; });
  else glow.style.display = "none";

  /* ---------- official forum links ---------- */
  ["#forumLink1", "#forumLink2", "#forumLink3", "#forumLink4"].forEach((id) => { const a = $(id); if (a) a.href = C.FORUM_REGISTRATION_URL; });

  /* ---------- countdown ---------- */
  const start = new Date(C.EVENT_START).getTime();
  const cd = $("#countdown");
  function tick() {
    let s = Math.max(0, Math.floor((start - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (const k in v) cd.querySelector(`[data-u="${k}"]`).textContent = pad(v[k]);
    if (s === 0) cd.outerHTML = `<p class="mono" style="color:var(--ok);margin:0 0 20px">● LIVE NOW — Le Méridien Dubai</p>`;
    else setTimeout(tick, 1000);
  }
  tick();

  /* ---------- ticker ---------- */
  const words = ["Connect", "Exchange", "Collaborate", "Grow", "Ideas", "Partnerships", "Solutions", "People · Food · A better tomorrow", "Together towards food resilience", "AI Hackathon", "Powered by Cloudnate"];
  $("#ticker").innerHTML = [...words, ...words].map((w) => `<span>${esc(w)}</span>`).join("");

  /* ---------- static renders ---------- */
  $("#sectors").insertAdjacentHTML("beforeend", D.sectors.map((s) => `<span class="chip">${esc(s)}</span>`).join(""));

  const dayOf = { Build: "DAY 01", Secure: "DAY 01", Innovate: "DAY 01", Reach: "DAY 02", Grow: "DAY 02", Collaborate: "DAY 02" };
  $("#pillars").innerHTML = D.pillars.map((p, i) => `
    <article class="pillar"><span class="n">P.0${i + 1}</span><span class="day-tag">${dayOf[p.name]}</span>
      <h3>${esc(p.name)}</h3><ul>${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <span class="ghost-letter" aria-hidden="true">${p.name[0]}</span></article>`).join("");

  $("#experiences").innerHTML = D.experiences.map(([t, d], i) => `
    <div class="panel exp reveal"><span class="ico">${pad(i + 1)}</span><div><h4>${esc(t)}</h4><p>${esc(d)}</p></div></div>`).join("");

  const arenas = [
    ["Food Security", "Strengthen local production, resilience and long-term food security.", "Forecasting · early-warning · resilience planning"],
    ["Manufacturing", "The local factory of 2035.", "Factory That Thinks · circular manufacturing · efficiency"],
    ["Trade & Markets", "New supply chains, markets and commercial opportunities.", "Farm → factory → consumer visibility"],
    ["Policy & Regulation", "Regulatory and traceability changes for the next phase of growth.", "Traceability · compliance · National Food Catalogue"],
    ["Health & Consumers", "Wellness, nutrition and changing consumer behaviour.", "Healthy living by design · omnichannel"],
    ["Sustainability", "A more circular and resilient food system.", "Net-zero food chain · waste · circularity"]
  ];
  $("#arenas").innerHTML = arenas.map(([t, d, k], i) => `
    <div class="panel arena reveal"><span class="mono">ARENA_${pad(i + 1)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p><small>${esc(k)}</small></div>`).join("");

  $("#conversations").innerHTML = D.conversations.map(([t, d], i) => `
    <div class="conv"><span class="mono">T.${pad(i + 1)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></div>`).join("");

  $("#highlights").innerHTML = D.highlights.map((h) => `<div>${esc(h)}</div>`).join("");

  $("#partnerGrid").innerHTML = D.partners.map(([r, n, logo]) => `<div class="partner"><span class="mono">${esc(r)}</span><img src="assets/logos/${logo}" alt="${esc(n)}" loading="lazy"></div>`).join("");

  /* ---------- agenda ---------- */
  let day = 0, view = "detail";
  const aiFlag = '<i class="ai-flag">AI</i>';
  function renderAgenda() {
    const d = D.days[day];
    let html = `<div class="day-banner"><h3>${esc(d.label)}</h3><span class="date">${esc(d.date)}</span><span class="theme">${d.theme.map(esc).join(" | ").toUpperCase()}</span></div>`;
    if (view === "detail") {
      html += `<div class="agenda-cols">
        <div><div class="col-title"><h4>Main stage</h4><span>${d.main.length} sessions</span></div>
          <ol class="timeline">${d.main.map(([t, s, k]) => `<li class="${k || ""}"><time>${esc(t)}</time><span class="t">${esc(s)}${k === "ai" ? aiFlag : ""}</span></li>`).join("")}</ol></div>
        <div><div class="col-title"><h4>Sideline meetings &amp; workshops</h4><span>${d.sideline.length} sessions</span></div>
          <div class="side-grid">${d.sideline.map(([t, s, k]) => `<div class="panel side-card ${k || ""}"><time>${esc(t)}</time><p>${esc(s)}</p></div>`).join("")}</div>
          ${d.evening.length ? `<div class="col-title" style="margin-top:28px"><h4>Evening activities</h4></div><div class="evening">${d.evening.map(([t, s], i) => `<div class="panel eve"><span class="ico">${i ? "🥂" : "🏆"}</span><div><time>${esc(t)}</time><p>${esc(s)}</p></div></div>`).join("")}</div>` : ""}
        </div></div>`;
    } else {
      const g = d.glance;
      html += `<div class="agenda-cols">
        <div><div class="col-title"><h4>Main stage</h4><span>${esc(g.mainTag)}</span></div>
          <ol class="timeline">${g.main.map(([t, s]) => `<li><time>${esc(t)}</time><span class="t">${esc(s)}</span></li>`).join("")}</ol></div>
        <div><div class="col-title"><h4>Business &amp; sideline programme</h4><span>${esc(g.bizTag)}</span></div>
          <ol class="timeline">${g.biz.map(([t, s, v]) => `<li class="${/AI /.test(s) ? "ai" : ""}"><time>${esc(t)}</time><span class="t">${esc(s)}${/AI /.test(s) ? aiFlag : ""}<span class="venue-tag">⌖ ${esc(v)}</span></span></li>`).join("")}</ol>
          ${g.evening.length ? `<div class="col-title" style="margin-top:28px"><h4>Evening programme</h4></div><ol class="timeline">${g.evening.map(([t, s, v]) => `<li><time>${esc(t)}</time><span class="t">${esc(s)}<span class="venue-tag">⌖ ${esc(v)}</span></span></li>`).join("")}</ol>` : ""}
        </div></div>`;
    }
    const out = $("#agendaOut");
    out.innerHTML = html;
    out.animate?.([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "ease-out" });
  }
  function bindTabs(sel, attr, set) {
    $(sel).addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $(sel).querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
      set(b.dataset[attr]); renderAgenda();
    });
  }
  bindTabs("#dayTabs", "day", (v) => (day = +v));
  bindTabs("#viewTabs", "view", (v) => (view = v));
  renderAgenda();

  /* ---------- guide (typewriter) ---------- */
  let typeTimer;
  function showGuide(i) {
    const [q, a] = D.guide[i];
    $("#guideQ").textContent = q;
    const el = $("#guideA"); el.textContent = ""; clearTimeout(typeTimer);
    let k = 0; const step = () => { el.textContent = a.slice(0, ++k); if (k < a.length) typeTimer = setTimeout(step, reduced ? 0 : 16); };
    step();
    document.querySelectorAll("#guideList button").forEach((b, j) => b.setAttribute("aria-pressed", j === i));
  }
  $("#guideList").innerHTML = D.guide.map(([q], i) => `<button type="button" data-i="${i}"><span class="mono">${pad(i + 1)}</span>${esc(q)}</button>`).join("");
  $("#guideList").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showGuide(+b.dataset.i); });
  showGuide(0);

  /* ---------- counters + reveal ---------- */
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    en.target.querySelectorAll("[data-count]").forEach((c) => {
      const to = +c.dataset.count, suf = c.dataset.suffix || ""; let n = 0;
      const t = setInterval(() => { n = Math.min(to, n + Math.max(1, Math.ceil(to / 24))); c.textContent = n + (n === to ? suf : ""); if (n === to) clearInterval(t); }, 40);
    });
    io.unobserve(en.target);
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- neural canvas ---------- */
  (function neural() {
    const cv = $("#neural"), ctx = cv.getContext("2d");
    let W, H, pts = [], mouse = { x: -999, y: -999 };
    const DPR = Math.min(2, devicePixelRatio || 1);
    function size() {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(90, Math.floor(W * H / 16000));
      pts = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, e: Math.random() < .12 }));
    }
    size(); addEventListener("resize", size);
    cv.parentElement.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) { ctx.strokeStyle = `rgba(39,225,255,${(1 - d / 140) * .22})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const p = pts[i], dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 180) { ctx.strokeStyle = `rgba(253,150,35,${(1 - dm / 180) * .5})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = p.e ? "#fd9623" : "rgba(39,225,255,.8)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.e ? 2.4 : 1.6, 0, 7); ctx.fill();
      }
      if (!reduced) requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- mini QR ---------- */
  if (window.qrcode) drawBrandQR($("#miniQR"), registerURL());

  /* ================= REGISTRATION FORM (single step) ================= */
  const form = $("#regForm");
  const roles = ["Hackathon Participant", "Team Lead", "Food Business / Challenge Owner", "Sponsor / Partner", "Visitor / Explorer"];
  $("#roleGrid").innerHTML = roles.map((r) => `<label class="choice"><input type="radio" name="role" value="${esc(r)}"><span>${esc(r)}</span></label>`).join("");
  $("#needChoices").innerHTML = ["AI agents & automation", "Generative AI / LLM apps", "Data & analytics", "Demand forecasting", "Supply chain visibility",
    "Traceability & compliance", "Smart manufacturing / IoT", "Customer experience & e-commerce", "Cloud & infrastructure", "Cybersecurity", "Custom software", "Talent & training"]
    .map((t) => `<label class="choice"><input type="checkbox" name="needs" value="${esc(t)}"><span>${esc(t)}</span></label>`).join("");

  /* free-text: guiding prompts + counter */
  const details = $("#details"), count = $("#detailsCount");
  const prompts = ["About my business", "The challenge I want solved", "My hackathon idea", "Best time to reach me"];
  $("#promptChips").innerHTML = prompts.map((p) => `<button type="button" class="prompt">+ ${esc(p)}</button>`).join("");
  $("#promptChips").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const label = b.textContent.replace(/^\+\s*/, "");
    const cur = details.value.replace(/\s+$/, "");
    details.value = (cur ? cur + "\n\n" : "") + label + ": ";
    b.classList.add("used");
    details.focus(); details.setSelectionRange(details.value.length, details.value.length);
    details.dispatchEvent(new Event("input", { bubbles: true }));
  });
  details.addEventListener("input", () => { count.textContent = details.value.length; });

  form.addEventListener("change", (e) => {
    if (e.target.name === "role") {
      $("#teamFields").hidden = !/Participant|Team Lead/.test(e.target.value);
      clearErr(e.target.closest(".f"));
    }
  });

  function setErr(f, m) { if (!f) return; f.classList.add("err"); const s = f.querySelector(".msg"); if (s) s.textContent = m; }
  function clearErr(f) { if (!f) return; f.classList.remove("err"); const s = f.querySelector(".msg"); if (s) s.textContent = ""; }
  form.addEventListener("input", (e) => clearErr(e.target.closest(".f")));

  function validate() {
    let ok = true, first;
    form.querySelectorAll("[required]").forEach((el) => {
      const f = el.closest(".f"); clearErr(f);
      const v = el.type === "checkbox" ? el.checked : el.value.trim();
      let m = "";
      if (!v) m = el.type === "checkbox" ? "Please tick to continue." : "Required";
      else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = "Enter a valid email";
      else if (el.type === "tel" && !/^[+\d][\d\s()-]{6,}$/.test(v)) m = "Enter a valid phone number";
      if (m) { ok = false; setErr(f, m); first = first || el; }
    });
    if (!form.querySelector('input[name="role"]:checked')) {
      ok = false; setErr(form.querySelector('[data-group="role"]'), "Choose one");
      first = first || form.querySelector('input[name="role"]');
    }
    if (first) first.focus();
    return ok;
  }

  const demo = !C.SHEET_ENDPOINT;
  $("#demoNote").hidden = !demo;
  const btn = $("#submitBtn"), status = $("#formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    if (form.website_hp.value) return; // bot
    if (!validate()) { status.textContent = "Please complete the highlighted fields."; return; }
    btn.disabled = true; btn.innerHTML = "Sending…";
    const data = {};
    for (const [k, v] of new FormData(form).entries()) { if (k === "website_hp") continue; data[k] = data[k] ? data[k] + ", " + v : v; }
    const ref = "CN-" + Date.now().toString(36).toUpperCase().slice(-6);
    Object.assign(data, {
      reference: ref,
      source: new URLSearchParams(location.search).get("src") || "website",
      submittedAt: new Date().toISOString(),
      page: location.href.split("#")[0]
    });
    try {
      if (!demo) {
        // Apps Script web apps don't return CORS headers on redirect → fire as a simple no-cors POST.
        await fetch(C.SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
      } else {
        console.info("[DEMO] Registration payload (not saved):", data);
        await new Promise((r) => setTimeout(r, 600));
      }
      $("#sName").textContent = data.fullName.split(/\s+/)[0];
      $("#sRef").textContent = ref;
      form.hidden = true;
      $("#success").classList.add("show");
    } catch (err) {
      console.error(err);
      status.textContent = "Couldn't reach the registration server. Please check your connection and try again.";
    }
    btn.disabled = false; btn.innerHTML = 'Register now <span class="arr">→</span>';
  });

  $("#againBtn").addEventListener("click", () => {
    form.reset(); $("#teamFields").hidden = true; count.textContent = "0";
    document.querySelectorAll("#promptChips .used").forEach((b) => b.classList.remove("used"));
    form.hidden = false; $("#success").classList.remove("show");
  });
})();
