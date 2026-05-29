/* ═══════════════════════════════════════════
   SUBJECTS.JS — Subjects & Rooms Module
═══════════════════════════════════════════ */

const Subjects = (() => {
  let editingSubjectId = null;
  let editingRoomId    = null;

  /* ══════ SUBJECTS ══════ */

  function openSubjectModal(subject = null) {
    editingSubjectId = subject?.id || null;
    const i18n = typeof I18n !== 'undefined';
    document.getElementById('subject-modal-title').textContent = subject
      ? (i18n ? I18n.t('modal.editSubject') : 'Edit Subject')
      : (i18n ? I18n.t('modal.addSubject') : 'Add Subject');

    document.getElementById('sm-name').value      = subject?.name || '';
    document.getElementById('sm-code').value      = subject?.code || '';
    document.getElementById('sm-hours').value     = subject?.hoursPerWeek || 4;
    document.getElementById('sm-room-type').value = subject?.roomType || 'lecture';
    document.getElementById('sm-color').value     = subject?.color || '#6366f1';

    // Populate faculty dropdown
    const sel = document.getElementById('sm-faculty');
    const faculty = DB.getFaculty();
    const selectFacultyLabel = (typeof I18n !== 'undefined') ? I18n.t('modal.selectFaculty') : '-- Select Faculty --';
    sel.innerHTML = `<option value="">${selectFacultyLabel}</option>` +
      faculty.map(f => `<option value="${f.id}" ${f.id === subject?.facultyId ? 'selected' : ''}>${f.name}</option>`).join('');

    document.getElementById('subject-modal').classList.remove('hidden');
  }

  function saveSubject() {
    const name      = document.getElementById('sm-name').value.trim();
    const code      = document.getElementById('sm-code').value.trim();
    const hours     = parseInt(document.getElementById('sm-hours').value) || 4;
    const roomType  = document.getElementById('sm-room-type').value;
    const facultyId = document.getElementById('sm-faculty').value;
    const color     = document.getElementById('sm-color').value;

    if (!name) { showToast('Subject name is required', 'error'); return; }

    const subject = { name, code, hoursPerWeek: hours, roomType, facultyId, color };

    if (editingSubjectId) {
      subject.id = editingSubjectId;
      DB.updateSubject(subject);
      DB.logActivity(`Updated subject: ${name}`, 'info');
      showToast(`Subject "${name}" updated`, 'success');
    } else {
      DB.addSubject(subject);
      DB.logActivity(`Added subject: ${name}`, 'info');
      showToast(`Subject "${name}" added`, 'success');
    }

    closeSubjectModal();
    renderSubjects();
    App.updateDashboard();
  }

  function deleteSubject(id) {
    const s = DB.getSubjectById(id);
    if (!s || !confirm(`Delete subject "${s.name}"?`)) return;
    DB.deleteSubject(id);
    DB.logActivity(`Deleted subject: ${s.name}`, 'warn');
    showToast(`Subject "${s.name}" deleted`, 'warn');
    renderSubjects();
    App.updateDashboard();
  }

  function closeSubjectModal() {
    document.getElementById('subject-modal').classList.add('hidden');
    editingSubjectId = null;
  }

  function renderSubjects() {
    const list     = document.getElementById('subjects-list');
    const subjects = DB.getSubjects();
    const faculty  = DB.getFaculty();

    if (!subjects.length) {
      const emptyMsg = (typeof I18n !== 'undefined') ? I18n.t('subjects.emptySubjects') : 'No subjects yet';
      list.innerHTML = `<div class="empty-state-sm"><i data-lucide="book-open"></i><p>${emptyMsg}</p></div>`;
      lucide.createIcons({ nodes: [list] });
      return;
    }

    list.innerHTML = subjects.map(s => {
      const f    = faculty.find(x => x.id === s.facultyId);
      const icon = s.roomType === 'lab' ? 'monitor' : s.roomType === 'seminar' ? 'presentation' : 'book-open';
      return `
        <div class="item-card">
          <div class="item-color-dot" style="background:${s.color || '#6366f1'}"></div>
          <div class="item-info">
            <div class="item-name">${s.name} ${s.code ? `<span style="font-size:0.7rem;color:var(--text-muted)">(${s.code})</span>` : ''}</div>
            <div class="item-sub">
              ${s.hoursPerWeek}h/wk •
              <span class="badge badge-violet" style="font-size:0.65rem">${s.roomType}</span>
              ${f ? ` • ${f.name}` : ' • <span style="color:var(--red);font-size:0.75rem">No faculty</span>'}
            </div>
          </div>
          <div class="item-actions">
            <button class="icon-btn edit" onclick="Subjects.openSubjectModal(DB.getSubjectById('${s.id}'))"><i data-lucide="pencil"></i></button>
            <button class="icon-btn delete" onclick="Subjects.deleteSubject('${s.id}')"><i data-lucide="trash-2"></i></button>
          </div>
        </div>`;
    }).join('');
    lucide.createIcons({ nodes: [list] });
  }

  /* ══════ ROOMS ══════ */

  function openRoomModal(room = null) {
    editingRoomId = room?.id || null;
    const i18n = typeof I18n !== 'undefined';
    document.getElementById('room-modal-title').textContent = room
      ? (i18n ? I18n.t('modal.editRoom') : 'Edit Room')
      : (i18n ? I18n.t('modal.addRoom') : 'Add Classroom');

    document.getElementById('rm-name').value     = room?.name || '';
    document.getElementById('rm-capacity').value = room?.capacity || 60;
    document.getElementById('rm-type').value     = room?.type || 'lecture';

    document.getElementById('room-modal').classList.remove('hidden');
  }

  function saveRoom() {
    const name     = document.getElementById('rm-name').value.trim();
    const capacity = parseInt(document.getElementById('rm-capacity').value) || 60;
    const type     = document.getElementById('rm-type').value;

    if (!name) { showToast('Room name is required', 'error'); return; }

    const room = { name, capacity, type };

    if (editingRoomId) {
      room.id = editingRoomId;
      DB.updateRoom(room);
      showToast(`Room "${name}" updated`, 'success');
      DB.logActivity(`Updated room: ${name}`, 'info');
    } else {
      DB.addRoom(room);
      showToast(`Room "${name}" added`, 'success');
      DB.logActivity(`Added room: ${name}`, 'info');
    }

    closeRoomModal();
    renderRooms();
    App.updateDashboard();
  }

  function deleteRoom(id) {
    const r = DB.getRoomById(id);
    if (!r || !confirm(`Delete room "${r.name}"?`)) return;
    DB.deleteRoom(id);
    showToast(`Room "${r.name}" deleted`, 'warn');
    DB.logActivity(`Deleted room: ${r.name}`, 'warn');
    renderRooms();
    App.updateDashboard();
  }

  function closeRoomModal() {
    document.getElementById('room-modal').classList.add('hidden');
    editingRoomId = null;
  }

  function renderRooms() {
    const list  = document.getElementById('rooms-list');
    const rooms = DB.getRooms();

    if (!rooms.length) {
      const emptyMsg = (typeof I18n !== 'undefined') ? I18n.t('subjects.emptyRooms') : 'No rooms yet';
      list.innerHTML = `<div class="empty-state-sm"><i data-lucide="building-2"></i><p>${emptyMsg}</p></div>`;
      lucide.createIcons({ nodes: [list] });
      return;
    }

    const typeColors = { lecture: 'badge-violet', lab: 'badge-cyan', seminar: 'badge-amber' };
    const typeIcons  = { lecture: 'monitor', lab: 'cpu', seminar: 'presentation' };

    list.innerHTML = rooms.map(r => `
      <div class="item-card">
        <div class="stat-icon ${r.type === 'lab' ? 'cyan' : r.type === 'seminar' ? 'amber' : 'violet'}" style="width:40px;height:40px;flex-shrink:0">
          <i data-lucide="${typeIcons[r.type] || 'building-2'}"></i>
        </div>
        <div class="item-info">
          <div class="item-name">${r.name}</div>
          <div class="item-sub">
            <span class="badge ${typeColors[r.type] || 'badge-violet'}">${r.type}</span>
            • Capacity: ${r.capacity}
          </div>
        </div>
        <div class="item-actions">
          <button class="icon-btn edit" onclick="Subjects.openRoomModal(DB.getRoomById('${r.id}'))"><i data-lucide="pencil"></i></button>
          <button class="icon-btn delete" onclick="Subjects.deleteRoom('${r.id}')"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `).join('');
    lucide.createIcons({ nodes: [list] });
  }

  /* ── Init ── */
  function init() {
    document.getElementById('add-subject-btn')?.addEventListener('click', () => openSubjectModal());
    document.getElementById('add-room-btn')?.addEventListener('click', () => openRoomModal());
    document.getElementById('save-subject-btn')?.addEventListener('click', saveSubject);
    document.getElementById('save-room-btn')?.addEventListener('click', saveRoom);

    ['subject-modal','room-modal'].forEach(id => {
      document.querySelectorAll(`[data-modal="${id}"]`).forEach(btn => {
        btn.addEventListener('click', () => {
          document.getElementById(id).classList.add('hidden');
        });
      });
      document.getElementById(id)?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) document.getElementById(id).classList.add('hidden');
      });
    });
  }

  return { init, renderSubjects, renderRooms, openSubjectModal, openRoomModal, deleteSubject, deleteRoom };
})();
