/* ─── render.js ─── */
function renderAll() {
    renderLibrary();
    renderSidebar();
}

function renderLibrary() {
    const q = (document.getElementById('lib-search')?.value || '').toLowerCase();
    const sess = sortedArr(DB.sessions).filter(s => !q || s.name.toLowerCase().includes(q));
    const all = Object.keys(DB.sessions).length;
    const cnt = document.getElementById('ph-count');
    if (cnt) cnt.textContent = `${all} session${all !== 1 ? 's' : ''} saved locally`;
    document.getElementById('lib-grid').innerHTML = sess.map((s, i) => sessionCard(s, 'live', i)).join('') + newCard();
    renderSidebar();
}

function renderArchived() {
    const q = (document.getElementById('arc-search')?.value || '').toLowerCase();
    const sess = sortedArr(DB.archived).filter(s => !q || s.name.toLowerCase().includes(q));
    const cnt = document.getElementById('arc-count');
    if (cnt) cnt.textContent = `${Object.keys(DB.archived).length} archived`;
    document.getElementById('arc-grid').innerHTML = sess.length ?
        sess.map((s, i) => sessionCard(s, 'archived', i)).join('') :
        emptyState('fa-box-archive', 'Nothing archived yet', 'Archive sessions from the library using the archive button on each card.');
    renderSidebar();
}

function renderTrash() {
    const q = (document.getElementById('trs-search')?.value || '').toLowerCase();
    const sess = sortedArr(DB.trash).filter(s => !q || s.name.toLowerCase().includes(q));
    const cnt = document.getElementById('trs-count');
    if (cnt) cnt.textContent = `${Object.keys(DB.trash).length} deleted`;
    document.getElementById('trs-grid').innerHTML = sess.length ?
        sess.map((s, i) => sessionCard(s, 'trash', i)).join('') :
        emptyState('fa-trash', 'Trash is empty', 'Sessions moved to trash will appear here.');
    renderSidebar();
}

function renderWorkspaces() {
    const sess = sortedArr(DB.sessions);
    document.getElementById('ws-grid').innerHTML = sess.length ?
        sess.map((s, i) => sessionCard(s, 'live', i)).join('') + newCard() :
        emptyState('fa-layer-group', 'No workspaces yet', 'Create your first workspace to get started.');
}

function renderSidebar() {
    const live = sortedArr(DB.sessions);
    document.getElementById('sb-recent').innerHTML = live.slice(0, 8).map(s =>
        `<div class="sb-sess-item" onclick="openDetail('${s.id}')">
      <span class="sb-sess-icon">${s.icon || '<i class="fa-solid fa-folder"></i>'}</span>
      <span class="sb-sess-name">${esc(s.name)}</span>
      <span class="sb-sess-cnt">${totalTabs(s)}</span>
    </div>`
    ).join('') || '<div style="padding:5px 10px;font-size:11px;color:var(--text3)">No sessions yet</div>';
    document.getElementById('sb-lib-cnt').textContent = live.length;
    document.getElementById('sb-arc-cnt').textContent = Object.keys(DB.archived).length;
    document.getElementById('sb-trs-cnt').textContent = Object.keys(DB.trash).length;
}

function updateSyncTime() {
    const n = new Date();
    const el = document.getElementById('sb-sync');
    if (el) el.textContent = `Synced at ${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
}

function sessionCard(s, bucket, idx) {
    const tc = totalTabs(s);
    const gc = Object.keys(s.groups).length;
    const favs = allTabs(s).slice(0, 5);
    const extra = Math.max(0, allTabs(s).length - 5);

    const favHtml = favs.map(t =>
        `<div class="sc-fav"><img src="${fav(t.url)}" onerror="this.style.display='none'"/></div>`
    ).join('') + (extra ? `<div class="sc-fav-more">+${extra}</div>` : '');

    const pillHtml = Object.values(s.groups).slice(0, 4).map(g =>
        `<div class="sc-grp-pill" style="color:${g.color||s.color};border-color:${hex(g.color||s.color)}30;background:${hex(g.color||s.color)}14">${esc(g.name)}</div>`
    ).join('');

    let acts = '';
    if (bucket === 'live') {
        acts = `
      <button class="sca arc" onclick="event.stopPropagation();archiveSession('${s.id}')" title="Archive"><i class="fa-solid fa-box-archive"></i></button>
      <button class="sca shr" onclick="event.stopPropagation();shareSession('${s.id}')" title="Share"><i class="fa-brands fa-whatsapp"></i></button>
      <button class="sca del" onclick="event.stopPropagation();trashSession('${s.id}')" title="Trash"><i class="fa-solid fa-trash"></i></button>`;
    } else if (bucket === 'archived') {
        acts = `
      <button class="sca" onclick="event.stopPropagation();restoreFromArchive('${s.id}')" title="Restore" style="color:var(--ok)"><i class="fa-solid fa-rotate-left"></i></button>
      <button class="sca del" onclick="event.stopPropagation();permDeleteArchived('${s.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>`;
    } else if (bucket === 'trash') {
        acts = `
      <button class="sca" onclick="event.stopPropagation();restoreFromTrash('${s.id}')" title="Restore" style="color:var(--ok)"><i class="fa-solid fa-rotate-left"></i></button>
      <button class="sca del" onclick="event.stopPropagation();permDeleteTrash('${s.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>`;
    }

    return `<div class="sc ${bucket==='archived'?'archived':''}" style="--cc:${s.color}" onclick="openDetail('${s.id}','${bucket}')">
    <div class="sc-body">
      <div class="sc-top">
        <div class="sc-icon-wrap">${s.icon || '<i class="fa-solid fa-folder"></i>'}</div>
        <div class="sc-acts" onclick="event.stopPropagation()">${acts}</div>
      </div>
      <div class="sc-name">${esc(s.name)}</div>
      <div class="sc-meta"><i class="fa-regular fa-clock"></i>${tc} Tab${tc!==1?'s':''}  ·  Saved ${fmtDate(s.ts)}</div>
      <div class="sc-favs">${favHtml}</div>
      <div class="sc-groups">${pillHtml}</div>
    </div>
    <div class="sc-footer">
      <span class="sc-footer-meta">${gc} group${gc!==1?'s':''}</span>
      <button class="sc-restore" onclick="event.stopPropagation();openAllTabs('${s.id}','${bucket}')">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Restore
      </button>
    </div>
  </div>`;
}

function newCard() {
    return `<div class="sc new-sc" onclick="openAddModal()">
    <div class="new-plus"><i class="fa-solid fa-plus"></i></div>
    <div class="new-label">Save Current Tabs</div>
    <div class="new-sub">Create new local snapshot</div>
  </div>`;
}

function emptyState(icon, title, desc) {
    return `<div class="empty-view" style="grid-column:1/-1">
    <i class="fa-solid ${icon}"></i><h3>${title}</h3><p>${desc}</p>
  </div>`;
}