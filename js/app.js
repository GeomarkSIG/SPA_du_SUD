/* SPA du Sud – application front (sans dépendance hors Leaflet, hébergée en local dans js/vendor)
   Conception : MAUME Robin – Geomark SIG Solutions – licence MIT */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignoré */ } } };
  const fmt = n => Number(n).toLocaleString("fr-FR");
  hydrateIcons();

  /* ---------- thème ---------- */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved) root.dataset.theme = saved;
  $("#theme").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  });

  /* ---------- petits effets : toast + pattes ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600);
  }
  function burst(x, y) {
    if (reduceMotion) return;
    for (let i = 0; i < 7; i++) {
      const p = document.createElement("span"); p.className = "paw-p"; p.innerHTML = ic("paw");
      const a = (Math.PI * 2 * i) / 7 + Math.random() * .6, d = 40 + Math.random() * 50;
      p.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px;--r:${Math.random() * 80 - 40}deg`;
      document.body.appendChild(p); setTimeout(() => p.remove(), 900);
    }
  }
  const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------- fenêtre (dialog) ---------- */
  const dlg = $("#dlg");
  let lastFocus = null;
  function openDlg(html) {
    lastFocus = document.activeElement;
    $("#dlg-body").innerHTML = html;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    $(".dlg-x", dlg).focus();
  }
  function closeDlg() { dlg.close ? dlg.close() : dlg.removeAttribute("open"); }
  dlg.addEventListener("close", () => { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest(".dlg-x")) closeDlg(); });

  /* ---------- compteurs animés ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.dataset.count !== undefined ? animateCount(e.target) : e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .2 }) : null;
  function observe(scope) {
    $$("[data-count]", scope).forEach(el => { if (el.dataset.done) return; el.dataset.done = 1; io ? io.observe(el) : animateCount(el); });
    $$(".reveal", scope).forEach(el => io ? io.observe(el) : el.classList.add("in"));
  }

  /* ---------- favoris ---------- */
  let favs = new Set((store.get("favs") || "").split(",").filter(Boolean));
  const updFav = () => { $("#fav-n").textContent = favs.size; $("#fav-btn").classList.toggle("has", favs.size > 0); };
  function toggleFav(id, el) {
    const a = ANIMAUX.find(x => x.id === id); if (!a) return;
    if (favs.has(id)) { favs.delete(id); toast(a.nom + " retiré de vos favoris"); }
    else { favs.add(id); toast(a.nom + " ajouté à vos favoris"); if (el) burst(...centerOf(el)); }
    store.set("favs", [...favs].join(",")); updFav();
    $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle("on", favs.has(id)); b.setAttribute("aria-pressed", favs.has(id)); });
  }
  $("#fav-btn").addEventListener("click", () => {
    const list = ANIMAUX.filter(a => favs.has(a.id));
    openDlg(`<h2 id="dlg-title">${ic("heart", "beat")} Mes favoris</h2>` + (list.length
      ? `<div class="fav-list">${list.map(a => `<button class="fav-row" data-open="${esc(a.id)}"><span class="mini">${avatar(a)}</span><span><b>${esc(a.nom)}</b><br><small>${esc(a.espece)} · ${esc(a.age)}</small></span>${ic("arrow")}</button>`).join("")}</div><p><a class="btn" href="#adopter" data-close>Faire une demande d'adoption</a></p>`
      : `<p>Touchez le cœur d'un animal pour le garder ici. Vos favoris restent sur cet appareil.</p>`));
  });
  updFav();

  /* ---------- avatars SVG des animaux ---------- */
  function avatar(a) {
    const dog = a.espece === "chien";
    const ears = dog
      ? `<path d="M40 60 Q18 70 22 120 Q40 110 56 82Z" fill="${a.c2}"/><path d="M160 60 Q182 70 178 120 Q160 110 144 82Z" fill="${a.c2}"/>`
      : `<path d="M44 78 L52 24 L88 56Z" fill="${a.c1}"/><path d="M156 78 L148 24 L112 56Z" fill="${a.c1}"/><path d="M54 62 L56 40 L74 56Z" fill="#f4a9b8"/><path d="M146 62 L144 40 L126 56Z" fill="#f4a9b8"/>`;
    const snout = dog ? `<ellipse cx="100" cy="112" rx="30" ry="22" fill="${a.c1 === "#2f2f33" ? "#444" : "#fff"}" opacity=".85"/>` : "";
    const whisk = dog ? "" : `<g stroke="#fff" stroke-width="2" opacity=".8"><path d="M60 108 L24 100M60 116 L24 118M140 108 L176 100M140 116 L176 118"/></g>`;
    return `<svg class="pet" viewBox="0 0 200 170" role="img" aria-label="Illustration ${esc(a.espece)} ${esc(a.nom)}">
      <g class="ears">${ears}</g><ellipse cx="100" cy="95" rx="62" ry="58" fill="${a.c1}"/>${snout}
      <g class="eyes"><circle cx="76" cy="86" r="8" fill="#1d1d1d"/><circle cx="124" cy="86" r="8" fill="#1d1d1d"/>
      <circle cx="79" cy="83" r="2.6" fill="#fff"/><circle cx="127" cy="83" r="2.6" fill="#fff"/></g>
      <path d="M92 104 h16 l-8 9z" fill="${dog ? "#222" : "#f08aa3"}"/>
      <path d="M100 113 v6 M100 119 q-8 8 -16 2 M100 119 q8 8 16 2" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>${whisk}</svg>`;
  }
  const taille = { S: "Petit", M: "Moyen", L: "Grand" };
  const energyBar = n => `<span class="energy" title="Niveau d'énergie">${ic("energy")} ${[1, 2, 3].map(i => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  const picOf = a => a.photo ? `<img src="${esc(a.photo)}" alt="${esc(a.nom)}" loading="lazy">` : avatar(a);
  function animalCard(a, score) {
    return `<article class="animal reveal" data-open="${esc(a.id)}" tabindex="0" role="button" aria-label="Voir le portrait de ${esc(a.nom)}">
      <div class="pic">${picOf(a)}<span class="badge">${ic(a.espece === "chien" ? "dog" : "cat")} ${a.sexe === "M" ? "Mâle" : "Femelle"}</span>${score != null ? `<span class="match">${score}% compatible</span>` : ""}
      <button class="favb ${favs.has(a.id) ? "on" : ""}" data-fav="${esc(a.id)}" aria-pressed="${favs.has(a.id)}" aria-label="Ajouter ${esc(a.nom)} aux favoris">${ic("heart")}</button></div>
      <div class="body"><h3>${esc(a.nom)}</h3>
      <div class="meta">${esc(a.age)} · ${taille[a.taille]}</div>
      <div class="chips">${a.traits.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      ${energyBar(a.energie)}
      <p class="clamp">${esc(a.histoire)}</p>
      <span class="more">Voir le portrait ${ic("arrow")}</span></div></article>`;
  }
  function animalDialog(a) {
    openDlg(`<div class="dlg-animal"><div class="pic">${picOf(a)}</div><div>
      <h2 id="dlg-title">${esc(a.nom)}</h2>
      <p class="meta">${ic(a.espece === "chien" ? "dog" : "cat")} ${a.espece === "chien" ? "Chien" : "Chat"} · ${a.sexe === "M" ? "Mâle" : "Femelle"} · ${esc(a.age)} · ${taille[a.taille]}</p>
      <div class="chips">${a.traits.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <p>${esc(a.histoire)}</p>
      <ul class="facts">
        <li>${ic("energy")} Énergie ${energyBar(a.energie)}</li>
        <li>${ic("child")} ${a.enfants ? "S'entend avec les enfants" : "Mieux sans enfants"}</li>
        <li>${ic("cat")} ${a.chats ? "S'entend avec les chats" : "Mieux sans autre chat/animal"}</li>
      </ul>
      <div class="cta"><a class="btn" href="#adopter" data-adopt="${esc(a.id)}" data-close>${ic("home")} Je veux l'adopter</a>
      <button class="btn ghost" data-fav="${esc(a.id)}" type="button">${ic("heart")} Favori</button>
      <button class="btn ghost" data-share="${esc(a.id)}" type="button">${ic("share")} Partager</button></div>
      <p class="src">Profil d'exemple – les animaux réels sont présentés sur la page Facebook du refuge.</p></div></div>`);
    $$(`[data-fav="${a.id}"]`, dlg).forEach(b => { b.classList.toggle("on", favs.has(a.id)); });
  }

  /* délégation : ouvrir un portrait, favoris, partage, scroll, fermeture */
  document.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav, fav); return; }
    const sh = e.target.closest("[data-share]");
    if (sh) {
      const a = ANIMAUX.find(x => x.id === sh.dataset.share), url = location.href.split("#")[0] + "#animaux", txt = `${a.nom} cherche une famille à la SPA du Sud !`;
      if (navigator.share) navigator.share({ title: a.nom, text: txt, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(txt + " " + url).then(() => toast("Lien copié dans le presse-papiers"));
      return;
    }
    const ad = e.target.closest("[data-adopt]");
    if (ad) { const a = ANIMAUX.find(x => x.id === ad.dataset.adopt); if (a) $("#adopt-animal").value = a.nom; burst(...centerOf(ad)); }
    if (e.target.closest("[data-close]")) closeDlg();
    const op = e.target.closest("[data-open]");
    if (op) { const a = ANIMAUX.find(x => x.id === op.dataset.open); if (a) { if (dlg.open) closeDlg(); animalDialog(a); } return; }
    const sc = e.target.closest("[data-scroll]");
    if (sc) { e.preventDefault(); $(sc.getAttribute("href")).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
    const go = e.target.closest("[data-go]");
    if (go) pendingScroll = go.dataset.go;
    const b = e.target.closest(".btn");
    if (b && !b.matches("[data-adopt]") && !reduceMotion && b.tagName !== "A") burst(...centerOf(b));
  });
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".animal[data-open]")) { e.preventDefault(); e.target.click(); }
  });
  let pendingScroll = null;

  /* ---------- accueil : projecteur animé ---------- */
  const spot = $("#spot"), feat = ANIMAUX.filter((_, i) => [0, 6, 1, 9, 2, 7].includes(i));
  let si = 0, spotTimer;
  function drawSpot(i) {
    const a = feat[i];
    spot.innerHTML = `<p class="spot-k">${ic("star")} À la une</p><button class="spot-pic" data-open="${esc(a.id)}" aria-label="Voir ${esc(a.nom)}">${picOf(a)}</button>
      <h3>${esc(a.nom)} <small>${esc(a.age)}</small></h3><div class="chips">${a.traits.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="dots-nav">${feat.map((_, k) => `<button class="${k === i ? "on" : ""}" data-spot="${k}" aria-label="Animal ${k + 1}"></button>`).join("")}</div>`;
  }
  function startSpot() { clearInterval(spotTimer); if (!reduceMotion) spotTimer = setInterval(() => { si = (si + 1) % feat.length; drawSpot(si); }, 5000); }
  spot.addEventListener("click", e => { const d = e.target.closest("[data-spot]"); if (d) { si = +d.dataset.spot; drawSpot(si); startSpot(); } });
  spot.addEventListener("mouseenter", () => clearInterval(spotTimer)); spot.addEventListener("mouseleave", startSpot);
  drawSpot(0); startSpot();

  /* parallaxe douce de la photo */
  const heroBg = $(".hero-bg");
  if (!reduceMotion) addEventListener("scroll", () => { if (scrollY < 900) heroBg.style.transform = `translateY(${scrollY * .25}px) scale(1.08)`; }, { passive: true });

  /* tuiles chiffrées + fenêtres de détail */
  const totAdopt = FLUX.reduce((s, f) => s + f.adoptes, 0);
  const last = FLUX[FLUX.length - 1];
  const TILES = [
    { ic: "home", n: 102, lab: "places au refuge « Chance »", d: () => `<h2 id="dlg-title">${ic("home")} Refuge « Chance »</h2><p>Capacité autorisée de <b>102 animaux</b> : 66 chiens et 36 chats. Le refuge dispose d'une salle de toilettage et d'un espace de promenade, et s'occupe des soins, de l'alimentation, de la stérilisation et de l'adoption.</p><div class="gauges">${[["Chiens", 66, 102], ["Chats", 36, 102]].map(g => `<div class="hbar"><span>${g[0]}</span><div class="track"><div class="fill" style="--c:#0f6e7a;width:${g[1] / g[2] * 100}%"></div></div><b>${g[1]}</b></div>`).join("")}</div><p class="src">Source : CIVIS – Le Centre Animalier. D'autres sources citent 28 box pour chiens et une chatterie jusqu'à 45 chats : capacités à confirmer avec l'association.</p>` },
    { ic: "heart", n: totAdopt, lab: "adoptions de 2018 à 2022", d: () => `<h2 id="dlg-title">${ic("heart", "beat")} Adoptions par année</h2><div class="gauges">${FLUX.map(f => `<div class="hbar"><span>${f.an}</span><div class="track"><div class="fill" style="--c:#e4572e;width:${f.adoptes / 750 * 100}%"></div></div><b>${f.adoptes}</b></div>`).join("")}</div><p class="src">Source : CIVIS – Le Centre Animalier (chiffres du centre animalier de Saint-Pierre).</p>` },
    { ic: "alert", n: last.entrees, lab: "animaux entrés en fourrière en 2022", d: () => `<h2 id="dlg-title">${ic("alert")} Que deviennent-ils ?</h2><p>En 2022 : <b>${fmt(last.entrees)}</b> entrées, dont <b>${last.restitues}</b> rendus à leur propriétaire et <b>${last.refuge}</b> transférés au refuge. Le reste n'a pas d'issue publiée dans la source (adoption directe, autres issues, euthanasie).</p><p><a class="btn" href="#fonctionnement" data-close>Comprendre le fonctionnement</a></p>` },
    { ic: "waves", n: 2000, lab: "m² d'espace de jeux près de la mer", d: () => `<h2 id="dlg-title">${ic("waves")} Un refuge face à l'océan</h2><p>Le centre dispose d'un terrain de jeux d'environ 2 000 m² en bord de mer où les animaux peuvent se dépenser. Les bénévoles prolongent la sortie par des balades vers la plage de la Pointe du Diable.</p><p><a class="btn" href="#benevolat" data-close data-go="walk">${ic("route")} Voir les balades</a></p>` }
  ];
  $("#tiles").innerHTML = TILES.map((t, i) => `<button class="tile reveal" data-tile="${i}"><span class="ico">${ic(t.ic)}</span><b data-count="${t.n}">0</b><span class="lab">${esc(t.lab)}</span><span class="plus">${ic("arrow")}</span></button>`).join("");
  $("#tiles").addEventListener("click", e => { const t = e.target.closest("[data-tile]"); if (t) openDlg(TILES[+t.dataset.tile].d()); });

  /* carrousel */
  const car = $("#home-animals");
  car.innerHTML = ANIMAUX.filter((_, i) => [0, 1, 6, 9, 2, 7, 3, 10].includes(i)).map(a => animalCard(a)).join("");
  const step = () => (car.firstElementChild ? car.firstElementChild.getBoundingClientRect().width + 18 : 280);
  $("#car-prev").addEventListener("click", () => car.scrollBy({ left: -step(), behavior: "smooth" }));
  $("#car-next").addEventListener("click", () => car.scrollBy({ left: step(), behavior: "smooth" }));

  /* parcours d'adoption interactif */
  const STEPS = [
    ["Rencontrer", "paw", "Venez au refuge ou parcourez les portraits : touchez le cœur pour garder vos coups de cœur."],
    ["Se connaître", "users", "Un échange avec l'équipe pour trouver le bon match entre votre mode de vie et le caractère de l'animal."],
    ["Dossier", "mail", "Remplissez la demande d'adoption en ligne ou sur place."],
    ["Contrat", "shield", "Signature du contrat, frais d'adoption, carnet de santé et identification (puce)."],
    ["Suivi", "heart", "Nous prenons des nouvelles : l'équipe reste à vos côtés pendant la période d'adaptation."]
  ];
  const stepper = $("#stepper"), sNav = $(".stepper-nav", stepper), sBody = $(".stepper-body", stepper);
  sNav.innerHTML = STEPS.map((s, i) => `<button role="tab" data-s="${i}" aria-selected="${i === 0}" class="${i === 0 ? "on" : ""}"><span class="n">${i + 1}</span><span class="t">${s[0]}</span></button>`).join("");
  function drawStep(i) {
    $$("button", sNav).forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", k < i); b.setAttribute("aria-selected", k === i); });
    sBody.innerHTML = `<span class="ico big">${ic(STEPS[i][1])}</span><div><h3>${i + 1}. ${STEPS[i][0]}</h3><p>${STEPS[i][2]}</p>${i === 2 ? `<a class="btn" href="#adopter">Ouvrir le formulaire</a>` : i === 0 ? `<a class="btn" href="#animaux">Voir les animaux</a>` : ""}</div>`;
  }
  sNav.addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) drawStep(+b.dataset.s); });
  drawStep(0);
  $("#steps-adopt").innerHTML = STEPS.map(s => `<li class="reveal"><span class="ico">${ic(s[1])}</span><b>${s[0]}</b><span>${s[2]}</span></li>`).join("");

  /* ---------- animaux : filtres + questionnaire ---------- */
  const grid = $("#all-animals");
  let scores = null;
  function renderAnimals() {
    const f = { e: $("#f-esp").value, t: $("#f-taille").value, n: $("#f-energie").value, k: $("#f-enfants").checked, c: $("#f-chats").checked };
    let list = ANIMAUX.filter(a => (!f.e || a.espece === f.e) && (!f.t || a.taille === f.t) && (!f.n || a.energie === +f.n) && (!f.k || a.enfants) && (!f.c || a.chats));
    if (scores) list = list.slice().sort((a, b) => scores[b.id] - scores[a.id]);
    grid.innerHTML = list.length ? list.map(a => animalCard(a, scores ? scores[a.id] : null)).join("") : `<p>Aucun animal ne correspond à ces critères. Essayez d'élargir la recherche.</p>`;
    $("#f-count").textContent = list.length + " animal" + (list.length > 1 ? "aux" : "");
    observe(grid);
  }
  $$("#f-esp,#f-taille,#f-energie,#f-enfants,#f-chats").forEach(el => el.addEventListener("change", () => { scores = null; renderAnimals(); }));
  $("#q-go").addEventListener("click", () => {
    const log = $("#q-log").value, r = +$("#q-rythme").value, enf = $("#q-enf").value === "oui", autre = $("#q-autre").value;
    scores = {};
    ANIMAUX.forEach(a => {
      let s = 50;
      s += 20 - Math.abs(a.energie - r) * 10;
      if (enf) s += a.enfants ? 10 : -30;
      if (autre === "chat") s += a.chats ? 10 : -30;
      if (log === "app") s += a.espece === "chat" || a.taille === "S" ? 10 : (a.taille === "L" ? -20 : -5);
      scores[a.id] = Math.max(5, Math.min(100, s));
    });
    renderAnimals();
    grid.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
  const sel = $("#adopt-animal");
  sel.insertAdjacentHTML("beforeend", ANIMAUX.map(a => `<option value="${esc(a.nom)}">${esc(a.nom)} (${esc(a.espece)}, ${esc(a.age)})</option>`).join(""));

  /* ---------- adopter : checklist ---------- */
  const CHECK = ["J'ai l'accord de toute la famille (et du propriétaire si je loue).", "J'ai le budget : nourriture, vétérinaire, assurance (environ quelques dizaines d'euros par mois).",
    "Je peux consacrer du temps chaque jour à mon animal.", "Mon logement est sécurisé (clôture, fenêtres, cyclone).",
    "Je suis prêt·e à m'engager pour 10 à 20 ans.", "Je sais que les premières semaines demandent de la patience."];
  $("#checklist").innerHTML = CHECK.map((t, i) => `<li><label><input type="checkbox" data-c="${i}"> ${esc(t)}</label></li>`).join("");
  $("#checklist").addEventListener("change", e => {
    const n = $$("#checklist input:checked").length;
    $("#check-bar").style.width = (n / CHECK.length * 100) + "%";
    $("#check-txt").textContent = n + " / " + CHECK.length + (n === CHECK.length ? " – vous êtes prêt·e !" : " prêt·e");
    if (n === CHECK.length) { burst(...centerOf($("#check-bar"))); toast("Bravo, vous êtes prêt·e à adopter !"); }
  });
  $("#check-txt").textContent = "0 / " + CHECK.length + " prêt·e";

  /* ---------- dons ---------- */
  let amount = 20;
  function calcDon() {
    const m = $("input[name=freq]:checked").value === "mensuel";
    const net = amount * 0.34;
    $("#don-calc").innerHTML = amount > 0
      ? `Don de <b>${amount} €</b>${m ? " / mois" : ""}. Après réduction d'impôt de 66 % (cas général) : coût réel d'environ <b>${net.toFixed(2).replace(".", ",")} €</b>${m ? " / mois" : ""}.`
      : "Indiquez un montant.";
  }
  $$(".amounts button").forEach(b => b.addEventListener("click", () => {
    $$(".amounts button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    amount = +b.dataset.a; $("#don-other").value = ""; calcDon();
  }));
  $("#don-other").addEventListener("input", e => { $$(".amounts button").forEach(x => x.classList.remove("on")); amount = Math.max(0, +e.target.value || 0); calcDon(); });
  $$("input[name=freq]").forEach(r => r.addEventListener("change", calcDon));
  calcDon();

  /* ---------- bénévolat : missions cliquables ---------- */
  $("#missions").innerHTML = MISSIONS.map(m => `<button class="mission reveal" data-mission="${esc(m.id)}"><span class="ico big">${ic(m.ico)}</span><h3>${esc(m.titre)}</h3><p>${esc(m.desc)}</p>
    <div class="need"><span>${ic("clock")} ${esc(m.duree)}</span><span class="dots" title="${esc(m.besoin)}">${[1, 2, 3].map(i => `<i class="${i <= m.niveau ? "on" : ""}"></i>`).join("")} ${esc(m.besoin)}</span></div></button>`).join("");
  $("#b-missions").innerHTML = MISSIONS.map(m => `<label>${ic(m.ico)} <input type="checkbox" name="mission" value="${esc(m.titre)}"> ${esc(m.titre)}</label>`).join("");
  $("#missions").addEventListener("click", e => {
    const b = e.target.closest("[data-mission]"); if (!b) return;
    const m = MISSIONS.find(x => x.id === b.dataset.mission);
    openDlg(`<h2 id="dlg-title"><span class="ico">${ic(m.ico)}</span> ${esc(m.titre)}</h2><p>${esc(m.desc)}</p><p class="meta">${ic("clock")} ${esc(m.duree)} · ${esc(m.besoin)}</p><div class="cta"><button class="btn" data-join="${esc(m.titre)}" type="button">${ic("check")} Je m'inscris à cette mission</button></div>`);
  });
  dlg.addEventListener("click", e => {
    const j = e.target.closest("[data-join]"); if (!j) return;
    const box = $$("#b-missions input").find(i => i.value === j.dataset.join); if (box) box.checked = true;
    burst(...centerOf(j)); closeDlg(); toast("Mission ajoutée à votre inscription");
    $("#form-benev").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
  $("#r-pointe").textContent = `${ROUTES.pointe.km} km · ≈ ${ROUTES.pointe.min} min à pied`;
  $("#r-aeroport").textContent = `${ROUTES.aeroport.km} km · ≈ ${ROUTES.aeroport.min} min à pied`;

  /* ---------- équipe ---------- */
  const person = p => `<div class="person reveal" style="--c:${p.c || "#0f6e7a"}"><div class="av">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.nom)}">` : ic("user")}</div><b>${esc(p.role)}</b><span class="nm">${esc(p.nom)}</span><p>${esc(p.desc)}</p></div>`;
  $("#org").innerHTML = `<div class="lvl ca"><div class="person"><b>${ic("building")} ${esc(EQUIPE.ca.titre)}</b><span class="nm">${esc(EQUIPE.ca.noms.join(", "))}</span></div></div>
    <div class="lvl">${EQUIPE.direction.map(person).join("")}</div>
    <div class="lvl">${EQUIPE.salaries.map(person).join("")}</div>
    <div class="lvl"><div class="person" style="--c:#f6b73c"><div class="av">${ic("users")}</div><b>Bénévoles</b><span class="nm">Tout notre réseau</span><p>Six pôles ci‑dessous, ouverts à toutes et tous.</p></div></div>`;
  $("#vols").innerHTML = EQUIPE.benevoles.map((v, i) => `<div class="vol reveal"><span class="ico">${ic(MISSIONS[i] ? MISSIONS[i].ico : "paw")}</span><b>${esc(v.role)}</b><span>${esc(v.desc)}</span></div>`).join("");

  /* ---------- fonctionnement : graphique + simulateur ---------- */
  const yearsEl = $("#years"), chart = $("#chart");
  FLUX.forEach((f, i) => yearsEl.insertAdjacentHTML("beforeend", `<button role="tab" data-i="${i}" class="${i === FLUX.length - 1 ? "on" : ""}">${f.an}</button>`));
  function drawYear(i) {
    const f = FLUX[i], autre = Math.max(0, f.entrees - f.restitues - f.refuge);
    const rows = [["Entrées en fourrière", f.entrees, "#0f6e7a"], ["Restitués au propriétaire", f.restitues, "#2e8b57"], ["Transférés au refuge", f.refuge, "#f6b73c"], ["Adoptés (année)", f.adoptes, "#17a398"], ["Ni restitués ni transférés*", autre, "#c0392b"]];
    chart.innerHTML = rows.map(r => `<div class="hbar"><span>${r[0]}</span><div class="track"><div class="fill" style="--c:${r[2]}" data-w="${(r[1] / 1500 * 100).toFixed(1)}"></div></div><b>${fmt(r[1])}</b></div>`).join("")
      + `<p class="src">* ${(autre / f.entrees * 100).toFixed(0)} % des entrées : inclut notamment les euthanasies (non détaillées dans la source).</p>`;
    requestAnimationFrame(() => requestAnimationFrame(() => $$(".fill", chart).forEach(e => e.style.width = e.dataset.w + "%")));
  }
  yearsEl.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", yearsEl).forEach(x => x.classList.toggle("on", x === b)); drawYear(+b.dataset.i);
  });
  drawYear(FLUX.length - 1);

  const sim = $("#sim");
  function drawSim() {
    const free = +sim.value, occ = 102 - free, pct = occ / 102 * 100;
    $("#sim-val").textContent = free;
    const bar = $("#sim-bar"); bar.style.width = pct + "%";
    bar.style.background = pct < 70 ? "#2e8b57" : pct < 92 ? "#f6b73c" : "#c0392b";
    $("#sim-txt").textContent = free === 0 ? "Refuge plein : plus aucun transfert possible. Les animaux de la fourrière n'ont plus d'issue vivante une fois le délai légal écoulé, sauf adoption ou famille d'accueil immédiate."
      : free < 10 ? "Presque complet : seuls quelques animaux peuvent sortir de la fourrière. Chaque adoption libère immédiatement une place."
      : free < 40 ? "Des places existent, mais les entrées en fourrière (≈ 100 par mois) dépassent vite la capacité si les adoptions ralentissent."
      : "Le refuge peut accueillir plusieurs animaux de la fourrière cette semaine.";
  }
  sim.addEventListener("input", drawSim); drawSim();
  $$("#flow .node").forEach(n => n.setAttribute("tabindex", "0"));

  /* ---------- cartes Leaflet ---------- */
  const maps = {};
  const mapErr = id => { const el = $(id); if (el) el.innerHTML = "<p style='padding:20px'>La carte n'a pas pu être chargée.</p>"; };
  /* Fond : Esri World Street Map (données OSM), repli sur le serveur OSM si Esri échoue.
     tile.openstreetmap.org seul renvoie 403 sans Referer (ouverture en file://). */
  const base = () => {
    const esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: 'Tiles © <a href="https://www.esri.com">Esri</a> — données © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let errors = 0;
    esri.on("tileerror", () => {
      if (++errors !== 6 || !esri._map) return;
      const map = esri._map; map.removeLayer(esri);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, referrerPolicy: "origin", attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    });
    return esri;
  };
  const pinIcon = (t, glyph) => L.divIcon({ className: "", html: `<span class="pin ${t}"><span>${ic(glyph || "paw")}</span></span>`, iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30] });
  const popup = (title, rows, extra) => `<div class="pop"><h4>${title}</h4>${rows.map(r => `<p>${ic(r[0])}<span>${r[1]}</span></p>`).join("")}${extra || ""}</div>`;

  function initWalk() {
    const m = L.map("map-walk", { scrollWheelZoom: false }).setView(SITE.coord, 14); base().addTo(m);
    m.on("focus", () => m.scrollWheelZoom.enable()); m.on("blur", () => m.scrollWheelZoom.disable());
    L.marker(SITE.coord, { icon: pinIcon("both", "paw") }).addTo(m).bindPopup(popup("Refuge SPA du Sud", [["pin", "Départ des balades (position approximative)"], ["phone", SITE.tel]]));
    const spec = {
      pointe: { color: "#e4572e", end: "Plage de la Pointe du Diable", glyph: "waves", info: "Sentier littoral jusqu'à l'escalier de la plage" },
      aeroport: { color: "#0f6e7a", end: "Aéroport de Pierrefonds (clôture littorale)", glyph: "plane", info: "Le long de la clôture, côté mer – on n'entre pas dans l'aéroport" }
    };
    const layers = {}; let cur = "pointe", walker = null, anim = null;
    const dist = (a, b) => m.distance(a, b);
    Object.keys(spec).forEach(k => {
      const r = ROUTES[k], s = spec[k];
      const line = L.polyline(r.pts, { color: s.color, weight: 6, opacity: .95, lineCap: "round", className: "route-line" });
      const casing = L.polyline(r.pts, { color: "#fff", weight: 10, opacity: .9 });
      const end = L.marker(r.pts[r.pts.length - 1], { icon: pinIcon(k === "pointe" ? "refuge" : "fourriere", s.glyph) })
        .bindPopup(popup(s.end, [["route", `${r.km} km · ≈ ${r.min} min à pied`], ["info", s.info]]));
      layers[k] = L.layerGroup([casing, line, end]);
    });
    const hud = $("#walk-hud");
    function stopAnim() { if (anim) cancelAnimationFrame(anim); anim = null; if (walker) { m.removeLayer(walker); walker = null; } $("#walk-play").innerHTML = ic("walk") + " Simuler la balade"; }
    function show(k) {
      stopAnim(); cur = k;
      Object.values(layers).forEach(l => m.removeLayer(l)); layers[k].addTo(m);
      m.fitBounds(L.latLngBounds(ROUTES[k].pts).pad(.18));
      $$(".route").forEach(b => b.classList.toggle("on", b.dataset.r === k));
      hud.innerHTML = `<b>${ic(k === "pointe" ? "waves" : "plane")} ${esc(spec[k].end)}</b><span>${ROUTES[k].km} km · ≈ ${ROUTES[k].min} min</span>`;
    }
    $$(".route").forEach(b => b.addEventListener("click", () => show(b.dataset.r)));
    $("#walk-play").addEventListener("click", () => {
      if (anim) { stopAnim(); return; }
      const pts = ROUTES[cur].pts.map(p => L.latLng(p[0], p[1])), seg = [], total = pts.reduce((s, p, i) => { const d = i ? dist(pts[i - 1], p) : 0; seg.push(d); return s + d; }, 0);
      walker = L.marker(pts[0], { icon: L.divIcon({ className: "", html: `<span class="walker">${ic("dog")}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] }), zIndexOffset: 1000 }).addTo(m);
      $("#walk-play").innerHTML = ic("x") + " Arrêter";
      const dur = reduceMotion ? 1 : 14000, t0 = performance.now();
      (function frame(t) {
        const p = Math.min(1, (t - t0) / dur); let target = p * total, i = 1;
        while (i < pts.length - 1 && target > seg[i]) { target -= seg[i]; i++; }
        const a = pts[i - 1], b = pts[i], f = seg[i] ? Math.min(1, target / seg[i]) : 1;
        walker.setLatLng([a.lat + (b.lat - a.lat) * f, a.lng + (b.lng - a.lng) * f]);
        hud.innerHTML = `<b>${ic("walk")} ${Math.round(p * ROUTES[cur].km * 1000)} m parcourus</b><span>${Math.round(p * ROUTES[cur].min)} / ${ROUTES[cur].min} min</span>`;
        if (p < 1) anim = requestAnimationFrame(frame); else { anim = null; toast("Arrivés ! " + spec[cur].end); $("#walk-play").innerHTML = ic("walk") + " Rejouer"; }
      })(t0);
    });
    maps.walk = m; show("pointe");
  }

  function initMap(name) {
    if (typeof L === "undefined") { mapErr(name === "walk" ? "#map-walk" : name === "island" ? "#map-island" : "#map-contact"); return; }
    if (maps[name]) { setTimeout(() => maps[name].invalidateSize(), 50); return; }
    if (name === "contact") {
      const m = L.map("map-contact", { scrollWheelZoom: false }).setView(SITE.coord, 15); base().addTo(m);
      m.on("focus", () => m.scrollWheelZoom.enable()); m.on("blur", () => m.scrollWheelZoom.disable());
      L.marker(SITE.coord, { icon: pinIcon("both", "paw") }).addTo(m).bindPopup(popup("SPA du Sud", [["pin", esc(SITE.adresse)], ["phone", esc(SITE.tel)], ["info", "Position approximative"]])).openPopup();
      maps.contact = m;
    }
    if (name === "walk") initWalk();
    if (name === "island") {
      const m = L.map("map-island", { scrollWheelZoom: false }).setView([-21.12, 55.53], 10); base().addTo(m);
      m.on("focus", () => m.scrollWheelZoom.enable()); m.on("blur", () => m.scrollWheelZoom.disable());
      const lbl = { both: "Refuge + fourrière", refuge: "Refuge", fourriere: "Fourrière" }, gl = { both: "paw", refuge: "home", fourriere: "alert" };
      const pts = [];
      STRUCTURES.forEach(s => {
        pts.push(s.coord);
        L.marker(s.coord, { icon: pinIcon(s.type, gl[s.type]), title: s.nom }).addTo(m).bindPopup(
          popup(esc(s.nom), [["info", `<i>${lbl[s.type]} · ${esc(s.zone)}</i>`], ["pin", esc(s.adresse)], ["phone", esc(s.tel)], ["route", `${s.coord[0].toFixed(5)}, ${s.coord[1].toFixed(5)}`]],
            `<p class="small">${esc(s.info)}</p><a class="pop-btn" href="https://www.openstreetmap.org/directions?to=${s.coord[0]}%2C${s.coord[1]}" target="_blank" rel="noopener">Itinéraire ↗</a>`), { maxWidth: 320 });
      });
      m.fitBounds(L.latLngBounds(pts).pad(.12));
      maps.island = m;
    }
  }

  /* ---------- navigation par onglets ---------- */
  const tabs = $$(".tab").map(t => t.id);
  function show(id) {
    if (!tabs.includes(id)) id = "accueil";
    $$(".tab").forEach(t => t.hidden = t.id !== id);
    $$("nav a").forEach(a => { const on = a.dataset.tab === id; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); });
    $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false");
    const sec = $("#" + id);
    document.title = (id === "accueil" ? "" : (sec.querySelector("h1")?.textContent + " – ")) + "SPA du Sud – Saint-Pierre, La Réunion";
    window.scrollTo(0, 0);
    document.body.classList.toggle("on-home", id === "accueil");
    if (id === "animaux") renderAnimals();
    if (id === "contact") initMap("contact");
    if (id === "benevolat") initMap("walk");
    if (id === "fonctionnement") { initMap("island"); drawYear(+$("#years .on").dataset.i); }
    observe(sec);
    if (pendingScroll === "walk" && id === "benevolat") { setTimeout(() => $("#map-walk").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }), 120); }
    pendingScroll = null;
  }
  const route = () => show((location.hash || "#accueil").slice(1));
  window.addEventListener("hashchange", route);
  $("#burger").addEventListener("click", () => { const o = $("#nav").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); });

  /* ---------- formulaires (mailto, aucun serveur) ---------- */
  function mailForm(form, subject, extra, okId) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      $$("input,textarea,select", form).forEach(i => i.classList.add("touched"));
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const fd = new FormData(form), lines = [];
      for (const [k, v] of fd.entries()) if (!["rgpd", "engage", "mission"].includes(k) && v) lines.push(`${k} : ${v}`);
      if (extra) lines.unshift(...extra());
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      const ok = $(okId); ok.hidden = false;
      ok.textContent = "Merci ! Votre messagerie s'ouvre avec le message prêt à envoyer. Si rien ne s'ouvre, écrivez-nous à " + SITE.email + ".";
      const btn = $("button[type=submit]", form); if (btn) burst(...centerOf(btn));
    });
  }
  mailForm($("#form-adopt"), "Demande d'adoption", null, "#ok-adopt");
  mailForm($("#form-don"), "Annonce de don", () => [`montant : ${amount} € (${$("input[name=freq]:checked").value})`], "#ok-don");
  mailForm($("#form-benev"), "Inscription bénévole", () => ["missions : " + ($$("input[name=mission]:checked").map(i => i.value).join(", ") || "non précisé")], "#ok-benev");
  mailForm($("#form-contact"), "Message depuis le site", null, "#ok-contact");

  observe(document);
  route();
})();
