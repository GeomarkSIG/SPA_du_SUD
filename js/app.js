/* SPA du Sud – application front (sans dépendance hors Leaflet)
   Conception : MAUME Robin – Geomark SIG Solutions – licence MIT */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignoré */ } } };

  /* ---------- thème ---------- */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved) root.dataset.theme = saved;
  $("#theme").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  });

  /* ---------- compteurs animés ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = target.toLocaleString("fr-FR"); return; }
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString("fr-FR");
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.dataset.count !== undefined ? animateCount(e.target) : e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .3 }) : null;
  function observe(scope) {
    $$("[data-count]", scope).forEach(el => { if (el.dataset.done) return; el.dataset.done = 1; io ? io.observe(el) : animateCount(el); });
    $$(".reveal", scope).forEach(el => io ? io.observe(el) : el.classList.add("in"));
  }

  /* ---------- avatars SVG des animaux ---------- */
  function avatar(a) {
    const dog = a.espece === "chien";
    const ears = dog
      ? `<path d="M40 60 Q18 70 22 120 Q40 110 56 82Z" fill="${a.c2}"/><path d="M160 60 Q182 70 178 120 Q160 110 144 82Z" fill="${a.c2}"/>`
      : `<path d="M44 78 L52 24 L88 56Z" fill="${a.c1}"/><path d="M156 78 L148 24 L112 56Z" fill="${a.c1}"/><path d="M54 62 L56 40 L74 56Z" fill="#f4a9b8"/><path d="M146 62 L144 40 L126 56Z" fill="#f4a9b8"/>`;
    const snout = dog ? `<ellipse cx="100" cy="112" rx="30" ry="22" fill="${a.c1 === "#2f2f33" ? "#444" : "#fff"}" opacity=".85"/>` : "";
    const whisk = dog ? "" : `<g stroke="#fff" stroke-width="2" opacity=".8"><path d="M60 108 L24 100M60 116 L24 118M140 108 L176 100M140 116 L176 118"/></g>`;
    return `<svg viewBox="0 0 200 170" role="img" aria-label="Illustration ${esc(a.espece)} ${esc(a.nom)}">
      ${ears}<ellipse cx="100" cy="95" rx="62" ry="58" fill="${a.c1}"/>${snout}
      <circle cx="76" cy="86" r="8" fill="#1d1d1d"/><circle cx="124" cy="86" r="8" fill="#1d1d1d"/>
      <circle cx="79" cy="83" r="2.6" fill="#fff"/><circle cx="127" cy="83" r="2.6" fill="#fff"/>
      <path d="M92 104 h16 l-8 9z" fill="${dog ? "#222" : "#f08aa3"}"/>
      <path d="M100 113 v6 M100 119 q-8 8 -16 2 M100 119 q8 8 16 2" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>${whisk}</svg>`;
  }
  const taille = { S: "Petit", M: "Moyen", L: "Grand" };
  function animalCard(a, score) {
    const pic = a.photo ? `<img src="${esc(a.photo)}" alt="${esc(a.nom)}" loading="lazy">` : avatar(a);
    return `<article class="animal reveal">
      <div class="pic">${pic}<span class="badge">${a.espece === "chien" ? "🐕" : "🐈"} ${esc(a.sexe === "M" ? "Mâle" : "Femelle")}</span>${score != null ? `<span class="match">${score}% compatible</span>` : ""}</div>
      <div class="body"><h3>${esc(a.nom)}</h3>
      <div class="meta">${esc(a.age)} · ${taille[a.taille]}</div>
      <div class="chips">${a.traits.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="energy" title="Niveau d'énergie">Énergie ${[1, 2, 3].map(i => `<i class="${i <= a.energie ? "on" : ""}"></i>`).join("")}</div>
      <p>${esc(a.histoire)}</p>
      <p class="meta">${a.enfants ? "👶 OK enfants" : "👶 Sans enfants"} · ${a.chats ? "🐈 OK chats" : "🐈 Sans chats"}</p>
      <a class="btn" href="#adopter" data-adopt="${esc(a.id)}">Je veux l'adopter</a></div></article>`;
  }

  /* ---------- accueil ---------- */
  const STEPS = [
    ["Rencontrer", "Venez au refuge ou parcourez les portraits."],
    ["Se connaître", "Un échange avec l'équipe pour trouver le bon match."],
    ["Dossier", "Remplissez la demande d'adoption (en ligne ou sur place)."],
    ["Contrat", "Signature, frais d'adoption, carnet de santé et puce."],
    ["Suivi", "Nous prenons des nouvelles : l'équipe reste à vos côtés."]
  ];
  const stepsHtml = STEPS.map(s => `<li class="reveal"><b>${s[0]}</b><span>${s[1]}</span></li>`).join("");
  $("#steps-home").innerHTML = stepsHtml;
  $("#steps-adopt").innerHTML = stepsHtml;
  $("#home-animals").innerHTML = ANIMAUX.filter((_, i) => [0, 1, 6, 9].includes(i)).map(a => animalCard(a)).join("");

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
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-adopt]");
    if (b) { const a = ANIMAUX.find(x => x.id === b.dataset.adopt); if (a) sel.value = a.nom; }
  });

  /* ---------- adopter : checklist ---------- */
  const CHECK = ["J'ai l'accord de toute la famille (et du propriétaire si je loue).", "J'ai le budget : nourriture, vétérinaire, assurance (environ quelques dizaines d'euros par mois).",
    "Je peux consacrer du temps chaque jour à mon animal.", "Mon logement est sécurisé (clôture, fenêtres, cyclone).",
    "Je suis prêt·e à m'engager pour 10 à 20 ans.", "Je sais que les premières semaines demandent de la patience."];
  $("#checklist").innerHTML = CHECK.map((t, i) => `<li><label><input type="checkbox" data-c="${i}"> ${esc(t)}</label></li>`).join("");
  $("#checklist").addEventListener("change", () => {
    const n = $$("#checklist input:checked").length;
    $("#check-bar").style.width = (n / CHECK.length * 100) + "%";
    $("#check-txt").textContent = n + " / " + CHECK.length + (n === CHECK.length ? " – vous êtes prêt·e ! 🎉" : " prêt·e");
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

  /* ---------- bénévolat ---------- */
  $("#missions").innerHTML = MISSIONS.map(m => `<article class="mission reveal"><span class="ico">${m.ico}</span><h3>${esc(m.titre)}</h3><p>${esc(m.desc)}</p>
    <div class="need"><span>⏱ ${esc(m.duree)}</span><span class="dots" title="${esc(m.besoin)}">${[1, 2, 3].map(i => `<i class="${i <= m.niveau ? "on" : ""}"></i>`).join("")} ${esc(m.besoin)}</span></div></article>`).join("");
  $("#b-missions").innerHTML = MISSIONS.map(m => `<label><input type="checkbox" name="mission" value="${esc(m.titre)}"> ${m.ico} ${esc(m.titre)}</label>`).join("");
  $("#r-pointe").textContent = `${ROUTES.pointe.km} km · ≈ ${ROUTES.pointe.min} min à pied`;
  $("#r-aeroport").textContent = `${ROUTES.aeroport.km} km · ≈ ${ROUTES.aeroport.min} min à pied`;

  /* ---------- équipe ---------- */
  const person = p => `<div class="person" style="--c:${p.c || "#0f6e7a"}"><div class="av">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.nom)}">` : "👤"}</div><b>${esc(p.role)}</b><span class="nm">${esc(p.nom)}</span><p>${esc(p.desc)}</p></div>`;
  $("#org").innerHTML = `<div class="lvl ca"><div class="person"><b>🏛️ ${esc(EQUIPE.ca.titre)}</b><span class="nm">${esc(EQUIPE.ca.noms.join(", "))}</span></div></div>
    <div class="lvl">${EQUIPE.direction.map(person).join("")}</div>
    <div class="lvl">${EQUIPE.salaries.map(person).join("")}</div>
    <div class="lvl"><div class="person" style="--c:#f6b73c"><div class="av">🤝</div><b>Bénévoles</b><span class="nm">Tout notre réseau</span><p>Six pôles ci‑dessous, ouverts à toutes et tous.</p></div></div>`;
  $("#vols").innerHTML = EQUIPE.benevoles.map(v => `<div class="vol reveal"><b>${esc(v.role)}</b><span>${esc(v.desc)}</span></div>`).join("");

  /* ---------- fonctionnement : graphique + simulateur ---------- */
  const yearsEl = $("#years"), chart = $("#chart");
  FLUX.forEach((f, i) => yearsEl.insertAdjacentHTML("beforeend", `<button role="tab" data-i="${i}" class="${i === FLUX.length - 1 ? "on" : ""}">${f.an}</button>`));
  function drawYear(i) {
    const f = FLUX[i], autre = Math.max(0, f.entrees - f.restitues - f.refuge);
    const rows = [["Entrées en fourrière", f.entrees, "#0f6e7a"], ["Restitués au propriétaire", f.restitues, "#2e8b57"], ["Transférés au refuge", f.refuge, "#f6b73c"], ["Adoptés (année)", f.adoptes, "#17a398"], ["Ni restitués ni transférés*", autre, "#c0392b"]];
    chart.innerHTML = rows.map(r => `<div class="hbar"><span>${r[0]}</span><div class="track"><div class="fill" style="--c:${r[2]}" data-w="${(r[1] / 1500 * 100).toFixed(1)}"></div></div><b>${r[1].toLocaleString("fr-FR")}</b></div>`).join("")
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

  /* ---------- cartes Leaflet (init paresseuse) ---------- */
  const maps = {};
  /* Fond de carte : tile.openstreetmap.org renvoie 403 sans Referer (file://, politiques strictes) et CARTO exige désormais une clé.
     Esri World Street Map (données OSM incluses) en principal, OSM standard en repli si Esri échoue. */
  const osm = () => {
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
  const pinIcon = t => L.divIcon({ className: "", html: `<span class="pin ${t}"></span>`, iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -26] });
  const labelIcon = (txt) => L.divIcon({ className: "", html: `<span style="background:#fff;color:#222;border:2px solid #0f6e7a;border-radius:8px;padding:2px 8px;font:600 12px system-ui;white-space:nowrap;box-shadow:0 1px 4px #0005">${txt}</span>`, iconAnchor: [0, 10] });
  function initMap(name) {
    if (typeof L === "undefined") { const el = $(name === "walk" ? "#map-walk" : name === "island" ? "#map-island" : "#map-contact"); if (el) el.innerHTML = "<p style='padding:20px'>La carte n'a pas pu être chargée (connexion requise).</p>"; return; }
    if (maps[name]) { setTimeout(() => maps[name].invalidateSize(), 50); return; }
    if (name === "contact") {
      const m = L.map("map-contact").setView(SITE.coord, 15); osm().addTo(m);
      L.marker(SITE.coord, { icon: pinIcon("both") }).addTo(m).bindPopup(`<b>SPA du Sud</b><br>${SITE.adresse}<br>📞 ${SITE.tel}`).openPopup();
      maps.contact = m;
    }
    if (name === "walk") {
      const m = L.map("map-walk").setView(SITE.coord, 14); osm().addTo(m);
      L.marker(SITE.coord, { icon: pinIcon("both") }).addTo(m).bindPopup("<b>Refuge SPA du Sud</b><br>Départ des balades");
      const mk = (k, color, name, dest) => {
        const r = ROUTES[k], line = L.polyline(r.pts, { color, weight: 5, opacity: .9, dashArray: k === "aeroport" ? "10 8" : null });
        const end = L.marker(dest, { icon: labelIcon(name) });
        line.bindPopup(`<b>${name}</b><br>${r.km} km · ≈ ${r.min} min à pied`);
        return L.layerGroup([line, end]);
      };
      const g = { pointe: mk("pointe", "#e4572e", "Pointe du Diable 🌊", ROUTES.pointe.pts[ROUTES.pointe.pts.length - 1]), aeroport: mk("aeroport", "#0f6e7a", "Aéroport Pierrefonds ✈️", ROUTES.aeroport.pts[ROUTES.aeroport.pts.length - 1]) };
      const show = k => {
        Object.values(g).forEach(l => m.removeLayer(l)); g[k].addTo(m);
        const pts = ROUTES[k].pts; m.fitBounds(L.latLngBounds(pts).pad(.2));
        $$(".route").forEach(b => b.classList.toggle("on", b.dataset.r === k));
      };
      $$(".route").forEach(b => b.addEventListener("click", () => show(b.dataset.r)));
      maps.walk = m; show("pointe");
    }
    if (name === "island") {
      const m = L.map("map-island").setView([-21.12, 55.53], 10); osm().addTo(m);
      const lbl = { both: "Refuge + fourrière", refuge: "Refuge", fourriere: "Fourrière" };
      const pts = [];
      STRUCTURES.forEach(s => {
        pts.push(s.coord);
        L.marker(s.coord, { icon: pinIcon(s.type), title: s.nom }).addTo(m).bindPopup(
          `<b>${esc(s.nom)}</b><br><i>${lbl[s.type]} · ${esc(s.zone)}</i><br>📍 ${esc(s.adresse)}<br>📞 ${esc(s.tel)}<br>🧭 ${s.coord[0].toFixed(5)}, ${s.coord[1].toFixed(5)}<br><small>${esc(s.info)}</small><br><a href="https://www.openstreetmap.org/directions?to=${s.coord[0]}%2C${s.coord[1]}" target="_blank" rel="noopener">Itinéraire ↗</a>`, { maxWidth: 300 });
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
    if (id === "animaux") renderAnimals();
    if (id === "contact") initMap("contact");
    if (id === "benevolat") initMap("walk");
    if (id === "fonctionnement") { initMap("island"); drawYear(+$("#years .on").dataset.i); }
    observe(sec);
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
      for (const [k, v] of fd.entries()) if (!["rgpd","engage","mission"].includes(k) && v) lines.push(`${k} : ${v}`);
      if (extra) lines.unshift(...extra());
      const body = lines.join("\n");
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const ok = $(okId); ok.hidden = false;
      ok.textContent = "Merci ! Votre messagerie s'ouvre avec le message prêt à envoyer. Si rien ne s'ouvre, écrivez-nous à " + SITE.email + ".";
    });
  }
  mailForm($("#form-adopt"), "Demande d'adoption", null, "#ok-adopt");
  mailForm($("#form-don"), "Annonce de don", () => [`montant : ${amount} € (${$("input[name=freq]:checked").value})`], "#ok-don");
  mailForm($("#form-benev"), "Inscription bénévole", () => ["missions : " + ($$("input[name=mission]:checked").map(i => i.value).join(", ") || "non précisé")], "#ok-benev");
  mailForm($("#form-contact"), "Message depuis le site", null, "#ok-contact");

  observe(document);
  route();
})();
