/* ═══════════════════════════════════════════
   I18N.JS — Internationalization Module
   Supports: EN, ES, FR, DE, HI, AR, TA, ZH, JA, PT
═══════════════════════════════════════════ */

const I18n = (() => {
  const STORAGE_KEY = 'ttp_language';

  const LANGUAGES = [
    { code: 'en', name: 'English',    nativeName: 'English',    flag: '🇬🇧', dir: 'ltr' },
    { code: 'es', name: 'Spanish',    nativeName: 'Español',    flag: '🇪🇸', dir: 'ltr' },
    { code: 'fr', name: 'French',     nativeName: 'Français',   flag: '🇫🇷', dir: 'ltr' },
    { code: 'de', name: 'German',     nativeName: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
    { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',     flag: '🇮🇳', dir: 'ltr' },
    { code: 'ar', name: 'Arabic',     nativeName: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
    { code: 'ta', name: 'Tamil',      nativeName: 'தமிழ்',     flag: '🇮🇳', dir: 'ltr' },
    { code: 'zh', name: 'Chinese',    nativeName: '中文',        flag: '🇨🇳', dir: 'ltr' },
    { code: 'ja', name: 'Japanese',   nativeName: '日本語',      flag: '🇯🇵', dir: 'ltr' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português',  flag: '🇧🇷', dir: 'ltr' },
  ];

  /* ════════════════════════════════════════
     TRANSLATION DICTIONARY
  ════════════════════════════════════════ */
  const T = {
    en: {
      'login.subtitle': 'Smart Scheduling System',
      'login.email': 'Email Address', 'login.password': 'Password',
      'login.signIn': 'Sign In', 'login.demoCredentials': 'Demo Credentials',
      'login.emailPh': 'admin@school.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'Invalid credentials. Please try again.',
      'nav.main': 'Main', 'nav.management': 'Management', 'nav.system': 'System',
      'nav.dashboard': 'Dashboard', 'nav.timetable': 'Timetable',
      'nav.autoScheduler': 'Auto Scheduler', 'nav.faculty': 'Faculty',
      'nav.subjectsRooms': 'Subjects & Rooms', 'nav.workload': 'Workload',
      'nav.export': 'Export', 'nav.settings': 'Settings',
      'nav.administrator': 'Administrator', 'nav.teacher': 'Teacher',
      'topbar.tutorial': 'Tutorial',
      'dash.title': 'Dashboard', 'dash.quickGenerate': 'Quick Generate',
      'dash.welcomeBack': 'Welcome back,',
      'dash.facultyMembers': 'Faculty Members', 'dash.subjects': 'Subjects',
      'dash.classrooms': 'Classrooms', 'dash.scheduledSlots': 'Scheduled Slots',
      'dash.recentActivity': 'Recent Activity', 'dash.quickActions': 'Quick Actions',
      'dash.workloadOverview': 'Workload Overview', 'dash.noActivity': 'No activity yet',
      'dash.noFacultyMini': 'No faculty added', 'dash.addFaculty': 'Add Faculty',
      'dash.addSubject': 'Add Subject', 'dash.generate': 'Generate',
      'faculty.title': 'Faculty Management',
      'faculty.subtitle': 'Manage teachers and their availability',
      'faculty.addFaculty': 'Add Faculty', 'faculty.search': 'Search faculty...',
      'faculty.allDepts': 'All Departments', 'faculty.thFaculty': 'Faculty',
      'faculty.thDept': 'Department', 'faculty.thSubjects': 'Subjects',
      'faculty.thHours': 'Max Hours/Week', 'faculty.thAvail': 'Availability',
      'faculty.thActions': 'Actions',
      'faculty.empty': 'No faculty added yet. Click "Add Faculty" to get started.',
      'subjects.title': 'Subjects & Classrooms',
      'subjects.subtitle': 'Configure subjects and room allocations',
      'subjects.addSubject': 'Add Subject', 'subjects.addRoom': 'Add Room',
      'subjects.heading': 'Subjects', 'subjects.roomsHeading': 'Classrooms',
      'subjects.emptySubjects': 'No subjects yet', 'subjects.emptyRooms': 'No rooms yet',
      'scheduler.title': 'Auto Scheduler',
      'scheduler.subtitle': 'Generate a clash-free timetable automatically',
      'scheduler.config': 'Configuration', 'scheduler.periods': 'Periods Per Day',
      'scheduler.days': 'Working Days', 'scheduler.classes': 'Classes / Sections',
      'scheduler.strategy': 'Strategy', 'scheduler.strategyBalanced': 'Balanced Workload',
      'scheduler.strategyCompact': 'Compact Schedule', 'scheduler.strategySpread': 'Spread Evenly',
      'scheduler.generate': 'Generate Timetable', 'scheduler.clear': 'Clear Schedule',
      'scheduler.log': 'Scheduler Log', 'scheduler.classPlaceholder': 'e.g. CS-A',
      'scheduler.ready': 'Ready to generate. Configure settings and press Generate.',
      'tt.title': 'Timetable', 'tt.subtitle': 'View, edit and manage your schedule',
      'tt.print': 'Print', 'tt.export': 'Export', 'tt.viewBy': 'View By',
      'tt.class': 'Class', 'tt.faculty': 'Faculty', 'tt.room': 'Room',
      'tt.select': 'Select', 'tt.noTimetable': 'No Timetable Generated',
      'tt.noTimetableDesc': 'Go to Auto Scheduler and generate a timetable first.',
      'tt.goScheduler': 'Go to Scheduler',
      'workload.title': 'Workload Analytics',
      'workload.subtitle': 'Monitor and balance teaching loads',
      'workload.autoBalance': 'Auto Balance', 'workload.noFaculty': 'No Faculty Added',
      'workload.noFacultyDesc': 'Add faculty members to see workload analytics.',
      'export.title': 'Export',
      'export.subtitle': 'Download your timetable in multiple formats',
      'export.pdfTitle': 'PDF Export',
      'export.pdfDesc': 'Download a print-ready PDF of the complete timetable with all slots, faculty and room details.',
      'export.allClasses': 'All Classes', 'export.facultyView': 'Faculty View',
      'export.roomView': 'Room View', 'export.downloadPdf': 'Download PDF',
      'export.excelTitle': 'Excel Export',
      'export.excelDesc': 'Export as an XLSX spreadsheet. Each class gets its own sheet with full schedule details.',
      'export.summarySheet': 'Summary Sheet', 'export.workloadSheet': 'Workload Sheet',
      'export.downloadExcel': 'Download Excel', 'export.printTitle': 'Print View',
      'export.printDesc': 'Open a printer-friendly view that strips styles for clean, ink-efficient output.',
      'export.gridLines': 'Show Grid Lines', 'export.openPrint': 'Open Print View',
      'settings.title': 'Settings',
      'settings.subtitle': 'Manage system configuration and users',
      'settings.institution': 'Institution', 'settings.instName': 'Institution Name',
      'settings.semester': 'Semester', 'settings.academicYear': 'Academic Year',
      'settings.periodDuration': 'Period Duration (minutes)',
      'settings.saveSettings': 'Save Settings', 'settings.userAccounts': 'User Accounts',
      'settings.addUser': 'Add User', 'settings.periodTimings': 'Period Timings',
      'settings.addPeriod': 'Add Period', 'settings.dangerZone': 'Danger Zone',
      'settings.dangerDesc': 'These actions are irreversible. Proceed with caution.',
      'settings.clearAll': 'Clear All Data', 'settings.resetApp': 'Reset App',
      'settings.language': 'Language', 'settings.languageDesc': 'Select your preferred display language',
      'modal.addFaculty': 'Add Faculty', 'modal.editFaculty': 'Edit Faculty',
      'modal.fullName': 'Full Name *', 'modal.email': 'Email',
      'modal.dept': 'Department *', 'modal.maxHours': 'Max Hours / Week',
      'modal.subjectExpertise': 'Subject Expertise (comma-separated)',
      'modal.availability': 'Availability', 'modal.availHint': '(click cells to toggle)',
      'modal.cancel': 'Cancel', 'modal.saveFaculty': 'Save Faculty',
      'modal.addSubject': 'Add Subject', 'modal.editSubject': 'Edit Subject',
      'modal.subjectName': 'Subject Name *', 'modal.subjectCode': 'Subject Code',
      'modal.hoursWeek': 'Hours Per Week *', 'modal.roomTypeReq': 'Room Type Required',
      'modal.lectureHall': 'Lecture Hall', 'modal.computerLab': 'Computer Lab',
      'modal.seminarRoom': 'Seminar Room', 'modal.any': 'Any',
      'modal.assignedFaculty': 'Assigned Faculty', 'modal.selectFaculty': '-- Select Faculty --',
      'modal.colorTag': 'Color Tag', 'modal.saveSubject': 'Save Subject',
      'modal.addRoom': 'Add Classroom', 'modal.editRoom': 'Edit Classroom',
      'modal.roomName': 'Room Name / Number *', 'modal.capacity': 'Capacity',
      'modal.roomType': 'Room Type', 'modal.saveRoom': 'Save Room',
      'modal.editSlot': 'Edit Slot', 'modal.subject': 'Subject',
      'modal.faculty': 'Faculty', 'modal.room': 'Room',
      'modal.clearSlot': 'Clear Slot', 'modal.save': 'Save',
      'modal.addUser': 'Add User', 'modal.password': 'Password *',
      'modal.role': 'Role', 'modal.administrator': 'Administrator',
      'modal.teacher': 'Teacher', 'modal.saveUser': 'Save User',
      'chat.placeholder': 'Ask me anything...',
      'lang.title': 'Language', 'lang.select': 'Select Language',
    },

    es: {
      'login.subtitle': 'Sistema de Programación Inteligente',
      'login.email': 'Correo Electrónico', 'login.password': 'Contraseña',
      'login.signIn': 'Iniciar Sesión', 'login.demoCredentials': 'Credenciales de Demo',
      'login.emailPh': 'admin@escuela.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'Credenciales inválidas. Por favor intente de nuevo.',
      'nav.main': 'Principal', 'nav.management': 'Gestión', 'nav.system': 'Sistema',
      'nav.dashboard': 'Panel', 'nav.timetable': 'Horario',
      'nav.autoScheduler': 'Programador Auto', 'nav.faculty': 'Profesores',
      'nav.subjectsRooms': 'Materias y Aulas', 'nav.workload': 'Carga Laboral',
      'nav.export': 'Exportar', 'nav.settings': 'Configuración',
      'nav.administrator': 'Administrador', 'nav.teacher': 'Profesor',
      'topbar.tutorial': 'Tutorial',
      'dash.title': 'Panel', 'dash.quickGenerate': 'Generar Rápido',
      'dash.facultyMembers': 'Miembros del Profesorado', 'dash.subjects': 'Materias',
      'dash.classrooms': 'Aulas', 'dash.scheduledSlots': 'Slots Programados',
      'dash.recentActivity': 'Actividad Reciente', 'dash.quickActions': 'Acciones Rápidas',
      'dash.workloadOverview': 'Resumen de Carga', 'dash.noActivity': 'Sin actividad aún',
      'dash.noFacultyMini': 'Sin profesores añadidos', 'dash.addFaculty': 'Añadir Profesor',
      'dash.addSubject': 'Añadir Materia', 'dash.generate': 'Generar',
      'faculty.title': 'Gestión de Profesores',
      'faculty.subtitle': 'Gestionar profesores y su disponibilidad',
      'faculty.addFaculty': 'Añadir Profesor', 'faculty.search': 'Buscar profesores...',
      'faculty.allDepts': 'Todos los Departamentos', 'faculty.thFaculty': 'Profesor',
      'faculty.thDept': 'Departamento', 'faculty.thSubjects': 'Materias',
      'faculty.thHours': 'Horas Máx/Semana', 'faculty.thAvail': 'Disponibilidad',
      'faculty.thActions': 'Acciones',
      'faculty.empty': 'No hay profesores. Haga clic en "Añadir Profesor" para comenzar.',
      'subjects.title': 'Materias y Aulas',
      'subjects.subtitle': 'Configurar materias y asignación de aulas',
      'subjects.addSubject': 'Añadir Materia', 'subjects.addRoom': 'Añadir Aula',
      'subjects.heading': 'Materias', 'subjects.roomsHeading': 'Aulas',
      'subjects.emptySubjects': 'Sin materias aún', 'subjects.emptyRooms': 'Sin aulas aún',
      'scheduler.title': 'Programador Automático',
      'scheduler.subtitle': 'Generar un horario sin conflictos automáticamente',
      'scheduler.config': 'Configuración', 'scheduler.periods': 'Períodos por Día',
      'scheduler.days': 'Días Laborables', 'scheduler.classes': 'Clases / Secciones',
      'scheduler.strategy': 'Estrategia', 'scheduler.strategyBalanced': 'Carga Equilibrada',
      'scheduler.strategyCompact': 'Horario Compacto', 'scheduler.strategySpread': 'Distribuir Uniformemente',
      'scheduler.generate': 'Generar Horario', 'scheduler.clear': 'Limpiar Horario',
      'scheduler.log': 'Registro del Programador', 'scheduler.classPlaceholder': 'p.ej. CS-A',
      'scheduler.ready': 'Listo para generar. Configure los ajustes y presione Generar.',
      'tt.title': 'Horario', 'tt.subtitle': 'Ver, editar y gestionar su horario',
      'tt.print': 'Imprimir', 'tt.export': 'Exportar', 'tt.viewBy': 'Ver Por',
      'tt.class': 'Clase', 'tt.faculty': 'Profesor', 'tt.room': 'Aula',
      'tt.select': 'Seleccionar', 'tt.noTimetable': 'Sin Horario Generado',
      'tt.noTimetableDesc': 'Vaya al Programador Automático y genere un horario primero.',
      'tt.goScheduler': 'Ir al Programador',
      'workload.title': 'Análisis de Carga Laboral',
      'workload.subtitle': 'Monitorear y equilibrar las cargas de enseñanza',
      'workload.autoBalance': 'Auto Equilibrar', 'workload.noFaculty': 'Sin Profesores Añadidos',
      'workload.noFacultyDesc': 'Añada profesores para ver el análisis de carga laboral.',
      'export.title': 'Exportar', 'export.subtitle': 'Descargar su horario en múltiples formatos',
      'export.pdfTitle': 'Exportar PDF',
      'export.pdfDesc': 'Descargue un PDF listo para imprimir con todos los detalles del horario.',
      'export.allClasses': 'Todas las Clases', 'export.facultyView': 'Vista de Profesor',
      'export.roomView': 'Vista de Aula', 'export.downloadPdf': 'Descargar PDF',
      'export.excelTitle': 'Exportar Excel',
      'export.excelDesc': 'Exportar como hoja de cálculo XLSX. Cada clase tiene su propia hoja.',
      'export.summarySheet': 'Hoja Resumen', 'export.workloadSheet': 'Hoja de Carga',
      'export.downloadExcel': 'Descargar Excel', 'export.printTitle': 'Vista de Impresión',
      'export.printDesc': 'Abrir una vista lista para imprimir con estilos limpios.',
      'export.gridLines': 'Mostrar Líneas de Cuadrícula', 'export.openPrint': 'Abrir Vista de Impresión',
      'settings.title': 'Configuración', 'settings.subtitle': 'Gestionar configuración del sistema y usuarios',
      'settings.institution': 'Institución', 'settings.instName': 'Nombre de la Institución',
      'settings.semester': 'Semestre', 'settings.academicYear': 'Año Académico',
      'settings.periodDuration': 'Duración del Período (minutos)',
      'settings.saveSettings': 'Guardar Configuración', 'settings.userAccounts': 'Cuentas de Usuario',
      'settings.addUser': 'Añadir Usuario', 'settings.periodTimings': 'Tiempos de Período',
      'settings.addPeriod': 'Añadir Período', 'settings.dangerZone': 'Zona de Peligro',
      'settings.dangerDesc': 'Estas acciones son irreversibles. Proceda con precaución.',
      'settings.clearAll': 'Borrar Todos los Datos', 'settings.resetApp': 'Reiniciar App',
      'settings.language': 'Idioma', 'settings.languageDesc': 'Seleccione su idioma de visualización preferido',
      'modal.addFaculty': 'Añadir Profesor', 'modal.editFaculty': 'Editar Profesor',
      'modal.fullName': 'Nombre Completo *', 'modal.email': 'Correo Electrónico',
      'modal.dept': 'Departamento *', 'modal.maxHours': 'Horas Máx / Semana',
      'modal.subjectExpertise': 'Materias de Experiencia (separadas por comas)',
      'modal.availability': 'Disponibilidad', 'modal.availHint': '(haga clic en celdas para alternar)',
      'modal.cancel': 'Cancelar', 'modal.saveFaculty': 'Guardar Profesor',
      'modal.addSubject': 'Añadir Materia', 'modal.editSubject': 'Editar Materia',
      'modal.subjectName': 'Nombre de Materia *', 'modal.subjectCode': 'Código de Materia',
      'modal.hoursWeek': 'Horas por Semana *', 'modal.roomTypeReq': 'Tipo de Aula Requerido',
      'modal.lectureHall': 'Sala de Conferencias', 'modal.computerLab': 'Laboratorio de Computación',
      'modal.seminarRoom': 'Sala de Seminario', 'modal.any': 'Cualquiera',
      'modal.assignedFaculty': 'Profesor Asignado', 'modal.selectFaculty': '-- Seleccionar Profesor --',
      'modal.colorTag': 'Etiqueta de Color', 'modal.saveSubject': 'Guardar Materia',
      'modal.addRoom': 'Añadir Aula', 'modal.editRoom': 'Editar Aula',
      'modal.roomName': 'Nombre / Número de Aula *', 'modal.capacity': 'Capacidad',
      'modal.roomType': 'Tipo de Aula', 'modal.saveRoom': 'Guardar Aula',
      'modal.editSlot': 'Editar Slot', 'modal.subject': 'Materia',
      'modal.faculty': 'Profesor', 'modal.room': 'Aula',
      'modal.clearSlot': 'Limpiar Slot', 'modal.save': 'Guardar',
      'modal.addUser': 'Añadir Usuario', 'modal.password': 'Contraseña *',
      'modal.role': 'Rol', 'modal.administrator': 'Administrador',
      'modal.teacher': 'Profesor', 'modal.saveUser': 'Guardar Usuario',
      'chat.placeholder': 'Pregúntame lo que sea...',
      'lang.title': 'Idioma', 'lang.select': 'Seleccionar Idioma',
    },

    fr: {
      'login.subtitle': 'Système de planification intelligent',
      'login.email': 'Adresse e-mail', 'login.password': 'Mot de passe',
      'login.signIn': 'Se connecter', 'login.demoCredentials': 'Identifiants de démo',
      'login.emailPh': 'admin@ecole.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'Identifiants invalides. Veuillez réessayer.',
      'nav.main': 'Principal', 'nav.management': 'Gestion', 'nav.system': 'Système',
      'nav.dashboard': 'Tableau de bord', 'nav.timetable': 'Emploi du temps',
      'nav.autoScheduler': 'Planificateur auto', 'nav.faculty': 'Enseignants',
      'nav.subjectsRooms': 'Matières & Salles', 'nav.workload': 'Charge de travail',
      'nav.export': 'Exporter', 'nav.settings': 'Paramètres',
      'nav.administrator': 'Administrateur', 'nav.teacher': 'Enseignant',
      'topbar.tutorial': 'Tutoriel',
      'dash.title': 'Tableau de bord', 'dash.quickGenerate': 'Générer rapidement',
      'dash.facultyMembers': 'Corps enseignant', 'dash.subjects': 'Matières',
      'dash.classrooms': 'Salles de classe', 'dash.scheduledSlots': 'Créneaux planifiés',
      'dash.recentActivity': 'Activité récente', 'dash.quickActions': 'Actions rapides',
      'dash.workloadOverview': 'Aperçu de la charge', 'dash.noActivity': 'Aucune activité encore',
      'dash.noFacultyMini': 'Aucun enseignant ajouté', 'dash.addFaculty': 'Ajouter un enseignant',
      'dash.addSubject': 'Ajouter une matière', 'dash.generate': 'Générer',
      'faculty.title': 'Gestion des enseignants',
      'faculty.subtitle': 'Gérer les enseignants et leur disponibilité',
      'faculty.addFaculty': 'Ajouter un enseignant', 'faculty.search': 'Rechercher des enseignants...',
      'faculty.allDepts': 'Tous les départements', 'faculty.thFaculty': 'Enseignant',
      'faculty.thDept': 'Département', 'faculty.thSubjects': 'Matières',
      'faculty.thHours': 'Heures max/semaine', 'faculty.thAvail': 'Disponibilité',
      'faculty.thActions': 'Actions',
      'faculty.empty': 'Aucun enseignant ajouté. Cliquez sur "Ajouter un enseignant" pour commencer.',
      'subjects.title': 'Matières & Salles de classe',
      'subjects.subtitle': 'Configurer les matières et les allocations de salles',
      'subjects.addSubject': 'Ajouter une matière', 'subjects.addRoom': 'Ajouter une salle',
      'subjects.heading': 'Matières', 'subjects.roomsHeading': 'Salles de classe',
      'subjects.emptySubjects': 'Aucune matière encore', 'subjects.emptyRooms': 'Aucune salle encore',
      'scheduler.title': 'Planificateur automatique',
      'scheduler.subtitle': 'Générer un emploi du temps sans conflit automatiquement',
      'scheduler.config': 'Configuration', 'scheduler.periods': 'Périodes par jour',
      'scheduler.days': 'Jours ouvrables', 'scheduler.classes': 'Classes / Sections',
      'scheduler.strategy': 'Stratégie', 'scheduler.strategyBalanced': 'Charge équilibrée',
      'scheduler.strategyCompact': 'Emploi du temps compact', 'scheduler.strategySpread': 'Répartir uniformément',
      'scheduler.generate': "Générer l'emploi du temps", 'scheduler.clear': "Effacer l'emploi du temps",
      'scheduler.log': 'Journal du planificateur', 'scheduler.classPlaceholder': 'ex. CS-A',
      'scheduler.ready': 'Prêt à générer. Configurez les paramètres et appuyez sur Générer.',
      'tt.title': 'Emploi du temps', 'tt.subtitle': "Voir, modifier et gérer votre emploi du temps",
      'tt.print': 'Imprimer', 'tt.export': 'Exporter', 'tt.viewBy': 'Voir par',
      'tt.class': 'Classe', 'tt.faculty': 'Enseignant', 'tt.room': 'Salle',
      'tt.select': 'Sélectionner', 'tt.noTimetable': "Aucun emploi du temps généré",
      'tt.noTimetableDesc': "Allez au Planificateur automatique et générez d'abord un emploi du temps.",
      'tt.goScheduler': 'Aller au planificateur',
      'workload.title': 'Analyse de la charge de travail',
      'workload.subtitle': "Surveiller et équilibrer les charges d'enseignement",
      'workload.autoBalance': 'Auto-équilibrer', 'workload.noFaculty': 'Aucun enseignant ajouté',
      'workload.noFacultyDesc': "Ajoutez des enseignants pour voir l'analyse de la charge de travail.",
      'export.title': 'Exporter', 'export.subtitle': 'Télécharger votre emploi du temps dans plusieurs formats',
      'export.pdfTitle': 'Export PDF',
      'export.pdfDesc': "Téléchargez un PDF prêt à imprimer avec tous les détails de l'emploi du temps.",
      'export.allClasses': 'Toutes les classes', 'export.facultyView': 'Vue enseignant',
      'export.roomView': 'Vue salle', 'export.downloadPdf': 'Télécharger PDF',
      'export.excelTitle': 'Export Excel',
      'export.excelDesc': 'Exporter sous forme de feuille de calcul XLSX. Chaque classe a sa propre feuille.',
      'export.summarySheet': 'Feuille récapitulative', 'export.workloadSheet': 'Feuille de charge',
      'export.downloadExcel': 'Télécharger Excel', 'export.printTitle': 'Vue impression',
      'export.printDesc': "Ouvrir une vue optimisée pour l'impression.",
      'export.gridLines': 'Afficher les lignes de grille', 'export.openPrint': "Ouvrir la vue impression",
      'settings.title': 'Paramètres', 'settings.subtitle': 'Gérer la configuration du système et les utilisateurs',
      'settings.institution': 'Institution', 'settings.instName': "Nom de l'institution",
      'settings.semester': 'Semestre', 'settings.academicYear': 'Année académique',
      'settings.periodDuration': 'Durée de la période (minutes)',
      'settings.saveSettings': 'Enregistrer les paramètres', 'settings.userAccounts': 'Comptes utilisateurs',
      'settings.addUser': 'Ajouter un utilisateur', 'settings.periodTimings': 'Horaires des périodes',
      'settings.addPeriod': 'Ajouter une période', 'settings.dangerZone': 'Zone dangereuse',
      'settings.dangerDesc': 'Ces actions sont irréversibles. Procédez avec prudence.',
      'settings.clearAll': 'Effacer toutes les données', 'settings.resetApp': "Réinitialiser l'application",
      'settings.language': 'Langue', 'settings.languageDesc': "Sélectionnez votre langue d'affichage préférée",
      'modal.addFaculty': 'Ajouter un enseignant', 'modal.editFaculty': "Modifier l'enseignant",
      'modal.fullName': 'Nom complet *', 'modal.email': 'E-mail',
      'modal.dept': 'Département *', 'modal.maxHours': 'Heures max / semaine',
      'modal.subjectExpertise': 'Expertise en matières (séparées par des virgules)',
      'modal.availability': 'Disponibilité', 'modal.availHint': '(cliquez sur les cellules pour basculer)',
      'modal.cancel': 'Annuler', 'modal.saveFaculty': "Enregistrer l'enseignant",
      'modal.addSubject': 'Ajouter une matière', 'modal.editSubject': 'Modifier la matière',
      'modal.subjectName': 'Nom de la matière *', 'modal.subjectCode': 'Code de la matière',
      'modal.hoursWeek': 'Heures par semaine *', 'modal.roomTypeReq': 'Type de salle requis',
      'modal.lectureHall': 'Amphithéâtre', 'modal.computerLab': 'Salle informatique',
      'modal.seminarRoom': 'Salle de séminaire', 'modal.any': "N'importe quelle",
      'modal.assignedFaculty': 'Enseignant assigné', 'modal.selectFaculty': '-- Sélectionner un enseignant --',
      'modal.colorTag': 'Étiquette couleur', 'modal.saveSubject': 'Enregistrer la matière',
      'modal.addRoom': 'Ajouter une salle', 'modal.editRoom': 'Modifier la salle',
      'modal.roomName': 'Nom / Numéro de salle *', 'modal.capacity': 'Capacité',
      'modal.roomType': 'Type de salle', 'modal.saveRoom': 'Enregistrer la salle',
      'modal.editSlot': 'Modifier le créneau', 'modal.subject': 'Matière',
      'modal.faculty': 'Enseignant', 'modal.room': 'Salle',
      'modal.clearSlot': 'Effacer le créneau', 'modal.save': 'Enregistrer',
      'modal.addUser': 'Ajouter un utilisateur', 'modal.password': 'Mot de passe *',
      'modal.role': 'Rôle', 'modal.administrator': 'Administrateur',
      'modal.teacher': 'Enseignant', 'modal.saveUser': "Enregistrer l'utilisateur",
      'chat.placeholder': 'Demandez-moi n\'importe quoi...',
      'lang.title': 'Langue', 'lang.select': 'Sélectionner la langue',
    },

    de: {
      'login.subtitle': 'Intelligentes Planungssystem',
      'login.email': 'E-Mail-Adresse', 'login.password': 'Passwort',
      'login.signIn': 'Anmelden', 'login.demoCredentials': 'Demo-Anmeldedaten',
      'login.emailPh': 'admin@schule.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.',
      'nav.main': 'Hauptmenü', 'nav.management': 'Verwaltung', 'nav.system': 'System',
      'nav.dashboard': 'Dashboard', 'nav.timetable': 'Stundenplan',
      'nav.autoScheduler': 'Auto-Planer', 'nav.faculty': 'Lehrkräfte',
      'nav.subjectsRooms': 'Fächer & Räume', 'nav.workload': 'Arbeitsbelastung',
      'nav.export': 'Exportieren', 'nav.settings': 'Einstellungen',
      'nav.administrator': 'Administrator', 'nav.teacher': 'Lehrer',
      'topbar.tutorial': 'Tutorial',
      'dash.title': 'Dashboard', 'dash.quickGenerate': 'Schnell generieren',
      'dash.facultyMembers': 'Lehrkräfte', 'dash.subjects': 'Fächer',
      'dash.classrooms': 'Klassenzimmer', 'dash.scheduledSlots': 'Geplante Slots',
      'dash.recentActivity': 'Letzte Aktivität', 'dash.quickActions': 'Schnellaktionen',
      'dash.workloadOverview': 'Übersicht Arbeitsbelastung', 'dash.noActivity': 'Noch keine Aktivität',
      'dash.noFacultyMini': 'Keine Lehrkräfte hinzugefügt', 'dash.addFaculty': 'Lehrkraft hinzufügen',
      'dash.addSubject': 'Fach hinzufügen', 'dash.generate': 'Generieren',
      'faculty.title': 'Lehrkraftverwaltung',
      'faculty.subtitle': 'Lehrkräfte und deren Verfügbarkeit verwalten',
      'faculty.addFaculty': 'Lehrkraft hinzufügen', 'faculty.search': 'Lehrkräfte suchen...',
      'faculty.allDepts': 'Alle Abteilungen', 'faculty.thFaculty': 'Lehrkraft',
      'faculty.thDept': 'Abteilung', 'faculty.thSubjects': 'Fächer',
      'faculty.thHours': 'Max. Std./Woche', 'faculty.thAvail': 'Verfügbarkeit',
      'faculty.thActions': 'Aktionen',
      'faculty.empty': 'Keine Lehrkräfte hinzugefügt. Klicken Sie auf "Lehrkraft hinzufügen".',
      'subjects.title': 'Fächer & Klassenzimmer',
      'subjects.subtitle': 'Fächer und Raumzuweisungen konfigurieren',
      'subjects.addSubject': 'Fach hinzufügen', 'subjects.addRoom': 'Raum hinzufügen',
      'subjects.heading': 'Fächer', 'subjects.roomsHeading': 'Klassenzimmer',
      'subjects.emptySubjects': 'Noch keine Fächer', 'subjects.emptyRooms': 'Noch keine Räume',
      'scheduler.title': 'Auto-Planer',
      'scheduler.subtitle': 'Konfliktfreien Stundenplan automatisch erstellen',
      'scheduler.config': 'Konfiguration', 'scheduler.periods': 'Stunden pro Tag',
      'scheduler.days': 'Arbeitstage', 'scheduler.classes': 'Klassen / Abschnitte',
      'scheduler.strategy': 'Strategie', 'scheduler.strategyBalanced': 'Ausgeglichene Belastung',
      'scheduler.strategyCompact': 'Kompakter Stundenplan', 'scheduler.strategySpread': 'Gleichmäßig verteilen',
      'scheduler.generate': 'Stundenplan generieren', 'scheduler.clear': 'Stundenplan löschen',
      'scheduler.log': 'Planer-Protokoll', 'scheduler.classPlaceholder': 'z.B. CS-A',
      'scheduler.ready': 'Bereit zum Generieren. Einstellungen konfigurieren und Generieren drücken.',
      'tt.title': 'Stundenplan', 'tt.subtitle': 'Stundenplan anzeigen, bearbeiten und verwalten',
      'tt.print': 'Drucken', 'tt.export': 'Exportieren', 'tt.viewBy': 'Ansicht nach',
      'tt.class': 'Klasse', 'tt.faculty': 'Lehrkraft', 'tt.room': 'Raum',
      'tt.select': 'Auswählen', 'tt.noTimetable': 'Kein Stundenplan generiert',
      'tt.noTimetableDesc': 'Gehen Sie zum Auto-Planer und erstellen Sie zuerst einen Stundenplan.',
      'tt.goScheduler': 'Zum Planer',
      'workload.title': 'Arbeitsbelastungsanalyse',
      'workload.subtitle': 'Unterrichtsbelastungen überwachen und ausgleichen',
      'workload.autoBalance': 'Auto-Ausgleich', 'workload.noFaculty': 'Keine Lehrkräfte hinzugefügt',
      'workload.noFacultyDesc': 'Fügen Sie Lehrkräfte hinzu, um die Arbeitsbelastungsanalyse zu sehen.',
      'export.title': 'Exportieren', 'export.subtitle': 'Stundenplan in mehreren Formaten herunterladen',
      'export.pdfTitle': 'PDF-Export',
      'export.pdfDesc': 'Druckfertiges PDF mit allen Stunden-, Lehrkraft- und Raumdetails herunterladen.',
      'export.allClasses': 'Alle Klassen', 'export.facultyView': 'Lehrkraftansicht',
      'export.roomView': 'Raumansicht', 'export.downloadPdf': 'PDF herunterladen',
      'export.excelTitle': 'Excel-Export',
      'export.excelDesc': 'Als XLSX-Tabelle exportieren. Jede Klasse bekommt ihr eigenes Blatt.',
      'export.summarySheet': 'Zusammenfassungsblatt', 'export.workloadSheet': 'Arbeitsblatt',
      'export.downloadExcel': 'Excel herunterladen', 'export.printTitle': 'Druckansicht',
      'export.printDesc': 'Druckerfreundliche Ansicht öffnen.',
      'export.gridLines': 'Gitterlinien anzeigen', 'export.openPrint': 'Druckansicht öffnen',
      'settings.title': 'Einstellungen', 'settings.subtitle': 'Systemkonfiguration und Benutzer verwalten',
      'settings.institution': 'Institution', 'settings.instName': 'Institutionsname',
      'settings.semester': 'Semester', 'settings.academicYear': 'Studienjahr',
      'settings.periodDuration': 'Stundendauer (Minuten)',
      'settings.saveSettings': 'Einstellungen speichern', 'settings.userAccounts': 'Benutzerkonten',
      'settings.addUser': 'Benutzer hinzufügen', 'settings.periodTimings': 'Stundenzeiten',
      'settings.addPeriod': 'Stunde hinzufügen', 'settings.dangerZone': 'Gefahrenzone',
      'settings.dangerDesc': 'Diese Aktionen sind unwiderruflich. Mit Vorsicht vorgehen.',
      'settings.clearAll': 'Alle Daten löschen', 'settings.resetApp': 'App zurücksetzen',
      'settings.language': 'Sprache', 'settings.languageDesc': 'Bevorzugte Anzeigesprache auswählen',
      'modal.addFaculty': 'Lehrkraft hinzufügen', 'modal.editFaculty': 'Lehrkraft bearbeiten',
      'modal.fullName': 'Vollständiger Name *', 'modal.email': 'E-Mail',
      'modal.dept': 'Abteilung *', 'modal.maxHours': 'Max. Std. / Woche',
      'modal.subjectExpertise': 'Fachkenntnisse (kommagetrennt)',
      'modal.availability': 'Verfügbarkeit', 'modal.availHint': '(Klicken Sie auf Zellen zum Umschalten)',
      'modal.cancel': 'Abbrechen', 'modal.saveFaculty': 'Lehrkraft speichern',
      'modal.addSubject': 'Fach hinzufügen', 'modal.editSubject': 'Fach bearbeiten',
      'modal.subjectName': 'Fachname *', 'modal.subjectCode': 'Fachcode',
      'modal.hoursWeek': 'Stunden pro Woche *', 'modal.roomTypeReq': 'Benötigter Raumtyp',
      'modal.lectureHall': 'Hörsaal', 'modal.computerLab': 'Computerlabor',
      'modal.seminarRoom': 'Seminarraum', 'modal.any': 'Beliebig',
      'modal.assignedFaculty': 'Zugewiesene Lehrkraft', 'modal.selectFaculty': '-- Lehrkraft auswählen --',
      'modal.colorTag': 'Farbmarkierung', 'modal.saveSubject': 'Fach speichern',
      'modal.addRoom': 'Klassenzimmer hinzufügen', 'modal.editRoom': 'Klassenzimmer bearbeiten',
      'modal.roomName': 'Raumname / -nummer *', 'modal.capacity': 'Kapazität',
      'modal.roomType': 'Raumtyp', 'modal.saveRoom': 'Raum speichern',
      'modal.editSlot': 'Slot bearbeiten', 'modal.subject': 'Fach',
      'modal.faculty': 'Lehrkraft', 'modal.room': 'Raum',
      'modal.clearSlot': 'Slot leeren', 'modal.save': 'Speichern',
      'modal.addUser': 'Benutzer hinzufügen', 'modal.password': 'Passwort *',
      'modal.role': 'Rolle', 'modal.administrator': 'Administrator',
      'modal.teacher': 'Lehrer', 'modal.saveUser': 'Benutzer speichern',
      'chat.placeholder': 'Fragen Sie mich alles...',
      'lang.title': 'Sprache', 'lang.select': 'Sprache auswählen',
    },

    hi: {
      'login.subtitle': 'स्मार्ट शेड्यूलिंग सिस्टम',
      'login.email': 'ईमेल पता', 'login.password': 'पासवर्ड',
      'login.signIn': 'साइन इन करें', 'login.demoCredentials': 'डेमो क्रेडेंशियल्स',
      'login.emailPh': 'admin@school.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।',
      'nav.main': 'मुख्य', 'nav.management': 'प्रबंधन', 'nav.system': 'सिस्टम',
      'nav.dashboard': 'डैशबोर्ड', 'nav.timetable': 'समय सारिणी',
      'nav.autoScheduler': 'ऑटो शेड्यूलर', 'nav.faculty': 'संकाय',
      'nav.subjectsRooms': 'विषय और कमरे', 'nav.workload': 'कार्यभार',
      'nav.export': 'निर्यात', 'nav.settings': 'सेटिंग्स',
      'nav.administrator': 'प्रशासक', 'nav.teacher': 'शिक्षक',
      'topbar.tutorial': 'ट्यूटोरियल',
      'dash.title': 'डैशबोर्ड', 'dash.quickGenerate': 'त्वरित निर्माण',
      'dash.facultyMembers': 'संकाय सदस्य', 'dash.subjects': 'विषय',
      'dash.classrooms': 'कक्षाएं', 'dash.scheduledSlots': 'निर्धारित स्लॉट',
      'dash.recentActivity': 'हालिया गतिविधि', 'dash.quickActions': 'त्वरित क्रियाएं',
      'dash.workloadOverview': 'कार्यभार अवलोकन', 'dash.noActivity': 'अभी तक कोई गतिविधि नहीं',
      'dash.noFacultyMini': 'कोई संकाय नहीं जोड़ा', 'dash.addFaculty': 'संकाय जोड़ें',
      'dash.addSubject': 'विषय जोड़ें', 'dash.generate': 'निर्माण करें',
      'faculty.title': 'संकाय प्रबंधन',
      'faculty.subtitle': 'शिक्षकों और उनकी उपलब्धता का प्रबंधन करें',
      'faculty.addFaculty': 'संकाय जोड़ें', 'faculty.search': 'संकाय खोजें...',
      'faculty.allDepts': 'सभी विभाग', 'faculty.thFaculty': 'संकाय',
      'faculty.thDept': 'विभाग', 'faculty.thSubjects': 'विषय',
      'faculty.thHours': 'अधि. घंटे/सप्ताह', 'faculty.thAvail': 'उपलब्धता',
      'faculty.thActions': 'कार्रवाई',
      'faculty.empty': 'अभी तक कोई संकाय नहीं जोड़ा। "संकाय जोड़ें" पर क्लिक करें।',
      'subjects.title': 'विषय और कक्षाएं',
      'subjects.subtitle': 'विषयों और कमरों का आवंटन कॉन्फ़िगर करें',
      'subjects.addSubject': 'विषय जोड़ें', 'subjects.addRoom': 'कमरा जोड़ें',
      'subjects.heading': 'विषय', 'subjects.roomsHeading': 'कक्षाएं',
      'subjects.emptySubjects': 'अभी तक कोई विषय नहीं', 'subjects.emptyRooms': 'अभी तक कोई कमरा नहीं',
      'scheduler.title': 'ऑटो शेड्यूलर',
      'scheduler.subtitle': 'स्वचालित रूप से टकराव-मुक्त समय सारिणी बनाएं',
      'scheduler.config': 'कॉन्फ़िगरेशन', 'scheduler.periods': 'प्रति दिन पीरियड',
      'scheduler.days': 'कार्य दिवस', 'scheduler.classes': 'कक्षाएं / अनुभाग',
      'scheduler.strategy': 'रणनीति', 'scheduler.strategyBalanced': 'संतुलित कार्यभार',
      'scheduler.strategyCompact': 'कॉम्पैक्ट शेड्यूल', 'scheduler.strategySpread': 'समान रूप से वितरित',
      'scheduler.generate': 'समय सारिणी बनाएं', 'scheduler.clear': 'शेड्यूल साफ़ करें',
      'scheduler.log': 'शेड्यूलर लॉग', 'scheduler.classPlaceholder': 'उदा. CS-A',
      'scheduler.ready': 'उत्पन्न करने के लिए तैयार। सेटिंग्स कॉन्फ़िगर करें और जनरेट दबाएं।',
      'tt.title': 'समय सारिणी', 'tt.subtitle': 'अपना शेड्यूल देखें, संपादित करें और प्रबंधित करें',
      'tt.print': 'प्रिंट', 'tt.export': 'निर्यात', 'tt.viewBy': 'द्वारा देखें',
      'tt.class': 'कक्षा', 'tt.faculty': 'संकाय', 'tt.room': 'कमरा',
      'tt.select': 'चुनें', 'tt.noTimetable': 'कोई समय सारिणी नहीं बनाई',
      'tt.noTimetableDesc': 'ऑटो शेड्यूलर पर जाएं और पहले समय सारिणी बनाएं।',
      'tt.goScheduler': 'शेड्यूलर पर जाएं',
      'workload.title': 'कार्यभार विश्लेषण',
      'workload.subtitle': 'शिक्षण भार की निगरानी और संतुलन करें',
      'workload.autoBalance': 'ऑटो बैलेंस', 'workload.noFaculty': 'कोई संकाय नहीं जोड़ा',
      'workload.noFacultyDesc': 'कार्यभार विश्लेषण देखने के लिए संकाय सदस्य जोड़ें।',
      'export.title': 'निर्यात', 'export.subtitle': 'अपनी समय सारिणी को कई प्रारूपों में डाउनलोड करें',
      'export.pdfTitle': 'PDF निर्यात',
      'export.pdfDesc': 'सभी विवरणों के साथ प्रिंट-तैयार PDF डाउनलोड करें।',
      'export.allClasses': 'सभी कक्षाएं', 'export.facultyView': 'संकाय दृश्य',
      'export.roomView': 'कमरा दृश्य', 'export.downloadPdf': 'PDF डाउनलोड करें',
      'export.excelTitle': 'Excel निर्यात',
      'export.excelDesc': 'XLSX स्प्रेडशीट के रूप में निर्यात करें।',
      'export.summarySheet': 'सारांश शीट', 'export.workloadSheet': 'कार्यभार शीट',
      'export.downloadExcel': 'Excel डाउनलोड करें', 'export.printTitle': 'प्रिंट दृश्य',
      'export.printDesc': 'प्रिंटर-अनुकूल दृश्य खोलें।',
      'export.gridLines': 'ग्रिड लाइनें दिखाएं', 'export.openPrint': 'प्रिंट दृश्य खोलें',
      'settings.title': 'सेटिंग्स', 'settings.subtitle': 'सिस्टम कॉन्फ़िगरेशन और उपयोगकर्ताओं का प्रबंधन करें',
      'settings.institution': 'संस्थान', 'settings.instName': 'संस्थान का नाम',
      'settings.semester': 'सेमेस्टर', 'settings.academicYear': 'शैक्षणिक वर्ष',
      'settings.periodDuration': 'पीरियड अवधि (मिनट)',
      'settings.saveSettings': 'सेटिंग्स सहेजें', 'settings.userAccounts': 'उपयोगकर्ता खाते',
      'settings.addUser': 'उपयोगकर्ता जोड़ें', 'settings.periodTimings': 'पीरियड समय',
      'settings.addPeriod': 'पीरियड जोड़ें', 'settings.dangerZone': 'खतरे का क्षेत्र',
      'settings.dangerDesc': 'ये कार्रवाइयां अपरिवर्तनीय हैं। सावधानी से आगे बढ़ें।',
      'settings.clearAll': 'सभी डेटा साफ़ करें', 'settings.resetApp': 'ऐप रीसेट करें',
      'settings.language': 'भाषा', 'settings.languageDesc': 'अपनी पसंदीदा प्रदर्शन भाषा चुनें',
      'modal.addFaculty': 'संकाय जोड़ें', 'modal.editFaculty': 'संकाय संपादित करें',
      'modal.fullName': 'पूरा नाम *', 'modal.email': 'ईमेल',
      'modal.dept': 'विभाग *', 'modal.maxHours': 'अधिकतम घंटे / सप्ताह',
      'modal.subjectExpertise': 'विषय विशेषज्ञता (अल्पविराम से अलग)',
      'modal.availability': 'उपलब्धता', 'modal.availHint': '(सेल पर क्लिक करके टॉगल करें)',
      'modal.cancel': 'रद्द करें', 'modal.saveFaculty': 'संकाय सहेजें',
      'modal.addSubject': 'विषय जोड़ें', 'modal.editSubject': 'विषय संपादित करें',
      'modal.subjectName': 'विषय का नाम *', 'modal.subjectCode': 'विषय कोड',
      'modal.hoursWeek': 'प्रति सप्ताह घंटे *', 'modal.roomTypeReq': 'आवश्यक कमरे का प्रकार',
      'modal.lectureHall': 'व्याख्यान हॉल', 'modal.computerLab': 'कंप्यूटर लैब',
      'modal.seminarRoom': 'सेमिनार कक्ष', 'modal.any': 'कोई भी',
      'modal.assignedFaculty': 'नियुक्त संकाय', 'modal.selectFaculty': '-- संकाय चुनें --',
      'modal.colorTag': 'रंग टैग', 'modal.saveSubject': 'विषय सहेजें',
      'modal.addRoom': 'कक्षा जोड़ें', 'modal.editRoom': 'कक्षा संपादित करें',
      'modal.roomName': 'कमरे का नाम / संख्या *', 'modal.capacity': 'क्षमता',
      'modal.roomType': 'कमरे का प्रकार', 'modal.saveRoom': 'कमरा सहेजें',
      'modal.editSlot': 'स्लॉट संपादित करें', 'modal.subject': 'विषय',
      'modal.faculty': 'संकाय', 'modal.room': 'कमरा',
      'modal.clearSlot': 'स्लॉट साफ़ करें', 'modal.save': 'सहेजें',
      'modal.addUser': 'उपयोगकर्ता जोड़ें', 'modal.password': 'पासवर्ड *',
      'modal.role': 'भूमिका', 'modal.administrator': 'प्रशासक',
      'modal.teacher': 'शिक्षक', 'modal.saveUser': 'उपयोगकर्ता सहेजें',
      'chat.placeholder': 'मुझसे कुछ भी पूछें...',
      'lang.title': 'भाषा', 'lang.select': 'भाषा चुनें',
    },

    ar: {
      'login.subtitle': 'نظام جدولة ذكي',
      'login.email': 'البريد الإلكتروني', 'login.password': 'كلمة المرور',
      'login.signIn': 'تسجيل الدخول', 'login.demoCredentials': 'بيانات اعتماد تجريبية',
      'login.emailPh': 'admin@school.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'بيانات اعتماد غير صالحة. يرجى المحاولة مرة أخرى.',
      'nav.main': 'الرئيسية', 'nav.management': 'الإدارة', 'nav.system': 'النظام',
      'nav.dashboard': 'لوحة التحكم', 'nav.timetable': 'الجدول الزمني',
      'nav.autoScheduler': 'الجدولة التلقائية', 'nav.faculty': 'أعضاء هيئة التدريس',
      'nav.subjectsRooms': 'المواد والقاعات', 'nav.workload': 'عبء العمل',
      'nav.export': 'تصدير', 'nav.settings': 'الإعدادات',
      'nav.administrator': 'مدير', 'nav.teacher': 'معلم',
      'topbar.tutorial': 'الدليل التعليمي',
      'dash.title': 'لوحة التحكم', 'dash.quickGenerate': 'إنشاء سريع',
      'dash.facultyMembers': 'أعضاء هيئة التدريس', 'dash.subjects': 'المواد',
      'dash.classrooms': 'الفصول الدراسية', 'dash.scheduledSlots': 'الفترات المجدولة',
      'dash.recentActivity': 'النشاط الأخير', 'dash.quickActions': 'إجراءات سريعة',
      'dash.workloadOverview': 'نظرة عامة على عبء العمل', 'dash.noActivity': 'لا يوجد نشاط بعد',
      'dash.noFacultyMini': 'لم يتم إضافة أعضاء', 'dash.addFaculty': 'إضافة عضو هيئة تدريس',
      'dash.addSubject': 'إضافة مادة', 'dash.generate': 'إنشاء',
      'faculty.title': 'إدارة أعضاء هيئة التدريس',
      'faculty.subtitle': 'إدارة المعلمين وتوافرهم',
      'faculty.addFaculty': 'إضافة عضو', 'faculty.search': 'البحث عن أعضاء...',
      'faculty.allDepts': 'جميع الأقسام', 'faculty.thFaculty': 'العضو',
      'faculty.thDept': 'القسم', 'faculty.thSubjects': 'المواد',
      'faculty.thHours': 'الحد الأقصى للساعات/أسبوع', 'faculty.thAvail': 'التوافر',
      'faculty.thActions': 'الإجراءات',
      'faculty.empty': 'لم يتم إضافة أعضاء بعد. انقر على "إضافة عضو" للبدء.',
      'subjects.title': 'المواد والفصول الدراسية',
      'subjects.subtitle': 'تكوين المواد وتخصيص القاعات',
      'subjects.addSubject': 'إضافة مادة', 'subjects.addRoom': 'إضافة قاعة',
      'subjects.heading': 'المواد', 'subjects.roomsHeading': 'الفصول الدراسية',
      'subjects.emptySubjects': 'لا توجد مواد بعد', 'subjects.emptyRooms': 'لا توجد قاعات بعد',
      'scheduler.title': 'الجدولة التلقائية',
      'scheduler.subtitle': 'إنشاء جدول زمني خالٍ من التعارضات تلقائياً',
      'scheduler.config': 'الإعداد', 'scheduler.periods': 'الحصص في اليوم',
      'scheduler.days': 'أيام العمل', 'scheduler.classes': 'الفصول / الأقسام',
      'scheduler.strategy': 'الاستراتيجية', 'scheduler.strategyBalanced': 'عبء عمل متوازن',
      'scheduler.strategyCompact': 'جدول مضغوط', 'scheduler.strategySpread': 'توزيع متساوٍ',
      'scheduler.generate': 'إنشاء الجدول الزمني', 'scheduler.clear': 'مسح الجدول',
      'scheduler.log': 'سجل الجدولة', 'scheduler.classPlaceholder': 'مثال: CS-A',
      'scheduler.ready': 'جاهز للإنشاء. قم بتكوين الإعدادات واضغط إنشاء.',
      'tt.title': 'الجدول الزمني', 'tt.subtitle': 'عرض وتحرير وإدارة جدولك الزمني',
      'tt.print': 'طباعة', 'tt.export': 'تصدير', 'tt.viewBy': 'عرض حسب',
      'tt.class': 'فصل', 'tt.faculty': 'عضو هيئة', 'tt.room': 'قاعة',
      'tt.select': 'اختر', 'tt.noTimetable': 'لم يتم إنشاء جدول زمني',
      'tt.noTimetableDesc': 'انتقل إلى الجدولة التلقائية وأنشئ جدولاً أولاً.',
      'tt.goScheduler': 'انتقل إلى الجدولة',
      'workload.title': 'تحليل عبء العمل',
      'workload.subtitle': 'مراقبة أعباء التدريس وتوازنها',
      'workload.autoBalance': 'توازن تلقائي', 'workload.noFaculty': 'لم يتم إضافة أعضاء',
      'workload.noFacultyDesc': 'أضف أعضاء هيئة التدريس لرؤية تحليل عبء العمل.',
      'export.title': 'تصدير', 'export.subtitle': 'تحميل الجدول الزمني بتنسيقات متعددة',
      'export.pdfTitle': 'تصدير PDF',
      'export.pdfDesc': 'تحميل PDF جاهز للطباعة مع جميع تفاصيل الجدول.',
      'export.allClasses': 'جميع الفصول', 'export.facultyView': 'عرض الأعضاء',
      'export.roomView': 'عرض القاعات', 'export.downloadPdf': 'تحميل PDF',
      'export.excelTitle': 'تصدير Excel',
      'export.excelDesc': 'تصدير كجدول بيانات XLSX. كل فصل له ورقة خاصة.',
      'export.summarySheet': 'ورقة الملخص', 'export.workloadSheet': 'ورقة العبء',
      'export.downloadExcel': 'تحميل Excel', 'export.printTitle': 'عرض الطباعة',
      'export.printDesc': 'فتح عرض مناسب للطباعة.',
      'export.gridLines': 'إظهار خطوط الشبكة', 'export.openPrint': 'فتح عرض الطباعة',
      'settings.title': 'الإعدادات', 'settings.subtitle': 'إدارة تكوين النظام والمستخدمين',
      'settings.institution': 'المؤسسة', 'settings.instName': 'اسم المؤسسة',
      'settings.semester': 'الفصل الدراسي', 'settings.academicYear': 'العام الدراسي',
      'settings.periodDuration': 'مدة الحصة (دقائق)',
      'settings.saveSettings': 'حفظ الإعدادات', 'settings.userAccounts': 'حسابات المستخدمين',
      'settings.addUser': 'إضافة مستخدم', 'settings.periodTimings': 'مواقيت الحصص',
      'settings.addPeriod': 'إضافة حصة', 'settings.dangerZone': 'منطقة الخطر',
      'settings.dangerDesc': 'هذه الإجراءات لا يمكن التراجع عنها. تابع بحذر.',
      'settings.clearAll': 'مسح جميع البيانات', 'settings.resetApp': 'إعادة تعيين التطبيق',
      'settings.language': 'اللغة', 'settings.languageDesc': 'اختر لغة العرض المفضلة لديك',
      'modal.addFaculty': 'إضافة عضو', 'modal.editFaculty': 'تعديل العضو',
      'modal.fullName': 'الاسم الكامل *', 'modal.email': 'البريد الإلكتروني',
      'modal.dept': 'القسم *', 'modal.maxHours': 'الحد الأقصى للساعات / أسبوع',
      'modal.subjectExpertise': 'التخصص في المواد (مفصولة بفواصل)',
      'modal.availability': 'التوافر', 'modal.availHint': '(انقر على الخلايا للتبديل)',
      'modal.cancel': 'إلغاء', 'modal.saveFaculty': 'حفظ العضو',
      'modal.addSubject': 'إضافة مادة', 'modal.editSubject': 'تعديل المادة',
      'modal.subjectName': 'اسم المادة *', 'modal.subjectCode': 'رمز المادة',
      'modal.hoursWeek': 'الساعات في الأسبوع *', 'modal.roomTypeReq': 'نوع القاعة المطلوبة',
      'modal.lectureHall': 'قاعة المحاضرات', 'modal.computerLab': 'مختبر الكمبيوتر',
      'modal.seminarRoom': 'غرفة الندوة', 'modal.any': 'أي نوع',
      'modal.assignedFaculty': 'العضو المعين', 'modal.selectFaculty': '-- اختر عضواً --',
      'modal.colorTag': 'علامة اللون', 'modal.saveSubject': 'حفظ المادة',
      'modal.addRoom': 'إضافة فصل', 'modal.editRoom': 'تعديل الفصل',
      'modal.roomName': 'اسم / رقم القاعة *', 'modal.capacity': 'السعة',
      'modal.roomType': 'نوع القاعة', 'modal.saveRoom': 'حفظ القاعة',
      'modal.editSlot': 'تعديل الفترة', 'modal.subject': 'المادة',
      'modal.faculty': 'العضو', 'modal.room': 'القاعة',
      'modal.clearSlot': 'مسح الفترة', 'modal.save': 'حفظ',
      'modal.addUser': 'إضافة مستخدم', 'modal.password': 'كلمة المرور *',
      'modal.role': 'الدور', 'modal.administrator': 'مدير',
      'modal.teacher': 'معلم', 'modal.saveUser': 'حفظ المستخدم',
      'chat.placeholder': 'اسألني أي شيء...',
      'lang.title': 'اللغة', 'lang.select': 'اختر اللغة',
    },

    ta: {
      'login.subtitle': 'ஸ்மார்ட் திட்டமிடல் அமைப்பு',
      'login.email': 'மின்னஞ்சல் முகவரி', 'login.password': 'கடவுச்சொல்',
      'login.signIn': 'உள்நுழைக', 'login.demoCredentials': 'டெமோ சான்றுகள்',
      'login.emailPh': 'admin@school.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'தவறான சான்றுகள். மீண்டும் முயற்சிக்கவும்.',
      'nav.main': 'முதன்மை', 'nav.management': 'நிர்வாகம்', 'nav.system': 'அமைப்பு',
      'nav.dashboard': 'டாஷ்போர்டு', 'nav.timetable': 'நேர அட்டவணை',
      'nav.autoScheduler': 'தானியங்கி திட்டமிடல்', 'nav.faculty': 'ஆசிரியர்கள்',
      'nav.subjectsRooms': 'பாடங்கள் & அறைகள்', 'nav.workload': 'பணிச்சுமை',
      'nav.export': 'ஏற்றுமதி', 'nav.settings': 'அமைப்புகள்',
      'nav.administrator': 'நிர்வாகி', 'nav.teacher': 'ஆசிரியர்',
      'topbar.tutorial': 'பயிற்சி',
      'dash.title': 'டாஷ்போர்டு', 'dash.quickGenerate': 'விரைவு உருவாக்கம்',
      'dash.facultyMembers': 'ஆசிரியர் உறுப்பினர்கள்', 'dash.subjects': 'பாடங்கள்',
      'dash.classrooms': 'வகுப்பறைகள்', 'dash.scheduledSlots': 'திட்டமிட்ட இடங்கள்',
      'dash.recentActivity': 'சமீபத்திய செயல்பாடு', 'dash.quickActions': 'விரைவு செயல்கள்',
      'dash.workloadOverview': 'பணிச்சுமை கண்ணோட்டம்', 'dash.noActivity': 'இன்னும் செயல்பாடு இல்லை',
      'dash.noFacultyMini': 'ஆசிரியர்கள் சேர்க்கப்படவில்லை', 'dash.addFaculty': 'ஆசிரியர் சேர்',
      'dash.addSubject': 'பாடம் சேர்', 'dash.generate': 'உருவாக்கு',
      'faculty.title': 'ஆசிரியர் நிர்வாகம்',
      'faculty.subtitle': 'ஆசிரியர்கள் மற்றும் அவர்களின் கிடைக்கும் தன்மையை நிர்வகிக்கவும்',
      'faculty.addFaculty': 'ஆசிரியர் சேர்', 'faculty.search': 'ஆசிரியர்களை தேடுக...',
      'faculty.allDepts': 'அனைத்து துறைகள்', 'faculty.thFaculty': 'ஆசிரியர்',
      'faculty.thDept': 'துறை', 'faculty.thSubjects': 'பாடங்கள்',
      'faculty.thHours': 'அதிக மணி/வாரம்', 'faculty.thAvail': 'கிடைக்கும் தன்மை',
      'faculty.thActions': 'செயல்கள்',
      'faculty.empty': 'இன்னும் ஆசிரியர்கள் சேர்க்கப்படவில்லை. "ஆசிரியர் சேர்" கிளிக் செய்யுங்கள்.',
      'subjects.title': 'பாடங்கள் & வகுப்பறைகள்',
      'subjects.subtitle': 'பாடங்கள் மற்றும் அறை ஒதுக்கீட்டை கட்டமைக்கவும்',
      'subjects.addSubject': 'பாடம் சேர்', 'subjects.addRoom': 'அறை சேர்',
      'subjects.heading': 'பாடங்கள்', 'subjects.roomsHeading': 'வகுப்பறைகள்',
      'subjects.emptySubjects': 'இன்னும் பாடங்கள் இல்லை', 'subjects.emptyRooms': 'இன்னும் அறைகள் இல்லை',
      'scheduler.title': 'தானியங்கி திட்டமிடல்',
      'scheduler.subtitle': 'மோதல் இல்லாத நேர அட்டவணையை தானாக உருவாக்குங்கள்',
      'scheduler.config': 'உள்ளமைவு', 'scheduler.periods': 'நாளுக்கு பீரியட்கள்',
      'scheduler.days': 'வேலை நாட்கள்', 'scheduler.classes': 'வகுப்புகள் / பிரிவுகள்',
      'scheduler.strategy': 'உத்தி', 'scheduler.strategyBalanced': 'சமச்சீரான பணிச்சுமை',
      'scheduler.strategyCompact': 'சுருக்கமான அட்டவணை', 'scheduler.strategySpread': 'சமமாக பரப்பு',
      'scheduler.generate': 'நேர அட்டவணை உருவாக்கு', 'scheduler.clear': 'அட்டவணை அழி',
      'scheduler.log': 'திட்டமிடல் பதிவு', 'scheduler.classPlaceholder': 'எ.கா. CS-A',
      'scheduler.ready': 'உருவாக்கத் தயாராக உள்ளது. அமைப்புகளை கட்டமைத்து உருவாக்கு அழுத்தவும்.',
      'tt.title': 'நேர அட்டவணை', 'tt.subtitle': 'உங்கள் அட்டவணையை பார்க்கவும், திருத்தவும், நிர்வகிக்கவும்',
      'tt.print': 'அச்சு', 'tt.export': 'ஏற்றுமதி', 'tt.viewBy': 'காண்',
      'tt.class': 'வகுப்பு', 'tt.faculty': 'ஆசிரியர்', 'tt.room': 'அறை',
      'tt.select': 'தேர்ந்தெடு', 'tt.noTimetable': 'நேர அட்டவணை உருவாக்கப்படவில்லை',
      'tt.noTimetableDesc': 'தானியங்கி திட்டமிடலுக்கு சென்று முதலில் நேர அட்டவணை உருவாக்குங்கள்.',
      'tt.goScheduler': 'திட்டமிடலுக்கு செல்',
      'workload.title': 'பணிச்சுமை பகுப்பாய்வு',
      'workload.subtitle': 'கற்பித்தல் சுமைகளை கண்காணித்து சமன் செய்யுங்கள்',
      'workload.autoBalance': 'தானியங்கி சமன்', 'workload.noFaculty': 'ஆசிரியர்கள் சேர்க்கப்படவில்லை',
      'workload.noFacultyDesc': 'பணிச்சுமை பகுப்பாய்வு காண ஆசிரியர்களை சேர்க்கவும்.',
      'export.title': 'ஏற்றுமதி', 'export.subtitle': 'உங்கள் நேர அட்டவணையை பல வடிவங்களில் பதிவிறக்கவும்',
      'export.pdfTitle': 'PDF ஏற்றுமதி',
      'export.pdfDesc': 'அனைத்து விவரங்களுடன் அச்சு-தயாரான PDF பதிவிறக்கவும்.',
      'export.allClasses': 'அனைத்து வகுப்புகள்', 'export.facultyView': 'ஆசிரியர் காட்சி',
      'export.roomView': 'அறை காட்சி', 'export.downloadPdf': 'PDF பதிவிறக்கு',
      'export.excelTitle': 'Excel ஏற்றுமதி',
      'export.excelDesc': 'XLSX ஸ்ப்ரெட்ஷீட்டாக ஏற்றுமதி செய்யுங்கள்.',
      'export.summarySheet': 'சுருக்க தாள்', 'export.workloadSheet': 'பணிச்சுமை தாள்',
      'export.downloadExcel': 'Excel பதிவிறக்கு', 'export.printTitle': 'அச்சு காட்சி',
      'export.printDesc': 'அச்சுக்கு ஏற்ற காட்சியை திறக்கவும்.',
      'export.gridLines': 'கட்டக்கோடுகள் காட்டு', 'export.openPrint': 'அச்சு காட்சி திற',
      'settings.title': 'அமைப்புகள்', 'settings.subtitle': 'கணினி உள்ளமைவு மற்றும் பயனர்களை நிர்வகிக்கவும்',
      'settings.institution': 'நிறுவனம்', 'settings.instName': 'நிறுவன பெயர்',
      'settings.semester': 'செமெஸ்டர்', 'settings.academicYear': 'கல்வியாண்டு',
      'settings.periodDuration': 'பீரியட் கால அளவு (நிமிடங்கள்)',
      'settings.saveSettings': 'அமைப்புகளை சேமி', 'settings.userAccounts': 'பயனர் கணக்குகள்',
      'settings.addUser': 'பயனர் சேர்', 'settings.periodTimings': 'பீரியட் நேரங்கள்',
      'settings.addPeriod': 'பீரியட் சேர்', 'settings.dangerZone': 'ஆபத்து மண்டலம்',
      'settings.dangerDesc': 'இந்த செயல்கள் மீளமுடியாதவை. கவனமாக முன்னேறுங்கள்.',
      'settings.clearAll': 'அனைத்து தரவையும் அழி', 'settings.resetApp': 'ஆப் மீட்டமை',
      'settings.language': 'மொழி', 'settings.languageDesc': 'உங்கள் விருப்பமான காட்சி மொழியை தேர்ந்தெடுங்கள்',
      'modal.addFaculty': 'ஆசிரியர் சேர்', 'modal.editFaculty': 'ஆசிரியர் திருத்து',
      'modal.fullName': 'முழு பெயர் *', 'modal.email': 'மின்னஞ்சல்',
      'modal.dept': 'துறை *', 'modal.maxHours': 'அதிக மணி / வாரம்',
      'modal.subjectExpertise': 'பாட நிபுணத்துவம் (கமாவால் பிரிக்கவும்)',
      'modal.availability': 'கிடைக்கும் தன்மை', 'modal.availHint': '(மாற்ற கலங்களை கிளிக் செய்யுங்கள்)',
      'modal.cancel': 'ரத்து செய்', 'modal.saveFaculty': 'ஆசிரியர் சேமி',
      'modal.addSubject': 'பாடம் சேர்', 'modal.editSubject': 'பாடம் திருத்து',
      'modal.subjectName': 'பாட பெயர் *', 'modal.subjectCode': 'பாட குறியீடு',
      'modal.hoursWeek': 'வாரத்தில் மணி நேரம் *', 'modal.roomTypeReq': 'தேவையான அறை வகை',
      'modal.lectureHall': 'விரிவுரை அரங்கம்', 'modal.computerLab': 'கணினி ஆய்வகம்',
      'modal.seminarRoom': 'கருத்தரங்கு அறை', 'modal.any': 'எந்த வகையும்',
      'modal.assignedFaculty': 'நியமிக்கப்பட்ட ஆசிரியர்', 'modal.selectFaculty': '-- ஆசிரியர் தேர்ந்தெடு --',
      'modal.colorTag': 'வண்ண குறிச்சொல்', 'modal.saveSubject': 'பாடம் சேமி',
      'modal.addRoom': 'வகுப்பறை சேர்', 'modal.editRoom': 'வகுப்பறை திருத்து',
      'modal.roomName': 'அறை பெயர் / எண் *', 'modal.capacity': 'கொள்ளளவு',
      'modal.roomType': 'அறை வகை', 'modal.saveRoom': 'அறை சேமி',
      'modal.editSlot': 'இடம் திருத்து', 'modal.subject': 'பாடம்',
      'modal.faculty': 'ஆசிரியர்', 'modal.room': 'அறை',
      'modal.clearSlot': 'இடம் அழி', 'modal.save': 'சேமி',
      'modal.addUser': 'பயனர் சேர்', 'modal.password': 'கடவுச்சொல் *',
      'modal.role': 'பங்கு', 'modal.administrator': 'நிர்வாகி',
      'modal.teacher': 'ஆசிரியர்', 'modal.saveUser': 'பயனர் சேமி',
      'chat.placeholder': 'எதையும் கேளுங்கள்...',
      'lang.title': 'மொழி', 'lang.select': 'மொழி தேர்ந்தெடு',
    },

    zh: {
      'login.subtitle': '智能排课系统',
      'login.email': '电子邮件地址', 'login.password': '密码',
      'login.signIn': '登录', 'login.demoCredentials': '演示凭据',
      'login.emailPh': 'admin@school.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': '凭据无效。请重试。',
      'nav.main': '主要', 'nav.management': '管理', 'nav.system': '系统',
      'nav.dashboard': '仪表板', 'nav.timetable': '时间表',
      'nav.autoScheduler': '自动排课', 'nav.faculty': '教师',
      'nav.subjectsRooms': '科目与教室', 'nav.workload': '工作量',
      'nav.export': '导出', 'nav.settings': '设置',
      'nav.administrator': '管理员', 'nav.teacher': '教师',
      'topbar.tutorial': '教程',
      'dash.title': '仪表板', 'dash.quickGenerate': '快速生成',
      'dash.facultyMembers': '教职员工', 'dash.subjects': '科目',
      'dash.classrooms': '教室', 'dash.scheduledSlots': '已安排课时',
      'dash.recentActivity': '最近活动', 'dash.quickActions': '快速操作',
      'dash.workloadOverview': '工作量概览', 'dash.noActivity': '暂无活动',
      'dash.noFacultyMini': '未添加教师', 'dash.addFaculty': '添加教师',
      'dash.addSubject': '添加科目', 'dash.generate': '生成',
      'faculty.title': '教师管理', 'faculty.subtitle': '管理教师及其可用时间',
      'faculty.addFaculty': '添加教师', 'faculty.search': '搜索教师...',
      'faculty.allDepts': '所有部门', 'faculty.thFaculty': '教师',
      'faculty.thDept': '部门', 'faculty.thSubjects': '科目',
      'faculty.thHours': '最大课时/周', 'faculty.thAvail': '可用时间',
      'faculty.thActions': '操作', 'faculty.empty': '尚未添加教师。点击"添加教师"开始。',
      'subjects.title': '科目与教室', 'subjects.subtitle': '配置科目和教室分配',
      'subjects.addSubject': '添加科目', 'subjects.addRoom': '添加教室',
      'subjects.heading': '科目', 'subjects.roomsHeading': '教室',
      'subjects.emptySubjects': '暂无科目', 'subjects.emptyRooms': '暂无教室',
      'scheduler.title': '自动排课', 'scheduler.subtitle': '自动生成无冲突时间表',
      'scheduler.config': '配置', 'scheduler.periods': '每天课时数',
      'scheduler.days': '工作日', 'scheduler.classes': '班级 / 部分',
      'scheduler.strategy': '策略', 'scheduler.strategyBalanced': '均衡工作量',
      'scheduler.strategyCompact': '紧凑安排', 'scheduler.strategySpread': '均匀分布',
      'scheduler.generate': '生成时间表', 'scheduler.clear': '清除安排',
      'scheduler.log': '排课日志', 'scheduler.classPlaceholder': '例如 CS-A',
      'scheduler.ready': '准备生成。配置设置后按生成。',
      'tt.title': '时间表', 'tt.subtitle': '查看、编辑和管理您的课程表',
      'tt.print': '打印', 'tt.export': '导出', 'tt.viewBy': '按此查看',
      'tt.class': '班级', 'tt.faculty': '教师', 'tt.room': '教室',
      'tt.select': '选择', 'tt.noTimetable': '未生成时间表',
      'tt.noTimetableDesc': '请前往自动排课并先生成时间表。',
      'tt.goScheduler': '前往排课',
      'workload.title': '工作量分析', 'workload.subtitle': '监控和平衡教学负荷',
      'workload.autoBalance': '自动平衡', 'workload.noFaculty': '未添加教师',
      'workload.noFacultyDesc': '添加教师以查看工作量分析。',
      'export.title': '导出', 'export.subtitle': '以多种格式下载时间表',
      'export.pdfTitle': 'PDF 导出', 'export.pdfDesc': '下载包含所有详细信息的打印就绪PDF。',
      'export.allClasses': '所有班级', 'export.facultyView': '教师视图',
      'export.roomView': '教室视图', 'export.downloadPdf': '下载 PDF',
      'export.excelTitle': 'Excel 导出', 'export.excelDesc': '导出为 XLSX 电子表格。每个班级有自己的工作表。',
      'export.summarySheet': '摘要工作表', 'export.workloadSheet': '工作量工作表',
      'export.downloadExcel': '下载 Excel', 'export.printTitle': '打印视图',
      'export.printDesc': '打开适合打印的视图。',
      'export.gridLines': '显示网格线', 'export.openPrint': '打开打印视图',
      'settings.title': '设置', 'settings.subtitle': '管理系统配置和用户',
      'settings.institution': '机构', 'settings.instName': '机构名称',
      'settings.semester': '学期', 'settings.academicYear': '学年',
      'settings.periodDuration': '课时长度（分钟）',
      'settings.saveSettings': '保存设置', 'settings.userAccounts': '用户账户',
      'settings.addUser': '添加用户', 'settings.periodTimings': '课时时间',
      'settings.addPeriod': '添加课时', 'settings.dangerZone': '危险区域',
      'settings.dangerDesc': '这些操作不可逆转。请谨慎操作。',
      'settings.clearAll': '清除所有数据', 'settings.resetApp': '重置应用',
      'settings.language': '语言', 'settings.languageDesc': '选择您偏好的显示语言',
      'modal.addFaculty': '添加教师', 'modal.editFaculty': '编辑教师',
      'modal.fullName': '全名 *', 'modal.email': '电子邮件',
      'modal.dept': '部门 *', 'modal.maxHours': '最大课时 / 周',
      'modal.subjectExpertise': '专业科目（逗号分隔）',
      'modal.availability': '可用时间', 'modal.availHint': '（点击格子切换）',
      'modal.cancel': '取消', 'modal.saveFaculty': '保存教师',
      'modal.addSubject': '添加科目', 'modal.editSubject': '编辑科目',
      'modal.subjectName': '科目名称 *', 'modal.subjectCode': '科目代码',
      'modal.hoursWeek': '每周课时 *', 'modal.roomTypeReq': '所需教室类型',
      'modal.lectureHall': '讲堂', 'modal.computerLab': '计算机实验室',
      'modal.seminarRoom': '研讨室', 'modal.any': '任意',
      'modal.assignedFaculty': '分配教师', 'modal.selectFaculty': '-- 选择教师 --',
      'modal.colorTag': '颜色标签', 'modal.saveSubject': '保存科目',
      'modal.addRoom': '添加教室', 'modal.editRoom': '编辑教室',
      'modal.roomName': '教室名称 / 编号 *', 'modal.capacity': '容量',
      'modal.roomType': '教室类型', 'modal.saveRoom': '保存教室',
      'modal.editSlot': '编辑时间段', 'modal.subject': '科目',
      'modal.faculty': '教师', 'modal.room': '教室',
      'modal.clearSlot': '清除时间段', 'modal.save': '保存',
      'modal.addUser': '添加用户', 'modal.password': '密码 *',
      'modal.role': '角色', 'modal.administrator': '管理员',
      'modal.teacher': '教师', 'modal.saveUser': '保存用户',
      'chat.placeholder': '向我提问...',
      'lang.title': '语言', 'lang.select': '选择语言',
    },

    ja: {
      'login.subtitle': 'スマートスケジューリングシステム',
      'login.email': 'メールアドレス', 'login.password': 'パスワード',
      'login.signIn': 'サインイン', 'login.demoCredentials': 'デモ認証情報',
      'login.emailPh': 'admin@school.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': '無効な認証情報です。もう一度お試しください。',
      'nav.main': 'メイン', 'nav.management': '管理', 'nav.system': 'システム',
      'nav.dashboard': 'ダッシュボード', 'nav.timetable': '時間割',
      'nav.autoScheduler': '自動スケジューラー', 'nav.faculty': '教員',
      'nav.subjectsRooms': '科目と教室', 'nav.workload': '作業量',
      'nav.export': 'エクスポート', 'nav.settings': '設定',
      'nav.administrator': '管理者', 'nav.teacher': '教師',
      'topbar.tutorial': 'チュートリアル',
      'dash.title': 'ダッシュボード', 'dash.quickGenerate': 'クイック生成',
      'dash.facultyMembers': '教員数', 'dash.subjects': '科目',
      'dash.classrooms': '教室', 'dash.scheduledSlots': 'スケジュール済みスロット',
      'dash.recentActivity': '最近のアクティビティ', 'dash.quickActions': 'クイックアクション',
      'dash.workloadOverview': '作業量の概要', 'dash.noActivity': 'まだアクティビティなし',
      'dash.noFacultyMini': '教員が追加されていません', 'dash.addFaculty': '教員を追加',
      'dash.addSubject': '科目を追加', 'dash.generate': '生成',
      'faculty.title': '教員管理', 'faculty.subtitle': '教員とその利用可能時間を管理する',
      'faculty.addFaculty': '教員を追加', 'faculty.search': '教員を検索...',
      'faculty.allDepts': 'すべての部門', 'faculty.thFaculty': '教員',
      'faculty.thDept': '部門', 'faculty.thSubjects': '科目',
      'faculty.thHours': '最大時間/週', 'faculty.thAvail': '利用可能時間',
      'faculty.thActions': 'アクション',
      'faculty.empty': '教員がまだ追加されていません。「教員を追加」をクリックして始めてください。',
      'subjects.title': '科目と教室', 'subjects.subtitle': '科目と教室の割り当てを設定する',
      'subjects.addSubject': '科目を追加', 'subjects.addRoom': '教室を追加',
      'subjects.heading': '科目', 'subjects.roomsHeading': '教室',
      'subjects.emptySubjects': '科目がまだありません', 'subjects.emptyRooms': '教室がまだありません',
      'scheduler.title': '自動スケジューラー', 'scheduler.subtitle': '競合のない時間割を自動的に生成する',
      'scheduler.config': '設定', 'scheduler.periods': '1日あたりのコマ数',
      'scheduler.days': '授業日', 'scheduler.classes': 'クラス / セクション',
      'scheduler.strategy': '戦略', 'scheduler.strategyBalanced': '均等な作業量',
      'scheduler.strategyCompact': 'コンパクトなスケジュール', 'scheduler.strategySpread': '均等に分散',
      'scheduler.generate': '時間割を生成', 'scheduler.clear': 'スケジュールをクリア',
      'scheduler.log': 'スケジューラーログ', 'scheduler.classPlaceholder': '例: CS-A',
      'scheduler.ready': '生成準備完了。設定を行って生成を押してください。',
      'tt.title': '時間割', 'tt.subtitle': 'スケジュールを表示、編集、管理する',
      'tt.print': '印刷', 'tt.export': 'エクスポート', 'tt.viewBy': '表示方法',
      'tt.class': 'クラス', 'tt.faculty': '教員', 'tt.room': '教室',
      'tt.select': '選択', 'tt.noTimetable': '時間割が生成されていません',
      'tt.noTimetableDesc': '自動スケジューラーに移動して、まず時間割を生成してください。',
      'tt.goScheduler': 'スケジューラーへ',
      'workload.title': '作業量分析', 'workload.subtitle': '教授負荷を監視・バランスする',
      'workload.autoBalance': '自動バランス', 'workload.noFaculty': '教員が追加されていません',
      'workload.noFacultyDesc': '作業量分析を見るには教員を追加してください。',
      'export.title': 'エクスポート', 'export.subtitle': '時間割を複数の形式でダウンロードする',
      'export.pdfTitle': 'PDF エクスポート', 'export.pdfDesc': 'すべての詳細を含む印刷対応PDFをダウンロードします。',
      'export.allClasses': 'すべてのクラス', 'export.facultyView': '教員ビュー',
      'export.roomView': '教室ビュー', 'export.downloadPdf': 'PDF をダウンロード',
      'export.excelTitle': 'Excel エクスポート', 'export.excelDesc': 'XLSXスプレッドシートとしてエクスポートします。',
      'export.summarySheet': 'サマリーシート', 'export.workloadSheet': '作業量シート',
      'export.downloadExcel': 'Excel をダウンロード', 'export.printTitle': '印刷ビュー',
      'export.printDesc': '印刷に適したビューを開きます。',
      'export.gridLines': 'グリッド線を表示', 'export.openPrint': '印刷ビューを開く',
      'settings.title': '設定', 'settings.subtitle': 'システム設定とユーザーを管理する',
      'settings.institution': '機関', 'settings.instName': '機関名',
      'settings.semester': 'セメスター', 'settings.academicYear': '学年度',
      'settings.periodDuration': 'コマの長さ（分）',
      'settings.saveSettings': '設定を保存', 'settings.userAccounts': 'ユーザーアカウント',
      'settings.addUser': 'ユーザーを追加', 'settings.periodTimings': 'コマの時間設定',
      'settings.addPeriod': 'コマを追加', 'settings.dangerZone': '危険ゾーン',
      'settings.dangerDesc': 'これらのアクションは元に戻せません。慎重に進めてください。',
      'settings.clearAll': 'すべてのデータをクリア', 'settings.resetApp': 'アプリをリセット',
      'settings.language': '言語', 'settings.languageDesc': '表示言語を選択してください',
      'modal.addFaculty': '教員を追加', 'modal.editFaculty': '教員を編集',
      'modal.fullName': '氏名 *', 'modal.email': 'メール',
      'modal.dept': '部門 *', 'modal.maxHours': '最大時間 / 週',
      'modal.subjectExpertise': '専門科目（カンマ区切り）',
      'modal.availability': '利用可能時間', 'modal.availHint': '（セルをクリックして切り替え）',
      'modal.cancel': 'キャンセル', 'modal.saveFaculty': '教員を保存',
      'modal.addSubject': '科目を追加', 'modal.editSubject': '科目を編集',
      'modal.subjectName': '科目名 *', 'modal.subjectCode': '科目コード',
      'modal.hoursWeek': '週あたりの時間 *', 'modal.roomTypeReq': '必要な教室タイプ',
      'modal.lectureHall': '講義室', 'modal.computerLab': 'コンピューター実習室',
      'modal.seminarRoom': 'セミナー室', 'modal.any': 'なんでも',
      'modal.assignedFaculty': '担当教員', 'modal.selectFaculty': '-- 教員を選択 --',
      'modal.colorTag': 'カラータグ', 'modal.saveSubject': '科目を保存',
      'modal.addRoom': '教室を追加', 'modal.editRoom': '教室を編集',
      'modal.roomName': '教室名 / 番号 *', 'modal.capacity': '収容人数',
      'modal.roomType': '教室タイプ', 'modal.saveRoom': '教室を保存',
      'modal.editSlot': 'スロットを編集', 'modal.subject': '科目',
      'modal.faculty': '教員', 'modal.room': '教室',
      'modal.clearSlot': 'スロットをクリア', 'modal.save': '保存',
      'modal.addUser': 'ユーザーを追加', 'modal.password': 'パスワード *',
      'modal.role': '役割', 'modal.administrator': '管理者',
      'modal.teacher': '教師', 'modal.saveUser': 'ユーザーを保存',
      'chat.placeholder': '何でも聞いてください...',
      'lang.title': '言語', 'lang.select': '言語を選択',
    },

    pt: {
      'login.subtitle': 'Sistema de Agendamento Inteligente',
      'login.email': 'Endereço de E-mail', 'login.password': 'Senha',
      'login.signIn': 'Entrar', 'login.demoCredentials': 'Credenciais de Demo',
      'login.emailPh': 'admin@escola.edu', 'login.passwordPh': '••••••••',
      'login.invalidCreds': 'Credenciais inválidas. Por favor, tente novamente.',
      'nav.main': 'Principal', 'nav.management': 'Gerenciamento', 'nav.system': 'Sistema',
      'nav.dashboard': 'Painel', 'nav.timetable': 'Grade Horária',
      'nav.autoScheduler': 'Agendador Auto', 'nav.faculty': 'Professores',
      'nav.subjectsRooms': 'Disciplinas & Salas', 'nav.workload': 'Carga Horária',
      'nav.export': 'Exportar', 'nav.settings': 'Configurações',
      'nav.administrator': 'Administrador', 'nav.teacher': 'Professor',
      'topbar.tutorial': 'Tutorial',
      'dash.title': 'Painel', 'dash.quickGenerate': 'Gerar Rapidamente',
      'dash.facultyMembers': 'Corpo Docente', 'dash.subjects': 'Disciplinas',
      'dash.classrooms': 'Salas de Aula', 'dash.scheduledSlots': 'Horários Agendados',
      'dash.recentActivity': 'Atividade Recente', 'dash.quickActions': 'Ações Rápidas',
      'dash.workloadOverview': 'Visão Geral de Carga', 'dash.noActivity': 'Nenhuma atividade ainda',
      'dash.noFacultyMini': 'Nenhum professor adicionado', 'dash.addFaculty': 'Adicionar Professor',
      'dash.addSubject': 'Adicionar Disciplina', 'dash.generate': 'Gerar',
      'faculty.title': 'Gerenciamento de Professores',
      'faculty.subtitle': 'Gerencie professores e sua disponibilidade',
      'faculty.addFaculty': 'Adicionar Professor', 'faculty.search': 'Pesquisar professores...',
      'faculty.allDepts': 'Todos os Departamentos', 'faculty.thFaculty': 'Professor',
      'faculty.thDept': 'Departamento', 'faculty.thSubjects': 'Disciplinas',
      'faculty.thHours': 'Horas Máx/Semana', 'faculty.thAvail': 'Disponibilidade',
      'faculty.thActions': 'Ações',
      'faculty.empty': 'Nenhum professor adicionado ainda. Clique em "Adicionar Professor" para começar.',
      'subjects.title': 'Disciplinas & Salas de Aula',
      'subjects.subtitle': 'Configurar disciplinas e alocações de salas',
      'subjects.addSubject': 'Adicionar Disciplina', 'subjects.addRoom': 'Adicionar Sala',
      'subjects.heading': 'Disciplinas', 'subjects.roomsHeading': 'Salas de Aula',
      'subjects.emptySubjects': 'Nenhuma disciplina ainda', 'subjects.emptyRooms': 'Nenhuma sala ainda',
      'scheduler.title': 'Agendador Automático',
      'scheduler.subtitle': 'Gerar uma grade horária sem conflitos automaticamente',
      'scheduler.config': 'Configuração', 'scheduler.periods': 'Períodos por Dia',
      'scheduler.days': 'Dias de Trabalho', 'scheduler.classes': 'Turmas / Seções',
      'scheduler.strategy': 'Estratégia', 'scheduler.strategyBalanced': 'Carga Equilibrada',
      'scheduler.strategyCompact': 'Grade Compacta', 'scheduler.strategySpread': 'Distribuir Uniformemente',
      'scheduler.generate': 'Gerar Grade Horária', 'scheduler.clear': 'Limpar Grade',
      'scheduler.log': 'Registro do Agendador', 'scheduler.classPlaceholder': 'ex. CS-A',
      'scheduler.ready': 'Pronto para gerar. Configure as opções e pressione Gerar.',
      'tt.title': 'Grade Horária', 'tt.subtitle': 'Ver, editar e gerenciar sua grade horária',
      'tt.print': 'Imprimir', 'tt.export': 'Exportar', 'tt.viewBy': 'Ver Por',
      'tt.class': 'Turma', 'tt.faculty': 'Professor', 'tt.room': 'Sala',
      'tt.select': 'Selecionar', 'tt.noTimetable': 'Nenhuma Grade Horária Gerada',
      'tt.noTimetableDesc': 'Vá ao Agendador Automático e gere uma grade horária primeiro.',
      'tt.goScheduler': 'Ir ao Agendador',
      'workload.title': 'Análise de Carga Horária',
      'workload.subtitle': 'Monitorar e equilibrar cargas de ensino',
      'workload.autoBalance': 'Auto Equilibrar', 'workload.noFaculty': 'Nenhum Professor Adicionado',
      'workload.noFacultyDesc': 'Adicione professores para ver a análise de carga horária.',
      'export.title': 'Exportar', 'export.subtitle': 'Baixar sua grade horária em múltiplos formatos',
      'export.pdfTitle': 'Exportar PDF', 'export.pdfDesc': 'Baixe um PDF pronto para impressão com todos os detalhes.',
      'export.allClasses': 'Todas as Turmas', 'export.facultyView': 'Visão de Professor',
      'export.roomView': 'Visão de Sala', 'export.downloadPdf': 'Baixar PDF',
      'export.excelTitle': 'Exportar Excel', 'export.excelDesc': 'Exportar como planilha XLSX.',
      'export.summarySheet': 'Folha de Resumo', 'export.workloadSheet': 'Folha de Carga',
      'export.downloadExcel': 'Baixar Excel', 'export.printTitle': 'Visão de Impressão',
      'export.printDesc': 'Abrir visão otimizada para impressão.',
      'export.gridLines': 'Mostrar Linhas de Grade', 'export.openPrint': 'Abrir Visão de Impressão',
      'settings.title': 'Configurações', 'settings.subtitle': 'Gerenciar configuração do sistema e usuários',
      'settings.institution': 'Instituição', 'settings.instName': 'Nome da Instituição',
      'settings.semester': 'Semestre', 'settings.academicYear': 'Ano Letivo',
      'settings.periodDuration': 'Duração do Período (minutos)',
      'settings.saveSettings': 'Salvar Configurações', 'settings.userAccounts': 'Contas de Usuário',
      'settings.addUser': 'Adicionar Usuário', 'settings.periodTimings': 'Horários dos Períodos',
      'settings.addPeriod': 'Adicionar Período', 'settings.dangerZone': 'Zona de Perigo',
      'settings.dangerDesc': 'Essas ações são irreversíveis. Prossiga com cuidado.',
      'settings.clearAll': 'Limpar Todos os Dados', 'settings.resetApp': 'Redefinir App',
      'settings.language': 'Idioma', 'settings.languageDesc': 'Selecione seu idioma de exibição preferido',
      'modal.addFaculty': 'Adicionar Professor', 'modal.editFaculty': 'Editar Professor',
      'modal.fullName': 'Nome Completo *', 'modal.email': 'E-mail',
      'modal.dept': 'Departamento *', 'modal.maxHours': 'Horas Máx / Semana',
      'modal.subjectExpertise': 'Especialidade em Disciplinas (separadas por vírgula)',
      'modal.availability': 'Disponibilidade', 'modal.availHint': '(clique nas células para alternar)',
      'modal.cancel': 'Cancelar', 'modal.saveFaculty': 'Salvar Professor',
      'modal.addSubject': 'Adicionar Disciplina', 'modal.editSubject': 'Editar Disciplina',
      'modal.subjectName': 'Nome da Disciplina *', 'modal.subjectCode': 'Código da Disciplina',
      'modal.hoursWeek': 'Horas por Semana *', 'modal.roomTypeReq': 'Tipo de Sala Necessário',
      'modal.lectureHall': 'Auditório', 'modal.computerLab': 'Laboratório de Informática',
      'modal.seminarRoom': 'Sala de Seminário', 'modal.any': 'Qualquer',
      'modal.assignedFaculty': 'Professor Designado', 'modal.selectFaculty': '-- Selecionar Professor --',
      'modal.colorTag': 'Etiqueta de Cor', 'modal.saveSubject': 'Salvar Disciplina',
      'modal.addRoom': 'Adicionar Sala', 'modal.editRoom': 'Editar Sala',
      'modal.roomName': 'Nome / Número da Sala *', 'modal.capacity': 'Capacidade',
      'modal.roomType': 'Tipo de Sala', 'modal.saveRoom': 'Salvar Sala',
      'modal.editSlot': 'Editar Horário', 'modal.subject': 'Disciplina',
      'modal.faculty': 'Professor', 'modal.room': 'Sala',
      'modal.clearSlot': 'Limpar Horário', 'modal.save': 'Salvar',
      'modal.addUser': 'Adicionar Usuário', 'modal.password': 'Senha *',
      'modal.role': 'Função', 'modal.administrator': 'Administrador',
      'modal.teacher': 'Professor', 'modal.saveUser': 'Salvar Usuário',
      'chat.placeholder': 'Pergunte-me qualquer coisa...',
      'lang.title': 'Idioma', 'lang.select': 'Selecionar Idioma',
    },
  };

  /* ════════════════════════════════════════
     CORE ENGINE
  ════════════════════════════════════════ */
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  function t(key) {
    return T[currentLang]?.[key] || T['en']?.[key] || key;
  }

  function getCurrentLang() { return currentLang; }

  function getLangObj(code) {
    return LANGUAGES.find(l => l.code === (code || currentLang));
  }

  function setLanguage(code) {
    if (!T[code]) return;
    currentLang = code;
    localStorage.setItem(STORAGE_KEY, code);
    const lang = getLangObj(code);
    document.documentElement.lang = code;
    document.documentElement.dir = lang?.dir || 'ltr';
    applyTranslations();
    updateSwitcherUI();
  }

  /* ════════════════════════════════════════
     DOM TRANSLATION ENGINE
  ════════════════════════════════════════ */
  function applyTranslations() {
    /* ── Apply data-i18n attributes ── */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPh);
    });

    /* ── Sidebar role display ── */
    const roleEl = document.getElementById('user-role-sidebar');
    if (roleEl) {
      const roleText = roleEl.getAttribute('data-role') || roleEl.textContent;
      if (roleText === 'admin' || roleText === t('nav.administrator') || roleEl.getAttribute('data-role') === 'admin') {
        roleEl.textContent = t('nav.administrator');
      } else {
        roleEl.textContent = t('nav.teacher');
      }
    }

    /* ── Chat placeholder ── */
    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.placeholder = t('chat.placeholder');

    /* ── Scheduler ready message ── */
    const schedLog = document.getElementById('sched-log');
    if (schedLog) {
      const firstLine = schedLog.querySelector('.log-line.info');
      if (firstLine && firstLine.dataset.isReady === 'true') {
        const timeSpan = firstLine.querySelector('.log-time');
        firstLine.textContent = '';
        if (timeSpan) firstLine.appendChild(timeSpan);
        firstLine.appendChild(document.createTextNode(' ' + t('scheduler.ready')));
      }
    }

    /* ── Class placeholder ── */
    const classInput = document.getElementById('sched-class-input');
    if (classInput) classInput.placeholder = t('scheduler.classPlaceholder');

    /* ── Faculty search placeholder ── */
    const facultySearch = document.getElementById('faculty-search');
    if (facultySearch) facultySearch.placeholder = t('faculty.search');

    /* ── Faculty filter default option ── */
    const facultyFilter = document.getElementById('faculty-filter');
    if (facultyFilter) {
      const allOpt = facultyFilter.querySelector('option[value="all"]');
      if (allOpt) allOpt.textContent = t('faculty.allDepts');
    }

    /* ── Subject modal room type options ── */
    const smRoomType = document.getElementById('sm-room-type');
    if (smRoomType) {
      smRoomType.querySelectorAll('option').forEach(opt => {
        const map = { lecture: 'modal.lectureHall', lab: 'modal.computerLab', seminar: 'modal.seminarRoom', any: 'modal.any' };
        if (map[opt.value]) opt.textContent = t(map[opt.value]);
      });
    }
    const rmType = document.getElementById('rm-type');
    if (rmType) {
      rmType.querySelectorAll('option').forEach(opt => {
        const map = { lecture: 'modal.lectureHall', lab: 'modal.computerLab', seminar: 'modal.seminarRoom' };
        if (map[opt.value]) opt.textContent = t(map[opt.value]);
      });
    }

    /* ── Scheduler strategy options ── */
    const schedStrategy = document.getElementById('sched-strategy');
    if (schedStrategy) {
      schedStrategy.querySelectorAll('option').forEach(opt => {
        const map = { balanced: 'scheduler.strategyBalanced', compact: 'scheduler.strategyCompact', spread: 'scheduler.strategySpread' };
        if (map[opt.value]) opt.textContent = t(map[opt.value]);
      });
    }

    /* ── User role options ── */
    const umRole = document.getElementById('um-role');
    if (umRole) {
      umRole.querySelectorAll('option').forEach(opt => {
        const map = { admin: 'modal.administrator', teacher: 'modal.teacher' };
        if (map[opt.value]) opt.textContent = t(map[opt.value]);
      });
    }

    /* ── Slot modal faculty select default ── */
    const smFaculty = document.getElementById('sm-faculty');
    if (smFaculty) {
      const def = smFaculty.querySelector('option[value=""]');
      if (def) def.textContent = t('modal.selectFaculty');
    }

    /* ── Breadcrumb update ── */
    const bc = document.getElementById('breadcrumb');
    if (bc && bc.dataset.page) {
      const pageKeyMap = {
        dashboard: 'nav.dashboard', faculty: 'nav.faculty',
        subjects: 'nav.subjectsRooms', scheduler: 'nav.autoScheduler',
        timetable: 'nav.timetable', workload: 'nav.workload',
        export: 'nav.export', settings: 'nav.settings',
      };
      bc.textContent = t(pageKeyMap[bc.dataset.page] || bc.dataset.page);
    }

    /* ── Update lang grid in settings if open ── */
    renderLangGrid();
  }

  /* ════════════════════════════════════════
     LANGUAGE SWITCHER (Topbar Dropdown)
  ════════════════════════════════════════ */
  function renderSwitcher() {
    const dropdown = document.getElementById('lang-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = LANGUAGES.map(lang => `
      <button class="lang-option ${lang.code === currentLang ? 'active' : ''}"
              onclick="I18n.setLanguage('${lang.code}'); event.stopPropagation();">
        <span class="lang-flag">${lang.flag}</span>
        <span class="lang-name">${lang.nativeName}</span>
        ${lang.code === currentLang ? '<i class="lang-check">✓</i>' : ''}
      </button>
    `).join('');

    updateSwitcherUI();
  }

  function updateSwitcherUI() {
    const lang = getLangObj();
    const flagEl = document.getElementById('lang-current-flag');
    const nameEl = document.getElementById('lang-current-code');
    if (flagEl) flagEl.textContent = lang?.flag || '🌐';
    if (nameEl) nameEl.textContent = (lang?.code || 'en').toUpperCase();

    /* Update dropdown active states */
    document.querySelectorAll('.lang-option').forEach(btn => {
      const code = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
      btn.classList.toggle('active', code === currentLang);
      const check = btn.querySelector('.lang-check');
      if (check) check.style.display = code === currentLang ? '' : 'none';
    });

    /* Update lang grid */
    renderLangGrid();
  }

  /* ════════════════════════════════════════
     LANGUAGE GRID (Settings Page)
  ════════════════════════════════════════ */
  function renderLangGrid() {
    const grid = document.getElementById('lang-grid');
    if (!grid) return;

    grid.innerHTML = LANGUAGES.map(lang => `
      <button class="lang-card ${lang.code === currentLang ? 'active' : ''}"
              onclick="I18n.setLanguage('${lang.code}')">
        <span class="lang-card-flag">${lang.flag}</span>
        <div class="lang-card-info">
          <div class="lang-card-native">${lang.nativeName}</div>
          <div class="lang-card-en">${lang.name}</div>
        </div>
        ${lang.code === currentLang ? '<div class="lang-card-check">✓</div>' : ''}
      </button>
    `).join('');
  }

  /* ════════════════════════════════════════
     TOPBAR DROPDOWN TOGGLE
  ════════════════════════════════════════ */
  function initDropdown() {
    const btn = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */
  function init() {
    /* Apply stored language */
    const lang = getLangObj(currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = lang?.dir || 'ltr';

    /* Mark scheduler log line for future updates */
    const schedLogLine = document.querySelector('#sched-log .log-line.info');
    if (schedLogLine) schedLogLine.dataset.isReady = 'true';

    renderSwitcher();
    applyTranslations();
    initDropdown();
  }

  return { init, t, setLanguage, getCurrentLang, LANGUAGES, applyTranslations, renderLangGrid, renderSwitcher };
})();

/* Auto-init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
});
