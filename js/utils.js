/* ─── utils.js ─── */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const pad = n => String(n).padStart(2, '0');

function norm(u) { return u.startsWith('http') ? u : 'https://' + u; }

function domain(u) { try { return new URL(norm(u)).hostname.replace('www.', ''); } catch { return u; } }

function fav(u) { return `https://www.google.com/s2/favicons?domain=${domain(u)}&sz=32`; }

function allTabs(s) { return Object.values(s.groups).flatMap(g => g.tabs); }

function totalTabs(s) { return allTabs(s).length; }

function parseURLs(t) { return t.split('\n').map(l => l.trim()).filter(l => l && (l.includes('.') || l.startsWith('http'))); }

function mkTab(u) { const n = norm(u); return { id: uid(), url: n, title: domain(n), ts: Date.now() }; }

function mkGroup(gid, name, urls) { return { id: gid, name, tabs: urls.map(mkTab), subgrouped: false, collapsed: false }; }

function sortedArr(obj) { return Object.values(obj).sort((a, b) => DB.sortDesc ? b.ts - a.ts : a.ts - b.ts); }

function hex(c) { return c || '#0ea5a0'; }

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function copyURL(url) { navigator.clipboard.writeText(url).then(() => toast('Copied!', 'ok')); }

function fmtDate(ts) {
    const d = new Date(ts),
        now = new Date(),
        diff = now - d;
    if (diff < 86400000) return `Today ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── TOAST ── */
function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fa-solid ${TICO[type] || TICO.info}"></i><span>${msg}</span>`;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => {
        el.classList.add('out');
        el.addEventListener('animationend', () => el.remove());
    }, 3200);
}

/* ── ZOOM ── */
function zoomIn() {
    zoomLevel = Math.min(ZOOM_MAX, +(zoomLevel + ZOOM_STEP).toFixed(1));
    applyZoom();
}

function zoomOut() {
    zoomLevel = Math.max(ZOOM_MIN, +(zoomLevel - ZOOM_STEP).toFixed(1));
    applyZoom();
}

function applyZoom() {
    document.getElementById('body').style.zoom = zoomLevel;
    toast(`Zoom ${Math.round(zoomLevel * 100)}%`, 'info');
}