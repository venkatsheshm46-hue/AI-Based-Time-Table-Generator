/* ═══════════════════════════════════════════
   SETTINGS.JS — Settings & User Management
═══════════════════════════════════════════ */

const Settings = (() => {
  let editingUserId = null;

  /* ── Load Settings into Form ── */
  function loadSettings() {
    const s = DB.getSettings();
    const el = id => document.getElementById(id);

    if (el('inst-name'))       el('inst-name').value       = s.institution || '';
    if (el('inst-semester'))   el('inst-semester').value   = s.semester || '';
    if (el('inst-year'))       el('inst-year').value       = s.year || '';
    if (el('period-duration')) el('period-duration').value = s.periodDuration || 50;

    renderPeriodTimings();
    renderUsers();
    updateSemesterBadge(s);
  }

  function updateSemesterBadge(s = null) {
    if (!s) s = DB.getSettings();
    const badge = document.getElementById('semester-badge');
    if (badge) badge.textContent = `${s.semester || 'Sem 1'} • ${s.year || '2024'}`;
  }

  /* ── Save Settings ── */
  function saveSettings() {
    const current = DB.getSettings();
    const updated = {
      ...current,
      institution:    document.getElementById('inst-name')?.value.trim() || 'My University',
      semester:       document.getElementById('inst-semester')?.value.trim() || 'Semester 1',
      year:           document.getElementById('inst-year')?.value.trim() || '2024',
      periodDuration: parseInt(document.getElementById('period-duration')?.value) || 50,
    };
    DB.saveSettings(updated);
    DB.logActivity('Settings updated', 'info');
    showToast('Settings saved!', 'success');
    updateSemesterBadge(updated);
  }

  /* ── Period Timings ── */
  function renderPeriodTimings() {
    const settings = DB.getSettings();
    const list     = document.getElementById('period-timings-list');
    if (!list) return;
    const timings  = settings.periodTimings || [];

    list.innerHTML = timings.map((t, i) => `
      <div class="period-item">
        <span style="font-size:0.8rem;color:var(--text-muted);min-width:24px">P${i+1}</span>
        <input type="text" class="form-input" value="${t}" data-idx="${i}" placeholder="09:00 - 09:50" />
        <button class="period-del" data-idx="${i}"><i data-lucide="x"></i></button>
      </div>`).join('');

    lucide.createIcons({ nodes: [list] });

    list.querySelectorAll('input[data-idx]').forEach(inp => {
      inp.addEventListener('change', () => {
        const s = DB.getSettings();
        s.periodTimings[inp.dataset.idx] = inp.value;
        DB.saveSettings(s);
      });
    });
    list.querySelectorAll('.period-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = DB.getSettings();
        s.periodTimings.splice(parseInt(btn.dataset.idx), 1);
        DB.saveSettings(s);
        renderPeriodTimings();
      });
    });
  }

  function addPeriod() {
    const s = DB.getSettings();
    s.periodTimings = s.periodTimings || [];
    const n = s.periodTimings.length;
    s.periodTimings.push(`${String(9 + n).padStart(2,'0')}:00 - ${String(9 + n).padStart(2,'0')}:50`);
    DB.saveSettings(s);
    renderPeriodTimings();
  }

  /* ── User Management ── */
  function renderUsers() {
    const container = document.getElementById('user-list');
    if (!container) return;
    const users = DB.getUsers();

    container.innerHTML = users.map(u => `
      <div class="user-item">
        <div class="user-item-avatar">${getInitials(u.name)}</div>
        <div class="user-item-info">
          <div class="user-item-name">${u.name} <span class="badge ${u.role === 'admin' ? 'badge-violet' : 'badge-cyan'}">${u.role}</span></div>
          <div class="user-item-email">${u.email}</div>
        </div>
        <div class="action-btns">
          <button class="icon-btn delete" onclick="Settings.deleteUser('${u.id}')" title="Delete User"><i data-lucide="trash-2"></i></button>
        </div>
      </div>`).join('');

    lucide.createIcons({ nodes: [container] });
  }

  function openUserModal() {
    editingUserId = null;
    document.getElementById('user-modal-title').textContent = 'Add User';
    document.getElementById('um-name').value     = '';
    document.getElementById('um-email').value    = '';
    document.getElementById('um-password').value = '';
    document.getElementById('um-role').value     = 'teacher';
    document.getElementById('user-modal').classList.remove('hidden');
  }

  function saveUser() {
    const name     = document.getElementById('um-name').value.trim();
    const email    = document.getElementById('um-email').value.trim();
    const password = document.getElementById('um-password').value;
    const role     = document.getElementById('um-role').value;

    if (!name || !email || !password) {
      showToast('All fields are required', 'error'); return;
    }

    // Check duplicate email
    const existing = DB.getUsers().find(u => u.email === email && u.id !== editingUserId);
    if (existing) { showToast('Email already exists', 'error'); return; }

    DB.addUser({ name, email, password, role });
    DB.logActivity(`Added user: ${name} (${role})`, 'info');
    showToast(`User "${name}" added`, 'success');
    closeUserModal();
    renderUsers();
  }

  function deleteUser(id) {
    const currentUser = Auth.currentUser();
    if (currentUser?.id === id) { showToast('Cannot delete your own account!', 'error'); return; }
    const users = DB.getUsers();
    const user  = users.find(u => u.id === id);
    if (!user || !confirm(`Delete user "${user.name}"?`)) return;
    DB.deleteUser(id);
    DB.logActivity(`Deleted user: ${user.name}`, 'warn');
    showToast(`User "${user.name}" deleted`, 'warn');
    renderUsers();
  }

  function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
    editingUserId = null;
  }

  /* ── Danger Zone ── */
  function clearAllData() {
    if (!confirm('⚠️ This will DELETE ALL data (faculty, subjects, rooms, schedule). Are you absolutely sure?')) return;
    if (!confirm('Second confirmation: This action CANNOT be undone. Continue?')) return;
    DB.clearAll();
    showToast('All data cleared', 'warn');
    App.updateDashboard();
    Faculty.render();
    Subjects.renderSubjects();
    Subjects.renderRooms();
    Workload.render();
    loadSettings();
  }

  function resetApp() {
    if (!confirm('Reset the entire app? All data and settings will be cleared.')) return;
    DB.clearAll();
    Auth.clearSession();
    window.location.reload();
  }

  /* ── Init ── */
  function init() {
    document.getElementById('save-general-btn')?.addEventListener('click', saveSettings);
    document.getElementById('add-period-btn')?.addEventListener('click', addPeriod);
    document.getElementById('add-user-btn')?.addEventListener('click', openUserModal);
    document.getElementById('save-user-btn')?.addEventListener('click', saveUser);
    document.getElementById('clear-all-btn')?.addEventListener('click', clearAllData);
    document.getElementById('reset-app-btn')?.addEventListener('click', resetApp);

    document.querySelectorAll('[data-modal="user-modal"]').forEach(btn => {
      btn.addEventListener('click', closeUserModal);
    });
    document.getElementById('user-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeUserModal();
    });
  }

  return { init, loadSettings, renderUsers, openUserModal, deleteUser, saveUser };
})();
