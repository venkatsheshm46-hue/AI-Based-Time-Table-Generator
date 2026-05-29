/* ═══════════════════════════════════════════
   FACULTY.JS — Faculty Management Module
═══════════════════════════════════════════ */

const Faculty = (() => {
  let editingId = null;
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];
  let periodsCount = 6;

  /* ── Availability Grid Builder ── */
  function buildAvailGrid(container, availability = {}) {
    const settings = DB.getSettings();
    periodsCount = settings.periodsPerDay || 6;
    const timings = settings.periodTimings || [];

    const headers = Array.from({ length: periodsCount }, (_, i) => timings[i] || `P${i + 1}`);

    let html = `<table class="avail-table"><thead><tr><th>Day</th>`;
    headers.forEach(h => { html += `<th>${h}</th>`; });
    html += `</tr></thead><tbody>`;

    DAYS.forEach(day => {
      html += `<tr><td class="avail-row-label">${day}</td>`;
      for (let p = 0; p < periodsCount; p++) {
        const key = `${day}-P${p + 1}`;
        const isAvail = availability[key] !== false; // default available
        html += `<td><div class="avail-cell ${isAvail ? 'available' : ''}" data-key="${key}" title="${day} Period ${p + 1}"></div></td>`;
      }
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    container.querySelectorAll('.avail-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        cell.classList.toggle('available');
      });
    });
  }

  function getAvailFromGrid(container) {
    const avail = {};
    container.querySelectorAll('.avail-cell').forEach(cell => {
      avail[cell.dataset.key] = cell.classList.contains('available');
    });
    return avail;
  }

  /* ── Open Modal ── */
  function openModal(faculty = null) {
    editingId = faculty ? faculty.id : null;
    const title = document.getElementById('faculty-modal-title');
    const i18n = typeof I18n !== 'undefined';
    title.textContent = faculty
      ? (i18n ? I18n.t('modal.editFaculty') : 'Edit Faculty')
      : (i18n ? I18n.t('modal.addFaculty') : 'Add Faculty');

    document.getElementById('fm-name').value     = faculty?.name || '';
    document.getElementById('fm-email').value    = faculty?.email || '';
    document.getElementById('fm-dept').value     = faculty?.department || '';
    document.getElementById('fm-hours').value    = faculty?.maxHours || 18;
    document.getElementById('fm-subjects').value = faculty?.expertise?.join(', ') || '';

    const grid = document.getElementById('fm-avail-grid');
    buildAvailGrid(grid, faculty?.availability || {});

    document.getElementById('faculty-modal').classList.remove('hidden');
  }

  /* ── Save Faculty ── */
  function saveFaculty() {
    const name = document.getElementById('fm-name').value.trim();
    const email = document.getElementById('fm-email').value.trim();
    const dept  = document.getElementById('fm-dept').value.trim();
    const hours = parseInt(document.getElementById('fm-hours').value) || 18;
    const exp   = document.getElementById('fm-subjects').value.split(',').map(s => s.trim()).filter(Boolean);
    const avail = getAvailFromGrid(document.getElementById('fm-avail-grid'));

    if (!name) { showToast('Faculty name is required', 'error'); return; }
    if (!dept)  { showToast('Department is required', 'error'); return; }

    const faculty = { name, email, department: dept, maxHours: hours, expertise: exp, availability: avail };

    if (editingId) {
      faculty.id = editingId;
      DB.updateFaculty(faculty);
      DB.logActivity(`Updated faculty: ${name}`, 'info');
      showToast(`Faculty "${name}" updated`, 'success');
    } else {
      DB.addFaculty(faculty);
      DB.logActivity(`Added faculty: ${name}`, 'info');
      showToast(`Faculty "${name}" added`, 'success');
    }

    closeModal();
    render();
    App.updateDashboard();
  }

  function closeModal() {
    document.getElementById('faculty-modal').classList.add('hidden');
    editingId = null;
  }

  /* ── Delete ── */
  function deleteFaculty(id) {
    const f = DB.getFacultyById(id);
    if (!f) return;
    if (!confirm(`Delete faculty "${f.name}"? This cannot be undone.`)) return;
    DB.deleteFaculty(id);
    DB.logActivity(`Deleted faculty: ${f.name}`, 'warn');
    showToast(`Faculty "${f.name}" deleted`, 'warn');
    render();
    App.updateDashboard();
  }

  /* ── Render Table ── */
  function render() {
    const faculty = DB.getFaculty();
    const tbody   = document.getElementById('faculty-tbody');
    const search  = (document.getElementById('faculty-search')?.value || '').toLowerCase();
    const filter  = document.getElementById('faculty-filter')?.value || 'all';

    // Update department filter
    const depts = [...new Set(faculty.map(f => f.department).filter(Boolean))];
    const filterSel = document.getElementById('faculty-filter');
    const prevVal = filterSel?.value;
    if (filterSel) {
      const allLabel = (typeof I18n !== 'undefined') ? I18n.t('faculty.allDepts') : 'All Departments';
      filterSel.innerHTML = `<option value="all">${allLabel}</option>` +
        depts.map(d => `<option value="${d}" ${d === prevVal ? 'selected' : ''}>${d}</option>`).join('');
    }

    const filtered = faculty.filter(f => {
      const matchSearch = !search || f.name.toLowerCase().includes(search) || f.department?.toLowerCase().includes(search);
      const matchFilter = filter === 'all' || f.department === filter;
      return matchSearch && matchFilter;
    });

    if (!filtered.length) {
      const emptyMsg = (typeof I18n !== 'undefined')
        ? (faculty.length ? 'No matching faculty found.' : I18n.t('faculty.empty'))
        : (faculty.length ? 'No matching faculty found.' : 'No faculty added yet. Click "Add Faculty" to get started.');
      tbody.innerHTML = `<tr><td colspan="6" class="empty-cell"><div class="empty-state-sm"><i data-lucide="users"></i><p>${emptyMsg}</p></div></td></tr>`;
      lucide.createIcons({ nodes: [tbody] });
      return;
    }

    const schedule = DB.getSchedule();
    // Count assigned hours per faculty
    const hoursMap = {};
    Object.values(schedule).forEach(classSchedule => {
      if (typeof classSchedule !== 'object') return;
      Object.values(classSchedule).forEach(daySlots => {
        if (typeof daySlots !== 'object') return;
        Object.values(daySlots).forEach(slot => {
          if (slot && slot.facultyId) {
            hoursMap[slot.facultyId] = (hoursMap[slot.facultyId] || 0) + 1;
          }
        });
      });
    });

    tbody.innerHTML = filtered.map(f => {
      const assigned = hoursMap[f.id] || 0;
      const pct = Math.min(100, Math.round((assigned / (f.maxHours || 1)) * 100));
      const statusColor = pct > 100 ? 'red' : pct > 85 ? 'amber' : 'green';
      const availCount = Object.values(f.availability || {}).filter(Boolean).length;
      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:0.625rem">
              <div class="user-avatar" style="width:32px;height:32px;font-size:0.75rem;flex-shrink:0">${getInitials(f.name)}</div>
              <div>
                <div class="faculty-name">${f.name}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${f.email || ''}</div>
              </div>
            </div>
          </td>
          <td>${f.department || '-'}</td>
          <td>
            <div style="display:flex;flex-wrap:wrap;gap:0.25rem">
              ${(f.expertise || []).slice(0, 3).map(e => `<span class="badge badge-violet">${e}</span>`).join('')}
              ${f.expertise?.length > 3 ? `<span class="badge" style="background:rgba(255,255,255,0.05)">+${f.expertise.length - 3}</span>` : ''}
            </div>
          </td>
          <td>
            <div style="font-size:0.875rem"><strong>${assigned}</strong><span style="color:var(--text-muted)">/${f.maxHours}</span></div>
            <div style="height:4px;border-radius:2px;background:rgba(255,255,255,0.08);margin-top:4px;overflow:hidden;width:80px">
              <div style="height:100%;width:${pct}%;background:var(--${statusColor === 'green' ? 'green' : statusColor === 'amber' ? 'amber' : 'red'});border-radius:2px;transition:width 0.5s"></div>
            </div>
          </td>
          <td>
            <span class="badge ${availCount > 20 ? 'badge-green' : availCount > 10 ? 'badge-amber' : 'badge-red'}">
              ${availCount} slots
            </span>
          </td>
          <td>
            <div class="action-btns">
              <button class="icon-btn edit" title="Edit" onclick="Faculty.openModal(DB.getFacultyById('${f.id}'))"><i data-lucide="pencil"></i></button>
              <button class="icon-btn avail" title="View Availability" onclick="Faculty.openModal(DB.getFacultyById('${f.id}'))"><i data-lucide="calendar"></i></button>
              <button class="icon-btn delete" title="Delete" onclick="Faculty.deleteFaculty('${f.id}')"><i data-lucide="trash-2"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('');

    lucide.createIcons({ nodes: [tbody] });
  }

  /* ── Init ── */
  function init() {
    document.getElementById('add-faculty-btn')?.addEventListener('click', () => openModal());
    document.getElementById('save-faculty-btn')?.addEventListener('click', saveFaculty);
    document.getElementById('faculty-search')?.addEventListener('input', render);
    document.getElementById('faculty-filter')?.addEventListener('change', render);

    // Modal close buttons
    document.querySelectorAll('[data-modal="faculty-modal"]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
    document.getElementById('faculty-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  return { init, render, openModal, deleteFaculty };
})();
