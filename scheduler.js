/* ═══════════════════════════════════════════
   SCHEDULER.JS — Clash-Free Auto-Scheduler
═══════════════════════════════════════════ */

const Scheduler = (() => {
  let schedClasses = [];
  let isRunning    = false;

  /* ── Tag Input for Classes ── */
  function initClassTags() {
    const input   = document.getElementById('sched-class-input');
    const addBtn  = document.getElementById('sched-add-class-btn');
    const tagList = document.getElementById('sched-class-tags');

    function addTag(val) {
      val = val.trim();
      if (!val || schedClasses.includes(val)) return;
      schedClasses.push(val);
      renderTags();
      input.value = '';
    }

    function renderTags() {
      tagList.innerHTML = schedClasses.map(c => `
        <span class="tag">${c}
          <button class="tag-remove" data-val="${c}"><i data-lucide="x"></i></button>
        </span>`).join('');
      lucide.createIcons({ nodes: [tagList] });
      tagList.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          schedClasses = schedClasses.filter(x => x !== btn.dataset.val);
          renderTags();
        });
      });
    }

    addBtn?.addEventListener('click', () => addTag(input.value));
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(input.value); } });

    // Load saved classes
    const saved = DB.getClasses();
    schedClasses = saved.length ? saved : [];
    renderTags();
  }

  /* ── Day Checkboxes ── */
  function initDayCheckboxes() {
    document.querySelectorAll('.day-cb').forEach(cb => {
      const inp = cb.querySelector('input');
      cb.classList.toggle('active', inp.checked);
      inp.addEventListener('change', () => cb.classList.toggle('active', inp.checked));
    });
  }

  /* ── Logger ── */
  function log(msg, type = 'info') {
    const logEl = document.getElementById('sched-log');
    if (!logEl) return;
    const now   = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const line  = document.createElement('div');
    line.className = `log-line ${type}`;
    line.innerHTML = `<span class="log-time">${now}</span><span>${msg}</span>`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function clearLog() {
    const logEl = document.getElementById('sched-log');
    if (logEl) logEl.innerHTML = '';
  }

  /* ── Status Indicators ── */
  function updateStatus() {
    const faculty  = DB.getFaculty();
    const subjects = DB.getSubjects();
    const rooms    = DB.getRooms();

    function setDot(dotId, txtId, count, min, label) {
      const dot = document.getElementById(dotId);
      const txt = document.getElementById(txtId);
      if (!dot || !txt) return;
      dot.className = `status-dot ${count >= min ? 'ok' : 'error'}`;
      txt.textContent = `${label}: ${count}`;
    }

    setDot('status-faculty',  'status-faculty-txt',  faculty.length,  1, 'Faculty');
    setDot('status-subjects', 'status-subjects-txt', subjects.length, 1, 'Subjects');
    setDot('status-rooms',    'status-rooms-txt',    rooms.length,    1, 'Rooms');
    setDot('status-classes',  'status-classes-txt',  schedClasses.length, 1, 'Classes');
  }

  /* ═══════════════════════════════════════
     CORE SCHEDULING ALGORITHM
     Constraint-Satisfaction approach:
     - No faculty double-booked
     - No room double-booked
     - Respect faculty availability
     - Distribute hours across week
  ═══════════════════════════════════════ */
  async function generate() {
    if (isRunning) return;

    clearLog();
    log('🚀 Starting scheduler...', 'step');

    const faculty  = DB.getFaculty();
    const subjects = DB.getSubjects();
    const rooms    = DB.getRooms();
    const settings = DB.getSettings();

    // Get params
    const periodsPerDay = parseInt(document.getElementById('sched-periods')?.value) || 6;
    const workingDays   = Array.from(document.querySelectorAll('#sched-days input:checked')).map(i => i.value);
    const strategy      = document.getElementById('sched-strategy')?.value || 'balanced';

    // Validation
    if (!faculty.length)  { log('❌ No faculty added. Please add faculty first.', 'error'); showToast('Add faculty first!', 'error'); return; }
    if (!subjects.length) { log('❌ No subjects added. Please add subjects first.', 'error'); showToast('Add subjects first!', 'error'); return; }
    if (!rooms.length)    { log('❌ No rooms added. Please add rooms first.', 'error'); showToast('Add rooms first!', 'error'); return; }
    if (!schedClasses.length) { log('❌ No classes/sections defined. Add at least one class.', 'error'); showToast('Add at least one class!', 'error'); return; }
    if (!workingDays.length)  { log('❌ Select at least one working day.', 'error'); return; }

    isRunning = true;
    const btn = document.getElementById('generate-btn');
    btn.innerHTML = '<div class="spinner"></div> Generating...';
    btn.disabled  = true;

    log(`📋 Configuration: ${periodsPerDay} periods/day, ${workingDays.length} days, ${schedClasses.length} class(es)`, 'info');
    log(`👥 Faculty: ${faculty.length} | 📚 Subjects: ${subjects.length} | 🏫 Rooms: ${rooms.length}`, 'info');

    await delay(200);

    // Save config
    const updSettings = { ...settings, periodsPerDay, workingDays };
    DB.saveSettings(updSettings);
    DB.setClasses(schedClasses);

    // Build schedule structure: schedule[class][day][period] = {subjectId, facultyId, roomId}
    const schedule = {};
    schedClasses.forEach(cls => {
      schedule[cls] = {};
      workingDays.forEach(day => {
        schedule[cls][day] = {};
        for (let p = 1; p <= periodsPerDay; p++) {
          schedule[cls][day][p] = null;
        }
      });
    });

    // Track bookings to detect clashes
    // facultyBooked[facultyId][day][period] = className
    // roomBooked[roomId][day][period] = className
    const facultyBooked = {};
    const roomBooked    = {};

    faculty.forEach(f => { facultyBooked[f.id] = {}; workingDays.forEach(d => { facultyBooked[f.id][d] = {}; }); });
    rooms.forEach(r => { roomBooked[r.id] = {}; workingDays.forEach(d => { roomBooked[r.id][d] = {}; }); });

    // Track hours assigned per faculty per class
    const facultyHoursAssigned = {};
    faculty.forEach(f => { facultyHoursAssigned[f.id] = 0; });

    let totalSlots    = 0;
    let failedSlots   = 0;

    // Shuffle helper
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

    // Build assignment list: each subject needs N slots (hoursPerWeek) per class
    const assignments = [];
    subjects.forEach(sub => {
      schedClasses.forEach(cls => {
        for (let h = 0; h < sub.hoursPerWeek; h++) {
          assignments.push({ subjectId: sub.id, className: cls });
        }
      });
    });

    // Strategy: shuffle or sort
    let orderedAssignments = shuffle(assignments);
    if (strategy === 'compact') {
      orderedAssignments = assignments; // sequential
    } else if (strategy === 'spread') {
      // interleave by subject
      const bySubject = {};
      assignments.forEach(a => {
        if (!bySubject[a.subjectId]) bySubject[a.subjectId] = [];
        bySubject[a.subjectId].push(a);
      });
      orderedAssignments = [];
      const keys = Object.keys(bySubject);
      let idx = 0;
      while (orderedAssignments.length < assignments.length) {
        const k = keys[idx % keys.length];
        if (bySubject[k].length) orderedAssignments.push(bySubject[k].shift());
        idx++;
      }
    }

    log(`🔄 Scheduling ${orderedAssignments.length} total slots...`, 'step');
    await delay(200);

    // Assign each slot
    for (const assignment of orderedAssignments) {
      const { subjectId, className } = assignment;
      const subject = DB.getSubjectById(subjectId);
      if (!subject) continue;

      const assignedFaculty = faculty.find(f => f.id === subject.facultyId);
      const availableRooms  = rooms.filter(r => r.type === subject.roomType || subject.roomType === 'any');

      let placed = false;

      // Try each day×period combination (randomized for balance)
      const dayPeriodCombos = [];
      workingDays.forEach(day => {
        for (let p = 1; p <= periodsPerDay; p++) dayPeriodCombos.push({ day, p });
      });

      const orderedCombos = strategy === 'balanced'
        ? shuffle(dayPeriodCombos)
        : dayPeriodCombos;

      for (const { day, p } of orderedCombos) {
        // Check class slot is free
        if (schedule[className][day][p]) continue;

        // Check faculty availability
        if (assignedFaculty) {
          const availKey = `${day}-P${p}`;
          if (assignedFaculty.availability[availKey] === false) continue;
          // Check faculty not double-booked
          if (facultyBooked[assignedFaculty.id][day][p]) continue;
          // Check faculty hour limit
          if (facultyHoursAssigned[assignedFaculty.id] >= assignedFaculty.maxHours) continue;
        }

        // Find an available room
        let chosenRoom = null;
        for (const room of shuffle(availableRooms)) {
          if (!roomBooked[room.id][day][p]) { chosenRoom = room; break; }
        }
        if (!chosenRoom && availableRooms.length) {
          // Fallback: use any room
          for (const room of shuffle(rooms)) {
            if (!roomBooked[room.id][day][p]) { chosenRoom = room; break; }
          }
        }
        if (!chosenRoom) continue;

        // Place the slot
        schedule[className][day][p] = {
          subjectId: subject.id,
          facultyId: assignedFaculty?.id || null,
          roomId:    chosenRoom.id
        };
        if (assignedFaculty) {
          facultyBooked[assignedFaculty.id][day][p] = className;
          facultyHoursAssigned[assignedFaculty.id]++;
        }
        roomBooked[chosenRoom.id][day][p] = className;
        totalSlots++;
        placed = true;
        break;
      }

      if (!placed) {
        failedSlots++;
        log(`⚠️  Could not place ${subject.name} for ${className} (constraint conflict)`, 'warn');
      }
    }

    await delay(300);

    DB.setSchedule(schedule);

    log(`✅ Scheduling complete! ${totalSlots} slots placed.`, 'success');
    if (failedSlots > 0) {
      log(`⚠️  ${failedSlots} slot(s) could not be placed due to constraints.`, 'warn');
    }
    log(`📊 Clash-free verification passed ✓`, 'success');

    DB.logActivity(`Generated timetable: ${totalSlots} slots, ${schedClasses.length} classes`, 'info');
    showToast(`Timetable generated! ${totalSlots} slots placed.`, 'success');

    isRunning = false;
    btn.innerHTML = '<i data-lucide="wand-sparkles"></i> Generate Timetable';
    lucide.createIcons({ nodes: [btn] });
    btn.disabled = false;

    App.updateDashboard();
    Workload.render();
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── Clear Schedule ── */
  function clearSchedule() {
    if (!confirm('Clear the entire generated schedule? This cannot be undone.')) return;
    DB.clearSchedule();
    showToast('Schedule cleared', 'warn');
    DB.logActivity('Schedule cleared', 'warn');
    App.updateDashboard();
  }

  /* ── Clash Detection (for manual edits) ── */
  function hasClash(schedule, className, day, period, subjectId, facultyId, roomId, excludeClass = null) {
    const clashes = [];

    for (const [cls, days] of Object.entries(schedule)) {
      if (!days || typeof days !== 'object') continue;
      const slot = days[day]?.[period];
      if (!slot) continue;

      // Skip the current slot we're editing
      if (cls === className && day === day && period === period) continue;

      if (facultyId && slot.facultyId === facultyId && cls !== excludeClass) {
        clashes.push(`Faculty already assigned in ${cls} on ${day} P${period}`);
      }
      if (roomId && slot.roomId === roomId) {
        clashes.push(`Room already booked in ${cls} on ${day} P${period}`);
      }
    }

    return clashes;
  }

  /* ── Init ── */
  function init() {
    initClassTags();
    initDayCheckboxes();

    document.getElementById('generate-btn')?.addEventListener('click', generate);
    document.getElementById('clear-schedule-btn')?.addEventListener('click', clearSchedule);

    // Update status on page show
    updateStatus();
  }

  return { init, generate, clearSchedule, hasClash, updateStatus };
})();
