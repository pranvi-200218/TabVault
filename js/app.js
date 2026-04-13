function boot() {
    loadLS();
    buildIconRow();
    applyTheme();
    updateSyncTime();
    renderAll();
}

function launch() {
    const l = document.getElementById('landing');
    l.classList.add('out');
    setTimeout(() => {
        l.style.display = 'none';
        document.getElementById('app').classList.add('show');
        boot();
    }, 460);
}

function goHome() {
    document.getElementById('app').classList.remove('show');
    const l = document.getElementById('landing');
    l.style.display = 'flex';
    setTimeout(() => l.classList.remove('out'), 20);
}

function toggleTheme() {
    DB.theme = DB.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveLS();
}

function applyTheme() {
    document.body.classList.toggle('light', DB.theme === 'light');
    document.getElementById('themeBtn').innerHTML = DB.theme === 'light' ?
        '<i class="fa-solid fa-moon"></i>' :
        '<i class="fa-solid fa-sun"></i>';
}

function switchView(v, btn) {
    currentView = v;
    document.querySelectorAll('.top-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.getElementById('view-' + v) ? .classList.add('active');
    if (v === 'workspaces') renderWorkspaces();
    if (v === 'library') renderLibrary();
}

function showSbSection(section) {
    document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const viewMap = { library: 'library', archived: 'archived', trash: 'trash' };
    if (viewMap[section]) {
        currentView = section;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-' + section).classList.add('active');
        if (section === 'library') {
            document.querySelectorAll('.top-tab').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-view="library"]').classList.add('active');
            renderLibrary();
        } else if (section === 'archived') {
            renderArchived();
        } else if (section === 'trash') {
            renderTrash();
        }
    }
}

function toggleSort() {
    DB.sortDesc = !DB.sortDesc;
    document.getElementById('sort-lbl').textContent = DB.sortDesc ? 'Recent' : 'Oldest';
    renderLibrary();
    saveLS();
}