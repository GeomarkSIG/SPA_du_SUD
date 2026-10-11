/* Icônes SVG maison (24×24, trait) – licence MIT, Geomark SIG Solutions */
(function () {
  const P = {
    paw: '<circle cx="5.5" cy="11" r="2"/><circle cx="9.5" cy="6" r="2"/><circle cx="14.5" cy="6" r="2"/><circle cx="18.5" cy="11" r="2"/><path d="M12 12c-3 0-6 3.5-6 6 0 2 1.7 2.5 3 2.2 1-.2 2-.6 3-.6s2 .4 3 .6c1.3.3 3-.2 3-2.2 0-2.5-3-6-6-6z"/>',
    dog: '<path d="M7 8 4.5 6.5C3 8 3 11 5 13.5l2 .5"/><path d="M17 8l2.500-1.500C21 8 21 11 19 13.500l-2 .5"/><path d="M7 8c1-2 2.500-3 5-3s4 1 5 3v5c0 3-2.200 5-5 5s-5-2-5-5z"/><circle cx="9.500" cy="11" r=".7" fill="currentColor"/><circle cx="14.500" cy="11" r=".7" fill="currentColor"/><path d="M10.500 14.500h3l-1.500 1.500z"/>',
    cat: '<path d="M5 10V3.500l4 2.500h6l4-2.500V10c1 1 1.500 2.300 1.500 3.500 0 3.500-3.500 6-8.500 6s-8.500-2.500-8.500-6C3.500 12.300 4 11 5 10z"/><circle cx="9.500" cy="12" r=".7" fill="currentColor"/><circle cx="14.500" cy="12" r=".7" fill="currentColor"/><path d="M11 14.500h2l-1 1.200z"/><path d="M12 15.700c-.7.8-1.500.8-2.200.3M12 15.700c.7.8 1.500.8 2.200.3"/>',
    home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    heart: '<path d="M12 21s-8-5.500-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 10c0 5.500-8 11-8 11z"/>',
    users: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c0-3.500 3-6 6.500-6s6.500 2.500 6.500 6"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14c3 0 4.500 2 4.500 5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.500-7 8-7s8 3 8 7"/>',
    walk: '<circle cx="13" cy="4.500" r="2"/><path d="M10 21l2-6 3 2v4M12 15l-1-5 3-1 3 3 3 .5M11 10l-3 3-2 .5"/>',
    hammer: '<path d="M13 5l6 6"/><path d="M11.500 3.500l9 9-3 3-9-9z"/><path d="M11 10 4 17a2.100 2.100 0 0 0 3 3l7-7"/>',
    sparkles: '<path d="M10 3l1.900 5.100L17 10l-5.100 1.900L10 17l-1.900-5.100L3 10l5.100-1.900z"/><path d="M19 14l.8 2.200 2.200.8-2.200.8L19 20l-.8-2.200-2.200-.8 2.200-.8z"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.200 8.200 20 20M8.200 15.800 20 4"/>',
    hug: '<path d="M12 21s-8-5.500-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 10c0 5.500-8 11-8 11z"/><path d="M12 9.500v5M9.500 12h5"/>',
    megaphone: '<path d="M3 10v4l4 1 11 5V4L7 9z"/><path d="M7 15l1 5h3l-1-4.500"/><path d="M21 9v6"/>',
    phone: '<path d="M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.5c.9.3 1.800.6 2.800.7a2 2 0 0 1 1.700 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.900 5.700a2 2 0 0 1-2.200 0L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    plane: '<path d="M17.800 19.200 16 11l3.500-3.500C21 6 21.500 4 21 3c-1-.5-3 0-4.500 1.500L13 8 4.800 6.200c-.5-.1-.9.1-1.100.5l-.3.5c-.2.5-.1 1 .3 1.300L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.500 5.300c.3.400.8.500 1.300.3l.5-.2c.4-.3.6-.7.5-1.200z"/>',
    waves: '<path d="M2 7c2.500-2 4.500-2 7 0s4.500 2 7 0 4.500-2 6 0M2 13c2.500-2 4.500-2 7 0s4.500 2 7 0 4.500-2 6 0M2 19c2.500-2 4.500-2 7 0s4.500 2 7 0 4.500-2 6 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>',
    drop: '<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.600 0l3-3a4 4 0 0 0-5.600-5.600l-1 1"/><path d="M14 10a4 4 0 0 0-5.600 0l-3 3a4 4 0 0 0 5.600 5.600l1-1"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="m8.500 12 2.500 2.500 5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.1"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.1"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
    gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8C10 3 6 4 7 6.500 8 8 12 8 12 8zM12 8c2-5 6-4 5-1.500C16 8 12 8 12 8z"/>',
    route: '<circle cx="6" cy="19" r="2.500"/><circle cx="18" cy="5" r="2.500"/><path d="M8.500 19H16a3.500 3.500 0 0 0 0-7H8a3.500 3.500 0 0 1 0-7h7.500"/>',
    building: '<path d="M4 21V5l8-2 8 2v16M9 21v-5h6v5M8 9h2M14 9h2M8 12.500h2M14 12.500h2"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    moon: '<path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500z"/>',
    share: '<circle cx="6" cy="12" r="2.500"/><circle cx="18" cy="6" r="2.500"/><circle cx="18" cy="18" r="2.500"/><path d="m8.200 10.800 7.600-3.600M8.200 13.200l7.600 3.600"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    star: '<path d="m12 3 2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/>',
    ruler: '<path d="m3 17 14-14 4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    energy: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    child: '<circle cx="12" cy="6" r="3"/><path d="M6 21v-6a6 6 0 0 1 12 0v6M9 21v-4M15 21v-4"/>'
  };
  window.ICON_NAMES = Object.keys(P);
  window.ic = (n, cls) => '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[n] || P.paw) + '</svg>';
  window.hydrateIcons = root => (root || document).querySelectorAll('i[data-i]').forEach(el => {
    el.outerHTML = window.ic(el.dataset.i, el.className.replace(/\bi\b/, '').trim());
  });
})();
