// function createSession(name, gname, urls) {
//     const id = uid(),
//         gid = uid();
//     DB.sessions[id] = {
//         id,
//         name,
//         icon: pickedIcon,
//         color: '#0ea5a0',
//         ts: Date.now(),
//         groups: {
//             [gid]: mkGroup(gid, gname, urls)
//         }
//     };
//     saveLS();
//     renderAll();
//     toast(`"${name}" saved with ${urls.length} tabs`, 'ok');
// }

// function addGroupToSession(sid, gname, urls) {
//     const s = DB.sessions[sid];
//     if (!s) return;
//     const ex = Object.values(s.groups).find(g => g.name.toLowerCase() === gname.toLowerCase());
//     if (ex) { ex.tabs.push(...urls.map(mkTab)); } else {
//         const gid = uid();
//         s.groups[gid] = mkGroup(gid, gname, urls);
//     }
//     s.ts = Date.now();
//     saveLS();
//     renderAll();
//     updateSyncTime();
//     toast(`Group "${gname}" updated`, 'ok');
// }

// /* ── ARCHIVE ── */
// function archiveSession(id) {
//     const s = DB.sessions[id];
//     if (!s) return;
//     DB.archived[id] = {...s, archivedAt: Date.now() };
//     delete DB.sessions[id];
//     saveLS();
//     renderAll();
//     renderArchived();
//     toast(`"${s.name}" archived`, 'warn');
// }

// function restoreFromArchive(id) {
//     const s = DB.archived[id];
//     if (!s) return;
//     DB.sessions[id] = s;
//     delete DB.archived[id];
//     saveLS();
//     renderAll();
//     renderArchived();
//     toast(`"${s.name}" restored to Library`, 'ok');
// }

// function permDeleteArchived(id) {
//     const s = DB.archived[id];
//     if (!s) return;
//     confirm2(`Permanently delete "${s.name}"?`, 'This cannot be undone.', () => {
//         delete DB.archived[id];
//         saveLS();
//         renderArchived();
//         renderSidebar();
//         toast('Deleted permanently', 'err');
//     });
// }

// /* ── TRASH ── */
// function trashSession(id) {
//     const s = DB.sessions[id];
//     if (!s) return;
//     DB.trash[id] = {...s, deletedAt: Date.now() };
//     delete DB.sessions[id];
//     saveLS();
//     renderAll();
//     renderTrash();
//     toast(`"${s.name}" moved to Trash`, 'warn');
// }

// function restoreFromTrash(id) {
//     const s = DB.trash[id];
//     if (!s) return;
//     DB.sessions[id] = s;
//     delete DB.trash[id];
//     saveLS();
//     renderAll();
//     renderTrash();
//     toast(`"${s.name}" restored`, 'ok');
// }

// function permDeleteTrash(id) {
//     const s = DB.trash[id];
//     if (!s) return;
//     confirm2(`Permanently delete "${s.name}"?`, 'This cannot be undone.', () => {
//         delete DB.trash[id];
//         saveLS();
//         renderTrash();
//         renderSidebar();
//         toast('Deleted permanently', 'err');
//     });
// }

// function emptyTrash() {
//     const cnt = Object.keys(DB.trash).length;
//     if (!cnt) { toast('Trash is already empty', 'info'); return; }
//     confirm2('Empty Trash?', `This will permanently delete ${cnt} session${cnt!==1?'s':''}. Cannot be undone.`, () => {
//         DB.trash = {};
//         saveLS();
//         renderTrash();
//         renderSidebar();
//         toast('Trash emptied', 'err');
//     });
// }

// /* ── SHARE ── */
// function shareSession(id) {
//     const store = detailBucket === 'archived' ? DB.archived : detailBucket === 'trash' ? DB.trash : DB.sessions;
//     const s = store[id] || DB.sessions[id];
//     if (!s) return;
//     const tabs = allTabs(s);
//     const lines = [`📁 *${s.name}*`, `_${tabs.length} saved tabs_`, ''];
//     Object.values(s.groups).forEach(g => {
//         lines.push(`*${g.name}:*`);
//         g.tabs.forEach(t => lines.push(`• ${t.url}`));
//         lines.push('');
//     });
//     window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
// }



/* ─── session.js ─── */
function createSession(name, gname, urls) {
    const id = uid(),
        gid = uid();
    DB.sessions[id] = {
        id,
        name,
        icon: pickedIcon || ICONS[0],
        color: '#0ea5a0',
        ts: Date.now(),
        groups: {
            [gid]: mkGroup(gid, gname, urls)
        }
    };
    saveLS();
    renderAll();
    toast(`"${name}" saved with ${urls.length} tabs`, 'ok');
}

function addGroupToSession(sid, gname, urls) {
    const s = DB.sessions[sid];
    if (!s) return;
    const ex = Object.values(s.groups).find(g => g.name.toLowerCase() === gname.toLowerCase());
    if (ex) { ex.tabs.push(...urls.map(mkTab)); } else {
        const gid = uid();
        s.groups[gid] = mkGroup(gid, gname, urls);
    }
    s.ts = Date.now();
    saveLS();
    renderAll();
    updateSyncTime();
    toast(`Group "${gname}" updated`, 'ok');
}

/* ── ARCHIVE ── */
function archiveSession(id) {
    const s = DB.sessions[id];
    if (!s) return;
    DB.archived[id] = {...s, archivedAt: Date.now() };
    delete DB.sessions[id];
    saveLS();
    renderAll();
    renderArchived();
    toast(`"${s.name}" archived`, 'warn');
}

function restoreFromArchive(id) {
    const s = DB.archived[id];
    if (!s) return;
    DB.sessions[id] = s;
    delete DB.archived[id];
    saveLS();
    renderAll();
    renderArchived();
    toast(`"${s.name}" restored to Library`, 'ok');
}

function permDeleteArchived(id) {
    const s = DB.archived[id];
    if (!s) return;
    confirm2(`Permanently delete "${s.name}"?`, 'This cannot be undone.', () => {
        delete DB.archived[id];
        saveLS();
        renderArchived();
        renderSidebar();
        toast('Deleted permanently', 'err');
    });
}

/* ── TRASH ── */
function trashSession(id) {
    const s = DB.sessions[id];
    if (!s) return;
    DB.trash[id] = {...s, deletedAt: Date.now() };
    delete DB.sessions[id];
    saveLS();
    renderAll();
    renderTrash();
    toast(`"${s.name}" moved to Trash`, 'warn');
}

function restoreFromTrash(id) {
    const s = DB.trash[id];
    if (!s) return;
    DB.sessions[id] = s;
    delete DB.trash[id];
    saveLS();
    renderAll();
    renderTrash();
    toast(`"${s.name}" restored`, 'ok');
}

function permDeleteTrash(id) {
    const s = DB.trash[id];
    if (!s) return;
    confirm2(`Permanently delete "${s.name}"?`, 'This cannot be undone.', () => {
        delete DB.trash[id];
        saveLS();
        renderTrash();
        renderSidebar();
        toast('Deleted permanently', 'err');
    });
}

function emptyTrash() {
    const cnt = Object.keys(DB.trash).length;
    if (!cnt) { toast('Trash is already empty', 'info'); return; }
    confirm2('Empty Trash?', `This will permanently delete ${cnt} session${cnt!==1?'s':''}. Cannot be undone.`, () => {
        DB.trash = {};
        saveLS();
        renderTrash();
        renderSidebar();
        toast('Trash emptied', 'err');
    });
}

/* ── SHARE ── */
function shareSession(id) {
    const store = detailBucket === 'archived' ? DB.archived : detailBucket === 'trash' ? DB.trash : DB.sessions;
    const s = store[id] || DB.sessions[id];
    if (!s) return;
    const tabs = allTabs(s);
    const lines = [`📁 *${s.name}*`, `_${tabs.length} saved tabs_`, ''];
    Object.values(s.groups).forEach(g => {
        lines.push(`*${g.name}:*`);
        g.tabs.forEach(t => lines.push(`• ${t.url}`));
        lines.push('');
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
}