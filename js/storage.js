/* ─── storage.js ─── */
function saveLS() {
    try {
        localStorage.setItem('tv5', JSON.stringify(DB));
        updateSyncTime();
    } catch (e) { toast('Storage full!', 'err'); }
}

function loadLS() {
    try {
        const raw = localStorage.getItem('tv5');
        if (!raw) return;
        const d = JSON.parse(raw);
        DB.sessions = d.sessions || {};
        DB.archived = d.archived || {};
        DB.trash = d.trash || {};
        DB.theme = d.theme || 'dark';
        DB.sortDesc = d.sortDesc !== undefined ? d.sortDesc : true;
    } catch (e) {}
}