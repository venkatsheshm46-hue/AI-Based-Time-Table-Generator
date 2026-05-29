/* ═══════════════════════════════════════════
   TIMETABLE.JS — Grid Display + Drag & Edit
═══════════════════════════════════════════ */

const TimetableView = (() => {
  let currentView   = 'class'; // class | faculty | room
  let currentFilter = '';
  let slotEditCtx   = null;   // { className, day, period }
  let dragSource    = null;   // { className, day, period, slot }

  /* ── Filter Select ── */
  function populateFilterSelect() {
    const sel      = document.getElementById('tt-filter-select');
    const schedule = DB.getSchedule();
    const faculty  = DB.getFaculty();
    const rooms    = DB.getRooms();

    let options = [];
    if (currentView === 'class') {
      options = DB.getClasses().filter(c => schedule[c]);
      if (!options.length) options = Object.keys(schedule);
    } else if (currentView === 'faculty') {
      options = faculty.map(f => ({ id: f.id, label: f.name }));
    } else {
      options = rooms.map(r => ({ id: r.id, label: r.name }));
    }

    if (!sel) return;

    if (Array.isArray(options) && typeof options[0] === 'object') {
      sel.innerHTML = options.map(o => `<option value="${o.id}">${o.label}</option>`).join('');
    } else {
      sel.innerHTML = options.map(o => `<option value="${o}">${o}</option>`).join('');
    }

    currentFilter = sel.value;
  }

  /* ── Render Grid ── */
  function render() {
    const schedule = DB.getSchedule();
    const settings = DB.getSettings();
    const days     = settings.workingDays || ['Mon','Tue','Wed','Thu','Fri'];
    const periods  = settings.periodsPerDay || 6;
    const timings  = settings.periodTimings || [];

    const emptyEl = document.getElementById('tt-empty');
    const gridEl  = document.getElementById('timetable-grid-container');

    const hasData = Object.keys(schedule).length > 0;
    if (!hasData) {
      emptyEl?.classList.remove('hidden');
      gridEl?.classList.add('hidden');
      return;
    }

    emptyEl?.classList.add('hidden');
    gridEl?.classList.remove('hidden');

    if (currentView === 'class') {
      renderClassView(schedule, days, periods, timings);
    } else if (currentView === 'faculty') {
      renderFacultyView(schedule, days, periods, timings);
    } else {
      renderRoomView(schedule, days, periods, timings);
    }
  }

  /* ── Class View ── */
  function renderClassView(schedule, days, periods, timings) {
    const gridEl  = document.getElementById('timetable-grid-container');
    const cls     = currentFilter;
    const clsData = schedule[cls];

    if (!clsData) {
      gridEl.innerHTML = `<div class="empty-state-sm"><i data-lucide="calendar-x"></i><p>No data for "${cls}"</p></div>`;
      lucide.createIcons({ nodes: [gridEl] });
      return;
    }

    let html = buildGridHTML(days, periods, timings, (day, p) => {
      const slot = clsData[day]?.[p];
      return renderSlot(slot, day, p, cls);
    });

    gridEl.innerHTML = html;
    attachSlotEvents(gridEl, (day, p) => openSlotEdit(cls, day, p));
  }

  /* ── Faculty View ── */
  function renderFacultyView(schedule, days, periods, timings) {
    const gridEl    = document.getElementById('timetable-grid-container');
    const facultyId = currentFilter;

    let html = buildGridHTML(days, periods, timings, (day, p) => {
      // Find slot where this faculty is assigned
      for (const [cls, clsData] of Object.entries(schedule)) {
        const slot = clsData[day]?.[p];
        if (slot && slot.facultyId === facultyId) {
          return renderSlot(slot, day, p, cls, true);
        }
      }
      return `<div class="tt-slot empty" data-day="${day}" data-period="${p}"></div>`;
    });

    gridEl.innerHTML = html;
    lucide.createIcons({ nodes: [gridEl] });
  }

  /* ── Room View ── */
  function renderRoomView(schedule, days, periods, timings) {
    const gridEl = document.getElementById('timetable-grid-container');
    const roomId = currentFilter;

    let html = buildGridHTML(days, periods, timings, (day, p) => {
      for (const [cls, clsData] of Object.entries(schedule)) {
        const slot = clsData[day]?.[p];
        if (slot && slot.roomId === roomId) {
          return renderSlot(slot, day, p, cls, false, true);
        }
      }
      return `<div class="tt-slot empty" data-day="${day}" data-period="${p}"></div>`;
    });

    gridEl.innerHTML = html;
    lucide.createIcons({ nodes: [gridEl] });
  }

  /* ── Grid HTML Builder ── */
  function buildGridHTML(days, periods, timings, cellFn) {
    // Period headers
    let html = `<table class="tt-grid"><thead><tr><th>Day / Period</th>`;
    for (let p = 1; p <= periods; p++) {
      html += `<th>P${p}<br><span style="font-weight:400;font-size:0.65rem;color:var(--text-muted)">${timings[p-1] || ''}</span></th>`;
    }
    html += `</tr></thead><tbody>`;

    days.forEach(day => {
      html += `<tr><td class="day-label">${day}</td>`;
      for (let p = 1; p <= periods; p++) {
        html += `<td>${cellFn(day, p)}</td>`;
      }
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    return html;
  }

  /* ── Slot Renderer ── */
  function renderSlot(slot, day, p, className, showClass = false, showFaculty = true) {
    if (!slot) {
      return `<div class="tt-slot empty" data-day="${day}" data-period="${p}" data-class="${className}" draggable="false"></div>`;
    }

    const subject = DB.getSubjectById(slot.subjectId);
    const faculty = DB.getFacultyById(slot.facultyId);
    const room    = DB.getRoomById(slot.roomId);

    const bg    = subject?.color || '#6366f1';
    const alpha = hexToRgba(bg, 0.25);
    const border = hexToRgba(bg, 0.5);

    return `
      <div class="tt-slot filled"
        style="background:${alpha};border:1px solid ${border};color:white"
        data-day="${day}" data-period="${p}" data-class="${className}"
        draggable="true"
        title="${subject?.name || ''} | ${faculty?.name || ''} | ${room?.name || ''}">
        <div class="slot-subject">${subject?.name || 'Unknown'}</div>
        ${showClass  ? `<div class="slot-faculty" style="color:rgba(255,255,255,0.8)">${className}</div>` : ''}
        ${showFaculty && faculty ? `<div class="slot-faculty">${faculty.name}</div>` : ''}
        <div class="slot-room">${room?.name || ''}</div>
      </div>`;
  }

  /* ── Slot Events ── */
  function attachSlotEvents(container, clickFn) {
    lucide.createIcons({ nodes: [container] });

    container.querySelectorAll('.tt-slot').forEach(slotEl => {
      const day    = slotEl.dataset.day;
      const period = parseInt(slotEl.dataset.period);
      const cls    = slotEl.dataset.class;

      // Click to edit
      slotEl.addEventListener('click', () => {
        if (cls && day && period) clickFn(day, period);
      });

      // Drag & Drop
      if (slotEl.draggable) {
        slotEl.addEventListener('dragstart', (e) => {
          const schedule = DB.getSchedule();
          dragSource = { className: cls, day, period, slot: schedule[cls]?.[day]?.[period] };
          e.dataTransfer.effectAllowed = 'move';
          slotEl.style.opacity = '0.5';
        });
        slotEl.addEventListener('dragend', () => { slotEl.style.opacity = ''; });
      }

      slotEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        slotEl.classList.add('drag-over');
      });
      slotEl.addEventListener('dragleave', () => slotEl.classList.remove('drag-over'));
      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('drag-over');
        if (!dragSource) return;
        handleDrop(cls, day, period, slotEl);
      });
    });
  }

  /* ── Drag Drop Handler ── */
  function handleDrop(targetClass, targetDay, targetPeriod, targetEl) {
    if (!dragSource) return;
    const { className: srcClass, day: srcDay, period: srcPeriod, slot: srcSlot } = dragSource;
    if (srcClass === targetClass && srcDay === targetDay && srcPeriod === targetPeriod) return;

    const schedule = DB.getSchedule();
    const targetSlot = schedule[targetClass]?.[targetDay]?.[targetPeriod];

    // Clash check for the source slot moving to target
    if (srcSlot) {
      const clashes = Scheduler.hasClash(schedule, targetClass, targetDay, targetPeriod,
        srcSlot.subjectId, srcSlot.facultyId, srcSlot.roomId, srcClass);
      if (clashes.length) {
        showToast(`Clash: ${clashes[0]}`, 'error');
        dragSource = null;
        return;
      }
    }

    // Swap or move
    schedule[targetClass][targetDay][targetPeriod] = srcSlot || null;
    schedule[srcClass][srcDay][srcPeriod] = targetSlot || null;

    DB.setSchedule(schedule);
    DB.logActivity(`Moved slot: ${srcClass} ${srcDay} P${srcPeriod} → ${targetClass} ${targetDay} P${targetPeriod}`, 'info');
    showToast('Slot moved successfully', 'success');
    dragSource = null;
    render();
    Workload.render();
  }

  /* ── Slot Edit Modal ── */
  function openSlotEdit(className, day, period) {
    slotEditCtx = { className, day, period };
    const schedule = DB.getSchedule();
    const slot     = schedule[className]?.[day]?.[period];
    const subjects = DB.getSubjects();
    const faculty  = DB.getFaculty();
    const rooms    = DB.getRooms();
    const settings = DB.getSettings();
    const timings  = settings.periodTimings || [];

    document.getElementById('slot-context').innerHTML = `
      <strong>${className}</strong> · ${day} · Period ${period}
      ${timings[period - 1] ? ` · <span style="color:var(--text-muted)">${timings[period - 1]}</span>` : ''}
    `;

    // Populate selects
    const subjectSel = document.getElementById('slot-subject');
    subjectSel.innerHTML = '<option value="">-- Free Slot --</option>' +
      subjects.map(s => `<option value="${s.id}" ${s.id === slot?.subjectId ? 'selected' : ''}>${s.name}</option>`).join('');

    const facultySel = document.getElementById('slot-faculty');
    facultySel.innerHTML = '<option value="">-- No Faculty --</option>' +
      faculty.map(f => `<option value="${f.id}" ${f.id === slot?.facultyId ? 'selected' : ''}>${f.name}</option>`).join('');

    const roomSel = document.getElementById('slot-room');
    roomSel.innerHTML = '<option value="">-- No Room --</option>' +
      rooms.map(r => `<option value="${r.id}" ${r.id === slot?.roomId ? 'selected' : ''}>${r.name} (${r.type})</option>`).join('');

    document.getElementById('slot-clash-warn').classList.add('hidden');

    // Live clash check
    [subjectSel, facultySel, roomSel].forEach(sel => {
      sel.addEventListener('change', checkClashLive);
    });

    document.getElementById('slot-modal').classList.remove('hidden');
  }

  function checkClashLive() {
    if (!slotEditCtx) return;
    const { className, day, period } = slotEditCtx;
    const facultyId = document.getElementById('slot-faculty').value;
    const roomId    = document.getElementById('slot-room').value;
    const subjectId = document.getElementById('slot-subject').value;
    const schedule  = DB.getSchedule();

    const clashes = Scheduler.hasClash(schedule, className, day, period, subjectId, facultyId, roomId, className);
    const warnEl  = document.getElementById('slot-clash-warn');
    const msgEl   = document.getElementById('slot-clash-msg');

    if (clashes.length) {
      msgEl.textContent = clashes[0];
      warnEl.classList.remove('hidden');
    } else {
      warnEl.classList.add('hidden');
    }
  }

  function saveSlotEdit() {
    if (!slotEditCtx) return;
    const { className, day, period } = slotEditCtx;
    const subjectId = document.getElementById('slot-subject').value;
    const facultyId = document.getElementById('slot-faculty').value;
    const roomId    = document.getElementById('slot-room').value;

    const schedule = DB.getSchedule();
    if (!schedule[className]) schedule[className] = {};
    if (!schedule[className][day]) schedule[className][day] = {};

    if (!subjectId) {
      schedule[className][day][period] = null;
    } else {
      const clashes = Scheduler.hasClash(schedule, className, day, period, subjectId, facultyId, roomId, className);
      if (clashes.length) {
        if (!confirm(`Clash detected: ${clashes[0]}. Save anyway?`)) return;
      }
      schedule[className][day][period] = { subjectId, facultyId: facultyId || null, roomId: roomId || null };
    }

    DB.setSchedule(schedule);
    DB.logActivity(`Edited slot: ${className} ${day} P${period}`, 'info');
    showToast('Slot updated', 'success');
    closeSlotModal();
    render();
    Workload.render();
    App.updateDashboard();
  }

  function clearSlot() {
    if (!slotEditCtx) return;
    const { className, day, period } = slotEditCtx;
    const schedule = DB.getSchedule();
    if (schedule[className]?.[day]) {
      schedule[className][day][period] = null;
      DB.setSchedule(schedule);
    }
    showToast('Slot cleared', 'info');
    closeSlotModal();
    render();
  }

  function closeSlotModal() {
    document.getElementById('slot-modal').classList.add('hidden');
    slotEditCtx = null;
  }

  /* ── Helpers ── */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* ── Init ── */
  function init() {
    // View switcher
    document.querySelectorAll('#tt-view-switcher .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#tt-view-switcher .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        populateFilterSelect();
        render();
      });
    });

    // Filter select
    document.getElementById('tt-filter-select')?.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      render();
    });

    // Slot modal buttons
    document.getElementById('save-slot-btn')?.addEventListener('click', saveSlotEdit);
    document.getElementById('clear-slot-btn')?.addEventListener('click', clearSlot);
    document.querySelectorAll('[data-modal="slot-modal"]').forEach(btn => {
      btn.addEventListener('click', closeSlotModal);
    });
    document.getElementById('slot-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeSlotModal();
    });

    // Quick export/print
    document.getElementById('tt-export-btn')?.addEventListener('click', () => App.navigate('export'));
    document.getElementById('tt-print-btn')?.addEventListener('click', () => window.print());
  }

  function refresh() {
    populateFilterSelect();
    render();
  }

  return { init, render, refresh, populateFilterSelect };
})();
