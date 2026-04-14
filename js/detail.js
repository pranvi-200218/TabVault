// function openDetail(id, bucket) {
//     bucket = bucket || 'live';
//     activeDpId = id;
//     detailBucket = bucket;
//     const store = bucket === 'archived' ? DB.archived : bucket === 'trash' ? DB.trash : DB.sessions;
//     const s = store[id];
//     if (!s) return;
//     document.getElementById('dp-icon').innerHTML = s.icon || '<i class="fa-solid fa-folder"></i>';
//     document.getElementById('dp-name').textContent = s.name;
//     refreshDpMeta(s);
//     renderDpBody(s);
//     document.getElementById('dp').classList.add('open');
// }

// function closeDetail() {
//     document.getElementById('dp').classList.remove('open');
//     activeDpId = null;
// }
// document.getElementById('dp').addEventListener('click', e => { if (e.target === e.currentTarget) closeDetail(); });

// function refreshDpMeta(s) {
//     const tc = totalTabs(s),
//         gc = Object.keys(s.groups).length;
//     document.getElementById('dp-meta').textContent = `${tc} tab${tc!==1?'s':''} · ${gc} group${gc!==1?'s':''}`;
// }

// function renderDpBody(s) {
//     const el = document.getElementById('dp-body');
//     if (!Object.keys(s.groups).length) {
//         el.innerHTML = '<div class="empty-view" style="padding:40px"><i class="fa-solid fa-folder-open"></i><h3>No groups</h3><p>Add a group to this session.</p></div>';
//         return;
//     }
//     el.innerHTML = Object.values(s.groups).map(g => dpGroup(s, g)).join('');
// }

// function dpGroup(s, g) {
//     const col = g.color || s.color || '#0ea5a0';
//     return `<div class="dp-group ${g.collapsed?'col':''}" id="dpg-${g.id}">
//     <div class="dp-grp-hd" style="--gcc:${col}" onclick="toggleDpGroup('${s.id}','${g.id}')">
//       <div class="dp-grp-dot" style="background:${col}"></div>
//       <span class="dp-grp-name">${esc(g.name)}</span>
//       <span class="dp-grp-cnt">${g.tabs.length}</span>
//       <i class="fa-solid fa-chevron-down dp-grp-chev"></i>
//     </div>
//     <div class="dp-grp-body">
//       <div class="dp-sub-bar">
//         <label>
//           <div class="tog"><input type="checkbox" ${g.subgrouped?'checked':''} onchange="toggleSubgroup('${s.id}','${g.id}',this.checked)" onclick="event.stopPropagation()"/><div class="tog-track"></div></div>
//           Subgroup by domain
//         </label>
//         <span style="margin-left:auto;font-size:10px;color:var(--text3)">${g.subgrouped?'ON':'OFF'}</span>
//       </div>
//       ${renderDpTabs(s.id, g)}
//     </div>
//   </div>`;
// }

// function renderDpTabs(sid, g) {
//     if (!g.tabs.length) return '<div style="padding:10px 13px;font-size:11px;color:var(--text3)">No tabs in this group</div>';
//     if (!g.subgrouped) return g.tabs.map(t => dpTabRow(sid, g.id, t)).join('');
//     const byDomain = {};
//     g.tabs.forEach(t => {
//         const d = domain(t.url);
//         (byDomain[d] || (byDomain[d] = [])).push(t);
//     });
//     return Object.entries(byDomain).map(([d, tabs]) =>
//         `<div class="dp-subgrp-hd"><i class="fa-solid fa-globe"></i>${esc(d)}</div>${tabs.map(t => dpTabRow(sid, g.id, t)).join('')}`
//     ).join('');
// }

// function dpTabRow(sid, gid, t) {
//     return `<a class="dp-tab-row" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">
//     <img class="dp-tab-fav" src="${fav(t.url)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
//     <div class="dp-tab-fb" style="display:none"><i class="fa-solid fa-globe"></i></div>
//     <div class="dp-tab-info">
//       <div class="dp-tab-title">${esc(t.title || domain(t.url))}</div>
//       <div class="dp-tab-url">${esc(t.url)}</div>
//     </div>
//     <div class="dp-tab-acts" onclick="event.stopPropagation()">
//       <button class="dp-tact" onclick="copyURL('${esc(t.url)}')" title="Copy"><i class="fa-regular fa-copy"></i></button>
//       <button class="dp-tact del" onclick="deleteTabFromDetail('${sid}','${gid}','${t.id}')" title="Remove"><i class="fa-solid fa-xmark"></i></button>
//     </div>
//   </a>`;
// }

// function toggleDpGroup(sid, gid) {
//     const store = detailBucket === 'archived' ? DB.archived : detailBucket === 'trash' ? DB.trash : DB.sessions;
//     const s = store[sid];
//     if (!s) return;
//     s.groups[gid].collapsed = !s.groups[gid].collapsed;
//     saveLS();
//     renderDpBody(s);
// }

// function toggleSubgroup(sid, gid, val) {
//     const store = detailBucket === 'archived' ? DB.archived : detailBucket === 'trash' ? DB.trash : DB.sessions;
//     const s = store[sid];
//     if (!s || !s.groups[gid]) return;
//     s.groups[gid].subgrouped = val;
//     saveLS();
//     renderDpBody(s);
//     toast(val ? 'Tabs grouped by domain' : 'Subgrouping off', 'ok');
// }

// function deleteTabFromDetail(sid, gid, tid) {
//     const s = DB.sessions[sid];
//     if (!s) return;
//     s.groups[gid].tabs = s.groups[gid].tabs.filter(t => t.id !== tid);
//     saveLS();
//     renderDpBody(s);
//     refreshDpMeta(s);
//     renderLibrary();
//     renderSidebar();
//     toast('Tab removed', 'info');
// }

// function addGroupToCurrentDetail() {
//     if (!activeDpId) return;
//     modalMode = 'addgroup';
//     editSessionId = activeDpId;
//     document.getElementById('modal-t').textContent = 'Add Group';
//     document.getElementById('modal-d').textContent = 'Add a new tab group to the current session.';
//     document.getElementById('modal-save-lbl').textContent = 'Add Group';
//     document.getElementById('m-name').value = DB.sessions[activeDpId] ? .name || '';
//     document.getElementById('m-name').disabled = true;
//     document.getElementById('m-grp').value = '';
//     document.getElementById('m-urls').value = '';
//     document.getElementById('add-modal').classList.add('open');
// }


/* ─── detail.js ─── */
function openDetail(id, bucket) {
    bucket = bucket || 'live';
    activeDpId = id;
    detailBucket = bucket;
    const store = bucket === 'archived' ? DB.archived : bucket === 'trash' ? DB.trash : DB.sessions;
    const s = store[id];
    if (!s) return;
    document.getElementById('dp-icon').innerHTML = s.icon || '<i class="fa-solid fa-folder"></i>';
    document.getElementById('dp-name').textContent = s.name;
    refreshDpMeta(s);
    renderDpBody(s);
    document.getElementById('dp').classList.add('open');
}

function closeDetail() {
    document.getElementById('dp').classList.remove('open');
    activeDpId = null;
}
document.getElementById('dp').addEventListener('click', e => { if (e.target === e.currentTarget) closeDetail(); });

function refreshDpMeta(s) {
    const tc = totalTabs(s),
        gc = Object.keys(s.groups).length;
    document.getElementById('dp-meta').textContent = `${tc} tab${tc!==1?'s':''} · ${gc} group${gc!==1?'s':''}`;
}

function renderDpBody(s) {
    const el = document.getElementById('dp-body');
    if (!Object.keys(s.groups).length) {
        el.innerHTML = '<div class="empty-view" style="padding:40px"><i class="fa-solid fa-folder-open"></i><h3>No groups</h3><p>Add a group to this session.</p></div>';
        return;
    }
    el.innerHTML = Object.values(s.groups).map(g => dpGroup(s, g)).join('');
}

function dpGroup(s, g) {
    const col = g.color || s.color || '#0ea5a0';
    return `<div class="dp-group ${g.collapsed?'col':''}" id="dpg-${g.id}">
    <div class="dp-grp-hd" style="--gcc:${col}" onclick="toggleDpGroup('${s.id}','${g.id}')">
      <div class="dp-grp-dot" style="background:${col}"></div>
      <span class="dp-grp-name">${esc(g.name)}</span>
      <span class="dp-grp-cnt">${g.tabs.length}</span>
      <i class="fa-solid fa-chevron-down dp-grp-chev"></i>
    </div>
    <div class="dp-grp-body">
      <div class="dp-sub-bar">
        <label>
          <div class="tog"><input type="checkbox" ${g.subgrouped?'checked':''} onchange="toggleSubgroup('${s.id}','${g.id}',this.checked)" onclick="event.stopPropagation()"/><div class="tog-track"></div></div>
          Subgroup by domain
        </label>
        <span style="margin-left:auto;font-size:10px;color:var(--text3)">${g.subgrouped?'ON':'OFF'}</span>
      </div>
      ${renderDpTabs(s.id, g)}
    </div>
  </div>`;
}

function renderDpTabs(sid, g) {
    if (!g.tabs.length) return '<div style="padding:10px 13px;font-size:11px;color:var(--text3)">No tabs in this group</div>';
    if (!g.subgrouped) return g.tabs.map(t => dpTabRow(sid, g.id, t)).join('');
    const byDomain = {};
    g.tabs.forEach(t => {
        const d = domain(t.url);
        (byDomain[d] || (byDomain[d] = [])).push(t);
    });
    return Object.entries(byDomain).map(([d, tabs]) =>
        `<div class="dp-subgrp-hd"><i class="fa-solid fa-globe"></i>${esc(d)}</div>${tabs.map(t => dpTabRow(sid, g.id, t)).join('')}`
    ).join('');
}

function dpTabRow(sid, gid, t) {
    return `<a class="dp-tab-row" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">
    <img class="dp-tab-fav" src="${fav(t.url)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
    <div class="dp-tab-fb" style="display:none"><i class="fa-solid fa-globe"></i></div>
    <div class="dp-tab-info">
      <div class="dp-tab-title">${esc(t.title || domain(t.url))}</div>
      <div class="dp-tab-url">${esc(t.url)}</div>
    </div>
    <div class="dp-tab-acts" onclick="event.stopPropagation()">
      <button class="dp-tact" onclick="copyURL('${esc(t.url)}')" title="Copy"><i class="fa-regular fa-copy"></i></button>
      <button class="dp-tact del" onclick="deleteTabFromDetail('${sid}','${gid}','${t.id}')" title="Remove"><i class="fa-solid fa-xmark"></i></button>
    </div>
  </a>`;
}

function toggleDpGroup(sid, gid) {
    const store = detailBucket === 'archived' ? DB.archived : detailBucket === 'trash' ? DB.trash : DB.sessions;
    const s = store[sid];
    if (!s) return;
    s.groups[gid].collapsed = !s.groups[gid].collapsed;
    saveLS();
    renderDpBody(s);
}

function toggleSubgroup(sid, gid, val) {
    const store = detailBucket === 'archived' ? DB.archived : detailBucket === 'trash' ? DB.trash : DB.sessions;
    const s = store[sid];
    if (!s || !s.groups[gid]) return;
    s.groups[gid].subgrouped = val;
    saveLS();
    renderDpBody(s);
    toast(val ? 'Tabs grouped by domain' : 'Subgrouping off', 'ok');
}

function deleteTabFromDetail(sid, gid, tid) {
    const s = DB.sessions[sid];
    if (!s) return;
    s.groups[gid].tabs = s.groups[gid].tabs.filter(t => t.id !== tid);
    saveLS();
    renderDpBody(s);
    refreshDpMeta(s);
    renderLibrary();
    renderSidebar();
    toast('Tab removed', 'info');
}

function addGroupToCurrentDetail() {
    if (!activeDpId) return;
    modalMode = 'addgroup';
    editSessionId = activeDpId;
    document.getElementById('modal-t').textContent = 'Add Group';
    document.getElementById('modal-d').textContent = 'Add a new tab group to the current session.';
    document.getElementById('modal-save-lbl').textContent = 'Add Group';
    document.getElementById('m-name').value = DB.sessions[activeDpId]?.name || '';
    document.getElementById('m-name').disabled = true;
    document.getElementById('m-grp').value = '';
    document.getElementById('m-urls').value = '';
    document.getElementById('add-modal').classList.add('open');
}