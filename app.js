/* ═══════════════════════════════════════════
   APP.JS — Main Application Router & Orchestrator
═══════════════════════════════════════════ */

const App = (() => {

  const PAGES = {
    dashboard: { el: 'page-dashboard',  label: 'Dashboard' },
    faculty:   { el: 'page-faculty',    label: 'Faculty' },
    subjects:  { el: 'page-subjects',   label: 'Subjects & Rooms' },
    scheduler: { el: 'page-scheduler',  label: 'Auto Scheduler' },
    timetable: { el: 'page-timetable',  label: 'Timetable' },
    workload:  { el: 'page-workload',   label: 'Workload' },
    export:    { el: 'page-export',     label: 'Export' },
    settings:  { el: 'page-settings',   label: 'Settings' },
  };

  let currentPage = 'dashboard';

  /* ── Navigate ── */
  function navigate(page) {
    if (!PAGES[page]) return;
    currentPage = page;

    // Hide all content pages
    document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
    // Show target
    document.getElementById(PAGES[page].el)?.classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Update breadcrumb
    const bc = document.getElementById('breadcrumb');
    if (bc) {
      const pageKeyMap = {
        dashboard: 'nav.dashboard', faculty: 'nav.faculty',
        subjects: 'nav.subjectsRooms', scheduler: 'nav.autoScheduler',
        timetable: 'nav.timetable', workload: 'nav.workload',
        export: 'nav.export', settings: 'nav.settings',
      };
      bc.dataset.page = page;
      bc.textContent = (typeof I18n !== 'undefined') ? I18n.t(pageKeyMap[page] || page) : PAGES[page].label;
    }

    // Page-specific refresh
    switch (page) {
      case 'faculty':   Faculty.render(); break;
      case 'subjects':  Subjects.renderSubjects(); Subjects.renderRooms(); break;
      case 'timetable': TimetableView.refresh(); break;
      case 'workload':  Workload.render(); break;
      case 'scheduler': Scheduler.updateStatus(); break;
      case 'settings':  Settings.loadSettings(); break;
      case 'dashboard': updateDashboard(); break;
    }

    // Re-apply translations after page switch
    if (typeof I18n !== 'undefined') {
      I18n.applyTranslations();
    }

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('mobile-open');
  }

  /* ── Show App (after login) ── */
  function showApp(user) {
    document.getElementById('page-login').classList.remove('active');
    document.getElementById('app').classList.remove('hidden');

    // Set user info in sidebar
    document.getElementById('user-name-sidebar').textContent  = user.name;
    const roleEl = document.getElementById('user-role-sidebar');
    if (roleEl) {
      roleEl.setAttribute('data-role', user.role);
      roleEl.textContent = (typeof I18n !== 'undefined')
        ? I18n.t(user.role === 'admin' ? 'nav.administrator' : 'nav.teacher')
        : (user.role === 'admin' ? 'Administrator' : 'Teacher');
    }
    document.getElementById('user-avatar-sidebar').textContent = getInitials(user.name);
    document.getElementById('welcome-name').textContent       = user.name.split(' ')[0];

    // Hide admin-only sections for teachers
    if (user.role !== 'admin') {
      document.querySelectorAll('[data-admin-only]').forEach(el => el.style.display = 'none');
      // Restrict scheduler and settings
      const settingsNav = document.querySelector('[data-page="settings"]');
      if (settingsNav) settingsNav.style.display = 'none';
    }

    // Init all modules
    lucide.createIcons();
    Faculty.init();
    Subjects.init();
    Scheduler.init();
    TimetableView.init();
    Workload.init();
    Export.init();
    Settings.init();
    Assistant.init();

    // Re-init i18n after icons created so Lucide doesn't overwrite
    if (typeof I18n !== 'undefined') {
      I18n.renderSwitcher();
      I18n.applyTranslations();
    }

    // Wire up navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(item.dataset.page);
      });
    });

    // Quick action buttons
    document.querySelectorAll('.qa-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.page));
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      const sb = document.getElementById('sidebar');
      sb.classList.toggle('collapsed');
      const icon = sb.classList.contains('collapsed') ? 'panel-left-open' : 'panel-left-close';
      document.getElementById('sidebar-toggle').innerHTML = `<i data-lucide="${icon}"></i>`;
      lucide.createIcons({ nodes: [document.getElementById('sidebar-toggle')] });
    });

    // Mobile menu
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    // Quick generate button
    document.getElementById('quick-generate-btn')?.addEventListener('click', () => navigate('scheduler'));

    // Buttons inside timetable page that navigate
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.tagName === 'BUTTON' && !el.classList.contains('nav-item') && !el.classList.contains('qa-btn')) {
        el.addEventListener('click', () => {
          const pg = el.dataset.page;
          if (pg && PAGES[pg]) navigate(pg);
        });
      }
    });

    navigate('dashboard');
    updateDashboard();
  }

  /* ── Show Login ── */
  function showLogin() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('page-login').classList.add('active');
    document.getElementById('login-form')?.reset();
    document.getElementById('login-error')?.classList.add('hidden');
    const btn = document.getElementById('login-btn');
    if (btn) {
      btn.innerHTML = '<span>Sign In</span><i data-lucide="arrow-right"></i>';
      btn.disabled = false;
      lucide.createIcons({ nodes: [btn] });
    }
  }

  /* ── Update Dashboard ── */
  function updateDashboard() {
    const faculty  = DB.getFaculty();
    const subjects = DB.getSubjects();
    const rooms    = DB.getRooms();
    const schedule = DB.getSchedule();

    // Count scheduled slots
    let totalSlots = 0;
    Object.values(schedule).forEach(cls => {
      if (typeof cls !== 'object') return;
      Object.values(cls).forEach(day => {
        if (typeof day !== 'object') return;
        Object.values(day).forEach(slot => { if (slot) totalSlots++; });
      });
    });

    // Animate stat counts
    animateCount('stat-faculty-count', faculty.length);
    animateCount('stat-subject-count', subjects.length);
    animateCount('stat-room-count',    rooms.length);
    animateCount('stat-slot-count',    totalSlots);

    // Activity list
    renderActivity();

    // Mini workload
    Workload.renderMini();
  }

  function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start  = parseInt(el.textContent) || 0;
    const diff   = target - start;
    const steps  = 20;
    let   step   = 0;
    const timer  = setInterval(() => {
      step++;
      el.textContent = Math.round(start + (diff * step / steps));
      if (step >= steps) { el.textContent = target; clearInterval(timer); }
    }, 20);
  }

  function renderActivity() {
    const list     = document.getElementById('activity-list');
    if (!list) return;
    const activity = DB.getActivity().reverse();

    if (!activity.length) {
      list.innerHTML = `<div class="empty-state-sm"><i data-lucide="inbox"></i><p>No activity yet</p></div>`;
      lucide.createIcons({ nodes: [list] });
      return;
    }

    const icons = { info: 'info', warn: 'alert-triangle', error: 'x-circle' };
    const colors = { info: 'var(--violet-light)', warn: 'var(--amber)', error: 'var(--red)' };

    list.innerHTML = activity.slice(0, 8).map(a => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${colors[a.type] || 'var(--violet-light)'}"></div>
        <div>
          <div>${a.msg}</div>
          <div class="activity-time">${formatTime(a.time)} · ${formatDate(a.time)}</div>
        </div>
      </div>`).join('');
  }

  /* ── Global Init ── */
  function init() {
    // Init Lucide icons first
    if (window.lucide) lucide.createIcons();

    // Auth handles session and shows login or app
    Auth.init();
  }

  return { init, navigate, showApp, showLogin, updateDashboard };
})();

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
