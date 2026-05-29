/* ═══════════════════════════════════════════
   WORKLOAD.JS — Workload Analytics
═══════════════════════════════════════════ */

const Workload = (() => {

  function computeWorkload() {
    const faculty  = DB.getFaculty();
    const schedule = DB.getSchedule();
    const subjects = DB.getSubjects();

    // Count hours per faculty
    const hoursMap    = {};
    const subjectsMap = {};

    faculty.forEach(f => {
      hoursMap[f.id]    = 0;
      subjectsMap[f.id] = new Set();
    });

    Object.values(schedule).forEach(classData => {
      if (typeof classData !== 'object') return;
      Object.values(classData).forEach(dayData => {
        if (typeof dayData !== 'object') return;
        Object.values(dayData).forEach(slot => {
          if (!slot || !slot.facultyId) return;
          hoursMap[slot.facultyId]    = (hoursMap[slot.facultyId] || 0) + 1;
          if (!subjectsMap[slot.facultyId]) subjectsMap[slot.facultyId] = new Set();
          if (slot.subjectId) subjectsMap[slot.facultyId].add(slot.subjectId);
        });
      });
    });

    return faculty.map(f => ({
      faculty:   f,
      assigned:  hoursMap[f.id] || 0,
      maxHours:  f.maxHours || 20,
      subjectIds: [...(subjectsMap[f.id] || [])]
    }));
  }

  function render() {
    const grid    = document.getElementById('workload-grid');
    if (!grid) return;
    const data    = computeWorkload();
    const faculty = DB.getFaculty();

    if (!faculty.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon"><i data-lucide="users"></i></div>
          <h3>No Faculty Added</h3>
          <p>Add faculty members to see workload analytics.</p>
        </div>`;
      lucide.createIcons({ nodes: [grid] });
      return;
    }

    grid.innerHTML = data.map(({ faculty: f, assigned, maxHours, subjectIds }) => {
      const pct   = maxHours > 0 ? Math.min(100, Math.round((assigned / maxHours) * 100)) : 0;
      const level = pct > 100 ? 'over' : pct > 80 ? 'warn' : 'ok';
      const levelLabel = pct > 100 ? '🔴 Overloaded' : pct > 80 ? '🟡 Near Limit' : '🟢 Balanced';

      const subjNames = subjectIds.map(sid => {
        const s = DB.getSubjectById(sid);
        return s ? `<span class="wl-subject-tag" style="border-color:${s.color || 'var(--border)'}">${s.name}</span>` : '';
      }).join('');

      return `
        <div class="glass-card workload-card">
          <div class="wl-header">
            <div class="wl-avatar">${getInitials(f.name)}</div>
            <div>
              <div class="wl-name">${f.name}</div>
              <div class="wl-dept">${f.department || 'No Dept'}</div>
            </div>
          </div>
          <div class="wl-stats">
            <span>${assigned} / ${maxHours} hours assigned</span>
            <span>${levelLabel}</span>
          </div>
          <div class="wl-bar">
            <div class="wl-fill ${level}" style="width:${pct}%"></div>
          </div>
          <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.625rem">${pct}% of capacity used</div>
          ${subjectIds.length ? `<div class="wl-subjects">${subjNames}</div>` : `<div style="font-size:0.75rem;color:var(--text-muted)">No subjects assigned</div>`}
        </div>`;
    }).join('');

    lucide.createIcons({ nodes: [grid] });
  }

  /* ── Mini Workload for Dashboard ── */
  function renderMini() {
    const container = document.getElementById('workload-mini');
    if (!container) return;
    const data = computeWorkload().slice(0, 4);

    if (!data.length) {
      container.innerHTML = `<div class="empty-state-sm"><i data-lucide="users"></i><p>No faculty added</p></div>`;
      lucide.createIcons({ nodes: [container] });
      return;
    }

    container.innerHTML = data.map(({ faculty: f, assigned, maxHours }) => {
      const pct   = maxHours > 0 ? Math.min(100, Math.round((assigned / maxHours) * 100)) : 0;
      const level = pct > 100 ? 'over' : pct > 80 ? 'warn' : 'ok';
      const fillColor = level === 'ok' ? 'var(--green)' : level === 'warn' ? 'var(--amber)' : 'var(--red)';
      return `
        <div class="workload-mini-item">
          <div class="wm-label">
            <span style="font-size:0.78rem;font-weight:600">${f.name}</span>
            <span style="font-size:0.75rem;color:var(--text-muted)">${assigned}/${maxHours}h</span>
          </div>
          <div class="wm-bar">
            <div class="wm-fill" style="width:${pct}%;background:${fillColor}"></div>
          </div>
        </div>`;
    }).join('');
  }

  /* ── Auto Balance ── */
  function autoBalance() {
    const schedule = DB.getSchedule();
    const faculty  = DB.getFaculty();
    if (!Object.keys(schedule).length) { showToast('Generate a timetable first!', 'error'); return; }
    if (faculty.length < 2) { showToast('Need at least 2 faculty to balance', 'warn'); return; }

    // Simple balancing: redistribute overloaded faculty slots to underloaded
    const data = computeWorkload().sort((a, b) => b.assigned - a.assigned);
    const overloaded   = data.filter(d => d.assigned > d.maxHours);
    const underloaded  = data.filter(d => d.assigned < d.maxHours * 0.7);

    if (!overloaded.length) { showToast('Workload is already balanced! 🎉', 'success'); return; }

    let changes = 0;

    outer:
    for (const { faculty: fOver } of overloaded) {
      for (const { faculty: fUnder } of underloaded) {
        if (fOver.id === fUnder.id) continue;

        // Find subjects in common expertise
        const commonSubjects = (fOver.expertise || []).filter(e => (fUnder.expertise || []).includes(e));
        if (!commonSubjects.length) continue;

        // Find a slot assigned to fOver and reassign to fUnder
        for (const [cls, clsData] of Object.entries(schedule)) {
          if (!clsData || typeof clsData !== 'object') continue;
          for (const [day, dayData] of Object.entries(clsData)) {
            if (!dayData || typeof dayData !== 'object') continue;
            for (const [period, slot] of Object.entries(dayData)) {
              if (!slot || slot.facultyId !== fOver.id) continue;
              const subj = DB.getSubjectById(slot.subjectId);
              if (!subj || !commonSubjects.includes(subj.name)) continue;

              // Check fUnder availability
              const availKey = `${day}-P${period}`;
              if (fUnder.availability?.[availKey] === false) continue;

              // Check not double-booked
              let conflict = false;
              for (const [c2, cd2] of Object.entries(schedule)) {
                if (cd2?.[day]?.[parseInt(period)]?.facultyId === fUnder.id) { conflict = true; break; }
              }
              if (conflict) continue;

              schedule[cls][day][parseInt(period)].facultyId = fUnder.id;
              changes++;
              if (changes >= 3) break outer;
            }
          }
        }
      }
    }

    if (changes > 0) {
      DB.setSchedule(schedule);
      DB.logActivity(`Auto-balanced workload: ${changes} slot(s) redistributed`, 'info');
      showToast(`Balanced! ${changes} slot(s) redistributed`, 'success');
      render();
      Faculty.render();
    } else {
      showToast('Could not auto-balance (no compatible faculty found)', 'warn');
    }
  }

  function init() {
    document.getElementById('balance-btn')?.addEventListener('click', autoBalance);
  }

  return { init, render, renderMini, computeWorkload };
})();
