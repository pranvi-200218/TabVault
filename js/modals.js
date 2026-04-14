/* ─── modals.js ─── */
function openAddModal() {
    modalMode = 'add';
    editSessionId = null;
    document.getElementById('modal-t').textContent = 'Save New Session';
    document.getElementById('modal-d').textContent = "Add URLs below and they'll be grouped into this session.";
    document.getElementById('modal-save-lbl').textContent = 'Save Session';
    document.getElementById('m-name').value = '';
    document.getElementById('m-name').disabled = false;
    document.getElementById('m-grp').value = '';
    document.getElementById('m-urls').value = '';
    document.getElementById('add-modal').classList.add('open');
}

function closeAddModal() {
    document.getElementById('add-modal').classList.remove('open');
    document.getElementById('m-name').disabled = false;
}
document.getElementById('add-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAddModal();
});

function saveSessionModal() {
    const name = document.getElementById('m-name').value.trim();
    const grp = document.getElementById('m-grp').value.trim() || 'General';
    const urls = parseURLs(document.getElementById('m-urls').value);
    if (!name) { toast('Please enter a session name', 'err'); return; }
    if (!urls.length) { toast('Please enter at least one URL', 'err'); return; }
    if (modalMode === 'addgroup') {
        addGroupToSession(editSessionId, grp, urls);
        closeAddModal();
        return;
    }
    const dup = Object.values(DB.sessions).find(s => s.name.toLowerCase() === name.toLowerCase());
    if (dup) { showDupModal(dup, name, grp, urls); return; }
    createSession(name, grp, urls);
    closeAddModal();
}

/* ── DUPLICATE MODAL ── */
function showDupModal(dup, name, gname, urls) {
    pendingDup = { dup, name, gname, urls };
    document.getElementById('dup-t').textContent = `"${name}" already exists`;
    document.getElementById('dup-d').textContent = 'Choose how to handle the duplicate:';
    document.getElementById('dup-opts').innerHTML = `
    <div class="dup-opt" onclick="dupChoice('merge')"><div class="dup-opt-t">➕ Add group to existing</div><div class="dup-opt-d">Merge "${gname}" into "${name}"</div></div>
    <div class="dup-opt" onclick="dupChoice('replace')"><div class="dup-opt-t">🔄 Replace session</div><div class="dup-opt-d">Delete old and save fresh</div></div>
    <div class="dup-opt" onclick="dupChoice('keep')"><div class="dup-opt-t">📋 Keep both</div><div class="dup-opt-d">Save as "${name} (2)"</div></div>`;
    closeAddModal();
    document.getElementById('dup-modal').classList.add('open');
}

function closeDupModal() {
    document.getElementById('dup-modal').classList.remove('open');
    pendingDup = null;
}
document.getElementById('dup-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDupModal();
});

function dupChoice(action) {
    const { dup, name, gname, urls } = pendingDup;
    if (action === 'merge') addGroupToSession(dup.id, gname, urls);
    else if (action === 'replace') {
        delete DB.sessions[dup.id];
        createSession(name, gname, urls);
    } else createSession(name + ' (2)', gname, urls);
    closeDupModal();
}

function buildIconRow() {
    document.getElementById('icon-row').innerHTML = ICONS.map((ic, i) =>
        `<div class="icon-opt${i===0?' on':''}" onclick="pickIcon(${i},this)">${ic}</div>`
    ).join('');
}

function pickIcon(idx, el) {
    pickedIcon = ICONS[idx];
    document.querySelectorAll('.icon-opt').forEach(e => e.classList.remove('on'));
    el.classList.add('on');
}

function confirm2(title, desc, onOk) {
    document.getElementById('conf-t').textContent = title;
    document.getElementById('conf-d').textContent = desc;
    const acts = document.getElementById('conf-acts');
    acts.innerHTML = '';
    const cancel = document.createElement('button');
    cancel.className = 'btn btn-s';
    cancel.textContent = 'Cancel';
    cancel.onclick = closeConf;
    acts.appendChild(cancel);
    const ok = document.createElement('button');
    ok.className = 'btn btn-d';
    ok.textContent = 'Delete';
    ok.onclick = () => {
        onOk();
        closeConf();
    };
    acts.appendChild(ok);
    document.getElementById('conf-modal').classList.add('open');
}

function closeConf() { document.getElementById('conf-modal').classList.remove('open'); }
document.getElementById('conf-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeConf();
});