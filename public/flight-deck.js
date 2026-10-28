/* Flight Deck v4.3 — runtime for the home page (sky, world, instruments, sections, AiRa).
   Content comes from the #data JSON rendered by app/(deck)/page.tsx from lib/*.ts. */
(function(){
"use strict";
const D = JSON.parse(document.getElementById('data').textContent);
const BAN = JSON.parse(document.getElementById('banners').textContent);
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const ss = { get(k){ try { return sessionStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { sessionStorage.setItem(k,v); } catch(e){} } };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a + (b-a)*t;
const smooth = (a,b,x) => { const t = clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
const SITE = window.FD_BASE || '';
const RESUME = SITE + '/sushin-bandha-resume.pdf';
const nowS = () => performance.now()/1000;

/* ================= icons ================= */
const ICON = {
  gh:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
  li:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M12 12v6M9 15l3 3 3-3"/></svg>',
  dep:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 19h19v2h-19zM22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"/></svg>',
  radio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M7 9 17 3"/><circle cx="8.5" cy="15" r="2.5"/><path d="M14 13h4M14 17h4"/></svg>',
  kbd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></svg>',
  ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  cert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></svg>',
  sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1 0 8z"/></svg>'
};
function icons(root){ $$('[data-icon]', root).forEach(e => { if (!e.querySelector('svg')) e.insertAdjacentHTML('afterbegin', ICON[e.dataset.icon] || ''); }); }
icons(document);

/* ================= waypoints ================= */
const WP = [
  {id:'klaf',  code:'KLAF',  name:'Home',           alt:0},
  {id:'crews', code:'CREWS', name:'About',          alt:3000},
  {id:'logbk', code:'LOGBK', name:'Experience',     alt:10000},
  {id:'gates', code:'GATES', name:'Projects',       alt:18000},
  {id:'grnds', code:'GRNDS', name:'Education',      alt:24000},
  {id:'radar', code:'RADAR', name:'Skills',         alt:30000},
  {id:'patch', code:'PATCH', name:'Certifications', alt:35000},
  {id:'centr', code:'CENTR', name:'Contact',        alt:41000}
];
const fmtAlt = a => a < 1 ? 'GND' : a >= 18000 ? 'FL' + String(Math.round(a/100)).padStart(3,'0') : Math.round(a).toLocaleString('en-US') + ' FT';
const spoken = {CREWS:'crews', LOGBK:'logbook', GATES:'gates', GRNDS:'grounds', RADAR:'radar', PATCH:'patch', CENTR:'center'};

function mark(){}

/* ================= sound ================= */
let AC = null, soundOn = false;
const MASTER = .55; // effects sit well under the live ATC audio
function ac(){ if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} } return AC; }
function tone(f, d, type, vol, when){
  if (!soundOn) return; const c = ac(); if (!c) return;
  const t = c.currentTime + (when||0), o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime((vol||.05)*MASTER, t+.01); g.gain.exponentialRampToValueAtTime(.0001, t+d);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t+d+.05);
}
function chime(){ tone(988,.35,'sine',.06); tone(740,.5,'sine',.05,.22); }
let lastTick = 0;
function tick(){ const n = performance.now(); if (n - lastTick < 70) return; lastTick = n; tone(1500+Math.random()*700,.015,'square',.006); }
function noise(d, freq, vol, type){
  if (!soundOn) return; const c = ac(); if (!c) return;
  const len = Math.floor(c.sampleRate * d), b = c.createBuffer(1, len, c.sampleRate), x = b.getChannelData(0);
  for (let i=0;i<len;i++) x[i] = (Math.random()*2-1) * (1 - i/len);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  f.type = type || 'bandpass'; f.frequency.value = freq || 1800; f.Q.value = .8; g.gain.value = (vol || .08)*MASTER;
  s.buffer = b; s.connect(f).connect(g).connect(c.destination); s.start();
}
const squelch = d => noise(d || .25, 1800, .08);
function say(t, rate, onend){ if (onend) setTimeout(onend, 1200); return;
  if (!soundOn || !('speechSynthesis' in window)) { if (onend) setTimeout(onend, 50); return; }
  try { const u = new SpeechSynthesisUtterance(t); u.rate = rate || 1.05; u.pitch = 1; if (onend) u.onend = onend; speechSynthesis.speak(u); } catch(e){ if (onend) onend(); }
}
function setSound(on){
  soundOn = on; $('#soundBtn').setAttribute('aria-pressed', String(on)); $('#soundBtn').classList.toggle('on', on);
  $('#soundBtn .sw').setAttribute('opacity', on ? '1' : '.25');
  if (on) { ac() && AC.resume && AC.resume(); chime(); toast('SOUND <b>ON</b> · chimes, monitor beeps, radio and callouts'); }
  else { try { speechSynthesis.cancel(); } catch(e){} toast('SOUND <b>OFF</b>'); }
}
$('#soundBtn').addEventListener('click', () => setSound(!soundOn));

/* ================= theme ================= */
const root = document.documentElement;
const isNight = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
function syncRocker(){ $('#themeBtn').dataset.night = String(isNight()); }
function flipTheme(){ root.dataset.theme = isNight() ? 'light' : 'dark'; syncRocker(); toast(isNight() ? 'NIGHT PANEL · instrument glow' : 'DAY PANEL'); tone(isNight()?330:660,.08,'square',.03); }
$('#themeBtn').addEventListener('click', flipTheme);
new MutationObserver(syncRocker).observe(root, {attributes:true, attributeFilter:['data-theme']});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncRocker);
syncRocker();

/* ================= toast ================= */
let toastT = null;
function toast(html, ms){ const t = $('#toast'); t.innerHTML = html; t.classList.remove('gone'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('gone'), ms || 2600); }

/* ================= clocks ================= */
function clocks(){
  const d = new Date();
  $('#boardClock').textContent = 'KLAF · LOCAL ' + d.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'America/Indiana/Indianapolis'});
  if (!WX.manual) { WX.hour = nowHour(); updateWxUI(); }
}
$('#yr').textContent = new Date().getFullYear();

/* ================= weather model ================= */
const CONDS = [
  ['clear','Clear', {}],
  ['few','Few clouds', {cover:.22, base:5000, top:7500}],
  ['scattered','Partly cloudy', {cover:.45, base:4500, top:9000}],
  ['broken','Mostly cloudy', {cover:.8, base:3500, top:11000}],
  ['overcast','Overcast', {cover:1, base:2500, top:12000}],
  ['rain','Rain', {cover:1, base:1800, top:14000, precip:.75, kind:'rain', vis:4}],
  ['snow','Snow', {cover:1, base:1500, top:10000, precip:.7, kind:'snow', vis:2}],
  ['fog','Fog', {cover:1, base:300, top:2500, fog:.85, vis:.5}],
  ['storm','Thunderstorm', {cover:1, base:2500, top:34000, precip:1, kind:'rain', storm:1, vis:3}]
];
function nowHour(){ const d = new Date(); return d.getHours() + d.getMinutes()/60; }
const WX = {cond:'scattered', hour:nowHour(), manual:false};
(function(){ const m = /wx=([a-z]+)(?:@([\d.]+))?/.exec(location.hash); if (m && CONDS.some(c => c[0] === m[1])) { WX.cond = m[1]; if (m[2]) { WX.hour = +m[2]; WX.manual = true; } } })();
let CC = null;
function cond(){ if (CC && CC.id === WX.cond) return CC; const c = CONDS.find(x => x[0] === WX.cond); CC = Object.assign({id:c[0], label:c[1], cover:0, base:0, top:0, precip:0, kind:null, fog:0, storm:0, vis:10}, c[2]); return CC; }
const DIG = ['zero','one','two','three','four','five','six','seven','eight','niner'];
const spell = s => String(s).split('').map(ch => /\d/.test(ch) ? DIG[+ch] : ch).join(' ');
function fmtHour(h){ const H = Math.floor(h), M = Math.round((h-H)*60); return String(H).padStart(2,'0') + ':' + String(M % 60).padStart(2,'0'); }
function metar(){
  const c = cond(), d = new Date();
  const z = String(d.getUTCDate()).padStart(2,'0') + String(d.getUTCHours()).padStart(2,'0') + String(d.getUTCMinutes()).padStart(2,'0') + 'Z';
  const wind = c.storm ? '24018G28KT' : c.kind === 'snow' ? '31012KT' : '27008KT';
  const vis = c.vis >= 10 ? '10SM' : c.vis >= 1 ? c.vis + 'SM' : '1/2SM';
  const wx = c.storm ? '+TSRA ' : c.kind === 'rain' ? '-RA ' : c.kind === 'snow' ? 'SN ' : c.fog ? 'FG ' : '';
  const lay = h => String(Math.round(h/100)).padStart(3,'0');
  const sky = c.cover === 0 ? 'SKC' : (c.cover < .3 ? 'FEW' : c.cover < .6 ? 'SCT' : c.cover < .95 ? 'BKN' : 'OVC') + lay(c.base) + (c.storm ? 'CB' : '');
  const tmp = c.kind === 'snow' ? 'M02/M04' : c.fog ? '09/09' : c.storm ? '24/19' : '18/09';
  return `METAR KLAF ${z} ${wind} ${vis} ${wx}${sky} ${tmp} A3002 RMK AO2`;
}
function category(){
  const c = cond(), ceil = c.cover >= .75 ? c.base : 1e9, v = c.vis;
  if (ceil < 500 || v < 1) return ['LIFR','#e25bd4'];
  if (ceil < 1000 || v < 3) return ['IFR','#ff5263'];
  if (ceil <= 3000 || v <= 5) return ['MVFR','#57a9ff'];
  return ['VFR','#5be39a'];
}
$('#wxGrid').innerHTML = CONDS.map(c => `<button type="button" data-c="${c[0]}" aria-pressed="false">${esc(c[1])}</button>`).join('');
$$('#wxGrid button').forEach(b => b.addEventListener('click', () => { WX.cond = b.dataset.c; updateWxUI(); mark('wx'); tone(880,.05,'sine',.03); heroColors(); }));
$('#wxHour').addEventListener('input', e => { WX.hour = +e.target.value; WX.manual = true; updateWxUI(); mark('wx'); heroColors(); });
$('#wxNow').addEventListener('click', () => { WX.manual = false; WX.hour = nowHour(); updateWxUI(); heroColors(); });
function updateWxUI(){
  const c = cond(), [cat, col] = category();
  $('#wxCat').textContent = cat; $('#wxCat').style.color = col; $('#wxDot').style.background = col;
  $('#wxChipT').textContent = 'KLAF ' + cat;
  $('#wxMetar').textContent = metar();
  $('#wxHour').value = WX.hour; $('#wxHourT').textContent = fmtHour(WX.hour) + (WX.manual ? ' (PREVIEW)' : ' (YOUR CLOCK)');
  $$('#wxGrid button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.c === WX.cond)));
  $('#wxTag').innerHTML = `${c.cover > .6 || c.kind ? '☁' : '☀'} ${esc(c.label.toUpperCase())} · ${fmtHour(WX.hour)} LOCAL · <span style="color:${col}">${cat}</span>`;
}
function toggleWx(force){
  const p = $('#wxPop'), open = force != null ? force : p.hidden;
  p.hidden = !open; $('#wxBtn').setAttribute('aria-expanded', String(open));
  if (open) { mark('wx'); setTimeout(() => $('#wxGrid [aria-pressed="true"]')?.focus(), 30); }
}
$('#wxBtn').addEventListener('click', () => toggleWx());
$('#wxTag').addEventListener('click', () => toggleWx(true));
$('#wxClose').addEventListener('click', () => toggleWx(false));
updateWxUI(); clocks(); setInterval(clocks, 30000);

/* ================= nav route + menu ================= */
const route = $('#route');
WP.forEach((w,i) => {
  const b = document.createElement('button'); b.type = 'button';
  b.innerHTML = `<i></i><span>${w.code}</span><em>${esc(w.name)} · ${fmtAlt(w.alt)}</em>`;
  b.addEventListener('click', () => go(w.id)); route.appendChild(b);
});
$('#menu').innerHTML = WP.map(w => `<button type="button" data-id="${w.id}"><b>${w.code}</b><span>${esc(w.name)}</span><small>${fmtAlt(w.alt)}</small></button>`).join('') +
  `<div class="set"><button type="button" id="mAtc" aria-pressed="false">${ICON.radio} Live ATC</button><button type="button" id="mSound">${ICON.sound} Sound</button><button type="button" id="mTheme">${ICON.sun} Day / Night</button><button type="button" id="mWx">${ICON.cloud} Weather</button><a href="${SITE}/sushin-bandha-resume.pdf" target="_blank" rel="noopener" aria-label="Resume (PDF)">${ICON.doc} PDF</a></div>`;
$$('#menu > button').forEach(b => b.addEventListener('click', () => { closeMenu(); go(b.dataset.id); }));
$('#mSound').addEventListener('click', () => setSound(!soundOn));
$('#mAtc').addEventListener('click', () => { closeMenu(); laToggle(); });
$('#mTheme').addEventListener('click', flipTheme);
$('#mWx').addEventListener('click', () => { closeMenu(); toggleWx(true); });
function closeMenu(){ $('#menu').hidden = true; $('#menuBtn').setAttribute('aria-expanded','false'); }
$('#menuBtn').addEventListener('click', () => { const m = $('#menu'); m.hidden = !m.hidden; $('#menuBtn').setAttribute('aria-expanded', String(!m.hidden)); });
function go(id){ const el = document.getElementById(id); if (el) el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); }

/* ================= keys help ================= */
function openKeys(){ $('#keysHelp').hidden = false; mark('keys'); setTimeout(() => $('#keysClose').focus(), 20); }
function closeKeys(){ $('#keysHelp').hidden = true; }
$('#keysBtn').addEventListener('click', openKeys);
$('#keysClose').addEventListener('click', closeKeys);
$('#keysHelp').addEventListener('click', e => { if (e.target.id === 'keysHelp') closeKeys(); });

/* ================= boot + coach ================= */
const BOOT = [['BATTERY MASTER','ON'],['AVIONICS','ON'],['AiRa COPILOT','ONLINE'],['PULSE OX / HR','98% · 72 BPM'],['ATIS KLAF','INFO ALPHA'],['FLIGHT PLAN','8 WAYPOINTS FILED']];
let bootTimers = [];
function runBoot(force){
  const el = $('#boot');
  if (!force && (reduce || ss.get('booted'))) { el.hidden = true; afterBoot(); return; }
  el.hidden = false; el.classList.remove('out','go');
  $('#bootList').innerHTML = BOOT.map(b => `<li><span>${b[0]}</span><span class="dots"></span><b>${b[1]}</b></li>`).join('');
  $('#bootClr').classList.remove('on');
  $('#bootLights').innerHTML = Array.from({length:14}, (_,i) => `<i style="--x:${(i%2?1:-1)*(10+Math.floor(i/2)*16)}px;animation-delay:${Math.floor(i/2)*60}ms"></i>`).join('');
  bootTimers.forEach(clearTimeout); bootTimers = [];
  $$('#bootList li').forEach((li,i) => bootTimers.push(setTimeout(() => { li.classList.add('on'); tick(); }, 180 + i*230)));
  const t1 = 180 + BOOT.length*230 + 200;
  bootTimers.push(setTimeout(() => { $('#bootClr').classList.add('on'); el.classList.add('go'); chime(); }, t1));
  bootTimers.push(setTimeout(endBoot, t1 + 1100));
  ss.set('booted','1');
}
function endBoot(){ bootTimers.forEach(clearTimeout); const el = $('#boot'); if (el.hidden) return; el.classList.add('out'); setTimeout(() => { el.hidden = true; }, 600); afterBoot(); }
let afterBootDone = false;
function afterBoot(){
  if (afterBootDone) return; afterBootDone = true;
  setTimeout(() => airaSay("Hey, I'm AiRa — Bandha's AI assistant. Scroll down to explore, or ask me anything.", 'AiRa · FIRST OFFICER', 5500), 700);
  if (!ss.get('coach')) setTimeout(showCoach, 2600);
}
function showCoach(){
  ss.set('coach','1');
  const c = $('#coach'), r = $('#xpdrBox').getBoundingClientRect();
  c.hidden = false;
  const w = c.offsetWidth, left = clamp(r.left + r.width/2 - w/2, 16, innerWidth - w - 16);
  c.style.left = left + 'px'; c.style.top = (r.bottom + 12) + 'px';
  c.style.setProperty('--ax', (r.left + r.width/2 - left - 6) + 'px');
  $('#xpdrBox').classList.add('flash'); setTimeout(() => $('#xpdrBox').classList.remove('flash'), 1600);
  setTimeout(() => c.hidden = true, 9000);
}
$('#coachX').addEventListener('click', () => $('#coach').hidden = true);
$('#bootSkip').addEventListener('click', endBoot);

/* ================= hero ================= */
(function(){
  const roles = D.roles; let ri = 0, ci = 0, del = false; const el = $('#tw');
  if (reduce) { el.textContent = '> ' + roles.join(' · '); return; }
  (function step(){
    const w = roles[ri]; el.textContent = '> ' + w.slice(0, ci);
    if (!del && ci < w.length) { ci++; return setTimeout(step, 70); }
    if (!del) { del = true; return setTimeout(step, 1500); }
    if (ci > 0) { ci--; return setTimeout(step, 32); }
    del = false; ri = (ri+1) % roles.length; setTimeout(step, 250);
  })();
})();
const NS = 'http://www.w3.org/2000/svg';
const hero = $('#klaf'), pfd = $('#pfd'), att = $('#att'), attWrap = $('#attWrap'), rwy = $('#rwy');
const HG = {W:0, H:0, gy:300, depth:400, tS:null, tA:null};
const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const setA = (e, attrs) => { for (const k in attrs) e.setAttribute(k, attrs[k]); };
const stage = $('#stage'), copyEl = $('.hero .copy');
const RW = {dNear:40, pool:false, last:''};
function layoutHero(){
  const r = stage.getBoundingClientRect(), W = r.width, H = r.height;
  const keepT = copyEl.style.transform; copyEl.style.transform = 'none';
  const n1 = $('.n1').getBoundingClientRect(), n2 = $('.n2').getBoundingClientRect();
  copyEl.style.transform = keepT;
  const gy = (n1.bottom + n2.top)/2 - r.top;
  HG.W = W; HG.H = H; HG.gy = gy; HG.depth = H - gy;
  pfd.setAttribute('viewBox', `0 0 ${W} ${H}`);
  attWrap.setAttribute('transform', `translate(${W/2} ${gy})`);
  HG.bw = Math.min(W*.2, 300); HG.dep = HG.depth + 60;
  if (!RW.pool) {
    RW.pool = true;
    RW.dash = Array.from({length:12}, () => el('line', {x1:0, x2:0, 'stroke-opacity':.8}, $('#rwyDash')));
    RW.edge = Array.from({length:48}, () => el('circle', {fill:'#ffe7a8'}, $('#edge')));
    RW.thr = Array.from({length:8}, () => el('polygon', {}, $('#rwyThr')));
    RW.papi = Array.from({length:4}, (_,i) => el('circle', {fill: i < 2 ? '#ff4a4a' : '#ffffff', class:'papi'}, $('#papi')));
  }
  RW.last = '';
  const R = Math.max(120, Math.min(Math.max(n1.width, n2.width)/2 + 70, gy - 64 - 18));
  const s55 = Math.sin(55*Math.PI/180), c55 = Math.cos(55*Math.PI/180);
  $('#bankPath').setAttribute('d', `M ${-R*s55} ${-R*c55} A ${R} ${R} 0 0 1 ${R*s55} ${-R*c55}`);
  const bt = $('#bankTicks'); bt.innerHTML = '';
  [-45,-30,-20,-10,10,20,30,45].forEach(a => { const q = a*Math.PI/180, l = Math.abs(a) % 30 === 0 ? 18 : 10; el('line', {x1:Math.sin(q)*R, y1:-Math.cos(q)*R, x2:Math.sin(q)*(R+l), y2:-Math.cos(q)*(R+l)}, bt); });
  setA($('#bankPtr'), {points:`0,${-R+3} -9,${-R+19} 9,${-R+19}`});
  const top = Math.max(96, gy - 190), bot = Math.min(H - 60, gy + 230);
  HG.tS = {x:24, w:84, top, h:bot - top, cy:gy};
  HG.tA = {x:W - 24 - 104, w:104, top, h:bot - top, cy:gy};
  for (const [k, T] of [['S', HG.tS], ['A', HG.tA]]) {
    setA($('#t' + k + 'bg'), {x:T.x, y:T.top, width:T.w, height:T.h});
    setA($('#c' + k + 'r'), {x:T.x, y:T.top, width:T.w, height:T.h});
    setA($('#t' + k + 'box'), {x:T.x - 2, y:T.cy - 20, width:T.w + 4, height:40});
  }
  setA($('#spdV'), {x:HG.tS.x + HG.tS.w/2, y:HG.tS.cy + 7}); setA($('#spdL'), {x:HG.tS.x + HG.tS.w/2, y:HG.tS.top - 8});
  setA($('#altV'), {x:HG.tA.x + HG.tA.w/2, y:HG.tA.cy + 7}); setA($('#altSel'), {x:HG.tA.x + HG.tA.w/2, y:HG.tA.top - 8});
}
/* Runway in true perspective from the cockpit: a feature d feet ahead sits at y = dep*dNear*eye/d
   below the horizon, and x scales with y, so everything streams toward you and slides underneath
   as the roll distance s grows. eye > 1 is height above the runway once airborne. */
function drawRunway(s, eye){
  const key = s.toFixed(1) + '|' + eye.toFixed(3) + '|' + HG.W; if (key === RW.last || !RW.pool) return; RW.last = key;
  const dep = HG.dep, bw = HG.bw, k = bw/dep, Y = d => d <= 0 ? 1e6 : dep*RW.dNear*eye/d, X = y => k*y/eye;
  const yN = dep*eye;
  setA($('#rwyPoly'), {points:`-16,1 16,1 ${X(yN) + 16},${yN} ${-X(yN) - 16},${yN}`});
  // centerline stripes: 120 ft painted, 80 ft gap, starting 30 ft past the numbers
  const per = 200, first = 70 - s; let j = 0;
  const k0 = Math.max(0, Math.floor((RW.dNear*.5 - first)/per));
  for (let i = k0; j < RW.dash.length; i++, j++) {
    const d0 = first + i*per, d1 = d0 + 120, e = RW.dash[j];
    if (d1 <= 1) { e.setAttribute('visibility', 'hidden'); continue; }
    const y0 = Y(d1), y1 = Math.min(Y(Math.max(d0, 1)), yN + 40);
    if (y0 < 2.5 || y0 > yN + 40) { e.setAttribute('visibility', 'hidden'); continue; }
    setA(e, {y1:y0, y2:y1, 'stroke-width':(1 + 5.5*(y0/yN)).toFixed(2), visibility:'visible'});
  }
  // edge lights every 200 ft on both sides
  const ef = 40 - (s % 200); j = 0;
  for (let i = 0; j < RW.edge.length; i++) {
    const d = ef + i*200; const y = Y(d); if (y < 2) { for (; j < RW.edge.length; j++) RW.edge[j].setAttribute('visibility', 'hidden'); break; }
    const x = X(y)*1.03 + 16*(1 - y/yN), rr = .8 + 3.2*Math.min(1.4, y/yN);
    for (const sx of [-1, 1]) { if (j >= RW.edge.length) break; setA(RW.edge[j++], {cx:sx*x, cy:y, r:rr.toFixed(2), visibility: y > yN + 30 ? 'hidden' : 'visible'}); }
  }
  // threshold bars 43–50 ft ahead at brake release, runway number just past them
  const yA = Y(50 - s), yB = Math.min(Y(43 - s), yN + 60);
  [-.88, -.68, -.48, -.28, .16, .36, .56, .76].forEach((L0, i) => { const L1 = L0 + .12, xa = X(yA) + 16*(1 - yA/yN), xb = X(yB) + 16*(1 - yB/yN); setA(RW.thr[i], {points:`${L0*xa},${yA} ${L1*xa},${yA} ${L1*xb},${yB} ${L0*xb},${yB}`, visibility: yA > yN + 40 ? 'hidden' : 'visible'}); });
  const yNum = Y(52.6 - s);
  setA($('#rwyNum'), {x:0, y:yNum, 'font-size': Math.max(26, dep*.12*(yNum/(dep*.76))), opacity: HG.W < 760 || yNum > yN + 80 ? 0 : .9});
  // PAPI on the left, 72 ft ahead
  const yP = Y(72 - s), xP = -(X(yP) + 16)*1.18, show = HG.W >= 760 && yP < yN + 20;
  RW.papi.forEach((c, i) => setA(c, {cx:xP - i*Math.max(7, yP*.04), cy:yP, r:Math.max(2.4, yP*.014), visibility: show ? 'visible' : 'hidden'}));
}
function tape(g, val, step, px, T, side, fmt){
  while (g.firstChild) g.removeChild(g.firstChild);
  const base = Math.floor(val/step)*step;
  for (let i=-7;i<=7;i++){
    const v = base + i*step; if (v < 0) continue;
    const y = T.cy - (v - val)/step*px; if (y < T.top - 10 || y > T.top + T.h + 10) continue;
    const tx = side === 'L' ? T.x + 8 : T.x + T.w - 8;
    el('text', {x:tx, y:y + 6, 'text-anchor': side === 'L' ? 'start' : 'end'}, g).textContent = fmt ? fmt(v) : v;
    const lx = side === 'L' ? T.x + T.w : T.x;
    el('line', {x1:lx, x2: side === 'L' ? lx - 10 : lx + 10, y1:y, y2:y, stroke:'#fff', 'stroke-width':2}, g);
  }
}
let tgtR = 0, tgtP = 0, curR = 0, curP = 0, heroHover = false, gyro = false;
const hk = {l:0, r:0, u:0, d:0};
hero.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  const b = hero.getBoundingClientRect();
  tgtR = ((e.clientX - b.left)/b.width - .5) * 28; tgtP = ((e.clientY - b.top)/b.height - .5) * 36;
  heroHover = true; if (Math.abs(tgtR) > 5) mark('tilt');
});
hero.addEventListener('pointerleave', () => heroHover = false);
hero.addEventListener('touchmove', e => { const t = e.touches[0], b = hero.getBoundingClientRect(); tgtR = ((t.clientX - b.left)/b.width - .5)*28; tgtP = ((t.clientY - b.top)/b.height - .5)*36; heroHover = true; mark('tilt'); }, {passive:true});
hero.addEventListener('touchend', () => { if (!gyro) heroHover = false; });
function heroColors(){
  const S = skyAt(0), c = S.c, day = S.day, snow = c.kind === 'snow', wet = c.kind === 'rain';
  const g0 = snow ? mixA(C('#3a4250'), C('#e8edf2'), day) : wet ? mixA(C('#12171a'), C('#56703e'), day) : mixA(C('#151b1c'), C('#6d8a4c'), day);
  const g1 = snow ? mixA(C('#1b2029'), C('#b8c3cf'), day) : wet ? mixA(C('#06080a'), C('#2d3d24'), day) : mixA(C('#07090a'), C('#3b5030'), day);
  $('#gg0').setAttribute('stop-color', rgb(g0)); $('#gg1').setAttribute('stop-color', rgb(g1));
  const fogc = rgb(mixA(C('#2d323b'), C('#d3d8de'), day));
  $('#gf0').setAttribute('stop-color', fogc); $('#gf1').setAttribute('stop-color', fogc);
  $('#fogR').setAttribute('opacity', (c.fog ? .92 : c.kind ? .25 : 0).toFixed(2));
  $('#edge').setAttribute('opacity', (.35 + (1-day)*.65).toFixed(2));
  const sky = mixA(S.z, S.hz, .45), lum = (.2126*sky[0] + .7152*sky[1] + .0722*sky[2])/255;
  hero.classList.toggle('lite', lum > .56);
  hero.classList.toggle('gl', snow && day > .45);
}

/* ================= colors ================= */
function C(h){ return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
const mixA = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
const rgb = (a, al) => al == null ? `rgb(${a[0]|0},${a[1]|0},${a[2]|0})` : `rgba(${a[0]|0},${a[1]|0},${a[2]|0},${al})`;
const PAL = {dZ0:C('#4b90d8'), dZ1:C('#0d2a60'), dH0:C('#bfe0f8'), dH1:C('#3a6cb4'), nZ0:C('#0b1532'), nZ1:C('#02040c'), nH0:C('#1e2e58'), nH1:C('#070d20'),
  twA:C('#f6b487'), twP:C('#f08c6a'), twZ:C('#45508f'), gDZ:C('#97a1ad'), gDH:C('#c4cad1'), gNZ:C('#191d25'), gNH:C('#262b34'), stZ:C('#3c434e'), stH:C('#59616c'),
  mD:C('#dde2e7'), mN:C('#2a2f38'), flD:C('#f3f6f9'), flN:C('#1e2433'), clN:C('#323a4c')};

/* ================= sky ================= */
function skyAt(p){
  const c = cond(), alt = p*41000, h = WX.hour;
  const sunAlt = Math.sin((h-6)/12*Math.PI), day = smooth(-.12, .22, sunAlt), twi = clamp(1 - Math.abs(sunAlt)/.3, 0, 1);
  let z = mixA(mixA(PAL.nZ0,PAL.nZ1,p), mixA(PAL.dZ0,PAL.dZ1,p), day);
  let hz = mixA(mixA(PAL.nH0,PAL.nH1,p), mixA(PAL.dH0,PAL.dH1,p), day);
  hz = mixA(hz, h < 12 ? PAL.twA : PAL.twP, twi*.7*(1-p*.7)); z = mixA(z, PAL.twZ, twi*.3);
  const solid = c.cover >= .75;
  const below = c.cover > 0 && alt < c.base, inside = solid && alt >= c.base && alt <= c.top, above = c.cover > 0 && alt > c.top;
  if (below) {
    const u = solid ? 1 : c.cover*.45;
    let gz = mixA(PAL.gNZ, PAL.gDZ, day), gh = mixA(PAL.gNH, PAL.gDH, day);
    if (c.storm) { gz = mixA(gz, mixA(PAL.gNZ, PAL.stZ, day), .75); gh = mixA(gh, mixA(PAL.gNH, PAL.stH, day), .75); }
    z = mixA(z, gz, u); hz = mixA(hz, gh, u*.9);
  }
  if (inside) {
    let m = mixA(PAL.mN, PAL.mD, day); if (c.storm) m = mixA(m, mixA(PAL.gNZ, PAL.stZ, day), .6);
    const e = clamp(Math.min((alt - c.base)/700, (c.top - alt)/1600), 0, 1);
    z = mixA(z, m, .55 + .45*e); hz = mixA(hz, m, .6 + .4*e);
  }
  const space = smooth(.5, 1, p); z = mixA(z, C('#030818'), space*.6*day + space*.25*(1-day)); hz = mixA(hz, mixA(hz, C('#7fa6d6'), .5), space*.35*day);
  return {c, alt, p, day, twi, sunAlt, h, below, inside, above, solid, z, hz};
}
const sky = $('#sky'), sc = sky.getContext('2d'), fx = $('#fx'), fc = fx.getContext('2d');
let SW = 0, SH = 0;
function sizeCanvases(){
  const dpr = Math.min(1.5, devicePixelRatio || 1); SW = innerWidth; SH = innerHeight;
  for (const [cv, cx] of [[sky, sc], [fx, fc]]) { cv.width = SW*dpr; cv.height = SH*dpr; cx.setTransform(dpr,0,0,dpr,0,0); }
}
const rnd = (s => () => (s = (s*16807) % 2147483647) / 2147483647)(42);
const stars = Array.from({length:220}, () => ({x:rnd(), y:rnd()*.85, r:rnd()*1.3+.3, tw:rnd()*6.28}));
const puffs = Array.from({length:40}, (_,i) => ({x:rnd(), k:(i%10)/10 + rnd()*.08, w:.12 + rnd()*.4, sp:4 + rnd()*10, p:Array.from({length:6}, () => [rnd()*2-1, rnd()*.5-.25, .5 + rnd()*.6])}));
const drops = Array.from({length:340}, () => ({x:rnd(), y:rnd(), s:.7 + rnd()*.6, l:.6 + rnd()*.8}));
let bolt = null, nextBolt = 3, flashA = 0;
function puff(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, r*.15, x, y, r); g.addColorStop(0, rgb(col, a)); g.addColorStop(1, rgb(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function drawSky(S, t, hy, dt, vsN){
  const c = S.c;
  const g = sc.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, rgb(S.z)); g.addColorStop(1, rgb(S.hz));
  sc.fillStyle = g; sc.fillRect(0, 0, SW, hy); sc.fillStyle = rgb(S.hz); sc.fillRect(0, hy, SW, SH - hy + 1);
  const sa = Math.max((1 - S.day) * (S.inside ? 0 : S.below ? (S.solid ? 0 : 1 - c.cover) : 1), S.inside ? 0 : smooth(.72, 1, S.p)*.32);
  if (sa > .02) { sc.fillStyle = '#fff'; for (const s of stars) { sc.globalAlpha = sa*(.55 + .45*Math.sin(t*1.3 + s.tw)); sc.beginPath(); sc.arc(s.x*SW, s.y*hy, s.r, 0, 6.283); sc.fill(); } sc.globalAlpha = 1; }
  const clearView = !S.inside && !(S.below && S.solid);
  if (clearView) {
    if (S.sunAlt > -.08) {
      const sx = SW*(.12 + clamp((S.h-6)/12, 0, 1)*.76), sy = hy - clamp(S.sunAlt, 0, 1)*hy*.8 - 6;
      const warm = 1 - clamp(S.sunAlt/.35, 0, 1), R = 120 + warm*120;
      const sg = sc.createRadialGradient(sx, sy, 4, sx, sy, R);
      sg.addColorStop(0, `rgba(255,250,235,${.95 - (S.below ? c.cover*.4 : 0)})`); sg.addColorStop(.1, `rgba(255,${(232 - warm*50)|0},${(190 - warm*90)|0},.75)`); sg.addColorStop(1, 'rgba(255,200,150,0)');
      sc.fillStyle = sg; sc.beginPath(); sc.arc(sx, sy, R, 0, 6.283); sc.fill();
    } else {
      const mx = SW*.8, my = Math.min(hy*.25, SH*.2) + 30, mg = sc.createRadialGradient(mx, my, 4, mx, my, 90);
      mg.addColorStop(0, 'rgba(240,244,255,.95)'); mg.addColorStop(.17, 'rgba(240,244,255,.9)'); mg.addColorStop(.22, 'rgba(200,215,255,.16)'); mg.addColorStop(1, 'rgba(200,215,255,0)');
      sc.fillStyle = mg; sc.beginPath(); sc.arc(mx, my, 90, 0, 6.283); sc.fill();
    }
  }
  drawWorld(S, t, dt, hy, vsN);
  drawClouds(S, t, dt, hy);
  if (S.below && S.solid) {
    const scud = mixA(mixA(PAL.gNZ, PAL.gDZ, S.day), [0,0,0], c.storm ? .35 : .15);
    for (let i=0;i<14;i++){ const q = puffs[i], x = ((q.x*SW*1.5 + t*q.sp*3) % (SW*1.5)) - SW*.25, y = hy*(.08 + q.k*.4), w = q.w*SW*1.2; for (const pf of q.p) puff(sc, x + pf[0]*w*.5, y + pf[1]*w*.2, w*.2*pf[2], scud, .45); }
  }
  if (S.inside) {
    const m = mixA(mixA(PAL.mN, PAL.mD, S.day), [255,255,255], .1);
    for (let i=0;i<34;i++){ const q = puffs[i], y = ((i*137 + S.alt*.9) % (SH + 400)) - 200, x = ((q.x*SW*1.4 + t*q.sp*4) % (SW*1.4)) - SW*.2, w = q.w*SW*1.6; puff(sc, x, y, w*.4, m, .55); }
  }
  if (c.storm && !S.above) {
    if (!reduce && t > nextBolt) { flashA = .55; nextBolt = t + 3 + Math.random()*6; bolt = makeBolt(); setTimeout(() => noise(1.4, 120, .25, 'lowpass'), 500 + Math.random()*1200); }
    if (flashA > .01) {
      sc.fillStyle = `rgba(235,240,255,${flashA})`; sc.fillRect(0, 0, SW, SH);
      if (bolt && flashA > .3) { sc.strokeStyle = 'rgba(255,255,255,.95)'; sc.lineWidth = 2.5; sc.shadowColor = '#cfe0ff'; sc.shadowBlur = 14; sc.beginPath(); bolt.forEach((p,i) => i ? sc.lineTo(p[0], p[1]) : sc.moveTo(p[0], p[1])); sc.stroke(); sc.shadowBlur = 0; }
      flashA *= .86;
    }
  }
  drawStreaks(S, dt, vsN);
  if (c.fog && S.alt < 1800) { sc.fillStyle = rgb(mixA(PAL.mN, PAL.mD, S.day), c.fog*.8*(1 - S.alt/1800)); sc.fillRect(0, 0, SW, SH); }
}
function makeBolt(){ let x = SW*(.15 + Math.random()*.7), y = 0; const pts = [[x, y]]; while (y < SH*.7) { x += (Math.random()-.5)*60; y += 20 + Math.random()*40; pts.push([x, y]); } return pts; }
let mx = -999, my = -999;
function drawFx(S, dt, t){
  fc.clearRect(0, 0, SW, SH);
  const c = S.c; if (!c.kind || S.above) return;
  const n = Math.round(drops.length*c.precip*(S.inside ? .45 : 1)), heroOn = document.body.classList.contains('inhero');
  if (c.kind === 'rain') {
    const wind = c.storm ? .4 : .18;
    fc.strokeStyle = S.day > .5 ? `rgba(225,235,248,${heroOn ? .4 : .55})` : `rgba(170,190,220,${heroOn ? .3 : .45})`; fc.lineWidth = 1.2; fc.beginPath();
    for (let i=0;i<n;i++){
      const d = drops[i]; d.y += dt*d.s*(c.storm ? 1.7 : 1.25); d.x += dt*d.s*wind*.3; if (d.y > 1.05) { d.y -= 1.1; d.x = Math.random(); } if (d.x > 1) d.x -= 1;
      let px = d.x*SW, py = d.y*SH; const dx = px - mx, dy = py - my, dd = Math.hypot(dx, dy);
      if (dd < 110 && dd > 0) { px += dx/dd*(110 - dd)*.7; py += dy/dd*(110 - dd)*.2; }
      fc.moveTo(px, py); fc.lineTo(px - wind*16*d.l, py - 24*d.l);
    }
    fc.stroke();
  } else {
    fc.fillStyle = 'rgba(255,255,255,.85)'; fc.beginPath();
    for (let i=0;i<n;i++){
      const d = drops[i]; d.y += dt*d.s*.08; d.x += dt*(.012 + Math.sin(t*1.2 + d.l*12)*.02); if (d.y > 1.03) { d.y -= 1.06; d.x = Math.random(); } if (d.x > 1) d.x -= 1; if (d.x < 0) d.x += 1;
      let px = d.x*SW, py = d.y*SH; const dx = px - mx, dy = py - my, dd = Math.hypot(dx, dy);
      if (dd < 120 && dd > 0) { px += dx/dd*(120 - dd)*.6; py += dy/dd*(120 - dd)*.6; }
      const r = 1 + d.l*1.6; fc.moveTo(px + r, py); fc.arc(px, py, r, 0, 6.283);
    }
    fc.fill();
  }
}
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, {passive:true});

/* ================= world (background) =================
   The page is a window view from the cockpit. Altitude comes from scroll, so the
   background keeps changing all the way down: the farmland grid shrinks and hazes,
   cloud decks slide past as you climb through them, town lights come up at night,
   and the horizon starts to curve near FL410. Every layer is projected from one
   eye height, so near things move faster than far ones. */
const hash = (a, b) => { let h = (a*374761393 + b*668265263) | 0; h = (h ^ (h >>> 13))*1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0)/4294967295; };
const W0 = {z:0, camX:0, hold:0, eye:400};
const FIELD = [C('#6f7a46'), C('#8c8452'), C('#5b6b3c'), C('#7d6a44'), C('#91906a')];
const towns = Array.from({length:42}, (_,i) => ({X:(rnd()*2-1)*160000, Z:rnd()*360000, n:6 + Math.floor(rnd()*26), r:900 + rnd()*3800, big:i % 9 === 0}));
const townPts = towns.map(t => Array.from({length:t.n*(t.big ? 3 : 1)}, () => { const a = rnd()*6.283, q = Math.sqrt(rnd())*t.r*(t.big ? 1.8 : 1); return [Math.cos(a)*q, Math.sin(a)*q, rnd()]; }));
let cloudKey = '', cpuffs = [];
function cloudLayers(c){
  const L = [];
  if (c.cover > 0 && c.cover < .75) L.push({base:c.base, top:c.top, n:Math.round(10 + c.cover*34), kind:'cu'});
  if (c.cover < .3) L.push({base:4200, top:6200, n:8, kind:'cu'});
  if (!c.storm) L.push({base:13500, top:15500, n:c.cover < .3 ? 7 : 4, kind:'ac'});
  if (!c.storm) L.push({base:27000, top:31500, n:14, kind:'ci'});
  return L;
}
function seedPuff(q, L, far){ q.L = L; q.alt = L.base + Math.random()*(L.top - L.base); q.X = (Math.random()*2 - 1)*70000; q.d = far ? 45000 + Math.random()*25000 : 2500 + Math.random()*65000; q.w = L.kind === 'ci' ? 5000 + Math.random()*9000 : L.kind === 'ac' ? 1500 + Math.random()*2500 : 1800 + Math.random()*3600; q.s = Math.random(); }
function ensureClouds(c){
  if (cloudKey === c.id) return; cloudKey = c.id; cpuffs = [];
  cloudLayers(c).forEach(L => { for (let i=0;i<L.n;i++){ const q = {}; seedPuff(q, L, false); cpuffs.push(q); } });
}
function horizonAt(x, hy, curv){ const u = (x - SW/2)/(SW/2); return hy + curv*u*u; }
function drawWorld(S, t, dt, hy, vsN){
  const c = S.c, eye = Math.max(S.alt, W0.eye), f = SH*1.1, day = S.day, night = 1 - day;
  const gs = reduce ? 0 : lerp(140, 420, S.p)*(1 - W0.hold);
  W0.z += dt*gs; W0.camX = Math.sin(t*.01)*4000;
  const visFt = Math.max(3000, c.vis*5280*(1.4 + S.p*7));
  const curv = smooth(14000, 41000, S.alt)*Math.min(SH*.05, 46);
  const under = S.above && S.solid;
  const hz = S.hz;
  // ground (or undercast) under a curved horizon
  sc.save(); sc.beginPath(); sc.moveTo(0, SH + 2);
  for (let x = 0; x <= SW + 24; x += 24) sc.lineTo(x, horizonAt(x, hy, curv));
  sc.lineTo(SW, SH + 2); sc.closePath(); sc.clip();
  const g0 = under ? mixA(mixA(PAL.flN, PAL.flD, day), S.h < 12 ? PAL.twA : PAL.twP, S.twi*.35)
    : c.kind === 'snow' ? mixA(C('#2c323c'), C('#dfe5ec'), day) : mixA(C('#0a0d12'), C('#6a7444'), day);
  const dim = S.below && S.solid ? .7 : 1;
  for (let y = Math.floor(hy - 2); y < SH; y += 3) {
    const d = eye*f/Math.max(1, y - hy + curv*.3), hz2 = 1 - Math.exp(-d/visFt);
    sc.fillStyle = rgb(mixA(mixA(g0, [0,0,0], under ? 0 : (1 - dim)), hz, clamp(hz2*1.05, 0, 1))); sc.fillRect(0, y, SW, 3);
  }
  if (!under) {
    const F = eye < 7000 ? 1320 : 5280, dmin = eye*f/Math.max(1, SH - hy), zo = W0.z % F;
    // field patchwork (day) — quarter sections near the airport, square miles from altitude
    if (day > .08) {
      let quads = 0;
      for (let k = 0; k < 90 && quads < 520; k++) {
        const d0 = Math.max(dmin*.9, k*F - zo), d1 = d0 + F; if (d0 > visFt*2.2) break;
        const y0 = hy + eye*f/d1, y1 = hy + eye*f/d0; if (y1 - y0 < 1.5 && k > 3) break;
        const hzk = 1 - Math.exp(-d0/visFt), a = (1 - hzk)*.42*day*dim; if (a < .02) continue;
        const jr = Math.ceil(SW*.75*d1/f/F) + 1, kk = Math.floor((k*F - zo + W0.z)/F);
        for (let j = -jr; j <= jr; j++) {
          const X0 = j*F - (W0.camX % F), X1 = X0 + F, hsh = hash(j + Math.floor(W0.camX/F), kk);
          if (hsh < .22) continue;
          sc.fillStyle = rgb(FIELD[Math.floor(hsh*FIELD.length*.999)], a);
          sc.beginPath(); sc.moveTo(SW/2 + X0*f/d1, y0); sc.lineTo(SW/2 + X1*f/d1, y0); sc.lineTo(SW/2 + X1*f/d0, y1); sc.lineTo(SW/2 + X0*f/d0, y1); sc.closePath(); sc.fill(); quads++;
        }
      }
    }
    // section-line roads
    sc.strokeStyle = rgb(mixA(g0, [255,255,255], .25), (.10 + day*.12)*dim); sc.lineWidth = 1;
    sc.beginPath();
    for (let k = 1; k < 120; k++) { const d = k*F - zo; if (d < dmin) continue; const y = hy + eye*f/d; if (y - hy < 2.5) break; sc.moveTo(0, y); sc.lineTo(SW, y); }
    const reach = SW*.75*dmin/f;
    for (let X = -Math.ceil(reach/F)*F - (W0.camX % F); X <= reach; X += F) { sc.moveTo(SW/2 + X*f/dmin, SH); sc.lineTo(SW/2, hy); }
    sc.stroke();
    // the Wabash, winding through: an opaque ribbon so overlapping segments don't bead
    let prev = null; sc.lineCap = 'butt'; sc.lineJoin = 'round';
    for (let i = 0; i < 90; i++) {
      const d = dmin + Math.pow(i/89, 2.4)*visFt*2.2, Zw = d + W0.z, Xw = 9000*Math.sin(Zw/38000) + 3500*Math.sin(Zw/8700) + 2600 - W0.camX;
      const p = [SW/2 + Xw*f/d, hy + eye*f/d];
      if (prev) { const hzr = 1 - Math.exp(-d/visFt); sc.strokeStyle = rgb(mixA(mixA(mixA(g0, [0,0,0], 1 - dim), mixA(S.z, hz, .6), .55 + day*.15), hz, hzr)); sc.lineWidth = clamp(320*f/d, .5, 14); sc.beginPath(); sc.moveTo(prev[0], prev[1]); sc.lineTo(p[0], p[1]); sc.stroke(); }
      prev = p;
    }
    // town and highway lights after dusk
    if (night > .25) {
      sc.fillStyle = '#ffc77a';
      for (let ti = 0; ti < towns.length; ti++) {
        const T = towns[ti]; let Z = ((T.Z - W0.z) % 360000 + 360000) % 360000; if (Z < dmin*.8) continue;
        const pts = townPts[ti];
        for (const pt of pts) {
          const d = Z + pt[1]; if (d < dmin*.8) continue; const hzL = 1 - Math.exp(-d/(visFt*1.6));
          const x = SW/2 + (T.X + pt[0] - W0.camX)*f/d, y = hy + eye*f/d; if (x < -4 || x > SW + 4 || y > SH) continue;
          sc.globalAlpha = (night - .2)*(1 - hzL)*(.45 + .55*pt[2])*dim; const r = clamp(220*f/d*.04, .5, 2.2);
          sc.fillRect(x - r/2, y - r/2, r, r);
        }
      }
      sc.globalAlpha = 1;
    }
  }
  sc.restore();
  // limb glow once the curve shows
  if (curv > 2) {
    const k = curv/46; sc.strokeStyle = rgb(mixA(hz, [255,255,255], .5), .55*k); sc.lineWidth = 2; sc.beginPath();
    for (let x = 0; x <= SW + 24; x += 24) { const y = horizonAt(x, hy, curv); x ? sc.lineTo(x, y) : sc.moveTo(x, y); } sc.stroke();
  }
}
function drawClouds(S, t, dt, hy){
  const c = S.c, eye = Math.max(S.alt, 400), f = SH*1.1, day = S.day;
  if (S.inside) return;
  ensureClouds(c);
  const gs = reduce ? 0 : lerp(140, 420, S.p);
  const col = mixA(mixA(PAL.clN, [255,255,255], day), S.h < 12 ? PAL.twA : PAL.twP, S.twi*.35);
  const shade = mixA(col, [70,80,100], .35);
  cpuffs.sort((a,b) => b.d - a.d);
  for (const q of cpuffs) {
    q.d -= dt*gs*(.6 + q.s*.8);
    let x = SW/2 + (q.X - W0.camX*.3)*f/q.d;
    if (q.d < 900 || x < -SW || x > SW*2) { seedPuff(q, q.L, true); continue; }
    const y = hy - (q.alt - eye)*f/q.d, r = q.w*f/q.d;
    if (y < -r || y > SH + r) continue;
    const far = 1 - Math.exp(-q.d/60000), near = smooth(900, 3200, q.d);
    const a = (q.L.kind === 'ci' ? .32 : q.L.kind === 'ac' ? .5 : .78)*(1 - far*.75)*near*(.45 + day*.55);
    if (a < .02) continue;
    if (q.L.kind === 'ci') {
      sc.save(); sc.translate(x, y); sc.scale(1, .16); puff(sc, 0, 0, r, col, a); puff(sc, r*.5, -r*.2, r*.6, col, a*.8); sc.restore();
    } else {
      const n = q.L.kind === 'ac' ? 3 : 5;
      for (let i=0;i<n;i++){ const ox = (hash(i, q.s*1e4|0) - .5)*r*1.3, oy = -hash(q.s*1e4|0, i)*r*.35; puff(sc, x + ox, y + oy + r*.12, r*.55, shade, a*.55); puff(sc, x + ox, y + oy, r*.5, col, a); }
    }
  }
}
// streaks that rush past while you climb or descend
const streaks = Array.from({length:46}, () => ({x:rnd(), y:rnd(), l:.4 + rnd()*.8, s:.6 + rnd()*.8}));
function drawStreaks(S, dt, vsN){
  if (reduce) return; const m = clamp(Math.abs(vsN), 0, 1); if (m < .04) return;
  const dir = vsN >= 0 ? 1 : -1;
  sc.strokeStyle = S.day > .5 ? 'rgba(255,255,255,1)' : 'rgba(200,215,240,1)'; sc.lineWidth = 1;
  for (const p of streaks) {
    p.y += dir*dt*p.s*(.6 + m*2.4); if (p.y > 1.1) { p.y -= 1.2; p.x = Math.random(); } if (p.y < -.1) { p.y += 1.2; p.x = Math.random(); }
    const L = p.l*m*90; sc.globalAlpha = m*.16*p.s; sc.beginPath(); sc.moveTo(p.x*SW, p.y*SH); sc.lineTo(p.x*SW, p.y*SH - dir*L); sc.stroke();
  }
  sc.globalAlpha = 1;
}

/* ================= altitude model ================= */
let tops = [], maxScroll = 1;
function measure(){ tops = WP.map(w => document.getElementById(w.id).getBoundingClientRect().top + scrollY); maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight); layoutHero(); }
const ROT = .6;
const rollLen = () => reduce ? 1 : Math.max(1, hero.offsetHeight - stage.offsetHeight);
const rollTk = y => reduce ? 0 : clamp((y - hero.offsetTop)/rollLen(), 0, 1);
function rollDist(tk){ const a = clamp((tk - .03)/(ROT - .03), 0, 1); return tk <= ROT ? 1500*a*a : 1500 + (tk - ROT)*4000; }
function heroAlt(tk){ return tk <= ROT ? 0 : 900*Math.pow((tk - ROT)/(1 - ROT), 1.3); }
function altAt(y){
  if (y >= maxScroll - 4) return {alt:41000, i:WP.length-1};
  const R = reduce ? 0 : rollLen(), h0 = hero.offsetTop;
  if (!reduce && y < h0 + R) return {alt:heroAlt(rollTk(y)), i:0};
  const probe = y + innerHeight*.45; let i = 0;
  while (i < WP.length-1 && probe >= tops[i+1]) i++;
  if (i === WP.length-1) return {alt:41000, i};
  const a0 = i === 0 ? (reduce ? 0 : 900) : WP[i].alt;
  const s0 = i === 0 ? h0 + R + innerHeight*.45 : tops[i];
  return {alt: lerp(a0, WP[i+1].alt, clamp((probe - s0)/Math.max(1, tops[i+1] - s0), 0, 1)), i};
}
addEventListener('resize', () => { sizeCanvases(); sizeTrail(); measure(); });
new ResizeObserver(measure).observe($('#main'));

/* ================= altimeter rail ================= */
const altc = $('#altc'), ax = altc.getContext('2d');
function drawAltRail(alt){
  const W = 172, H = 680, cy = H/2, ppf = .16; ax.clearRect(0,0,W,H);
  ax.font = '500 22px JetBrains Mono, monospace'; ax.textAlign = 'right'; ax.fillStyle = '#e8eef6'; ax.strokeStyle = '#e8eef6'; ax.lineWidth = 2;
  const base = Math.floor(alt/100)*100;
  for (let v = base - 2400; v <= base + 2400; v += 100){ if (v < 0) continue; const y = cy - (v - alt)*ppf; if (y < -20 || y > H + 20) continue; ax.beginPath(); ax.moveTo(0, y); ax.lineTo(v % 500 === 0 ? 26 : 14, y); ax.stroke(); if (v % 500 === 0) ax.fillText(v.toLocaleString('en-US'), W - 12, y + 8); }
  const c = cond();
  if (c.cover > 0) { const yb = cy - (c.base - alt)*ppf, yt = cy - (c.top - alt)*ppf; ax.fillStyle = 'rgba(200,215,235,.14)'; ax.fillRect(0, Math.max(0, yt), 30, Math.min(H, yb) - Math.max(0, yt)); }
  WP.forEach(w => { const y = cy - (w.alt - alt)*ppf; if (y < 0 || y > H) return; ax.fillStyle = '#e25bd4'; ax.fillRect(0, y - 3, 8, 6); ax.font = '600 16px JetBrains Mono, monospace'; ax.textAlign = 'left'; ax.fillText(w.code, 32, y - 6); ax.font = '500 22px JetBrains Mono, monospace'; ax.textAlign = 'right'; });
  ax.fillStyle = '#03060c'; ax.strokeStyle = '#e8eef6'; ax.fillRect(6, cy - 26, W - 12, 52); ax.strokeRect(6, cy - 26, W - 12, 52);
  ax.fillStyle = '#5be39a'; ax.font = '600 28px JetBrains Mono, monospace'; ax.textAlign = 'center'; ax.fillText(Math.round(alt).toLocaleString('en-US'), W/2, cy + 10);
}

/* ================= vitals monitor =================
   One patient monitor docked in the cockpit (bottom left once you're airborne) plus a thin
   live ECG trace between sections. Normally it shows your own "pilot" vitals (climb and
   scroll speed push the rate up). When a medical call comes in it becomes the patient's
   monitor, and what you do in the call (compressions, shocks, epinephrine) shows on it. */
const V = {lastTouch:-99, base:72, hr:72, tapHR:72, exert:0, holding:false, taps:[], beats:[], next:0, svt:false, pause:0, spo2:98, rhythm:'NSR', charging:false, pt:null};
const mons = [];
$$('.ecgd').forEach(d => {
  const sec = d.nextElementSibling, code = (WP.find(w => sec && w.id === sec.id) || {}).code || '';
  d.innerHTML = `<div class="trace" tabindex="-1" aria-hidden="true"><canvas></canvas><span class="lbl"><i>♥</i> <b class="hrv">72</b> BPM · LEAD II · <span class="rh">NSR</span> · NEXT ${code}</span></div>`;
  const m = $('.trace', d);
  const o = {kind:'trace', m, cv:$('canvas', m), hr:$('.hrv', m), rh:$('.rh', m), heart:$('i', m), vis:false};
  mons.push(o);
  m.addEventListener('pointerdown', () => { V.lastTouch = nowS(); tapBeat(); });
});
const vm = $('#vmon');
const dock = {kind:'dock', m:vm, cv:$('canvas', vm), hr:$('.hr b', vm), heart:$('.hr i', vm), sp:$('.sp b', vm), bp:$('.bp b', vm), rh:$('.rh', vm), who:$('.who', vm), hh:$('.hh', vm), shock:$('.shock', vm), clear:$('.clear', vm), vis:true};
mons.push(dock);
{
  let holdT = null;
  const m = $('.scr', vm);
  m.addEventListener('pointerenter', () => { V.lastTouch = nowS(); });
  m.addEventListener('pointerdown', e => { V.lastTouch = nowS(); if (e.target.closest('button')) return; if (MED.on) return medTap(); tapBeat(); holdT = setTimeout(() => { V.holding = true; }, 260); });
  const up = () => { clearTimeout(holdT); V.holding = false; };
  m.addEventListener('pointerup', up); m.addEventListener('pointerleave', up); m.addEventListener('pointercancel', up);
  vm.addEventListener('keydown', e => {
    if (e.target !== $('.scr', vm)) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) { if (MED.on) medTap(); else tapBeat(); } }
    else if (e.key === 'e' || e.key === 'E') { e.preventDefault(); V.holding = true; }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); V.base = clamp(V.base + (e.key === 'ArrowUp' ? 4 : -4), 44, 120); toast('RESTING RATE <b>' + V.base + '</b> BPM'); }
    else if (e.key === 's' || e.key === 'S') { e.preventDefault(); shock(); }
  });
  vm.addEventListener('keyup', e => { if (e.key === 'e' || e.key === 'E') V.holding = false; });
  dock.shock.addEventListener('click', shock);
  $('#vmRun').addEventListener('click', () => medStart(null, true));
  $('#vmMin').addEventListener('click', () => { vm.classList.toggle('min'); $('#vmMin').setAttribute('aria-expanded', String(!vm.classList.contains('min'))); });
}
const monIO = new IntersectionObserver(es => es.forEach(e => { const o = mons.find(x => x.m.parentElement === e.target); if (o) o.vis = e.isIntersecting; }));
$$('.ecgd').forEach(d => monIO.observe(d));
function beep(){ if (nowS() - V.lastTouch < 8 || MED.on) tone(560 + (V.spo2 - 90)*28, .06, 'sine', .025); }
function addBeat(t, type){
  V.beats.push({t, type}); if (V.beats.length > 40) V.beats.shift();
  if (type !== 'cpr') { beep(); mons.forEach(o => { if (!o.heart) return; o.heart.classList.add('on'); setTimeout(() => o.heart.classList.remove('on'), 120); }); }
}
function tapBeat(){ const n = nowS(); V.lastTouch = n; if (n < V.pause) return; V.taps.push(n); addBeat(n, 'p'); V.next = n + 60/Math.max(40, V.hr); }
function shock(){
  if (MED.on && MED.wantShock) return medShock();
  if (!V.svt || V.charging) { if (!V.svt) toast('No shockable rhythm. Tap the monitor fast to push the rate past 165 first.'); return; }
  V.charging = true; toast('CHARGING · <b>200 J</b> · stand clear', 1200); chargeTone();
  setTimeout(() => {
    zap(); V.svt = false; V.charging = false; V.taps = []; V.exert = 0; V.hr = 70;
    toast('CONVERTED · normal sinus rhythm');
  }, 1000);
}
function chargeTone(){ if (soundOn) { const c = ac(); if (c) { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(400, c.currentTime); o.frequency.linearRampToValueAtTime(1600, c.currentTime + 1); g.gain.value = .03; o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 1); } } }
function zap(){
  const n = nowS(); addBeat(n, 'shock'); V.pause = n + 1.5; V.next = n + 1.5;
  dock.clear.classList.remove('on'); void dock.clear.offsetWidth; dock.clear.classList.add('on');
  noise(.25, 300, .2, 'lowpass');
}
const G = (x, m, s) => Math.exp(-((x-m)*(x-m))/(2*s*s));
function beatShape(d, type){
  const ts = Math.sqrt(60/Math.max(V.hr, 40));
  if (type === 'svt') return -.08*G(d,-.015,.008) + 1.0*G(d,0,.011) - .25*G(d,.022,.01) + .18*G(d,.16*ts,.045);
  if (type === 'p') return 1.15*G(d,-.045,.003) + .82*G(d,.02,.03) - .35*G(d,.24*ts,.06);
  if (type === 'shock') return 2.4*G(d,0,.025) - 1.8*G(d,.07,.05);
  if (type === 'cpr') return .9*G(d,.08,.07) - .35*G(d,.26,.08);
  return .12*G(d,-.16,.03) - .1*G(d,-.02,.008) + 1.0*G(d,0,.011) - .28*G(d,.025,.01) + .26*G(d,.25*ts,.06);
}
function signal(tau){
  let y = .012*Math.sin(tau*47) + .006*Math.sin(tau*131);
  const pt = V.pt;
  if (pt && pt.rhythm === 'VF') y += .32*Math.sin(tau*29.1 + Math.sin(tau*3.1)*2) + .2*Math.sin(tau*41.7 + 1.3) + .12*Math.sin(tau*17.3);
  for (const b of V.beats) { const d = tau - b.t; if (d > -.3 && d < .7) y += beatShape(d, b.type); }
  return y;
}
let vitT = 0;
function vitalsStep(n, dt){
  V.exert = V.holding ? Math.min(1, V.exert + dt*.22) : Math.max(0, V.exert - dt*.05);
  V.taps = V.taps.filter(x => n - x < 4);
  const pt = V.pt;
  const pacing = !pt && V.taps.length >= 2 && n - V.taps[V.taps.length-1] < 2.2;
  if (pacing) { const iv = (V.taps[V.taps.length-1] - V.taps[0])/(V.taps.length - 1); V.tapHR = 60/Math.max(.18, iv); if (V.tapHR > 165 && V.taps.length >= 5 && !V.svt) { V.svt = true; V.taps = []; toast('ALARM · <b>SVT 186</b> · press S or SYNC SHOCK', 3500); tone(880,.2,'square',.04); tone(880,.2,'square',.04,.3); } }
  let target = V.base + V.exert*95 + (document.body.classList.contains('mayday') ? 55 : 0) + Math.min(25, scrollKick);
  if (V.svt) target = 186;
  if (pt) target = pt.hr;
  V.hr = pacing && !V.svt ? lerp(V.hr, V.tapHR, .25) : lerp(V.hr, target, Math.min(1, dt*(pt ? 1.6 : .9)));
  const noBeats = pt && (pt.rhythm === 'VF' || pt.rhythm === 'ASYSTOLE');
  if (!pacing && !noBeats && n >= V.next && n >= V.pause) { addBeat(n, V.svt ? 'svt' : 'n'); V.next = n + 60/Math.max(30, V.hr)*(V.svt ? 1 : 1 + (Math.random() - .5)*.05); }
  V.spo2 = pt ? (pt.spo2 == null ? 84 : Math.round(lerp(V.spo2, pt.spo2, Math.min(1, dt*2)))) : V.svt ? 94 : V.exert > .6 ? 97 : 98;
  V.rhythm = pt ? pt.rhythm : V.svt ? 'SVT' : pacing ? 'PACED' : V.hr < 60 ? 'SINUS BRADY' : V.hr > 100 ? 'SINUS TACH' : 'NSR';
  vitT += dt;
  if (vitT > .25) {
    vitT = 0;
    const sys = pt ? pt.bp[0] : Math.round(118 + V.exert*38 - (V.svt ? 24 : 0)), dia = pt ? pt.bp[1] : Math.round(76 + V.exert*8 - (V.svt ? 12 : 0));
    const hrTxt = noBeats ? '---' : String(Math.round(V.hr)), alarm = V.svt || (pt && pt.alarm);
    mons.forEach(o => {
      if (!o.vis && o.kind !== 'dock') return;
      o.hr.textContent = hrTxt; o.rh.textContent = V.rhythm; o.rh.classList.toggle('alarm', !!alarm);
      if (o.kind === 'dock') { o.sp.textContent = pt && pt.spo2 == null ? '--' : V.spo2; o.bp.textContent = sys ? sys + '/' + dia : '--/--'; o.shock.hidden = !(V.svt || (MED.on && MED.wantShock)); o.who.textContent = pt ? pt.who : 'PILOT · N-BANDHA'; o.hh.textContent = hrTxt; }
    });
    vm.classList.toggle('alarm', !!alarm);
  }
}
function drawMon(o, n){
  const cv = o.cv, r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  if (!r.width) return;
  if (cv.width !== Math.round(r.width*dpr)) { cv.width = Math.round(r.width*dpr); cv.height = Math.round(r.height*dpr); }
  const c = cv.getContext('2d'), W = r.width, H = r.height; c.setTransform(dpr,0,0,dpr,0,0); c.clearRect(0,0,W,H);
  const trace = o.kind === 'trace';
  if (!trace) {
    c.strokeStyle = 'rgba(91,227,154,.07)'; c.lineWidth = 1;
    for (let x = 0; x < W; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = 0; y < H; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  }
  const win = trace ? 6 : 4, alarm = V.svt || (V.pt && V.pt.alarm), col = alarm ? (V.pt ? '#ff6b6b' : '#ffcf5b') : '#5be39a';
  const base = trace ? .62 : .6, amp = trace ? .5 : .42;
  c.lineWidth = trace ? 1.6 : 2; c.lineJoin = 'round'; c.strokeStyle = col; c.shadowColor = col; c.shadowBlur = trace ? 8 : 6; c.beginPath();
  for (let x = 0; x <= W; x += 2) { const tau = n - win + (x/W)*win, y = H*base - signal(tau)*H*amp; x ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.stroke(); c.shadowBlur = 0;
  if (trace) { const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.12, 'rgba(0,0,0,0)'); g.addColorStop(.88, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); c.globalCompositeOperation = 'destination-out'; c.fillStyle = g; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; }
  c.fillStyle = '#e9fff1'; c.beginPath(); c.arc(W - 2, H*base - signal(n)*H*amp, 2.6, 0, 6.283); c.fill();
}

/* ================= medical calls =================
   Random in-flight medical emergencies. Each one is a short, timed call that teaches one
   real skill. Training game only: the footer always says to call 911 in a real emergency.
   Sources for the steps: AHA adult CPR (100–120/min, shock then resume compressions),
   Stop the Bleed (tourniquet high and tight, 2–3 in above the wound, never on a joint),
   Red Cross choking (5 back blows, 5 abdominal thrusts), anaphylaxis (epinephrine
   auto-injector to the outer thigh), BE FAST stroke signs, and the rule of 15 for low sugar. */
const ls = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
const MED = {on:false, sc:null, step:0, t0:0, limit:0, timer:null, tick:null, saves:+(ss.get('saves') || 0), runs:+(ss.get('runs') || 0), active:0, next:0, wantShock:false, comp:[], hold:null, data:{}};
const SEATS = ['14C','22A','9F','31D','17B','26E','4A','11C'];
const pick = a => a[Math.floor(Math.random()*a.length)];
const SCEN = {
  arrest:{title:'Cardiac arrest', who:'PT · CARDIAC ARREST', pt:{hr:0, spo2:null, bp:[0,0], rhythm:'VF', alarm:true}, limit:45,
    scene: s => `The passenger in <b>${s}</b> collapsed. No response, and they're only gasping, not breathing normally. The crew is bringing the AED.`,
    learn:'Push hard and fast in the center of the chest, 100–120 a minute, at least 2 inches deep. After a shock, go straight back to compressions.'},
  bleed:{title:'Severe bleeding', who:'PT · HEMORRHAGE', pt:{hr:128, spo2:95, bp:[92,58], rhythm:'SINUS TACH', alarm:true}, limit:25,
    scene: s => `A galley cart caught the passenger in <b>${s}</b>. Bright red blood is spurting from the forearm and direct pressure isn't stopping it.`,
    learn:'Tourniquet high and tight: 2–3 inches above the wound, never over a joint. Tighten until the bleeding stops and note the time.'},
  choke:{title:'Choking', who:'PT · AIRWAY OBSTRUCTION', pt:{hr:124, spo2:88, bp:[148,92], rhythm:'SINUS TACH', alarm:true}, limit:25,
    scene: s => `The passenger in <b>${s}</b> is clutching their throat. They can't speak, cough or breathe. You ask "Are you choking?" and they nod.`,
    learn:'Give 5 back blows between the shoulder blades, then 5 abdominal thrusts. Repeat until the object comes out or they become unresponsive (then start CPR).'},
  ana:{title:'Anaphylaxis', who:'PT · ANAPHYLAXIS', pt:{hr:132, spo2:90, bp:[82,46], rhythm:'SINUS TACH', alarm:true}, limit:25,
    scene: s => `The passenger in <b>${s}</b> just ate a snack mix. Hives, swollen lips, and they're wheezing. There's an epinephrine auto-injector in their bag.`,
    learn:'Epinephrine first, into the outer thigh (through clothing is fine). Hold it in place about 3 seconds, get EMS, and be ready for a second dose if symptoms return.'},
  stroke:{title:'Stroke', who:'PT · SUSPECTED STROKE', pt:{hr:88, spo2:96, bp:[184,104], rhythm:'NSR', alarm:true}, limit:25,
    scene: s => `The passenger in <b>${s}</b> suddenly can't get words out. The right side of their face droops and their right arm drifts down when they lift both.`,
    learn:'BE FAST: Balance, Eyes, Face, Arms, Speech, Time. Note when symptoms started and get them to a stroke center. Nothing by mouth.'},
  sugar:{title:'Low blood sugar', who:'PT · HYPOGLYCEMIA · BGL 48', pt:{hr:112, spo2:98, bp:[126,80], rhythm:'SINUS TACH', alarm:true}, limit:20,
    scene: s => `The passenger in <b>${s}</b> has type 1 diabetes. They're sweaty, shaky and confused, but awake and able to swallow.`,
    learn:'Rule of 15: 15 g of fast sugar (juice, regular soda, glucose tabs), recheck in 15 minutes, repeat if still low. Only if they can swallow safely.'}
};
const med = $('#med'), mc = $('#mc');
function medAllowed(){ return !document.hidden && !dlg.open && $('#chat').hidden && $('#keysHelp').hidden && $('#boot').hidden && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || ''); }
function medAuto(){ return ls.get('fd.med') !== 'off' && !reduce; }
function medSchedule(first){ MED.next = MED.active + (first ? 28 + Math.random()*20 : 80 + Math.random()*70); }
medSchedule(true);
setInterval(() => {
  if (MED.on || !mc.hidden || curIdx < 1 || !medAllowed()) return;
  MED.active += 1;
  if (medAuto() && MED.active >= MED.next && MED.runs < 4) { medSchedule(false); medAlert(); }
}, 1000);
function medAlert(){
  const key = pick(Object.keys(SCEN)), seat = pick(SEATS);
  MED.pending = {key, seat};
  $('#mcT').innerHTML = `MEDICAL · <b>${esc(SCEN[key].title.toUpperCase())}</b> · ROW ${esc(seat)}`;
  mc.hidden = false; mc.classList.remove('in'); void mc.offsetWidth; mc.classList.add('in');
  chime(); tone(660,.25,'square',.03,.35); tone(660,.25,'square',.03,.7);
  clearTimeout(MED.mcT); MED.mcT = setTimeout(() => { mc.hidden = true; }, 9000);
}
$('#mcGo').addEventListener('click', () => { mc.hidden = true; const p = MED.pending; medStart(p && p.key, false, p && p.seat); });
$('#mcNo').addEventListener('click', () => { mc.hidden = true; });
$('#mcOff').addEventListener('click', () => { mc.hidden = true; ls.set('fd.med', 'off'); toast('Random medical calls <b>OFF</b> · run one any time from the monitor'); });
function medStart(key, manual, seat){
  if (MED.on) return;
  key = key || pick(Object.keys(SCEN)); seat = seat || pick(SEATS);
  const S = SCEN[key]; MED.on = true; MED.sc = key; MED.step = 0; MED.data = {seat, misses:0}; MED.comp = []; MED.wantShock = false;
  MED.runs++; ss.set('runs', MED.runs);
  V.pt = Object.assign({who:S.who + ' · ' + seat}, JSON.parse(JSON.stringify(S.pt))); V.beats = []; V.next = nowS() + .3; V.svt = false;
  vm.classList.remove('min'); document.body.classList.add('medcall');
  $('#medK').textContent = S.title.toUpperCase(); $('#medWhere').textContent = 'ROW ' + seat;
  $('#medScene').innerHTML = S.scene(seat);
  med.hidden = false; med.classList.remove('done', 'fail');
  MED.t0 = nowS(); MED.limit = S.limit;
  clearInterval(MED.tick); MED.tick = setInterval(medClock, 100);
  STEPS[key](0);
  setTimeout(() => { const f = $('#medQ button, #medQ [tabindex]'); if (f) f.focus(); }, 60);
}
function medClock(){
  const left = MED.limit - (nowS() - MED.t0);
  $('#medT').textContent = Math.max(0, left).toFixed(1) + 's';
  $('#medBar').style.width = clamp(left/MED.limit, 0, 1)*100 + '%';
  $('#medBar').classList.toggle('low', left < 6);
  if (left <= 0) medEnd(false, 'Out of time. The patient got worse while you were deciding.');
}
function q(html){ $('#medQ').innerHTML = html; }
function choice(prompt, opts, onPick){
  q(`<p class="mp">${prompt}</p><div class="mopts">${opts.map((o,i) => `<button type="button" data-i="${i}"><kbd>${i+1}</kbd>${o[0]}</button>`).join('')}</div><p class="mfb" id="mfb" aria-live="polite"></p>`);
  $$('#medQ .mopts button').forEach(b => b.addEventListener('click', () => {
    const o = opts[+b.dataset.i];
    if (o[1]) { b.classList.add('ok'); tone(880,.08,'sine',.04); setTimeout(() => onPick(+b.dataset.i), 450); }
    else { b.classList.add('no'); b.disabled = true; MED.data.misses++; $('#mfb').textContent = o[2] || 'Not that one.'; tone(220,.15,'square',.03); MED.t0 -= 3; }
  }));
}
function holdBtn(label, secs, onDone, hint){
  q(`<p class="mp">${hint}</p><button type="button" class="mhold" id="mhold"><span class="fill" id="mhf"></span><span class="lb">${label}</span></button><p class="mfb" id="mfb" aria-live="polite">Press and hold (or hold Space)</p>`);
  const b = $('#mhold'); let st = null, raf = null, done = false;
  const go = () => { if (st || done) return; st = nowS(); (function f(){ const p = clamp((nowS() - st)/secs, 0, 1); $('#mhf').style.width = p*100 + '%'; $('#mfb').textContent = p < 1 ? Math.ceil(secs - p*secs) + '…' : 'Done'; if (p >= 1) { done = true; tone(990,.1,'sine',.04); return onDone(); } raf = requestAnimationFrame(f); })(); };
  const stop = () => { if (done || !st) return; cancelAnimationFrame(raf); st = null; $('#mhf').style.width = '0%'; $('#mfb').textContent = 'Let go too early. Hold it the whole time.'; MED.data.misses++; };
  b.addEventListener('pointerdown', e => { e.preventDefault(); go(); }); b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop);
  b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); go(); } });
  b.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });
}
const STEPS = {
  arrest(step){
    if (step === 0) return choice('First move?', [['Start chest compressions now', true], ['Sit them up and give water', false, 'Never give anything by mouth to someone unresponsive.'], ['Wait for the AED before touching them', false, 'Every minute without compressions costs survival. Start now; the AED joins when it arrives.']], () => STEPS.arrest(1));
    if (step === 1) { MED.data.target = 20; return compressions(() => STEPS.arrest(2)); }
    if (step === 2) { MED.wantShock = true; V.pt.rhythm = 'VF'; q(`<p class="mp"><b>AED: "Shock advised."</b> Everyone clear. Press <kbd>SHOCK</kbd> on the monitor (or <kbd>S</kbd>).</p><button type="button" class="mshock" id="mshock">⚡ SHOCK · 200 J</button><p class="mfb" id="mfb"></p>`); $('#mshock').addEventListener('click', medShock); setTimeout(() => $('#mshock').focus(), 30); return; }
    if (step === 3) return choice('Shock delivered. Now what?', [['Resume compressions immediately', true], ['Check for a pulse for 30 seconds', false, 'Go straight back to compressions. The AED re-checks rhythm every 2 minutes.'], ['Wait for the AED to re-analyze', false, 'Pauses kill. Compressions right away.']], () => { MED.data.target = 10; compressions(() => { V.pt.rhythm = 'NSR'; V.pt.hr = 96; V.pt.spo2 = 94; V.pt.bp = [104, 66]; V.pt.alarm = false; V.next = nowS() + .2; medEnd(true, 'Pulse is back (ROSC). Recovery position, keep watching their breathing until paramedics take over.'); }); });
  },
  bleed(step){
    if (step === 0) {
      q(`<p class="mp">Where does the tourniquet go?</p><div class="arm" role="group" aria-label="Arm diagram"><svg viewBox="0 0 420 120" aria-hidden="true"><path d="M10 60 Q60 40 130 46 L250 54 Q330 58 410 66" stroke="#d9b38c" stroke-width="44" stroke-linecap="round" fill="none"/><circle cx="196" cy="51" r="11" fill="#c2252b"/><circle cx="196" cy="51" r="18" fill="none" stroke="#ff6b6b" stroke-dasharray="4 4"/><text x="196" y="102" fill="#ffb4b4" font-family="JetBrains Mono" font-size="11" text-anchor="middle">WOUND</text><text x="40" y="20" fill="#9fb0c8" font-family="JetBrains Mono" font-size="10">SHOULDER</text><text x="360" y="22" fill="#9fb0c8" font-family="JetBrains Mono" font-size="10">HAND</text></svg>
        <button type="button" class="zone" data-z="0" style="left:17%">A<small>Upper arm</small></button><button type="button" class="zone" data-z="1" style="left:31%">B<small>Elbow</small></button><button type="button" class="zone" data-z="2" style="left:46%">C<small>On the wound</small></button><button type="button" class="zone" data-z="3" style="left:68%">D<small>Wrist</small></button></div><p class="mfb" id="mfb" aria-live="polite"></p>`);
      const fb = ['', 'Never over a joint. It won\'t compress the artery against bone.', 'Not on the wound. Go 2–3 inches above it, toward the heart.', 'Below the wound does nothing. Blood comes from the heart side.'];
      $$('#medQ .zone').forEach(b => b.addEventListener('click', () => {
        const z = +b.dataset.z;
        if (z === 0) { b.classList.add('ok'); tone(880,.08,'sine',.04); setTimeout(() => STEPS.bleed(1), 450); }
        else { b.classList.add('no'); b.disabled = true; MED.data.misses++; MED.t0 -= 3; $('#mfb').textContent = fb[z]; tone(220,.15,'square',.03); }
      }));
      return;
    }
    if (step === 1) return holdBtn('⟳ TIGHTEN WINDLASS', 2.4, () => { V.pt.hr = 112; V.pt.bp = [104, 64]; V.pt.alarm = false; const t = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:false}); medEnd(true, `Bleeding stopped. You wrote <b>TK ${t}</b> on the tourniquet. Leave it on for the paramedics.`); }, 'High and tight on the upper arm. Now crank it until the bleeding stops.');
  },
  choke(step){
    if (step === 0) return choice('They nodded yes. What now?', [['5 back blows, then 5 abdominal thrusts', true], ['Give them water to wash it down', false, 'Liquids can make an obstruction worse.'], ['Reach in and sweep it out blind', false, 'Blind finger sweeps can push it deeper. Only remove it if you can see it.']], () => STEPS.choke(1));
    if (step === 1) {
      MED.data.bb = 0; MED.data.at = 0; const need = 3 + Math.floor(Math.random()*5);
      q(`<p class="mp">Lean them forward. Alternate: 5 back blows, then 5 abdominal thrusts.</p><div class="mopts two"><button type="button" id="mBB"><kbd>B</kbd>Back blow <span id="nBB">0/5</span></button><button type="button" id="mAT"><kbd>T</kbd>Abdominal thrust <span id="nAT">0/5</span></button></div><p class="mfb" id="mfb" aria-live="polite"></p>`);
      const press = kind => {
        const d = MED.data, total = d.bb + d.at, phase = Math.floor(total/5) % 2 === 0 ? 'bb' : 'at';
        if (kind !== phase) { $('#mfb').textContent = phase === 'bb' ? 'Finish your 5 back blows first.' : 'Now 5 abdominal thrusts.'; MED.data.misses++; tone(220,.12,'square',.03); return; }
        d[kind]++; noise(.06, kind === 'bb' ? 400 : 250, .12, 'lowpass');
        const cur = (total + 1) % 5 || 5;
        $('#nBB').textContent = (kind === 'bb' ? cur : 0) + '/5'; $('#nAT').textContent = (kind === 'at' ? cur : 0) + '/5';
        $('#mBB').classList.toggle('nx', cur === 5 ? kind === 'at' : kind === 'bb'); $('#mAT').classList.toggle('nx', cur === 5 ? kind === 'bb' : kind === 'at');
        $('#mfb').textContent = '';
        if (d.bb + d.at >= need + 5) { V.pt.spo2 = 97; V.pt.hr = 104; V.pt.alarm = false; medEnd(true, 'The object came out and they\'re coughing hard. Keep them seated; they should still get checked out.'); }
      };
      $('#mBB').addEventListener('click', () => press('bb')); $('#mAT').addEventListener('click', () => press('at'));
      MED.keys = e => { if (e.key === 'b' || e.key === 'B') press('bb'); if (e.key === 't' || e.key === 'T') press('at'); };
    }
  },
  ana(step){
    if (step === 0) return choice('What first?', [['Epinephrine auto-injector, outer thigh', true], ['Antihistamine pill and wait', false, 'Antihistamines are too slow for airway swelling. Epinephrine first.'], ['Their asthma inhaler', false, 'An inhaler won\'t reverse anaphylaxis. Epinephrine first.']], () => STEPS.ana(1));
    if (step === 1) return holdBtn('💉 HOLD AGAINST OUTER THIGH', 3, () => { V.pt.hr = 108; V.pt.bp = [108, 68]; V.pt.spo2 = 95; V.pt.alarm = false; medEnd(true, 'Wheezing eases within minutes. Note the time, get EMS, and keep a second injector ready in case symptoms come back.'); }, 'Blue cap off, orange tip to the outer thigh, push until it clicks, then hold.');
  },
  stroke(step){
    if (step === 0) {
      const opts = [['Face drooping', 1], ['Arm drifting', 1], ['Speech slurred', 1], ['Fever', 0], ['Rash', 0], ['Ear pain', 0]];
      q(`<p class="mp">Tap every stroke sign you see (BE FAST).</p><div class="mopts chips">${opts.map((o,i) => `<button type="button" data-i="${i}" aria-pressed="false">${o[0]}</button>`).join('')}</div><button type="button" class="mgo" id="mgo">Confirm signs ⏎</button><p class="mfb" id="mfb" aria-live="polite"></p>`);
      $$('#medQ .chips button').forEach(b => b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); tick(); }));
      $('#mgo').addEventListener('click', () => {
        const sel = $$('#medQ .chips button').map(b => b.getAttribute('aria-pressed') === 'true'), ok = sel.every((v,i) => v === !!opts[i][1]);
        if (ok) { tone(880,.08,'sine',.04); STEPS.stroke(1); } else { MED.data.misses++; MED.t0 -= 3; tone(220,.15,'square',.03); $('#mfb').textContent = 'Look again: face, arms and speech are the classic three.'; }
      });
      return;
    }
    if (step === 1) return choice('What matters most next?', [['Note the time it started and get them to a stroke center', true], ['Give an aspirin', false, 'Not until a CT rules out a bleed. Aspirin can make a bleeding stroke worse.'], ['Let them rest and see if it passes', false, 'Time is brain. Every minute counts, even if symptoms fade.']], () => { V.pt.alarm = false; medEnd(true, 'Symptom onset logged and the captain is diverting to a field with a stroke center. That timestamp decides which treatments they can get.'); });
  },
  sugar(step){
    if (step === 0) return choice('They can swallow. What do you give?', [['15 g fast sugar: juice or glucose tabs', true], ['A dose from their insulin pen', false, 'Insulin drops sugar further. That\'s the opposite of what they need.'], ['Nothing, wait for EMS', false, 'If they can swallow safely, fast sugar now is the fix.']], () => { V.pt.hr = 92; V.pt.alarm = false; V.pt.who = 'PT · BGL 96'; medEnd(true, 'Ten minutes later they\'re clear-headed. Recheck in 15 minutes, then a real snack.'); });
  }
};
function compressions(onDone){
  MED.comp = []; const target = MED.data.target;
  q(`<p class="mp">Hands center of chest. Push at <b>100–120 per minute</b>: tap the pad (or press <kbd>Space</kbd>).</p><button type="button" class="mpad" id="mpad"><b id="mcnt">0/${target}</b><span id="mrate">— /min</span></button><div class="mgauge" aria-hidden="true"><i class="band"></i><i class="ndl" id="mndl"></i><span>60</span><span>100</span><span>120</span><span>160</span></div><p class="mfb" id="mfb" aria-live="polite"></p>`);
  MED.onComp = () => {
    const n = nowS(); MED.comp.push(n); addBeat(n, 'cpr'); tone(140,.05,'sine',.05);
    const c = MED.comp, k = c.length; $('#mcnt').textContent = k + '/' + target;
    if (k >= 2) {
      const iv = c.slice(-4), rate = 60/((iv[iv.length-1] - iv[0])/(iv.length - 1));
      $('#mrate').textContent = Math.round(rate) + ' /min';
      $('#mndl').style.left = clamp((rate - 60)/100, 0, 1)*100 + '%';
      const good = rate >= 98 && rate <= 125; MED.data.good = (MED.data.good || 0) + (good ? 1 : 0); MED.data.cn = (MED.data.cn || 0) + 1;
      $('#mfb').textContent = rate < 98 ? 'Faster.' : rate > 125 ? 'Slow down a little.' : 'Good rate. Keep going.';
      $('#mpad').classList.toggle('good', good);
    }
    if (k >= target) { MED.onComp = null; onDone(); }
  };
  $('#mpad').addEventListener('pointerdown', e => { e.preventDefault(); MED.onComp && MED.onComp(); });
  $('#mpad').addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); MED.onComp && MED.onComp(); } });
  setTimeout(() => $('#mpad').focus(), 30);
}
function medTap(){ if (MED.onComp) MED.onComp(); }
function medShock(){
  if (!MED.wantShock || V.charging) return; V.charging = true; MED.wantShock = false; chargeTone();
  $('#mfb') && ($('#mfb').textContent = 'Charging… everyone clear!');
  setTimeout(() => { zap(); V.charging = false; V.pt.rhythm = 'ASYSTOLE'; STEPS.arrest(3); }, 1000);
}
function medEnd(ok, msg){
  if (!MED.on || med.classList.contains('done') || med.classList.contains('fail')) return;
  clearInterval(MED.tick); MED.onComp = null; MED.keys = null; MED.wantShock = false;
  const secs = nowS() - MED.t0, S = SCEN[MED.sc];
  let score = 0;
  if (ok) {
    MED.saves++; ss.set('saves', MED.saves);
    const cq = MED.data.cn ? MED.data.good/MED.data.cn : 1;
    score = Math.round(clamp(100 - MED.data.misses*12 - Math.max(0, secs - S.limit*.4)*1.2, 35, 100)*(.6 + .4*cq));
  }
  $('#vmSaves').textContent = MED.saves;
  med.classList.add(ok ? 'done' : 'fail');
  q(`<div class="mres"><b>${ok ? '✓ PATIENT STABLE' : '✕ PATIENT DETERIORATED'}</b>${ok ? `<span>SCORE ${score} · ${secs.toFixed(1)} s${MED.data.cn ? ' · CPR RATE ON TARGET ' + Math.round(MED.data.good/MED.data.cn*100) + '%' : ''}</span>` : ''}</div>
    <p class="mp">${msg}</p><p class="mlearn"><b>Remember</b> ${esc(S.learn)}</p>
    <p class="mwho">Sushin is a licensed EMT (NREMT · New Jersey · Indiana) with 56+ clinical hours across the ER and the ambulance.</p>
    <div class="mopts two"><button type="button" id="mLog">Read his run reports · LOGBK</button><button type="button" id="mAgain">${ok ? 'Run another call' : 'Try again'}</button></div>`);
  $('#mLog').addEventListener('click', () => { medClose(); go('logbk'); });
  $('#mAgain').addEventListener('click', () => { const k = ok ? null : MED.sc; medClose(); setTimeout(() => medStart(k, true), 200); });
  setTimeout(() => $('#mAgain').focus(), 30);
  if (ok) { chime(); toast('SAVE <b>' + MED.saves + '</b> · ' + esc(S.title)); } else tone(180,.4,'sawtooth',.03);
  setTimeout(() => { if (V.pt) { V.pt = null; V.beats = []; V.next = nowS() + .3; vm.classList.remove('alarm'); } }, ok ? 6000 : 1500);
}
function medClose(){
  clearInterval(MED.tick); med.hidden = true; MED.on = false; MED.onComp = null; MED.keys = null; MED.wantShock = false;
  document.body.classList.remove('medcall');
  if (V.pt) { V.pt = null; V.beats = []; V.next = nowS() + .3; }
}
$('#medX').addEventListener('click', medClose);
med.addEventListener('keydown', e => {
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return medClose(); }
  if (MED.keys) MED.keys(e);
  if (/^[1-4]$/.test(e.key)) { const b = $$('#medQ .mopts:not(.chips):not(.two) button')[+e.key - 1]; if (b && !b.disabled) { e.preventDefault(); b.click(); } }
  if ((e.key === 's' || e.key === 'S') && MED.wantShock) { e.preventDefault(); medShock(); }
});
if (/fdtest/.test(location.hash)) window.FD_TEST = {medStart, medEnd};
$('#vmSaves').textContent = MED.saves;
$('#vmAuto').addEventListener('click', () => { const off = ls.get('fd.med') === 'off'; ls.set('fd.med', off ? 'on' : 'off'); $('#vmAuto').setAttribute('aria-pressed', String(off)); toast('Random medical calls <b>' + (off ? 'ON' : 'OFF') + '</b>'); });
$('#vmAuto').setAttribute('aria-pressed', String(ls.get('fd.med') !== 'off'));
addEventListener('keydown', e => {
  if (!MED.onComp || e.key !== ' ' || e.repeat || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
  e.preventDefault(); MED.onComp();
}, true);

/* ================= radar ================= */
const scope = $('#scope'), rc = scope.getContext('2d'), RC = 450, RR = 410;
const angs = [-1.9,-0.8,0.35,1.3,2.25,3.2,4.15], dists = [.55,.3,.62,.82,.45,.72,.38];
const contacts = D.skillCategories.map((c,i) => { const a = angs[i % 7], d = dists[i % 7]; return {...c, a, x:RC + Math.cos(a)*d*RR, y:RC + Math.sin(a)*d*RR, glow:0, dots:c.skills.map((_,j) => [Math.cos(j*2.4)*(18 + j*3.2), Math.sin(j*2.4)*(18 + j*3.2)])}; });
let sweep = 0, selCat = 1, hotCat = -1, scopeVis = false;
new IntersectionObserver(es => scopeVis = es[0].isIntersecting).observe(scope);
function drawScope(dt){
  rc.clearRect(0,0,900,900); rc.save(); rc.beginPath(); rc.arc(RC,RC,RR,0,6.283); rc.clip();
  const bg = rc.createRadialGradient(RC,RC,0,RC,RC,RR); bg.addColorStop(0,'#062614'); bg.addColorStop(1,'#020a05'); rc.fillStyle = bg; rc.fillRect(0,0,900,900);
  rc.strokeStyle = 'rgba(91,227,154,.25)'; rc.lineWidth = 2;
  for (let i=1;i<=4;i++){ rc.beginPath(); rc.arc(RC,RC,RR*i/4,0,6.283); rc.stroke(); }
  for (let i=0;i<12;i++){ const a = i*Math.PI/6; rc.beginPath(); rc.moveTo(RC,RC); rc.lineTo(RC + Math.cos(a)*RR, RC + Math.sin(a)*RR); rc.stroke(); }
  for (let i=0;i<50;i++){ const a0 = sweep - i*.018; rc.fillStyle = `rgba(91,227,154,${(.3*(1 - i/50)).toFixed(3)})`; rc.beginPath(); rc.moveTo(RC,RC); rc.arc(RC,RC,RR,a0 - .02,a0); rc.closePath(); rc.fill(); }
  rc.restore();
  rc.fillStyle = 'rgba(91,227,154,.6)'; rc.font = '500 18px JetBrains Mono, monospace'; rc.textAlign = 'center';
  ['N','E','S','W'].forEach((l,i) => { const a = -Math.PI/2 + i*Math.PI/2; rc.fillText(l, RC + Math.cos(a)*(RR + 24), RC + Math.sin(a)*(RR + 24) + 6); });
  contacts.forEach((c,i) => {
    const diff = (((sweep - c.a) % 6.283) + 6.283) % 6.283;
    if (diff < .07) c.glow = 1; else c.glow *= Math.pow(.35, dt);
    if (reduce) c.glow = 1;
    const sel = i === selCat, g = Math.max(c.glow, sel ? .9 : .25, i === hotCat ? 1 : 0);
    c.dots.forEach(d => { rc.fillStyle = `rgba(91,227,154,${(g*.55).toFixed(2)})`; rc.beginPath(); rc.arc(c.x + d[0], c.y + d[1], 3, 0, 6.283); rc.fill(); });
    rc.fillStyle = `rgba(160,255,195,${g.toFixed(2)})`; rc.beginPath(); rc.arc(c.x, c.y, sel ? 13 : 10, 0, 6.283); rc.fill();
    if (sel) { rc.strokeStyle = '#eafff1'; rc.lineWidth = 2; rc.strokeRect(c.x - 22, c.y - 22, 44, 44); }
    const right = c.x > RC + 120; rc.textAlign = right ? 'right' : 'left'; const tx = right ? c.x - 30 : c.x + 30;
    rc.font = '600 19px JetBrains Mono, monospace'; rc.fillStyle = `rgba(220,255,232,${Math.max(.45, g).toFixed(2)})`; rc.fillText(c.title.toUpperCase(), tx, c.y - 4);
    rc.font = '500 15px JetBrains Mono, monospace'; rc.fillStyle = `rgba(140,220,170,${Math.max(.4, g).toFixed(2)})`; rc.fillText(c.skills.length + ' SKILLS', tx, c.y + 16);
  });
  sweep = (sweep + dt*1.4) % 6.283;
}
function scopePt(e){ const b = scope.getBoundingClientRect(), k = 900/b.width; return [(e.clientX - b.left)*k, (e.clientY - b.top)*k]; }
scope.addEventListener('pointermove', e => { const [x,y] = scopePt(e); hotCat = contacts.findIndex(c => Math.hypot(c.x - x, c.y - y) < 60); });
scope.addEventListener('pointerleave', () => hotCat = -1);
scope.addEventListener('click', e => { const [x,y] = scopePt(e); const i = contacts.findIndex(c => Math.hypot(c.x - x, c.y - y) < 60); if (i >= 0) selectCat(i); });
scope.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); selectCat((selCat + 1) % contacts.length); tick(); }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); selectCat((selCat - 1 + contacts.length) % contacts.length); tick(); }
  else if (e.key === 'Enter') { e.preventDefault(); $('#dblock [data-skill]')?.focus(); }
});
function selectCat(i){
  selCat = i; const c = contacts[i];
  $('#dblock').innerHTML = `<span class="kh"><kbd>←</kbd><kbd>→</kbd> skills · <kbd>⏎</kbd> open</span><span class="h">TGT ${String(i+1).padStart(2,'0')} · LOCKED · ${c.skills.length} SKILLS</span><b>${esc(c.title)}</b><div class="sk">${c.skills.map((s,j) => `<button type="button" data-skill="${j}">${esc(s)}</button>`).join('')}</div><span class="h" style="opacity:.7">SELECT A SKILL TO SEE WHERE IT WAS USED</span>`;
  $$('#dblock [data-skill]').forEach(b => b.addEventListener('click', () => openSkill(i, +b.dataset.skill)));
  rove($('#dblock .sk'), 'button', {h:true});
  $$('#cats button').forEach((b,j) => b.classList.toggle('on', j === i));
}
$('#cats').innerHTML = contacts.map(c => `<button type="button"><span>${esc(c.title)}</span><span>${c.skills.length}</span></button>`).join('');
$$('#cats button').forEach((b,i) => b.addEventListener('click', () => selectCat(i)));
$('#allskills').innerHTML = D.skillCategories.map((c,ci) => `<div class="card"><b>${esc(c.title)}</b><div class="chips">${c.skills.map((s,j) => `<button type="button" class="tagchip" data-c="${ci}" data-s="${j}">${esc(s)}</button>`).join('')}</div></div>`).join('');
$$('#allskills [data-s]').forEach(b => b.addEventListener('click', () => openSkill(+b.dataset.c, +b.dataset.s)));

/* ================= roving focus ================= */
function rove(container, sel, opt){
  opt = opt || {};
  if (!container || container._rove) return; container._rove = true;
  container.addEventListener('keydown', e => {
    const items = $$(sel, container), i = items.indexOf(document.activeElement); if (i < 0) return;
    const next = opt.h ? ['ArrowRight','ArrowDown'] : ['ArrowDown'], prev = opt.h ? ['ArrowLeft','ArrowUp'] : ['ArrowUp'];
    let j = -1;
    if (next.includes(e.key)) j = Math.min(items.length - 1, i + 1);
    else if (prev.includes(e.key)) j = Math.max(0, i - 1);
    else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = items.length - 1; else return;
    e.preventDefault(); items[j].focus(); if (opt.onMove) opt.onMove(items[j], j);
  });
}

/* ================= dialog ================= */
const dlg = $('#dlg'); let dnav = null, opener = null;
function openDlg(kind, labels, body, nav){
  dnav = nav || null;
  if (!dlg.open) opener = document.activeElement;
  $('#dlgBox').innerHTML = `<div class="bar ${kind}"><span class="bt">${labels.map(l => `<span>${esc(l)}</span>`).join('')}</span><button class="x" type="button" id="dlgX" aria-label="Close"><b>✕</b> ESC</button></div><div class="body">${body}</div>` +
    (nav ? `<div class="dfoot"><button type="button" id="dPrev" ${nav.i <= 0 ? 'disabled' : ''}>← Prev</button><span>${nav.i + 1} / ${nav.n} · <kbd>←</kbd> <kbd>→</kbd> browse · <kbd>Esc</kbd> close</span><button type="button" id="dNext" ${nav.i >= nav.n - 1 ? 'disabled' : ''}>Next →</button></div>` : '');
  icons($('#dlgBox'));
  $('#dlgX').addEventListener('click', closeDlg);
  if (nav) { $('#dPrev').addEventListener('click', () => nav.go(nav.i - 1)); $('#dNext').addEventListener('click', () => nav.go(nav.i + 1)); }
  if (!dlg.open) { try { dlg.showModal(); } catch(e){ dlg.setAttribute('open',''); } }
  cursorPause(true);
  $('#dlgBox').scrollTop = 0; $('#dlgX').focus({preventScroll:true});
}
function closeDlg(){ try { dlg.close(); } catch(e){ dlg.removeAttribute('open'); cursorPause(false); } }
dlg.addEventListener('close', () => { cursorPause(false); dnav = null; if (opener && opener.focus) opener.focus({preventScroll:true}); });
dlg.addEventListener('click', e => { if (e.target === dlg) closeDlg(); });
dlg.addEventListener('keydown', e => {
  if (!dnav) return;
  if (e.key === 'ArrowRight' && dnav.i < dnav.n - 1) { e.preventDefault(); dnav.go(dnav.i + 1); tick(); }
  if (e.key === 'ArrowLeft' && dnav.i > 0) { e.preventDefault(); dnav.go(dnav.i - 1); tick(); }
});
const meta = pairs => `<div class="meta">${pairs.map(p => `<div><small>${esc(p[0])}</small><b>${esc(p[1])}</b></div>`).join('')}</div>`;
function openSkill(ci, si){
  mark('skill'); const cat = D.skillCategories[ci], s = cat.skills[si], d = D.skillDetails[s];
  openDlg('sk', ['Radar · datablock', cat.title], `<h3>${esc(s)}</h3>${d ? `<p class="story">${esc(d.narrative)}</p>${d.appliedAt && d.appliedAt.length ? `<h4>Where I used it</h4><ul>${d.appliedAt.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}` : `<p class="story">${esc(s)} is part of my toolkit. Ask AiRa for more context on where I've used it.</p>`}`,
    {i:si, n:cat.skills.length, go: j => openSkill(ci, j)});
}

/* ================= CREWS ================= */
(function(){
  const about = [
    "I'm an Artificial Intelligence student at Purdue University (B.S. AI, class of 2027), pursuing a private pilot license on the side, and a licensed EMT (NREMT, New Jersey, and Indiana) actively practicing inter-facility transport — because I genuinely believe the best builders understand the systems and people they serve. My academic trajectory reflects that: I joined The Data Mine corporate partners program as a machine learning practitioner on a BASF project, completed the CERIAS cybersecurity seminar, and earned the Google AI Professional Certificate.",
    "Professionally, I've spent two summers at PSEG as a Product Intern — owning an IAM product backlog of 50+ items, executing 300+ UAT and SIT cases, and leading a cross-functional team of 25 interns to ship a company-wide onboarding site. In parallel, I built a time-series ML forecasting system for BASF that achieved ~92% accuracy and cut model update time from days to hours. The throughline: I care about shipping things that actually work in production, not just demos. I'm especially drawn to Aerospace and National Security — domains where product rigor, secure AI, and reliability are not optional.",
    "This semester I'm the project manager on a three-person team building a pilot-training tracking system for a simulated aviation client, and I'm building Relay on my own, a platform that sends an incident to the nearest qualified responder no matter which department they work for. Both come out of things I've seen working as an EMT and at large events."
  ];
  $('#aboutText').innerHTML = `<span class="eyebrow">Captain's notes</span>` + about.map(p => `<p>${esc(p)}</p>`).join('');
  const quals = [
    ['Education','B.S. Artificial Intelligence at Purdue University (Minor: CNIT), expected May 2027 — Google AI Professional Certificate holder, BASF x The Data Mine ML practitioner, student pilot in private pilot training.','<path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5"/>'],
    ['Product & ML','Product Management Intern at PSEG in IAM (99%-defect-free launch, 300+ UAT/SIT cases). Product Intern (Automation & Internal Tools) leading a 25-intern team. Built a 92%-accurate wine sales forecasting model and MLOps pipeline reducing update time by 97% for BASF.','<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>'],
    ['Security & Clinical','Licensed EMT (NREMT, New Jersey, Indiana) actively practicing inter-facility transport at OnTime Transport, with 56+ hours of clinical field experience across hospital ER and pre-hospital EMS. Hands-on IAM product ownership at a Fortune 500 utility. Assistant Team Lead with Purdue University Police Department.','<path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/>'],
    ['Leadership','Led 25-intern cross-functional teams at PSEG. Event Supervisor for 60,000+ patron Big Ten athletic events at Purdue Athletics. Mentored 20–25 first-year students as a Boiler Gold Rush Team Leader.','<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6M16 4a3.5 3.5 0 0 1 0 7M22 20c0-3-1.5-5-4-5.7"/>']
  ];
  $('#quals').innerHTML = quals.map(q => `<div class="qual card"><div class="k"><b>${esc(q[0])}</b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${q[2]}</svg></div><p>${esc(q[1])}</p></div>`).join('');
  const ic = ['<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="currentColor" stroke="none"/>','<path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/>','<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>'];
  $('#endorse').innerHTML = D.interests.map((x,i) => `<div class="endo card"><span class="seal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${ic[i%3]}</svg></span><div><b>${esc(x.title)}</b><p>${esc(x.description)}</p></div></div>`).join('');
  const card = $('#idcard');
  card.addEventListener('click', () => { card.classList.toggle('flipped'); mark('card'); tone(520,.06,'triangle',.03); });
  card.addEventListener('pointermove', e => { const b = card.getBoundingClientRect(); card.style.setProperty('--sx', ((e.clientX - b.left)/b.width*100) + '%'); card.style.setProperty('--sy', ((e.clientY - b.top)/b.height*100) + '%'); });
})();

/* ================= LOGBK ================= */
const MONTHS = {january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
const SEAS = {spring:[0,4], summer:[4,7], fall:[7,11], winter:[11,13]};
const pd = (s, end) => { const p = s.trim().toLowerCase().split(/\s+/); if (p[0] === 'present') return null; if (SEAS[p[0]]) return new Date(+p[1], SEAS[p[0]][end ? 1 : 0], 1); return new Date(+p[1], MONTHS[p[0]], 1); };
const short = d => d ? String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getFullYear()).slice(2) : 'NOW';
const exps = D.experiences.map(e => { const [a,b] = e.period.split(' - '); return {...e, s:pd(a), e2:pd(b || a, true), season: !b, ems:e.type === 'Clinical' || /EMT/.test(e.title)}; }).sort((a,b) => b.s - a.s);
$('#lbRows').innerHTML = exps.map((e,i) => `<button type="button" class="lb-row ${e.ems ? 'ems' : 'air'}" data-i="${i}" style="animation-delay:${i*90}ms"><span class="d">${e.season ? esc(e.period.toUpperCase().replace(/ \d\d(\d\d)$/, " ’$1")) : short(e.s) + ' → ' + short(e.e2)}</span><span class="o">${esc(e.company)}</span><span>${esc(e.title)}</span><span class="cls">${esc(e.type)}</span><span class="rm">${esc(e.summary)}</span><span class="go">›</span></button>`).join('');
$$('.lb-row').forEach(b => b.addEventListener('click', () => openExp(+b.dataset.i)));
rove($('#lbRows'), '.lb-row');
const TOT = [['Entries', exps.length, ''], ['Clinical hours', 56, '+'], ['Patrons / event', 60000, '+'], ['Interns led', 25, '']];
$('#lbTot').innerHTML = TOT.map(t => `<div><small>${t[0]}</small><b data-n="${t[1]}" data-s="${t[2]}">${t[1].toLocaleString('en-US')}${t[2]}</b></div>`).join('');
new IntersectionObserver((es, ob) => { if (!es[0].isIntersecting) return; ob.disconnect(); if (reduce) return;
  $$('.lb-row').forEach(r => r.classList.add('ink'));
  $$('#lbTot b').forEach(b => { const n = +b.dataset.n, s = b.dataset.s, t0 = performance.now(); (function f(now){ const k = clamp((now - t0)/1400, 0, 1); b.textContent = Math.round(n*(1 - Math.pow(1-k, 3))).toLocaleString('en-US') + s; if (k < 1) requestAnimationFrame(f); })(t0); });
}, {threshold:.15}).observe($('#logbook'));
function openExp(i){
  const e = exps[i]; mark('log'); tone(e.ems ? 880 : 520, .08, 'sine', .04);
  openDlg(e.ems ? 'ems' : 'air', e.ems ? ['✱ Run report · PCR style', e.type] : ['✈ Flight debrief', e.type],
    `<h3>${esc(e.title)}</h3>${meta([[e.ems ? 'Unit' : 'Operator', e.company], ['Period', e.period], ['Class', e.type]])}<p style="color:var(--soft)">${esc(e.summary)}</p><h4>Responsibilities &amp; Achievements</h4><ul>${e.description.map(d => `<li>${esc(d)}</li>`).join('')}</ul><h4>Skills Applied</h4><div class="chips">${e.skills.map(s => `<span class="tagchip">${esc(s)}</span>`).join('')}</div><h4>Full story</h4><p class="story">${esc(e.narrative)}</p>`,
    {i, n:exps.length, go:openExp});
}

/* ================= GATES ================= */
const DEST = {2:'PROJECT AIRA',5:'RELAY',1:'BASF WINE YIELD',4:'PREFLIGHT BRIEFER',6:'AEROLOG',7:'TRAINEEFLIGHTOPS',8:'LOSTLINK',3:'AI PORTFOLIO RAG'};
const flights = D.projects.map((p,i) => {
  let st = 'ON TIME', cls = 's-on';
  if (p.status === 'coming-soon') { st = 'DELAYED'; cls = 's-dl'; }
  else if (p.status === 'not-available') { st = 'CANCELLED'; cls = 's-cx'; }
  else if (p.liveUrl) { st = 'BOARDING'; cls = 's-bd'; }
  return {...p, fl:'SB' + String(p.id).padStart(3,'0'), dest:DEST[p.id] || p.title.toUpperCase().slice(0,17), gate:'ABC'[Math.floor(i/3)] + (i%3 + 1), st, cls, featured:i === 0};
});
const CH = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const cells = (t, n, extra) => `<span class="flaps ${extra || ''}">${Array.from({length:n}, (_,i) => `<span class="flap" data-t="${esc(t[i] || ' ')}"> </span>`).join('')}</span>`;
$('#brows').insertAdjacentHTML('beforeend', `<div class="brow hd" aria-hidden="true"><span class="c-f" style="width:${5*1.15 + .4}em">FLIGHT</span><span style="min-width:${17*1.15}em">DESTINATION</span><span class="c-g" style="min-width:${3*1.15}em">GATE</span><span>STATUS</span></div>` +
  flights.map((f,i) => `<button type="button" class="brow ${f.cls}" data-i="${i}" aria-label="${esc(f.title)}, ${f.st}">${cells(f.fl,5,'c-f')}${cells(f.dest,17)}${cells(f.gate,3,'c-g')}${cells(f.st,9,'st')}</button>`).join(''));
let boardOpen = false, flapRun = 0;
function spinCell(s, delay, run){
  const goal = s.dataset.t;
  if (reduce) { s.textContent = goal; return; }
  let k = 0; const steps = 5 + Math.floor(Math.random()*10);
  setTimeout(function spin(){ if (run !== flapRun && run !== -1) return; k++; s.textContent = k >= steps ? goal : CH[Math.floor(Math.random()*CH.length)]; s.classList.remove('f'); void s.offsetWidth; s.classList.add('f'); if (k < steps) setTimeout(spin, 50); }, delay);
}
function flipBoard(){ const run = ++flapRun; $('#await').hidden = true; noise(.9, 2600, .03, 'highpass'); $$('#brows .flap').forEach((s,i) => spinCell(s, i*4 + (i % 9)*20, run)); }
const rowCool = new WeakMap();
function flipRow(row){ if (!boardOpen) return; const n = performance.now(); if ((rowCool.get(row) || 0) > n) return; rowCool.set(row, n + 1200); $$('.flap', row).forEach((s,i) => spinCell(s, i*10, -1)); }
const brows = $('#brows');
new IntersectionObserver((es, ob) => { const e = es[0]; const full = e.intersectionRatio >= .97 || (e.boundingClientRect.height > innerHeight*.85 && e.intersectionRatio > .7);
  if (full && !boardOpen) { boardOpen = true; ob.disconnect(); setTimeout(() => { flipBoard(); setTimeout(() => { if (!$('#passwrap').children.length) { selRow(1, false); } }, 1600); }, 250); }
}, {threshold:[.5,.7,.85,.97,1]}).observe(brows);
const browBtns = $$('#brows .brow:not(.hd)');
browBtns.forEach((b,i) => {
  b.addEventListener('mouseenter', () => flipRow(b));
  b.addEventListener('click', () => { flipRow(b); selRow(i + 1, true); });
});
rove(brows, '.brow:not(.hd)', {onMove: (b, j) => { flipRow(b); selRow(j + 1, true); }});
$('#board').addEventListener('keydown', e => { if ((e.key === 'r' || e.key === 'R') && !/INPUT|TEXTAREA/.test(e.target.tagName)) { e.preventDefault(); if (boardOpen) flipBoard(); } });
$('#boardRefresh').addEventListener('click', () => { if (!boardOpen) { boardOpen = true; } flipBoard(); });
function selRow(k, user){ const rows = $$('#brows .brow'); rows.forEach(x => x.classList.remove('sel')); rows[k].classList.add('sel'); printPass(flights[k - 1], user); }
function printPass(f, user){
  if (user) { mark('pass'); tick(); }
  const live = f.liveUrl ? (f.liveUrl.startsWith('/') ? (window.FD_LIVE || SITE) + f.liveUrl : f.liveUrl) : null;
  const acts = [];
  if (live) acts.push(`<a class="ico" href="${esc(live)}" target="_blank" rel="noopener" aria-label="Open live demo" data-tip="Live demo" data-icon="ext"></a>`);
  if (f.githubUrl) acts.push(`<a class="ico" href="${esc(f.githubUrl)}" target="_blank" rel="noopener" aria-label="View code on GitHub" data-tip="Code" data-icon="gh"></a>`);
  const img = BAN[f.image];
  $('#passwrap').innerHTML = `<div class="pass ${user && !reduce ? 'print' : ''}"><div class="pm"><div class="ph"><span>BOARDING PASS · ${f.featured ? 'FEATURED PROJECT' : 'SELECTED WORK'}</span><b>KLAF ✈ ${esc(f.dest)}</b></div>${img ? `<img class="bn" src="${img}" alt="${esc(f.title)} banner">` : ''}<div class="pf"><div><small>PASSENGER</small><b>YOU</b></div><div><small>FLIGHT</small><b>${f.fl}</b></div><div><small>SEAT</small><b>1A</b></div><div><small>CLASS</small><b>${f.isPrivate ? 'PRIVATE' : 'PUBLIC'}</b></div></div><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p><div class="tags">${f.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></div><div class="ps"><small>GATE</small><span class="big">${f.gate}</span><small>STATUS</small><b class="mono">${f.st}</b><div class="bc" aria-hidden="true"></div><div class="act">${acts.length ? acts.join('') : '<span class="none">NO PUBLIC LINKS</span>'}</div></div></div>`;
  icons($('#passwrap'));
}

/* ================= GRNDS ================= */
const hl = D.eduHighlights.filter(h => !/\bAP\b/.test(h.label + ' ' + h.detail));
hl.forEach(h => { if (h.label === 'Private Pilot Training') h.star = true; });
$('#alsoCw').textContent = D.otherCoursework;
const hlIcons = {'Upward GPA Trend':'↗','Floor Senator':'★','Private Pilot Training':'✈','BASF x The Data Mine':'◆','CERIAS Security Seminar':'⛨'};
$('#eduHl').innerHTML = hl.map(h => `<div class="card ${h.star ? 'star' : ''}"><b>${hlIcons[h.label] || '◆'} ${esc(h.label)}</b><p>${esc(h.detail)}</p></div>`).join('');
function lessons(list, sel, inst){
  $(sel).innerHTML = list.map((c,i) => `<button type="button" class="lesson" data-i="${i}"><i>✓</i><span>${esc(c)}</span><small>DEBRIEF ›</small></button>`).join('');
  $$(sel + ' .lesson').forEach(b => b.addEventListener('click', () => openCourse(list, inst, +b.dataset.i)));
  rove($(sel), '.lesson');
}
lessons(D.coreCourses, '#pCourses', 'Purdue University'); lessons(D.anthropicCourses, '#aCourses', 'Anthropic Academy');
$('#pCount').textContent = D.coreCourses.length + ' LESSONS COMPLETE'; $('#aCount').textContent = D.anthropicCourses.length + ' LESSONS COMPLETE';
function openCourse(list, inst, i){
  mark('course'); const c = list[i], d = D.courseDetails[c];
  openDlg('grnd', ['Ground school · lesson debrief', d ? d.institution : inst], `<h3>${esc(c)}</h3><p class="story">${esc(d ? d.narrative : c + ' is part of my coursework at Purdue or Anthropic Academy. Ask the AI assistant for more context.')}</p>`, {i, n:list.length, go: j => openCourse(list, inst, j)});
}

/* ================= PATCH ================= */
const certs = D.certs;
const EMS = [1, 23, 24, 21];
const prof = EMS.map(id => certs.find(c => c.id === id)).filter(Boolean);
const google = certs.filter(c => c.issuer.startsWith('Google'));
const purdue = certs.filter(c => c.issuer === 'Purdue University');
const anth = certs.filter(c => c.issuer === 'Anthropic Academy');
const certOrder = [...prof, ...purdue, ...google, ...anth];
function starOfLife(){ const arm = '<rect x="-11" y="-46" width="22" height="92" rx="3" fill="#1f5bb5" stroke="#fff" stroke-width="3"/>'; return `<g>${arm}<g transform="rotate(60)">${arm}</g><g transform="rotate(120)">${arm}</g><rect x="-2.5" y="-36" width="5" height="70" fill="#fff"/><path d="M0 -26 C10 -20 -10 -12 0 -6 C10 0 -10 8 0 14 C8 18 -6 24 0 30" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>`; }
function patchSvg(c, i){
  const st = c.issuer.startsWith('State of'), nre = c.issuer.startsWith('National') || st, ring = st ? (c.id === 23 ? '#1d3d6b' : '#123a2a') : nre ? '#13306b' : '#8a1022', field = nre ? '#f3f1ea' : '#fff4f2';
  const top = st ? c.issuer.toUpperCase() : nre ? 'NATIONALLY REGISTERED' : 'AMERICAN HEART ASSOCIATION', bot = st ? 'EMT · LICENSED' : nre ? 'EMT · ACTIVE' : 'CPR · AED · BLS';
  const center = nre ? starOfLife() : '<path d="M0 34 C-40 6 -46 -18 -28 -30 C-16 -38 -4 -32 0 -22 C4 -32 16 -38 28 -30 C46 -18 40 6 0 34z" fill="#d42638"/><path d="M-40 -2 L-16 -2 L-10 -14 L-2 14 L6 -8 L12 -2 L40 -2" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>';
  return `<svg viewBox="-100 -100 200 200" aria-hidden="true"><defs><path id="pt${i}" d="M-70 0 A70 70 0 0 1 70 0"/><path id="pb${i}" d="M-74 0 A74 74 0 0 0 74 0"/></defs><circle r="96" fill="${ring}"/><circle r="91" fill="none" stroke="#e9d8a6" stroke-width="2.5" stroke-dasharray="5 4"/><circle r="56" fill="${field}"/><g transform="scale(.95)">${center}</g><text font-family="Saira Condensed, sans-serif" font-weight="700" font-size="17" fill="#fff" letter-spacing="2"><textPath href="#pt${i}" startOffset="50%" text-anchor="middle">${top}</textPath></text><text font-family="Saira Condensed, sans-serif" font-weight="700" font-size="17" fill="#e9d8a6" letter-spacing="3"><textPath href="#pb${i}" startOffset="50%" text-anchor="middle">${bot}</textPath></text><circle r="56" fill="none" stroke="#e9d8a6" stroke-width="2" stroke-dasharray="4 3"/></svg>`;
}
$('#patches').innerHTML = prof.map((c,i) => `<button type="button" class="patch card" data-cid="${c.id}">${patchSvg(c,i)}<div><b>${esc(c.title)}</b><small>${esc(c.issuer)} · ${esc(c.date)}</small><p>${esc(c.description)}</p></div></button>`).join('');
const ACR = {2:'FERPA',3:'HIPAA',4:'GLBA',5:'DATA',6:'SSN',25:'CART'};
$('#badges').innerHTML = purdue.map(c => `<button type="button" class="badge card" data-cid="${c.id}"><svg viewBox="0 0 84 96" aria-hidden="true"><path d="M42 3 80 16v30c0 24-17 40-38 47C21 86 4 70 4 46V16z" fill="#1a1a1a" stroke="#cfb991" stroke-width="3"/><path d="M42 11 72 21v25c0 19-13 32-30 38-17-6-30-19-30-38V21z" fill="none" stroke="#cfb991" stroke-width="1.2" stroke-dasharray="3 3"/><text x="42" y="52" text-anchor="middle" font-family="Saira Condensed, sans-serif" font-weight="800" font-size="${(ACR[c.id] || '').length > 4 ? 17 : 20}" fill="#cfb991">${ACR[c.id] || 'PU'}</text><text x="42" y="68" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#cfb991" letter-spacing="1">CLEARED</text></svg><b>${esc(c.title)}</b><small>${esc(c.date)}</small></button>`).join('');
const inks = ['#b03a2e','#1d4f91','#2f6b3a','#6b2f8a','#8a5a10'], shapes = ['circ','rnd','oval','sq'];
$('#stamps').innerHTML = anth.map((c,i) => `<button type="button" class="stamp ${shapes[i%4]}" data-cid="${c.id}" style="--c:${inks[i%5]};--r:${((i*37) % 17) - 8}deg"><div><small>ANTHROPIC ACADEMY</small><b>${esc(c.title)}</b><small>${esc(c.date.toUpperCase())} · ADMITTED</small></div></button>`).join('');
$('#stampCount').textContent = anth.length + ' ENDORSEMENTS';
const WING = '<svg viewBox="0 0 48 24" aria-hidden="true"><path d="M24 6 L20 12 L24 18 L28 12 Z" fill="currentColor"/><path d="M19 11 C14 6 8 6 2 7 C7 9 9 10 11 12 C8 12 6 13 4 14 C9 15 14 15 19 13 Z M29 11 C34 6 40 6 46 7 C41 9 39 10 37 12 C40 12 42 13 44 14 C39 15 34 15 29 13 Z" fill="currentColor" opacity=".8"/></svg>';
$('#aiwings').innerHTML = google.map(c => `<button type="button" class="wing" data-cid="${c.id}">${WING}<span><b>${esc(c.title)}</b><p>${esc(c.description)}</p></span><small>${esc(c.issuer.toUpperCase())} · ${esc(c.date.toUpperCase())}</small></button>`).join('');
new IntersectionObserver((es, ob) => { if (!es[0].isIntersecting || reduce) return; ob.disconnect(); $$('.stamp').forEach((s,i) => setTimeout(() => { s.classList.add('pressed'); tone(180,.05,'triangle',.04); }, i*110)); }, {threshold:.25}).observe($('#stamps'));
$$('#patch [data-cid]').forEach(b => b.addEventListener('click', () => openCert(certOrder.findIndex(c => String(c.id) === b.dataset.cid))));
['#patches','#badges','#stamps'].forEach(s => rove($(s), 'button', {h:true}));
function openCert(i){
  mark('cert'); const c = certOrder[i];
  openDlg('cert', ['Credential', c.issuer], `<h3>${esc(c.title)}</h3>${meta([['Issuer', c.issuer], ['Status', c.date]])}<p class="story">${esc(c.description)}</p>${c.pdfPath ? `<a class="ico" href="${esc(SITE + c.pdfPath)}" target="_blank" rel="noopener" aria-label="View certificate PDF" data-tip="View certificate" data-icon="cert"></a>` : ''}`,
    {i, n:certOrder.length, go:openCert});
}

/* ================= CENTR radio ================= */
// Live feeds come from lib/atc-feeds.ts (via #data). The radio starts on the home field and
// retunes to the LiveATC airport nearest the visitor once /api/wx reports a coarse location.
const AIRPORTS = D.atc || [], HOME = D.atcHome || 'KLAF', TID = {twr:'TWR', gnd:'GND', app:'APP', dep:'DEP'};
let apt = AIRPORTS.find(a => a.icao === HOME) || AIRPORTS[0] || null, aptDist = null, aptPicked = false, STATIONS = [], here = null;
function buildStations(){
  const S = apt ? apt.feeds.map(fd => ({f:fd.f, id:apt.icao + ' ' + TID[fd.t], name:fd.name, type:fd.t === 'dep' ? 'app' : fd.t, mounts:fd.mounts})) : [];
  if (apt && apt.icao === 'KLAF') S.push({f:127.750, id:'KLAF ATIS', name:'Information', type:'atis'});
  S.push({f:121.500, id:'GUARD', name:'Emergency', type:'guard'});
  STATIONS = S;
}
buildStations();
const LINES = {
  twr:['{N}, Cessna Four Two Romeo, holding short runway two eight, ready for departure.','Cessna Four Two Romeo, {N}, runway two eight, cleared for takeoff.','Boiler Two One, make left traffic runway two eight, report midfield downwind.','Boiler Two One, runway two eight, cleared to land.','Piper Six Echo Lima, traffic two o\'clock, three miles, a Cessna on the downwind.'],
  gnd:['{N}, Piper Six Echo Lima, at the FBO with information Alpha, taxi for departure.','Piper Six Echo Lima, {N}, runway two eight, taxi via Alpha.','Cessna Four Two Romeo, Lafayette Ground, taxi to parking via Alpha, monitor ground.'],
  app:['{N}, Boiler One Four, level three thousand five hundred, information Alpha.','Boiler One Four, {N}, altimeter three zero zero two, expect visual approach runway two eight.','November Four Two Romeo, radar contact, climb and maintain four thousand.'],
  guard:['(Guard is quiet. Quiet is good.)']
};
function atis(){
  const c = cond(), d = new Date(), z = String(d.getUTCHours()).padStart(2,'0') + String(d.getUTCMinutes()).padStart(2,'0');
  const wind = c.storm ? 'two four zero at one eight, gusts two eight' : c.kind === 'snow' ? 'three one zero at one two' : 'two seven zero at eight';
  const vis = c.vis >= 10 ? 'one zero' : c.vis >= 1 ? spell(c.vis) : 'one half';
  const sky = c.cover === 0 ? 'sky clear' : (c.cover < .3 ? 'few clouds' : c.cover < .6 ? 'scattered clouds' : c.cover < .95 ? 'ceiling broken' : 'ceiling overcast') + ' at ' + (c.base >= 1000 ? spell(Math.round(c.base/1000)) + ' thousand' : spell(Math.round(c.base/100)) + ' hundred');
  const wx = c.storm ? ' Thunderstorm, heavy rain.' : c.kind === 'rain' ? ' Light rain.' : c.kind === 'snow' ? ' Snow.' : c.fog ? ' Fog.' : '';
  return `Purdue University Airport information Alpha, ${spell(z)} Zulu. Wind ${wind}. Visibility ${vis}.${wx} ${sky.charAt(0).toUpperCase() + sky.slice(1)}. Altimeter three zero zero two. Runway two eight in use. Advise on initial contact you have information Alpha.`;
}
let fA = 121.5, fS = 119.6, station = null, nextTx = 0, txBusy = false, radioVis = false;
const ff = f => f.toFixed(3);
function renderDir(){
  $('#dir').innerHTML = STATIONS.map((s,i) => `<button type="button" data-i="${i}"><b>${ff(s.f)}</b>${esc(s.id)}${s.mounts ? '<i class="lv">LIVE</i>' : '<i>SIM</i>'}</button>`).join('');
  $('#aptT').textContent = !apt ? '' : apt.icao + ' · ' + apt.city.toUpperCase() + (apt.icao === HOME ? ' · HOME BASE' : aptDist != null ? ' · ' + Math.round(aptDist) + ' MI FROM YOU' : '');
}
$('#dir').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; fA = STATIONS[+b.dataset.i].f; showF(); tone(700,.05,'square',.03); });
function aptOptions(list){
  $('#aptSel').innerHTML = list.map(a => `<option value="${a.icao}">${a.icao} · ${esc(a.city)}${a.d != null ? ' · ' + Math.round(a.d) + ' mi' : a.icao === HOME ? ' · home' : ''}</option>`).join('');
  if (apt) $('#aptSel').value = apt.icao;
}
function setAirport(icao, d){
  const a = AIRPORTS.find(x => x.icao === icao); if (!a || a === apt) return;
  apt = a; aptDist = d == null ? null : d; buildStations();
  const firstLive = STATIONS.find(x => x.mounts) || STATIONS[0], second = STATIONS.find(x => x !== firstLive) || firstLive;
  fA = firstLive.f; fS = second.f; renderDir(); showF();
  $('#aptSel').value = a.icao;
}
const mi = (la1, lo1, la2, lo2) => { const r = Math.PI/180, x = Math.sin((la2 - la1)*r/2), y = Math.sin((lo2 - lo1)*r/2); return 7917.5*Math.asin(Math.sqrt(x*x + Math.cos(la1*r)*Math.cos(la2*r)*y*y)); };
function atcLocate(lat, lon){
  if (typeof lat !== 'number' || typeof lon !== 'number' || !AIRPORTS.length) return;
  here = {lat, lon};
  const list = AIRPORTS.map(a => Object.assign({}, a, {d:mi(lat, lon, a.lat, a.lon)})).sort((p, q) => p.d - q.d);
  aptOptions(list);
  const near = list[0];
  if (aptPicked || near.d > 250) return;
  if (near.icao !== apt.icao) { setAirport(near.icao, near.d); feed(`<em>NEAREST</em> ${esc(near.icao)} · ${esc(near.city)} · about ${Math.round(near.d)} mi from you. Live feeds via LiveATC.net.`); }
  else { aptDist = near.d; renderDir(); }
}
aptOptions([AIRPORTS.find(a => a.icao === HOME)].filter(Boolean).concat(AIRPORTS.filter(a => a.icao !== HOME).sort((p, q) => p.icao.localeCompare(q.icao))));
$('#aptSel').addEventListener('change', e => { aptPicked = true; const a = AIRPORTS.find(x => x.icao === e.target.value); setAirport(e.target.value, a && here ? mi(here.lat, here.lon, a.lat, a.lon) : null); tone(700,.05,'square',.03); });
rove($('#dir'), 'button', {h:true});

/* Live ATC audio. Streams play straight from LiveATC.net's servers in the visitor's browser
   (never proxied or re-served by this site), only after the visitor presses LISTEN LIVE,
   and stop when the tab is hidden so idle tabs don't hold one of LiveATC's connections. */
const LA = {on:false, el:null, gain:null, an:null, buf:null, st:null, mi:0, mount:null, state:'off', vol:.8, level:0, hiddenStop:false};
const LA_OK = window.FD_LIVEATC !== false;
function laEnsure(){
  if (LA.el) return;
  const a = new Audio(); a.crossOrigin = 'anonymous'; a.preload = 'none'; LA.el = a;
  a.addEventListener('playing', () => { if (a.readyState >= 3) laState('live'); });
  a.addEventListener('canplay', () => { if (!a.paused && LA.mount) laState('live'); });
  a.addEventListener('waiting', () => { if (LA.mount) laState('buffer'); });
  a.addEventListener('error', () => { if (LA.mount && a.error && a.getAttribute('src')) laFail(); });
  const c = ac();
  if (c && c.createMediaElementSource) {
    try {
      const src = c.createMediaElementSource(a), hp = c.createBiquadFilter(), lp = c.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 250; lp.type = 'lowpass'; lp.frequency.value = 3600;
      LA.gain = c.createGain(); LA.gain.gain.value = LA.vol; LA.an = c.createAnalyser(); LA.an.fftSize = 512; LA.buf = new Uint8Array(LA.an.fftSize);
      src.connect(hp).connect(lp).connect(LA.gain).connect(c.destination); lp.connect(LA.an);
      // tap the filtered feed for the transcriber (silent output keeps the processor running)
      if (c.createScriptProcessor) { const sp = c.createScriptProcessor(4096, 1, 1), mute = c.createGain(); mute.gain.value = 0; TX.ratio = c.sampleRate/8000; sp.onaudioprocess = ev => txProcess(ev.inputBuffer.getChannelData(0), ev.inputBuffer.duration); lp.connect(sp); sp.connect(mute).connect(c.destination); }
    } catch(e){ LA.gain = LA.an = null; a.volume = LA.vol; }
  } else a.volume = LA.vol;
}
function laState(s){
  const prev = LA.state; LA.state = s; const b = $('#lvBtn'), live = s === 'live';
  b.setAttribute('aria-pressed', String(LA.on)); b.classList.toggle('on', LA.on); b.classList.toggle('live', live);
  $('#lvT').textContent = !LA.on ? 'LISTEN LIVE' : s === 'live' ? 'LIVE · ' + (station ? station.id : '') : s === 'buffer' || s === 'connect' ? 'CONNECTING…' : s === 'down' ? 'FEED DOWN · SIM' : s === 'tap' ? 'TAP TO PLAY' : s === 'nolive' ? 'NO LIVE FEED' : 'LISTEN LIVE';
  const hb = $('#atcBtn'); hb.setAttribute('aria-pressed', String(LA.on)); hb.classList.toggle('on', LA.on); hb.classList.toggle('live', live);
  const mb = $('#mAtc'); if (mb) mb.setAttribute('aria-pressed', String(LA.on));
  const pill = $('#lvPill'); pill.hidden = !(LA.on && !radioVis && (live || s === 'buffer' || s === 'connect'));
  $('#lvPillT').textContent = station ? station.id + ' · ' + ff(station.f) : '';
  if (s === 'live' && station && LA.said !== LA.mount && (LA.said = LA.mount)) feed(`<em>LIVE</em> ${esc(station.id)} ${ff(station.f)} · audio from <a href="https://www.liveatc.net/" target="_blank" rel="noopener">LiveATC.net</a>`);
  if (s === 'down' && prev !== 'down') feed(`<em>${station ? esc(station.id) : ''}</em> LiveATC feed is offline right now. Showing sample traffic.`);
}
function laStop(){
  LA.tok = (LA.tok || 0) + 1; LA.mount = null;
  if (LA.ctl) { try { LA.ctl.abort(); } catch(e){} LA.ctl = null; }
  if (!LA.el) return;
  try { LA.el.pause(); LA.el.removeAttribute('src'); LA.el.load(); } catch(e){}
}
// LiveATC feeds are ~8 kbps MP3, so a bare <audio src> can buffer 20+ seconds before it starts.
// Feeding the same stream into MediaSource starts playback as soon as the first bytes arrive.
function laPlay(mount){
  laEnsure(); if (LA.mount === mount) return;
  laStop(); LA.mount = mount; const tok = LA.tok; laState('connect'); squelch(.18);
  const url = 'https://d.liveatc.net/' + mount + '?nocache=' + Date.now(), a = LA.el;
  const MS = window.ManagedMediaSource || window.MediaSource;
  let mse = false; try { mse = !!(MS && MS.isTypeSupported('audio/mpeg') && window.fetch && window.ReadableStream && window.AbortController); } catch(e){}
  if (!mse) return laDirect(url, tok);
  const ms = new MS(), ctl = new AbortController(); LA.ctl = ctl;
  a.disableRemotePlayback = true; a.src = URL.createObjectURL(ms);
  const p0 = a.play(); if (p0 && p0.catch) p0.catch(() => { if (tok === LA.tok && LA.state !== 'live') laState('tap'); });
  ms.addEventListener('sourceopen', async () => {
    if (tok !== LA.tok) return;
    let sb; try { sb = ms.addSourceBuffer('audio/mpeg'); sb.mode = 'sequence'; } catch(e){ return laDirect(url, tok); }
    let q = [], started = false;
    const pump = () => {
      if (tok !== LA.tok || sb.updating || !q.length) return;
      try {
        if (a.buffered.length && a.currentTime - a.buffered.start(0) > 40) { sb.remove(a.buffered.start(0), a.currentTime - 10); return; }
        sb.appendBuffer(q.shift());
      } catch(e){ q = []; }
    };
    sb.addEventListener('updateend', pump);
    try {
      const res = await fetch(url, {signal:ctl.signal, cache:'no-store'});
      if (!res.ok || !res.body) throw new Error('feed ' + res.status);
      const rd = res.body.getReader();
      for (;;) {
        const r = await rd.read(); if (r.done || tok !== LA.tok) break;
        q.push(r.value); pump();
        if (!started) { started = true; if (a.paused) { const pp = a.play(); if (pp && pp.catch) pp.catch(() => { if (tok === LA.tok) laState('tap'); }); } }
        if (a.buffered.length) { const end = a.buffered.end(a.buffered.length - 1); if (end - a.currentTime > 6) a.currentTime = end - 1.5; }
      }
      if (tok === LA.tok) laFail();
    } catch(e){ if (tok === LA.tok && !ctl.signal.aborted) laFail(); }
  }, {once:true});
}
function laDirect(url, tok){
  if (tok !== LA.tok) return; LA.el.src = url;
  const pp = LA.el.play(); if (pp && pp.catch) pp.catch(() => { if (tok === LA.tok) laFail(); });
}
function laFail(){
  const s = station; if (!LA.on || !s || !s.mounts) return;
  if (LA.mi + 1 < s.mounts.length) { LA.mi++; LA.mount = null; return laPlay(s.mounts[LA.mi]); }
  laStop(); laState('down');
}
function laTune(){
  if (!LA.on || !LA_OK) return;
  if (station && station.mounts) { if (!LA.mount || !station.mounts.includes(LA.mount)) { LA.mi = 0; laPlay(station.mounts[0]); } }
  else { laStop(); laState('nolive'); }
}
function laToggle(force){
  const on = force == null ? !LA.on : force; if (on === LA.on) return;
  LA.on = on;
  if (on) {
    const c = ac(); if (c && c.resume) c.resume();
    if (!station || !station.mounts) { const fl = STATIONS.find(x => x.mounts); if (fl) { fA = fl.f; showF(); } }
    mark('radio'); laTune(); toast('LIVE ATC · <b>' + esc(station ? station.id : '') + '</b> · audio from LiveATC.net' + (TX.off ? '' : ' · auto transcripts'), 3200);
  } else { laStop(); if (TX.rec) txEnd(true); laState('off'); feed('<em>LIVE</em> audio off'); }
}
function laNext(){ const L = STATIONS.filter(s => s.mounts); const i = L.indexOf(station); fA = L[(i + 1) % L.length].f; showF(); tone(700,.05,'square',.03); }
function laMeter(){
  let lvl = 0;
  if (LA.an && LA.state === 'live') { LA.an.getByteTimeDomainData(LA.buf); let s = 0; for (let i = 0; i < LA.buf.length; i += 4) { const v = (LA.buf[i] - 128)/128; s += v*v; } lvl = Math.sqrt(s/(LA.buf.length/4)); }
  else if (LA.state === 'live') lvl = .05 + Math.random()*.05;
  LA.level = lerp(LA.level, lvl, .4);
  $('#lvMeter').style.width = Math.round(clamp(LA.level*6, 0, 1)*100) + '%';
  if (LA.on && LA.state === 'live') $('#rxInd').classList.toggle('rx', LA.level > .035);
}
if (!LA_OK) $('#live').hidden = true;
$('#lvBtn').addEventListener('click', () => laToggle());
$('#atcBtn').addEventListener('click', () => laToggle());
$('#lvVol').addEventListener('input', e => { LA.vol = +e.target.value; if (LA.gain) LA.gain.gain.value = LA.vol; else if (LA.el) LA.el.volume = LA.vol; });
$('#lvPillNext').addEventListener('click', laNext);
$('#lvPillX').addEventListener('click', () => laToggle(false));
document.addEventListener('visibilitychange', () => {
  if (document.hidden && LA.on && LA.mount) { LA.hiddenStop = true; laStop(); }
  else if (!document.hidden && LA.hiddenStop) { LA.hiddenStop = false; laTune(); }
});
setInterval(laMeter, 90);

/* Live transcripts. Each transmission on the live feed (audio level up, then quiet for ~0.9 s)
   is downsampled to 8 kHz mono, wrapped as WAV and sent to /api/atc-transcribe (Gemini). */
const TX = {off:false, rec:false, pre:[], buf:[], len:0, quiet:0, loud:0, ratio:6, thr:.028, inflight:0, line:null, st:null};
function txProcess(x, dur){
  if (TX.off || !LA.on || LA.state !== 'live' || !station || !station.mounts) { if (TX.rec) txEnd(true); return; }
  let e = 0; for (let i = 0; i < x.length; i += 2) e += x[i]*x[i];
  const rms = Math.sqrt(e/(x.length/2)), r = TX.ratio, n = Math.floor(x.length/r), d = new Float32Array(n);
  for (let i = 0; i < n; i++) { const j0 = Math.floor(i*r), j1 = Math.max(j0 + 1, Math.floor((i + 1)*r)); let a = 0; for (let j = j0; j < j1; j++) a += x[j]; d[i] = a/(j1 - j0); }
  const loud = rms > TX.thr;
  if (!TX.rec) {
    TX.pre.push(d); if (TX.pre.length > 3) TX.pre.shift();
    TX.loud = loud ? TX.loud + dur : 0;
    if (TX.loud > .1) txStart();
    return;
  }
  TX.buf.push(d); TX.len += dur; TX.quiet = loud ? 0 : TX.quiet + dur;
  if (TX.quiet > .9 || TX.len > 15) txEnd(false);
}
function txStart(){
  TX.rec = true; TX.buf = TX.pre.slice(); TX.pre = []; TX.len = 0; TX.quiet = 0; TX.loud = 0; TX.st = station;
  TX.line = feed(`<em>${esc(station.id.split(' ').pop())}</em> <span class="txw">receiving…</span>`, 'live');
}
function wav(chunks){
  const n = chunks.reduce((a, c) => a + c.length, 0), b = new ArrayBuffer(44 + n*2), v = new DataView(b);
  const w = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n*2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n*2, true);
  let peak = .01; for (const c of chunks) for (let i = 0; i < c.length; i++) peak = Math.max(peak, Math.abs(c[i]));
  const g = Math.min(8, .9/peak); let o = 44;
  for (const c of chunks) for (let i = 0; i < c.length; i++, o += 2) v.setInt16(o, clamp(c[i]*g, -1, 1)*32767, true);
  return new Blob([b], {type:'audio/wav'});
}
function txEnd(drop){
  if (!TX.rec) return;
  TX.rec = false; const chunks = TX.buf, line = TX.line, st = TX.st, speech = TX.len - TX.quiet;
  TX.buf = []; TX.line = null;
  const span = line && $('.txw', line);
  if (drop || speech < .45) { if (line) line.remove(); return; }
  if (window.FD_PREVIEW || TX.inflight >= 3) { if (line) line.remove(); return; }
  TX.inflight++;
  fetch('/api/atc-transcribe?station=' + encodeURIComponent(st.name), {method:'POST', headers:{'Content-Type':'audio/wav'}, body:wav(chunks)})
    .then(r => r.json().catch(() => ({})).then(j => ({ok:r.ok, status:r.status, j})))
    .then(({ok, status, j}) => {
      if (!ok) {
        if (status === 429 || status === 503) { TX.off = true; feed(`<em>LIVE</em> ${status === 429 ? 'Transcript limit reached for now.' : 'Transcripts are unavailable right now.'} Audio keeps playing.`); }
        if (line) line.remove(); return;
      }
      const t = (j && j.text || '').trim();
      if (!t) { if (line) line.remove(); return; }
      if (span) { span.textContent = t; span.classList.add('done'); }
      $('#lvPillTx').textContent = st.id.split(' ').pop() + ': ' + t;
    })
    .catch(() => { if (line) line.remove(); })
    .finally(() => { TX.inflight--; });
}

function showF(){
  $('#fA').textContent = ff(fA); $('#fS').textContent = ff(fS); $('#knob').setAttribute('aria-valuenow', fS.toFixed(3));
  const s = STATIONS.find(x => Math.abs(x.f - fA) < .001) || null;
  $$('#dir button').forEach(b => b.classList.toggle('on', s && STATIONS[+b.dataset.i] === s));
  if (s !== station) {
    station = s; nextTx = nowS() + 1.2; try { speechSynthesis.cancel(); } catch(e){}
    $('#stn').textContent = s ? `${s.id} · ${s.name}` : `${ff(fA)} · NO STATION`;
    if (!LA.on || !s || !s.mounts) feed(s ? `<em>TUNED</em> ${esc(s.id)} on ${ff(fA)}${s.mounts ? ' · press LISTEN LIVE for live audio' : ' (simulated)'}` : `<em>${ff(fA)}</em> static… no station`);
    if (s && s.type !== 'guard') mark('radio');
    laTune();
  }
}
function feed(html, cls){ const f = $('#feed'); f.insertAdjacentHTML('beforeend', `<p${cls ? ` class="${cls}"` : ''}>${html}</p>`); const p = f.lastElementChild; while (f.children.length > 6) f.removeChild(f.firstChild); return p; }
function tune(d){ fS = Math.round(clamp(fS + d*.025, 118, 136.975)*1000)/1000; showF(); tick(); }
function swapF(){ [fA, fS] = [fS, fA]; showF(); tone(700,.05,'square',.03); }
$('#fUp').addEventListener('click', () => tune(1)); $('#fDn').addEventListener('click', () => tune(-1));
$('#fSwap').addEventListener('click', swapF);
const knob = $('#knob'); let kAng = 0, kLast = null, kAcc = 0;
knob.addEventListener('pointerdown', e => { knob.setPointerCapture(e.pointerId); const b = knob.getBoundingClientRect(); kLast = Math.atan2(e.clientY - b.top - b.height/2, e.clientX - b.left - b.width/2); });
knob.addEventListener('pointermove', e => { if (kLast == null) return; const b = knob.getBoundingClientRect(), a = Math.atan2(e.clientY - b.top - b.height/2, e.clientX - b.left - b.width/2); let d = a - kLast; if (d > Math.PI) d -= 6.283; if (d < -Math.PI) d += 6.283; kAng += d; kAcc += d; kLast = a; knob.style.transform = `rotate(${kAng}rad)`; while (Math.abs(kAcc) > .22) { tune(kAcc > 0 ? 1 : -1); kAcc -= Math.sign(kAcc)*.22; } });
knob.addEventListener('pointerup', () => kLast = null);
knob.addEventListener('wheel', e => { e.preventDefault(); tune(e.deltaY < 0 ? 1 : -1); kAng += e.deltaY < 0 ? .2 : -.2; knob.style.transform = `rotate(${kAng}rad)`; }, {passive:false});
$('.rface').addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.target === knob && (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft')) { e.preventDefault(); tune(e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : -1); kAng += .15; knob.style.transform = `rotate(${kAng}rad)`; }
  if (e.key === 'x' || e.key === 'X') { e.preventDefault(); swapF(); }
});
new IntersectionObserver(es => { radioVis = es[0].isIntersecting; laState(LA.state); }).observe($('.radio'));
setInterval(() => {
  const n = nowS(); if (!station || !radioVis || txBusy || n < nextTx) return;
  if (LA.on && station.mounts && LA.state !== 'down') return;
  const text = station.type === 'atis' ? atis() : LINES[station.type][Math.floor(Math.random()*LINES[station.type].length)].replace('{N}', station.name);
  txBusy = true; $('#rxInd').classList.add('rx');
  feed(`<em>${esc(station.id.split(' ').pop())}</em> ${esc(text)}`);
  squelch(.1);
  const done = () => { $('#rxInd').classList.remove('rx'); squelch(.08); txBusy = false; nextTx = nowS() + (station && station.type === 'atis' ? 4 : station && station.type === 'guard' ? 20 : 4 + Math.random()*5); };
  if (soundOn && station.type !== 'guard') say(text, 1.12, done); else setTimeout(done, Math.min(6000, 900 + text.length*45));
}, 500);
renderDir();
showF();
$('#cform').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#cName').value.trim(), em = $('#cEmail').value.trim(), m = $('#cMsg').value.trim();
  if (!n || !em || !m || !/^\S+@\S+\.\S+$/.test(em)) { $('#rx').innerHTML = `<div class="rx" style="border-color:var(--i-amber)"><b style="color:var(--i-amber)">CENTER: SAY AGAIN</b><p>Add your name, a valid email and a message, then transmit again.</p></div>`; return; }
  const b = $('#ptt'); b.classList.add('tx'); b.textContent = '◉ TRANSMITTING…'; $('#txled').classList.add('on'); squelch(.3);
  const done = (ok, err) => {
    b.classList.remove('tx'); b.textContent = '◉ PUSH TO TRANSMIT'; $('#txled').classList.remove('on'); squelch(.15);
    if (!ok) { $('#rx').innerHTML = `<div class="rx" style="border-color:var(--i-red)"><b style="color:var(--i-red)">CENTER: TRANSMISSION NOT RECEIVED</b><p>${esc(err || 'Something went wrong.')} Please try again in a minute.</p></div>`; return; }
    $('#rx').innerHTML = `<div class="rx"><b>CENTER: ${esc(n.toUpperCase())}, ROGER · ${ff(fA)}</b><p><strong>Message sent.</strong> Thanks for reaching out. I'll get back to you within 24–48 hours. You should receive a confirmation email shortly.</p>${window.FD_PREVIEW ? '<p style="font-size:.8rem;opacity:.7">Preview build: nothing was actually sent.</p>' : ''}</div>`;
    $('#cform').reset();
  };
  if (window.FD_PREVIEW) { setTimeout(() => done(true), 1300); return; }
  fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:n, email:em, subject:$('#cSubj').value.trim(), message:m, user_agent:navigator.userAgent})})
    .then(r => r.ok ? done(true) : r.json().then(j => done(false, j && j.error), () => done(false)))
    .catch(() => done(false));
});

/* ================= transponder / squawk ================= */
$('#goAround').addEventListener('click', () => { toast('GOING AROUND · returning to <b>KLAF</b>'); say('Going around'); window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });
const xin = $('#xpdr');
$('#ident').addEventListener('click', () => { $('#xpdrBox').classList.add('flash'); setTimeout(() => $('#xpdrBox').classList.remove('flash'), 1600); squawk(xin.value.trim(), true); });
xin.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); squawk(xin.value.trim(), true); xin.blur(); } });
xin.addEventListener('input', () => { xin.value = xin.value.replace(/[^0-7]/g, '').slice(0,4); if (xin.value.length === 4) squawk(xin.value); });
let nordo = false, mayT = null, keys = '', keysT = null;
function squawk(code, ident){
  xin.value = code;
  $('#xpdrMode').textContent = code === '7700' ? 'EMER' : code === '7600' ? 'NORDO' : 'ALT';
  if (code === '7700') return mayday();
  if (code === '7600') { nordo = true; toast('SQUAWK <b>7600</b> · radio failure. AiRa can only answer with light-gun signals.', 4000); airaSay('…', 'AiRa · NORDO', 2500); return; }
  if (code === '1200') { endMayday(); nordo = false; toast('SQUAWK <b>1200</b> · VFR, all systems normal'); return; }
  if (ident || code.length === 4) toast('SQUAWK <b>' + esc(code) + '</b> · Center: radar contact, N-BANDHA');
}
function mayday(){
  mark('squawk'); document.body.classList.add('mayday');
  let b = $('.mbanner'); if (!b) { b = document.createElement('button'); b.className = 'mbanner'; b.type = 'button'; b.textContent = 'SQUAWK 7700 · MAYDAY · tap or squawk 1200 to reset'; b.addEventListener('click', () => squawk('1200')); document.body.appendChild(b); }
  for (let i=0;i<4;i++) { tone(960,.22,'sawtooth',.03,i*.5); tone(700,.22,'sawtooth',.03,i*.5 + .25); }
  openChat(); addMsg('a', "Squawking 7700. What's your emergency? If it's a real one, call 911. Otherwise the fastest way to reach Sushin is the radio at Contact. I'm taking you there now.");
  setTimeout(() => go('centr'), 1400);
  clearTimeout(mayT); mayT = setTimeout(() => { endMayday(); xin.value = '1200'; $('#xpdrMode').textContent = 'ALT'; }, 9000);
}
function endMayday(){ document.body.classList.remove('mayday'); const b = $('.mbanner'); if (b) b.remove(); clearTimeout(mayT); }

/* ================= AiRa ================= */
const POOLS = {
  crews:["Ask me more about this","Want to know what drives me?","There's a story behind each of these","I'm happy to go deeper on any of this"],
  logbk:["Want to know more about this experience?","Ask me about my time here","I can walk you through what I actually did","There's more behind this role — ask me"],
  gates:["Want me to walk you through Project AiRa?","Ask me anything about these projects","Curious what tech stack I used here?","I built these — ask me how"],
  grnds:["Want to know more about my academic path?","Ask me about my coursework","There's more to this than grades — ask me"],
  radar:["Curious how I use any of these?","Ask me about any of these skills","Some of these have interesting stories behind them","Want to know which ones I use most?"],
  patch:["Ask me about any of these certs","Want to know why I got into this?","Some of these changed how I think about AI","Ask me which ones I'd recommend"],
  centr:["Ask me anything","I'm happy to answer any questions","Let's talk — ask me something"]
};
const poolIdx = {}; let bubT = null;
function airaSay(t, k, ms){ $('#bubbleT').textContent = t; $('#bubbleK').textContent = k || 'AiRa · FIRST OFFICER'; if (!$('#chat').hidden) return; $('#bubble').classList.remove('gone'); clearTimeout(bubT); bubT = setTimeout(() => $('#bubble').classList.add('gone'), ms || 4200); }
$('#bubble').addEventListener('click', () => openChat());
function openChat(){ $('#chat').hidden = false; $('#bubble').classList.add('gone'); if (!$('#msgs').children.length) addMsg('a', "Hey, I'm AiRa — Bandha's AI assistant. Ask me anything about his experience, projects, coursework or certifications."); setTimeout(() => $('#chatI').focus(), 50); }
function closeChat(){ $('#chat').hidden = true; }
$('#aira').addEventListener('click', () => { $('#chat').hidden ? openChat() : closeChat(); });
$('#chatX').addEventListener('click', closeChat);
function addMsg(who, text, src){ const m = document.createElement('div'); m.className = 'msg ' + who; m.textContent = text; if (src) { const s = document.createElement('small'); s.textContent = 'SOURCE · ' + src; m.appendChild(s); } $('#msgs').appendChild(m); $('#msgs').scrollTop = 1e6; }
const SUGG = ['Is he a pilot?','What does he do as an EMT?','Tell me about the Pre-Flight Briefer','What did he do at PSEG?','How do I contact him?'];
$('#sugg').innerHTML = SUGG.map(s => `<button type="button">${esc(s)}</button>`).join('');
$$('#sugg button').forEach(b => b.addEventListener('click', () => ask(b.textContent)));
$('#chatF').addEventListener('submit', e => { e.preventDefault(); const v = $('#chatI').value.trim(); if (v) { ask(v); $('#chatI').value = ''; } });
const corpus = [];
D.experiences.forEach(e => corpus.push({k:(e.title + ' ' + e.company + ' ' + e.summary + ' ' + e.description.join(' ') + ' ' + e.skills.join(' ') + ' ' + e.narrative).toLowerCase(), t:(e.title + ' ' + e.company).toLowerCase(), a:e.summary + ' ' + e.narrative.split('. ').slice(0,2).join('. ') + '.', s:'Experience · ' + e.company}));
D.projects.forEach(p => corpus.push({k:(p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase(), t:p.title.toLowerCase(), a:p.description, s:'Projects · ' + p.title}));
D.certs.forEach(c => corpus.push({k:(c.title + ' ' + c.issuer + ' ' + c.description).toLowerCase(), t:c.title.toLowerCase(), a:c.title + ' (' + c.issuer + ', ' + c.date + '). ' + c.description, s:'Certifications'}));
Object.entries(D.courseDetails).forEach(([n,d]) => corpus.push({k:(n + ' ' + d.narrative).toLowerCase(), t:n.toLowerCase(), a:d.narrative.split('. ').slice(0,3).join('. ') + '.', s:'Education · ' + n}));
Object.entries(D.skillDetails).forEach(([n,d]) => corpus.push({k:(n + ' ' + d.narrative).toLowerCase(), t:n.toLowerCase(), a:d.narrative.split('. ').slice(0,3).join('. ') + '.', s:'Skills · ' + n}));
const STOP = new Set('the a an and or of to in on for with about is are was what who how does did do he his him me you tell can i my it at as be this that from your sushin bandha'.split(' '));
const history = [];
function ask(q){
  addMsg('u', q); mark('aira'); const ql = q.toLowerCase();
  history.push({role:'user', content:q});
  if (!window.FD_PREVIEW && !nordo) {
    const typing = document.createElement('div'); typing.className = 'msg a'; typing.textContent = '…'; $('#msgs').appendChild(typing);
    fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({messages: history.slice(-10)})})
      .then(r => r.ok ? r.json() : Promise.reject()).then(d => { typing.remove(); if (!d || !d.message) throw 0; history.push({role:'assistant', content:d.message}); addMsg('a', d.message); })
      .catch(() => { typing.remove(); localAnswer(q, ql); });
    return;
  }
  localAnswer(q, ql);
}
function localAnswer(q, ql){
  setTimeout(() => {
    if (nordo) return addMsg('a', '[LIGHT GUN · STEADY GREEN] Radio failure, squawk 7600. Squawk 1200 to restore my radio.');
    if (/\b(pilot|fly|flying|ppl|aviation)\b/.test(ql)) return addMsg('a', "Yes. He's a student pilot working toward a private pilot license while studying AI at Purdue, with ongoing aviation coursework (AT 43300 Supervised Aviation Experience). His aviation projects include the Pre-Flight AI Briefer, AeroLog and TraineeFlightOps.", 'About · Education · Projects');
    if (/\b(contact|email|reach|hire|call|resume|message)\b/.test(ql)) return addMsg('a', "Use the radio form at Contact (FL410). That's the direct line, and he usually replies within 24–48 hours. His resume is the document icon in the header. He's also on GitHub and LinkedIn (icons in the footer).", 'Contact');
    if (/^(hi|hey|hello|yo)\b/.test(ql)) return addMsg('a', 'Hi! Ask me about his experience, projects, coursework, skills or certifications.');
    const words = ql.split(/[^a-z0-9+#.]+/).filter(w => w.length > 2 && !STOP.has(w));
    let best = null, bs = 0;
    corpus.forEach(c => { let s = 0; words.forEach(w => { if (c.t.includes(w)) s += 4; if (c.k.includes(w)) s += 1; }); if (s > bs) { bs = s; best = c; } });
    if (!best || bs < 2) return addMsg('a', "That isn't in my flight bag. Try asking about his EMT work, PSEG, Project AiRa, the Pre-Flight Briefer, or a course like Linear Algebra.");
    addMsg('a', best.a, best.s);
  }, 450);
}

/* ================= keyboard (global) ================= */
function heroKeysOK(){ return curIdx === 0 && !dlg.open && $('#chat').hidden && (document.activeElement === document.body || hero.contains(document.activeElement)); }
addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  if (e.key === 'Escape') {
    if (!$('#keysHelp').hidden) return closeKeys();
    if (!$('#wxPop').hidden) return toggleWx(false);
    if (!$('#menu').hidden) return closeMenu();
    if (!$('#chat').hidden) { closeChat(); $('#aira').focus(); return; }
    if (!$('#coach').hidden) { $('#coach').hidden = true; return; }
    if (!$('#boot').hidden) return endBoot();
    return;
  }
  if (!$('#boot').hidden && !$('#boot').classList.contains('out') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); return endBoot(); }
  if (typing || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented || dlg.open || !$('#keysHelp').hidden) return;
  if (/^\d$/.test(e.key)) {
    keys = (keys + e.key).slice(-4); xin.value = keys.padEnd(4, '-'); clearTimeout(keysT);
    keysT = setTimeout(() => { if (keys.length < 4) { xin.value = '1200'; } keys = ''; }, 2500);
    if (keys.length === 4) { squawk(keys, true); keys = ''; }
    return;
  }
  if (e.key === '?') { e.preventDefault(); return openKeys(); }
  if (e.key === '/') { e.preventDefault(); return openChat(); }
  if (e.key === '[' || e.key === ']') { e.preventDefault(); return go(WP[clamp(curIdx + (e.key === ']' ? 1 : -1), 0, WP.length - 1)].id); }
  if (e.key === 'c' || e.key === 'C') { return toggleWx(); }
  if (e.key === 'l' || e.key === 'L') { e.preventDefault(); return laToggle(); }
  if (heroKeysOK()) {
    const k = e.key.toLowerCase();
    if (k === 'enter' && document.activeElement === document.body) { e.preventDefault(); toast('N-BANDHA · <b>CLEARED FOR TAKEOFF</b> · runway 28 · climbing'); go('crews'); }
  }
});
addEventListener('keyup', e => { const k = e.key.toLowerCase(); if (k === 'arrowleft' || k === 'a') hk.l = 0; if (k === 'arrowright' || k === 'd') hk.r = 0; if (k === 'w') hk.u = 0; if (k === 's') hk.d = 0; });

/* ================= waypoint arrival =================
   Each section waits off-screen until you reach its flight level: panels on the left slide in
   from the left, panels on the right from the right, and centered ones come up from in front. */
const lvl = $('#lvl');
let lvlT = null;
function levelOff(w){
  if (!lvl) return;
  lvl.innerHTML = `<small>LEVEL OFF</small><b>${esc(fmtAlt(w.alt))}</b><span>${esc(w.code)} · ${esc(w.name.toUpperCase())}</span>`;
  lvl.classList.remove('on'); void lvl.offsetWidth; lvl.classList.add('on');
  clearTimeout(lvlT); lvlT = setTimeout(() => lvl.classList.remove('on'), 1700);
}
function prepArrivals(){
  if (reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sec = e.target; io.unobserve(sec); sec.classList.add('arr');
    const w = WP.find(x => x.id === sec.id); if (w && afterBootDone) levelOff(w);
  }), {rootMargin:'0px 0px -40% 0px'});
  const vw = innerWidth;
  WP.slice(1).forEach(w => {
    const sec = document.getElementById(w.id), wrap = sec && $('.wrap', sec); if (!wrap) return;
    const r0 = sec.getBoundingClientRect(); if (r0.top < innerHeight*.68) return; // already in view on load
    const items = [];
    for (const ch of wrap.children) {
      const cs = getComputedStyle(ch), kids = Array.from(ch.children).filter(k => k.offsetWidth && getComputedStyle(k).position !== 'absolute');
      if ((cs.display.includes('grid') || cs.display.includes('flex')) && kids.length > 1 && kids.length <= 12 && kids.some(k => k.offsetWidth < ch.offsetWidth*.8)) items.push(...kids); else items.push(ch);
    }
    $$('#lbRows > *', sec).slice(0, 10).forEach(k => items.push(k));
    const side = Math.min(vw*.18, 220);
    items.forEach((it, i) => {
      const b = it.getBoundingClientRect(), c = (b.left + b.width/2)/vw;
      const dir = b.width > vw*.7 ? 0 : c < .42 ? -1 : c > .58 ? 1 : 0;
      it.classList.add('fly');
      it.style.setProperty('--fx', dir*side + 'px');
      it.style.setProperty('--fy', dir ? '24px' : '70px');
      it.style.setProperty('--fs', dir ? '.96' : '.84');
      it.style.setProperty('--fr', dir*-14 + 'deg');
      it.style.setProperty('--fd', Math.min(i*70, 700) + 'ms');
    });
    sec.classList.add('pre'); io.observe(sec);
  });
}

/* ================= section tracking ================= */
let curIdx = 0, lastAnnounced = 0;
function onWaypoint(i){
  const w = WP[i];
  $$('#route button').forEach((b,j) => { b.classList.toggle('on', j === i); b.classList.toggle('past', j < i); });
  const nx = WP[Math.min(i + 1, WP.length - 1)];
  $('#selAlt').textContent = 'SEL ' + fmtAlt(nx.alt); $('#altSel').textContent = 'SEL ' + nx.alt;
  if (i === lastAnnounced) return; lastAnnounced = i;
  if (i > 0) {
    const pool = POOLS[w.id] || []; poolIdx[w.id] = ((poolIdx[w.id] == null ? -1 : poolIdx[w.id]) + 1) % (pool.length || 1);
    airaSay(pool[poolIdx[w.id]] || '', 'PASSING ' + w.code + ' · ' + fmtAlt(w.alt), 3800);
    decode($('#' + w.id + ' [data-code]'));
    tone(1320,.06,'sine',.018); tone(1760,.08,'sine',.018,.07);
    if (i >= 2) mark('climb');
    say(w.id === 'centr' ? 'Level four one zero. Contact Center.' : 'Passing ' + (spoken[w.code] || w.code));
  }
}
function decode(e){ if (!e || reduce) return; const goal = e.textContent; let k = 0; const iv = setInterval(() => { k++; e.textContent = goal.split('').map((c,j) => j < k/2 ? c : CH[1 + Math.floor(Math.random()*26)]).join(''); if (k/2 >= goal.length) { clearInterval(iv); e.textContent = goal; } }, 35); }

/* ================= plane cursor ================= */
const pc = $('#pc'), trail = $('#trail'), tc = trail.getContext('2d');
function sizeTrail(){ trail.width = innerWidth; trail.height = innerHeight; }
const usePlane = fine && !reduce;
let cx = -100, cy = -100, px = -100, py = -100, pang = 0, pts = [], cursorPaused = false;
function cursorPause(on){ cursorPaused = on; if (!usePlane) return; document.body.classList.toggle('plane-cursor', !on); pc.style.display = on ? 'none' : 'block'; trail.style.display = on ? 'none' : 'block'; if (on) pts = []; }
if (usePlane) {
  document.body.classList.add('plane-cursor'); pc.style.display = 'block'; sizeTrail();
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return; cx = e.clientX; cy = e.clientY; const t = e.target;
    pc.classList.toggle('text', !!t.closest('input,textarea'));
    pc.classList.toggle('hot', !!t.closest('a,button,[role="button"],[role="slider"],summary,.knob,#scope,.mon,label'));
  });
  document.addEventListener('mouseleave', () => { cx = cy = -100; });
} else trail.style.display = 'none';
function drawCursor(dt){
  if (cursorPaused) return;
  const dx = cx - px, dy = cy - py, dist = Math.hypot(dx, dy);
  px = lerp(px, cx, .35); py = lerp(py, cy, .35);
  if (dist > 2) { const a = Math.atan2(dy, dx) + Math.PI/2; let d = a - pang; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; pang += d*.18; }
  pc.style.transform = `translate(${px}px,${py}px) rotate(${pang}rad) scaleX(${1 - clamp(dist/120, 0, .35)})`;
  if (!pc.classList.contains('hot') && !pc.classList.contains('text') && dist > 1.5) pts.push({x:px, y:py, l:1});
  tc.clearRect(0, 0, trail.width, trail.height);
  for (let i = pts.length - 1; i >= 0; i--) { pts[i].l -= dt*1.6; if (pts[i].l <= 0) pts.splice(i, 1); }
  if (pts.length > 1) { tc.lineCap = 'round'; for (let i=1;i<pts.length;i++){ const a = pts[i-1], b = pts[i]; tc.strokeStyle = `rgba(255,255,255,${(b.l*.55).toFixed(3)})`; tc.lineWidth = 1 + b.l*3; tc.beginPath(); tc.moveTo(a.x, a.y); tc.lineTo(b.x, b.y); tc.stroke(); } }
  if (pts.length > 80) pts.splice(0, pts.length - 80);
}

/* ================= takeoff callouts ================= */
const CALLOUTS = [[.16, 'AIRSPEED ALIVE', 'RWY 28 · KLAF'], [ROT - .02, 'ROTATE', 'V<sub>R</sub> 55 KT'], [.84, 'POSITIVE RATE', 'CLIMB · 3,000 FT · CREWS']];
function callout(big, small){
  const c = $('#callout'); c.innerHTML = esc(big) + (small ? `<small>${small}</small>` : ''); c.classList.add('on');
  tone(1180,.07,'sine',.02); tone(1580,.09,'sine',.02,.08);
  clearTimeout(calloutT); calloutT = setTimeout(() => c.classList.remove('on'), 1400);
}

/* ================= main loop ================= */
let heroVis = true; new IntersectionObserver(es => heroVis = es[0].isIntersecting).observe(hero);
let rollS = 0, lastTk = 0, calloutT = null; const copyStyle = copyEl.style;
let lastClip = '', altShown = 0, lastT = performance.now(), lastAlt = 0, vs = 0, lastSY = scrollY, spd = 0, scrollKick = 0, colorT = 0;
const altV = $('#altV'), spdV = $('#spdV'), altT = $('#altT'), spdT = $('#spdT'), bankPtr = $('#bankPtr');
function frame(now){
  const dt = Math.min(.05, (now - lastT)/1000); lastT = now; const t = now/1000;
  const st = altAt(scrollY);
  if (st.i !== curIdx) { curIdx = st.i; onWaypoint(curIdx); }
  altShown = lerp(altShown, st.alt, reduce ? 1 : .12);
  const dy = scrollY - lastSY; lastSY = scrollY;
  vs = lerp(vs, (altShown - lastAlt)/Math.max(dt, .001)*60, .1); lastAlt = altShown;
  scrollKick = Math.max(scrollKick*Math.pow(.3, dt), Math.abs(dy)*1.2);
  const R = rollLen(), tk = rollTk(scrollY), hEnd = hero.offsetTop + hero.offsetHeight;
  const inH = scrollY < hEnd - innerHeight*.18; document.body.classList.toggle('inhero', inH);
  const clipB = inH ? `inset(0 0 ${Math.max(0, innerHeight - (hEnd - scrollY))}px 0)` : 'none';
  if (clipB !== lastClip) { lastClip = clipB; $('#fx').style.clipPath = clipB; }
  const p = altShown/41000, S = skyAt(p);
  const cruiseY = SH*(.64 + .08*smooth(0, 1, p));
  const pitchMax = Math.max(0, SH*1.08 - HG.gy), pitch = reduce ? 0 : pitchMax*smooth(ROT - .02, 1, tk);
  let hy;
  if (reduce) hy = lerp(clamp(HG.gy - scrollY, SH*.25, SH), cruiseY, smooth(.1, .75, scrollY/Math.max(1, hero.offsetHeight)));
  else { const after = scrollY - (hero.offsetTop + R); hy = after <= 0 ? HG.gy + pitch : lerp(HG.gy + pitchMax, cruiseY, smooth(0, innerHeight*1.1, after)); }
  const rS = reduce ? 0 : rollDist(tk);
  if (!reduce) { W0.z += (rS - rollS)*1.6; W0.hold = 1 - smooth(ROT, 1, tk); W0.eye = lerp(150, 400, smooth(.2, 1, tk)); }
  rollS = rS;
  drawSky(S, t, hy, dt, clamp(vs/6000, -1.5, 1.5)); drawFx(S, dt, t);
  if ((colorT += dt) > 1) { colorT = 0; heroColors(); }
  const rw = route.clientWidth - 28, rp = clamp((curIdx + (WP[curIdx+1] ? (st.alt - WP[curIdx].alt)/(WP[curIdx+1].alt - WP[curIdx].alt) : 0))/(WP.length - 1), 0, 1);
  $('#routeProg').style.width = (rp*rw) + 'px'; $('#routeAc').style.left = (14 + rp*rw) + 'px';
  $('#mprog').style.width = (scrollY/maxScroll*100) + '%';
  $('#wpChip').textContent = WP[curIdx].code + ' · ' + fmtAlt(altShown);
  $('.altrail').classList.toggle('off', curIdx === 0);
  if (innerWidth > 1280 && curIdx > 0) { drawAltRail(altShown); const vsc = clamp(vs, -6000, 6000); $('#vsi').textContent = 'VS ' + (vsc >= 0 ? '+' : '') + Math.round(vsc/50)*50; }
  const n = nowS(); vitalsStep(n, dt); mons.forEach(o => { if (o.vis) drawMon(o, n); });
  if (heroVis) {
    const tr = 0, tp = 0;
    curR = lerp(curR, reduce ? 0 : tr, .07); curP = lerp(curP, reduce ? 0 : tp, .07);
    const climb = clamp(altShown/3000, 0, 1);

    att.setAttribute('transform', `translate(0 ${pitch.toFixed(1)})`);
    drawRunway(rS, 1 + (reduce ? 0 : heroAlt(tk)/120));
    $('#hzLine').setAttribute('stroke-opacity', (.75*(1 - smooth(ROT, .9, tk))).toFixed(2));
    if (!reduce) {
      const cf = smooth(.04, .28, tk);
      copyStyle.opacity = (1 - cf).toFixed(3); copyStyle.transform = cf > 0 ? `translateY(${(-cf*80).toFixed(1)}px) scale(${(1 + cf*.08).toFixed(3)})` : '';
      copyStyle.visibility = cf > .98 ? 'hidden' : '';
      for (const [at, big, small] of CALLOUTS) if (lastTk < at && tk >= at) callout(big, small);
      lastTk = tk;
    }
    bankPtr.setAttribute('transform', `rotate(${(-curR).toFixed(2)})`);
    const spT = reduce || scrollY > hero.offsetTop + R ? (scrollY > 4 ? 74 + clamp(altShown/10000, 0, 1)*200 : 0) + Math.abs(dy)*.8 : tk <= ROT ? 58*Math.pow(clamp((tk - .03)/(ROT - .03), 0, 1), .85) : 58 + 16*smooth(ROT, .9, tk);
    spd = lerp(spd, spT, .15);
    if (innerWidth > 900 && HG.tS) {
      tape(altT, altShown, 100, 58, HG.tA, 'R', v => v.toLocaleString('en-US'));
      tape(spdT, spd, 10, 46, HG.tS, 'L');
      altV.textContent = Math.round(altShown).toLocaleString('en-US'); spdV.textContent = Math.round(spd);
    }
  }
  if (usePlane) drawCursor(dt);
  if (scopeVis) drawScope(reduce ? 0 : dt);
  requestAnimationFrame(frame);
}

/* ================= live weather ================= */
if (!window.FD_PREVIEW && !/wx=/.test(location.hash)) {
  fetch('/api/wx').then(r => r.json().catch(() => null)).then(d => {
    if (d) atcLocate(d.lat, d.lon);
    if (!d || !d.condition) return;
    const cc = d.cloudCover || 0;
    WX.cond = d.condition === 'clear' ? (cc < 15 ? 'clear' : 'few') : d.condition === 'cloudy' ? (cc < 70 ? 'scattered' : 'broken') : d.condition;
    if (!CONDS.some(c => c[0] === WX.cond)) WX.cond = 'scattered';
    if (d.city) $('#wxWhere').textContent = 'YOUR SKY · ' + String(d.city).toUpperCase();
    updateWxUI(); heroColors();
  }).catch(() => {});
}

/* ================= start ================= */
sizeCanvases(); measure(); heroColors(); selectCat(1);
prepArrivals();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); });
onWaypoint(0);
runBoot(false);
requestAnimationFrame(frame);
})();
