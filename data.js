/* ═══════════════════════════════════════════
   DATA.JS — LocalStorage CRUD Layer
═══════════════════════════════════════════ */

const DB = {
  KEYS: {
    faculty:    'ttp_faculty',
    subjects:   'ttp_subjects',
    rooms:      'ttp_rooms',
    schedule:   'ttp_schedule',
    settings:   'ttp_settings',
    users:      'ttp_users',
    activity:   'ttp_activity',
    classes:    'ttp_classes',
  },

  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  _getObj(key, def = {}) {
    try { return JSON.parse(localStorage.getItem(key)) || def; }
    catch { return def; }
  },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  /* ── Faculty ── */
  getFaculty()            { return this._get(this.KEYS.faculty); },
  setFaculty(data)        { this._set(this.KEYS.faculty, data); },
  addFaculty(f)           { const d = this.getFaculty(); f.id = f.id || uid(); d.push(f); this.setFaculty(d); return f; },
  updateFaculty(f)        { const d = this.getFaculty().map(x => x.id === f.id ? f : x); this.setFaculty(d); },
  deleteFaculty(id)       { this.setFaculty(this.getFaculty().filter(x => x.id !== id)); },
  getFacultyById(id)      { return this.getFaculty().find(x => x.id === id); },

  /* ── Subjects ── */
  getSubjects()           { return this._get(this.KEYS.subjects); },
  setSubjects(data)       { this._set(this.KEYS.subjects, data); },
  addSubject(s)           { const d = this.getSubjects(); s.id = s.id || uid(); d.push(s); this.setSubjects(d); return s; },
  updateSubject(s)        { const d = this.getSubjects().map(x => x.id === s.id ? s : x); this.setSubjects(d); },
  deleteSubject(id)       { this.setSubjects(this.getSubjects().filter(x => x.id !== id)); },
  getSubjectById(id)      { return this.getSubjects().find(x => x.id === id); },

  /* ── Rooms ── */
  getRooms()              { return this._get(this.KEYS.rooms); },
  setRooms(data)          { this._set(this.KEYS.rooms, data); },
  addRoom(r)              { const d = this.getRooms(); r.id = r.id || uid(); d.push(r); this.setRooms(d); return r; },
  updateRoom(r)           { const d = this.getRooms().map(x => x.id === r.id ? r : x); this.setRooms(d); },
  deleteRoom(id)          { this.setRooms(this.getRooms().filter(x => x.id !== id)); },
  getRoomById(id)         { return this.getRooms().find(x => x.id === id); },

  /* ── Schedule ── */
  getSchedule()           { return this._getObj(this.KEYS.schedule, {}); },
  setSchedule(data)       { this._set(this.KEYS.schedule, data); },
  clearSchedule()         { this._set(this.KEYS.schedule, {}); },

  /* ── Classes ── */
  getClasses()            { return this._get(this.KEYS.classes); },
  setClasses(data)        { this._set(this.KEYS.classes, data); },

  /* ── Settings ── */
  getSettings() {
    return this._getObj(this.KEYS.settings, {
      institution: 'My University',
      semester: 'Semester 1',
      year: '2024-2025',
      periodDuration: 50,
      periodsPerDay: 6,
      workingDays: ['Mon','Tue','Wed','Thu','Fri'],
      periodTimings: [
        '09:00 - 09:50', '09:55 - 10:45', '11:00 - 11:50',
        '11:55 - 12:45', '14:00 - 14:50', '14:55 - 15:45'
      ]
    });
  },
  saveSettings(data) { this._set(this.KEYS.settings, data); },

  /* ── Users ── */
  getUsers() {
    const users = this._get(this.KEYS.users);
    if (!users.length) {
      const defaults = [
        { id: 'u1', name: 'Administrator', email: 'admin@school.edu', password: 'admin123', role: 'admin' },
        { id: 'u2', name: 'Teacher Demo', email: 'teacher@school.edu', password: 'teacher123', role: 'teacher' }
      ];
      this._set(this.KEYS.users, defaults);
      return defaults;
    }
    return users;
  },
  saveUsers(data) { this._set(this.KEYS.users, data); },
  addUser(u)      { const d = this.getUsers(); u.id = u.id || uid(); d.push(u); this.saveUsers(d); return u; },
  deleteUser(id)  { this.saveUsers(this.getUsers().filter(x => x.id !== id)); },
  findUser(email, password) { return this.getUsers().find(u => u.email === email && u.password === password); },

  /* ── Activity Log ── */
  getActivity()           { return this._get(this.KEYS.activity).slice(-20); },
  logActivity(msg, type = 'info') {
    const list = this._get(this.KEYS.activity);
    list.push({ id: uid(), msg, type, time: new Date().toISOString() });
    if (list.length > 50) list.splice(0, list.length - 50);
    this._set(this.KEYS.activity, list);
  },

  /* ── Reset ── */
  clearAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
  }
};

/* ── Helpers ── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Global Toast ── */
function showToast(msg, type = 'info', duration = 3500) {
  const icons = { success: 'check-circle', error: 'x-circle', info: 'info', warn: 'alert-triangle' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i data-lucide="${icons[type] || 'info'}"></i><span>${msg}</span>`;
  container.appendChild(t);
  lucide.createIcons({ nodes: [t] });
  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 300);
  }, duration);
}
