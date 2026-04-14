// const TAB_STAGGER = 120;

// function openAllTabs(id, bucket) {
//     bucket = bucket || detailBucket || 'live';
//     const store = bucket === 'archived' ? DB.archived : bucket === 'trash' ? DB.trash : DB.sessions;
//     const s = store[id] || DB.sessions[id];
//     if (!s) return;

//     const tabs = allTabs(s);
//     if (!tabs.length) { toast('No tabs in this session', 'warn'); return; }

//     /* Open the first tab immediately (user gesture context — no blocker) */
//     const first = window.open(tabs[0].url, '_blank');

//     /* If even the first tab was blocked, browser has strict popup blocking.
//        Show the allow-popups guide and bail out. */
//     if (!first) {
//         showPopupModal();
//         return;
//     }

//     /* Open the rest with a small stagger so the browser doesn't throttle */
//     tabs.slice(1).forEach((t, i) => {
//         setTimeout(() => {
//             const w = window.open(t.url, '_blank');
//             /* If a later tab is blocked mid-sequence, show the guide once */
//             if (!w && i === 0) showPopupModal();
//         }, TAB_STAGGER * (i + 1));
//     });

//     toast(`Opening ${tabs.length} tab${tabs.length !== 1 ? 's' : ''}…`, 'ok');
// }

// /* ── POPUP BLOCKED GUIDE MODAL ── */
// function showPopupModal() {
//     document.getElementById('popup-modal').classList.add('open');
// }

// function closePopupModal() {
//     document.getElementById('popup-modal').classList.remove('open');
// }

// document.getElementById('popup-modal').addEventListener('click', e => {
//     if (e.target === e.currentTarget) closePopupModal();
// });



/* ─── tabs.js ─── */
const TAB_STAGGER = 120;

function openAllTabs(id, bucket) {
    bucket = bucket || detailBucket || 'live';
    const store = bucket === 'archived' ? DB.archived : bucket === 'trash' ? DB.trash : DB.sessions;
    const s = store[id] || DB.sessions[id];
    if (!s) return;

    const tabs = allTabs(s);
    if (!tabs.length) { toast('No tabs in this session', 'warn'); return; }

    /* Open the first tab immediately (user gesture context — no blocker) */
    const first = window.open(tabs[0].url, '_blank');

    /* If even the first tab was blocked, browser has strict popup blocking.
       Show the allow-popups guide and bail out. */
    if (!first) {
        showPopupModal();
        return;
    }

    /* Open the rest with a small stagger so the browser doesn't throttle */
    tabs.slice(1).forEach((t, i) => {
        setTimeout(() => {
            const w = window.open(t.url, '_blank');
            /* If a later tab is blocked mid-sequence, show the guide once */
            if (!w && i === 0) showPopupModal();
        }, TAB_STAGGER * (i + 1));
    });

    toast(`Opening ${tabs.length} tab${tabs.length !== 1 ? 's' : ''}…`, 'ok');
}

/* ── POPUP BLOCKED GUIDE MODAL ── */
function showPopupModal() {
    document.getElementById('popup-modal').classList.add('open');
}

function closePopupModal() {
    document.getElementById('popup-modal').classList.remove('open');
}

document.getElementById('popup-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closePopupModal();
});