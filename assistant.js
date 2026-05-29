/* ═══════════════════════════════════════════
   ASSISTANT.JS — Smart Chatbot & Tutorial Engine
═══════════════════════════════════════════ */

const Assistant = (() => {
  let isOpen       = false;
  let isTyping     = false;
  let messageCount = 0;

  /* ══════ KNOWLEDGE BASE ══════ */
  const KB = [
    // Navigation
    { patterns: ['dashboard','home','main'], action: 'navigate', page: 'dashboard',
      reply: "Taking you to the **Dashboard** now! 🏠 Here you'll see all your key stats at a glance." },
    { patterns: ['faculty','teacher','staff','lecturer'], action: 'navigate', page: 'faculty',
      reply: "Opening **Faculty Management** ✅ You can add teachers, set their availability and track their workload here." },
    { patterns: ['subject','course','class subject'], action: 'navigate', page: 'subjects',
      reply: "Going to **Subjects & Rooms** 📚 Add your subjects with hours per week and assign faculty here." },
    { patterns: ['room','classroom','hall','lab'], action: 'navigate', page: 'subjects',
      reply: "Opening **Subjects & Rooms** 🏫 You can add classrooms, labs and seminar rooms there." },
    { patterns: ['schedule','scheduler','generate','auto'], action: 'navigate', page: 'scheduler',
      reply: "Opening the **Auto Scheduler** ⚡ Configure your periods, days, and click Generate!" },
    { patterns: ['timetable','time table','calendar','grid','view'], action: 'navigate', page: 'timetable',
      reply: "Opening the **Timetable** 📅 You can view by class, faculty or room, and drag-drop slots to edit." },
    { patterns: ['workload','load','balance','hours'], action: 'navigate', page: 'workload',
      reply: "Heading to **Workload Analytics** 📊 See how teaching hours are distributed across your faculty." },
    { patterns: ['export','download','pdf','excel','print'], action: 'navigate', page: 'export',
      reply: "Opening **Export** 💾 Download your timetable as PDF or Excel with one click!" },
    { patterns: ['setting','config','user','account','period timing'], action: 'navigate', page: 'settings',
      reply: "Going to **Settings** ⚙️ Manage institution details, user accounts and period timings." },

    // Tutorial
    { patterns: ['tutorial','guide','help me','how to','getting started','start','begin','steps','walk'], action: 'tutorial',
      reply: "Sure! Let me walk you through the **complete timetable generation process** step by step. Starting the tutorial now! 🎓" },
    { patterns: ['sample','example','demo','try'], action: 'tutorial',
      reply: "Great idea! Let me show you how to create a timetable with a sample walkthrough. Launching tutorial! 🚀" },

    // How-to answers
    { patterns: ['add faculty','create faculty','new teacher'],
      reply: "To add a faculty member:\n1️⃣ Go to **Faculty** page\n2️⃣ Click **Add Faculty** button\n3️⃣ Enter name, department, max hours\n4️⃣ Toggle the availability grid (green = available)\n5️⃣ Click **Save Faculty**" },
    { patterns: ['add subject','create subject','new subject','new course'],
      reply: "To add a subject:\n1️⃣ Go to **Subjects & Rooms** page\n2️⃣ Click **Add Subject**\n3️⃣ Enter subject name, code, hours per week\n4️⃣ Choose room type (Lecture/Lab/Seminar)\n5️⃣ Assign a faculty member\n6️⃣ Pick a color tag and save!" },
    { patterns: ['add room','add classroom','create room'],
      reply: "To add a classroom:\n1️⃣ Go to **Subjects & Rooms** page\n2️⃣ Click **Add Room**\n3️⃣ Enter room name, capacity and type\n4️⃣ Click **Save Room** ✅" },
    { patterns: ['clash','conflict','overlap','double book'],
      reply: "Time Table Pro uses a **Constraint Satisfaction Algorithm** to prevent clashes:\n✅ No faculty assigned to two classes at the same time\n✅ No room double-booked\n✅ Faculty availability is respected\n⚠️ If you manually edit and create a clash, the system will warn you in red!" },
    { patterns: ['drag','move slot','edit slot','change slot'],
      reply: "To manually edit a slot in the Timetable:\n🖱️ **Drag & Drop** — grab a filled slot and drop it to another period\n🖱️ **Click** — click any slot to open the edit modal and change subject, faculty or room\n⚠️ Clash warnings appear automatically!" },
    { patterns: ['export pdf','download pdf'],
      reply: "To export as PDF:\n1️⃣ Go to **Export** page\n2️⃣ Choose options (All Classes, Faculty View, Room View)\n3️⃣ Click **Download PDF** 📄\nA beautiful multi-page PDF will be saved!" },
    { patterns: ['export excel','download excel','xlsx'],
      reply: "To export as Excel:\n1️⃣ Go to **Export** page\n2️⃣ Choose sheets to include (Summary, Workload)\n3️⃣ Click **Download Excel** 📊\nEach class gets its own sheet in the XLSX file!" },
    { patterns: ['workload balance','auto balance','redistribute'],
      reply: "To balance faculty workload:\n1️⃣ Go to **Workload** page\n2️⃣ Review the color-coded bars:\n   🟢 Green = Balanced\n   🟡 Yellow = Near limit\n   🔴 Red = Overloaded\n3️⃣ Click **Auto Balance** to redistribute overloaded slots!" },
    { patterns: ['login','password','credential','sign in','user'],
      reply: "Default credentials:\n👑 **Admin:** admin@school.edu / admin123\n👨‍🏫 **Teacher:** teacher@school.edu / teacher123\n\nYou can add more users in **Settings → User Accounts**." },
    { patterns: ['strategy','balanced','compact','spread'],
      reply: "Three scheduling strategies are available:\n⚖️ **Balanced Workload** — distributes randomly for even load\n📦 **Compact** — fills slots sequentially\n🌊 **Spread Evenly** — interleaves subjects across the week" },

    // General
    { patterns: ['hello','hi','hey','greetings','good morning','good evening'],
      reply: "Hello! 👋 I'm **TTP Assistant**, your smart scheduling guide. I can help you:\n• Navigate to any page\n• Answer questions about features\n• Walk you through the tutorial\n\nWhat would you like to do?" },
    { patterns: ['thank','thanks','great','awesome','perfect','good','nice'],
      reply: "You're welcome! 😊 Is there anything else I can help you with? Type **tutorial** for a step-by-step guide or ask me anything!" },
    { patterns: ['bye','goodbye','exit','close'],
      reply: "Goodbye! 👋 Remember, I'm always here if you need help. Just click the assistant button!" },
    { patterns: ['feature','what can you do','capabilities','help'],
      reply: "Here's what I can do:\n🧭 **Navigate** — say 'go to faculty' or 'open scheduler'\n📖 **Explain** — ask 'how to add a subject' or 'what is clash detection'\n🎓 **Tutorial** — say 'start tutorial' for a guided walkthrough\n📊 **Status** — I can tell you about your current data\n\nTry any of these!" },
    { patterns: ['status','how many','current','data'],
      action: 'status',
      reply: null }, // dynamic
  ];

  const FALLBACKS = [
    "I'm not sure about that, but I can help you navigate! Try saying **'go to scheduler'** or **'start tutorial'** 🤔",
    "Hmm, let me think... I specialize in timetable scheduling! Try asking **'how to generate a timetable'** or **'show me the tutorial'** 📚",
    "I didn't quite catch that. You can ask me things like:\n• 'How do I add faculty?'\n• 'Start the tutorial'\n• 'Go to export page' 😊",
  ];

  /* ══════ TUTORIAL STEPS ══════ */
  const TUTORIAL_STEPS = [
    {
      title: '🎓 Welcome to Time Table Pro!',
      subtitle: 'Step 1 of 7 — Overview',
      icon: '🏫',
      content: `<p>This tutorial will guide you through creating your first clash-free timetable in just <strong>7 simple steps</strong>.</p>
      <div class="tut-checklist">
        <div class="tut-check-item">✅ Add Faculty Members</div>
        <div class="tut-check-item">✅ Add Subjects</div>
        <div class="tut-check-item">✅ Add Classrooms</div>
        <div class="tut-check-item">✅ Configure Scheduler</div>
        <div class="tut-check-item">✅ Generate Timetable</div>
        <div class="tut-check-item">✅ Review & Edit</div>
        <div class="tut-check-item">✅ Export</div>
      </div>
      <p class="tut-tip">💡 <strong>Tip:</strong> You can click <em>Skip Tutorial</em> anytime and come back by asking the assistant "start tutorial".</p>`,
      page: null, highlight: null
    },
    {
      title: '👥 Step 1 — Add Faculty Members',
      subtitle: 'Step 2 of 7 — Faculty Setup',
      icon: '👨‍🏫',
      content: `<p>Faculty members are the teachers who will be assigned to subjects.</p>
      <div class="tut-steps">
        <div class="tut-step"><span class="tut-num">1</span><span>Click <strong>"Faculty"</strong> in the left sidebar</span></div>
        <div class="tut-step"><span class="tut-num">2</span><span>Click the <strong>"Add Faculty"</strong> button (top right)</span></div>
        <div class="tut-step"><span class="tut-num">3</span><span>Fill in name, department, and max hours/week</span></div>
        <div class="tut-step"><span class="tut-num">4</span><span>Toggle the <strong>availability grid</strong> — green cells = available periods</span></div>
        <div class="tut-step"><span class="tut-num">5</span><span>Click <strong>"Save Faculty"</strong></span></div>
      </div>
      <div class="tut-example">
        <strong>📝 Example:</strong><br/>
        Dr. Priya Sharma · Computer Science · 18 hrs/wk<br/>
        Available: Mon–Fri, Periods 1–5
      </div>`,
      page: 'faculty', highlight: 'add-faculty-btn'
    },
    {
      title: '📚 Step 2 — Add Subjects',
      subtitle: 'Step 3 of 7 — Subject Setup',
      icon: '📖',
      content: `<p>Subjects define <em>what</em> gets taught, <em>how often</em>, and by <em>whom</em>.</p>
      <div class="tut-steps">
        <div class="tut-step"><span class="tut-num">1</span><span>Go to <strong>"Subjects & Rooms"</strong> page</span></div>
        <div class="tut-step"><span class="tut-num">2</span><span>Click <strong>"Add Subject"</strong></span></div>
        <div class="tut-step"><span class="tut-num">3</span><span>Enter name (e.g. <em>Data Structures</em>), code (e.g. <em>CS301</em>)</span></div>
        <div class="tut-step"><span class="tut-num">4</span><span>Set <strong>hours per week</strong> (how many periods this subject needs)</span></div>
        <div class="tut-step"><span class="tut-num">5</span><span>Choose <strong>room type</strong>: Lecture Hall, Lab, or Seminar</span></div>
        <div class="tut-step"><span class="tut-num">6</span><span>Assign a <strong>faculty member</strong> and choose a color</span></div>
      </div>
      <div class="tut-example">
        <strong>📝 Example:</strong><br/>
        Data Structures (CS301) · 4 hrs/wk · Lecture Hall<br/>
        Assigned to: Dr. Priya Sharma · Color: 🟣
      </div>`,
      page: 'subjects', highlight: 'add-subject-btn'
    },
    {
      title: '🏫 Step 3 — Add Classrooms',
      subtitle: 'Step 4 of 7 — Room Setup',
      icon: '🚪',
      content: `<p>Classrooms are where subjects are taught. The scheduler ensures no room is double-booked.</p>
      <div class="tut-steps">
        <div class="tut-step"><span class="tut-num">1</span><span>On the <strong>Subjects & Rooms</strong> page, click <strong>"Add Room"</strong></span></div>
        <div class="tut-step"><span class="tut-num">2</span><span>Enter the <strong>room name</strong> (e.g. Room 101, Lab-A)</span></div>
        <div class="tut-step"><span class="tut-num">3</span><span>Set the <strong>capacity</strong> (number of students)</span></div>
        <div class="tut-step"><span class="tut-num">4</span><span>Choose <strong>room type</strong> matching your subjects</span></div>
        <div class="tut-step"><span class="tut-num">5</span><span>Click <strong>"Save Room"</strong></span></div>
      </div>
      <div class="tut-example">
        <strong>📝 Example:</strong><br/>
        Room 101 · Lecture Hall · Capacity: 60<br/>
        Lab-A · Computer Lab · Capacity: 30
      </div>`,
      page: 'subjects', highlight: 'add-room-btn'
    },
    {
      title: '⚙️ Step 4 — Configure the Scheduler',
      subtitle: 'Step 5 of 7 — Scheduler Setup',
      icon: '⚡',
      content: `<p>Now configure how the timetable should be generated.</p>
      <div class="tut-steps">
        <div class="tut-step"><span class="tut-num">1</span><span>Go to <strong>"Auto Scheduler"</strong> page</span></div>
        <div class="tut-step"><span class="tut-num">2</span><span>Set <strong>Periods Per Day</strong> (e.g. 6)</span></div>
        <div class="tut-step"><span class="tut-num">3</span><span>Select your <strong>Working Days</strong> (Mon–Fri or include Sat)</span></div>
        <div class="tut-step"><span class="tut-num">4</span><span>Add your <strong>Class/Section names</strong> (e.g. CS-A, CS-B)</span></div>
        <div class="tut-step"><span class="tut-num">5</span><span>Choose a <strong>Strategy</strong>: Balanced (recommended), Compact, or Spread</span></div>
      </div>
      <div class="tut-example">
        <strong>📝 Example Config:</strong><br/>
        6 periods/day · Mon to Fri · Classes: CS-A, CS-B<br/>
        Strategy: Balanced Workload ⚖️
      </div>`,
      page: 'scheduler', highlight: 'generate-btn'
    },
    {
      title: '🚀 Step 5 — Generate & Review',
      subtitle: 'Step 6 of 7 — Generation',
      icon: '✨',
      content: `<p>Click <strong>Generate Timetable</strong> and watch the magic happen!</p>
      <div class="tut-steps">
        <div class="tut-step"><span class="tut-num">1</span><span>Click the <strong>"Generate Timetable"</strong> button</span></div>
        <div class="tut-step"><span class="tut-num">2</span><span>Watch the <strong>Scheduler Log</strong> — it shows live progress</span></div>
        <div class="tut-step"><span class="tut-num">3</span><span>Go to the <strong>Timetable</strong> page to view the result</span></div>
        <div class="tut-step"><span class="tut-num">4</span><span>Use the <strong>View By</strong> tabs to see Class, Faculty, or Room views</span></div>
        <div class="tut-step"><span class="tut-num">5</span><span><strong>Click any slot</strong> to edit it, or <strong>drag & drop</strong> to move slots</span></div>
      </div>
      <div class="tut-tip">
        ⚠️ <strong>Clash Warning:</strong> If a manual edit creates a conflict (same faculty or room at the same time), the system highlights it in red and asks for confirmation.
      </div>`,
      page: 'scheduler', highlight: 'generate-btn'
    },
    {
      title: '💾 Step 6 — Export Your Timetable',
      subtitle: 'Step 7 of 7 — Export',
      icon: '🎉',
      content: `<p>Congratulations! Your timetable is ready. Now export it!</p>
      <div class="tut-steps">
        <div class="tut-step"><span class="tut-num">1</span><span>Go to the <strong>"Export"</strong> page</span></div>
        <div class="tut-step"><span class="tut-num">2</span><span>Choose <strong>PDF</strong> for a print-ready document</span></div>
        <div class="tut-step"><span class="tut-num">3</span><span>Choose <strong>Excel</strong> for spreadsheet format (each class gets its own sheet)</span></div>
        <div class="tut-step"><span class="tut-num">4</span><span>Select options (Faculty View, Room View, Workload Sheet)</span></div>
        <div class="tut-step"><span class="tut-num">5</span><span>Click <strong>Download</strong> and you're done! 🎉</span></div>
      </div>
      <div class="tut-example">
        <strong>🏆 You're all set!</strong><br/>
        Your clash-free, balanced timetable is ready to share with your institution.<br/>
        Ask the assistant anything anytime by clicking the 💬 button!
      </div>`,
      page: 'export', highlight: 'export-pdf-btn'
    }
  ];

  let tutorialStep = 0;

  /* ══════ CHAT ENGINE ══════ */
  function findResponse(input) {
    const lower = input.toLowerCase();

    for (const rule of KB) {
      if (rule.patterns.some(p => lower.includes(p))) {
        // Handle dynamic status response
        if (rule.action === 'status') {
          const f = DB.getFaculty().length;
          const s = DB.getSubjects().length;
          const r = DB.getRooms().length;
          const sc = Object.keys(DB.getSchedule()).length;
          return {
            reply: `📊 **Current Status:**\n👥 Faculty: **${f}**\n📚 Subjects: **${s}**\n🏫 Rooms: **${r}**\n📅 Scheduled Classes: **${sc}**\n\n${f && s && r ? '✅ Ready to generate!' : '⚠️ Add faculty, subjects and rooms first.'}`,
            action: null, page: null
          };
        }
        return rule;
      }
    }
    return null;
  }

  function formatMessage(text) {
    // Convert markdown-like syntax to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
      .replace(/^(\d+️⃣|✅|⚠️|🔴|🟡|🟢|📝|🧭|📖|📊|💾|⚖️|📦|🌊|👑|👨‍🏫)/gm, (m) => `<span>${m}</span>`);
  }

  function addMessage(text, sender = 'bot', delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) { resolve(); return; }
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        if (sender === 'bot') {
          msg.innerHTML = `
            <div class="chat-avatar-bot"><i data-lucide="bot"></i></div>
            <div class="chat-bubble">${formatMessage(text)}</div>`;
        } else {
          msg.innerHTML = `<div class="chat-bubble">${formatMessage(text)}</div>`;
        }
        chatBody.appendChild(msg);
        lucide.createIcons({ nodes: [msg] });
        chatBody.scrollTop = chatBody.scrollHeight;
        resolve();
      }, delay);
    });
  }

  async function showTyping(duration = 900) {
    if (isTyping) return;
    isTyping = true;
    const chatBody = document.getElementById('chat-body');
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing-indicator-msg';
    typing.id = 'typing-bubble';
    typing.innerHTML = `
      <div class="chat-avatar-bot"><i data-lucide="bot"></i></div>
      <div class="chat-bubble typing-bubble">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>`;
    chatBody.appendChild(typing);
    lucide.createIcons({ nodes: [typing] });
    chatBody.scrollTop = chatBody.scrollHeight;

    return new Promise(resolve => {
      setTimeout(() => {
        typing.remove();
        isTyping = false;
        resolve();
      }, duration);
    });
  }

  async function sendMessage(input) {
    const text = (input || document.getElementById('chat-input')?.value || '').trim();
    if (!text) return;

    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.value = '';

    await addMessage(text, 'user');
    messageCount++;

    // Find response
    const rule = findResponse(text);

    await showTyping(700 + Math.random() * 400);

    if (rule) {
      await addMessage(rule.reply, 'bot');

      // Navigate if action
      if (rule.action === 'navigate' && rule.page) {
        setTimeout(() => App.navigate(rule.page), 600);
      }
      if (rule.action === 'tutorial') {
        setTimeout(() => startTutorial(), 800);
      }

      // Highlight button if specified
      if (rule.highlight) {
        setTimeout(() => {
          const el = document.getElementById(rule.highlight);
          if (el) {
            el.classList.add('pulse-highlight');
            setTimeout(() => el.classList.remove('pulse-highlight'), 3000);
          }
        }, 800);
      }
    } else {
      const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
      await addMessage(fallback, 'bot');
    }

    // Suggest chips after every 3 messages
    if (messageCount % 3 === 0) {
      showSuggestions();
    }
  }

  function showSuggestions() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;
    const suggestions = ['Start Tutorial', 'Go to Scheduler', 'Check Status', 'How to export?'];
    const shuffled = suggestions.sort(() => Math.random() - 0.5).slice(0, 3);
    const chipEl = document.createElement('div');
    chipEl.className = 'chat-suggestions';
    chipEl.innerHTML = shuffled.map(s =>
      `<button class="chat-chip" onclick="Assistant.sendMessage('${s}')">${s}</button>`
    ).join('');
    chatBody.appendChild(chipEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  /* ══════ TOGGLE CHAT ══════ */
  function toggle() {
    isOpen = !isOpen;
    const panel = document.getElementById('chat-panel');
    const fab   = document.getElementById('chat-fab');
    if (panel) panel.classList.toggle('open', isOpen);
    if (fab)   fab.classList.toggle('active', isOpen);

    if (isOpen && messageCount === 0) {
      // Welcome message
      setTimeout(async () => {
        await showTyping(600);
        await addMessage(
          "Hi there! 👋 I'm **TTP Assistant**, your smart scheduling guide!\n\nI can help you:\n🧭 **Navigate** — 'Go to faculty'\n📖 **Explain features** — 'How to add a subject?'\n🎓 **Tutorial** — 'Start tutorial'\n📊 **Status** — 'Show current status'\n\nWhat would you like to do today?",
          'bot'
        );
        showSuggestions();
      }, 200);
    }
  }

  /* ══════ TUTORIAL ENGINE ══════ */
  function startTutorial() {
    tutorialStep = 0;
    showTutorialStep();
  }

  function showTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step) { closeTutorial(); return; }

    const overlay = document.getElementById('tutorial-overlay');
    const modal   = document.getElementById('tutorial-modal');
    if (!overlay || !modal) return;

    // Navigate to the page for this step
    if (step.page) App.navigate(step.page);

    // Update modal content
    document.getElementById('tut-title').textContent    = step.title;
    document.getElementById('tut-subtitle').textContent = step.subtitle;
    document.getElementById('tut-body').innerHTML       = step.content;
    document.getElementById('tut-icon').textContent     = step.icon;

    // Progress dots
    const dots = document.getElementById('tut-dots');
    dots.innerHTML = TUTORIAL_STEPS.map((_, i) =>
      `<div class="tut-dot ${i === tutorialStep ? 'active' : i < tutorialStep ? 'done' : ''}"></div>`
    ).join('');

    // Update buttons
    const prevBtn = document.getElementById('tut-prev');
    const nextBtn = document.getElementById('tut-next');
    if (prevBtn) prevBtn.style.display = tutorialStep === 0 ? 'none' : 'flex';
    if (nextBtn) nextBtn.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? '🎉 Finish' : 'Next →';

    // Progress bar
    const pct = Math.round(((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100);
    const progressFill = document.getElementById('tut-progress-fill');
    if (progressFill) progressFill.style.width = `${pct}%`;

    overlay.classList.remove('hidden');
    overlay.classList.add('active');

    // Highlight target element
    if (step.highlight) {
      setTimeout(() => {
        const el = document.getElementById(step.highlight);
        if (el) {
          el.classList.add('tut-highlight');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }

    // Remove previous highlights
    document.querySelectorAll('.tut-highlight').forEach(el => {
      if (!step.highlight || el.id !== step.highlight) {
        el.classList.remove('tut-highlight');
      }
    });
  }

  function nextTutorialStep() {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      tutorialStep++;
      showTutorialStep();
    } else {
      closeTutorial();
      showToast('🎉 Tutorial complete! You\'re ready to build amazing timetables!', 'success', 5000);
    }
  }

  function prevTutorialStep() {
    if (tutorialStep > 0) {
      tutorialStep--;
      showTutorialStep();
    }
  }

  function closeTutorial() {
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
    document.querySelectorAll('.tut-highlight').forEach(el => el.classList.remove('tut-highlight'));
  }

  /* ══════ INIT ══════ */
  function init() {
    // FAB button
    document.getElementById('chat-fab')?.addEventListener('click', toggle);
    document.getElementById('chat-close-btn')?.addEventListener('click', toggle);

    // Send message
    document.getElementById('chat-send-btn')?.addEventListener('click', () => sendMessage());
    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Tutorial buttons
    document.getElementById('tut-next')?.addEventListener('click', nextTutorialStep);
    document.getElementById('tut-prev')?.addEventListener('click', prevTutorialStep);
    document.getElementById('tut-close')?.addEventListener('click', closeTutorial);
    document.getElementById('tut-skip')?.addEventListener('click', closeTutorial);
    document.getElementById('tutorial-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeTutorial();
    });

    // Tutorial launch from topbar
    document.getElementById('tutorial-btn')?.addEventListener('click', startTutorial);
  }

  return { init, toggle, sendMessage, startTutorial, closeTutorial };
})();
