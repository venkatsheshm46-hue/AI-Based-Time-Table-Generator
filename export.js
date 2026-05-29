/* ═══════════════════════════════════════════
   EXPORT.JS — PDF + Excel Export
═══════════════════════════════════════════ */

const Export = (() => {

  /* ══════ PDF EXPORT ══════ */
  function exportPDF() {
    const schedule = DB.getSchedule();
    const settings = DB.getSettings();
    const classes  = Object.keys(schedule);

    if (!classes.length) { showToast('No timetable to export!', 'error'); return; }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) { showToast('PDF library not loaded', 'error'); return; }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const days    = settings.workingDays || ['Mon','Tue','Wed','Thu','Fri'];
    const periods = settings.periodsPerDay || 6;
    const timings = settings.periodTimings || [];

    const allClasses  = document.getElementById('pdf-all-classes')?.checked !== false;
    const facView     = document.getElementById('pdf-faculty-view')?.checked;
    const roomView    = document.getElementById('pdf-room-view')?.checked;

    let isFirst = true;

    // Class timetables
    if (allClasses) {
      classes.forEach(cls => {
        if (!isFirst) doc.addPage();
        isFirst = false;

        // Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setTextColor(241, 245, 249);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`${settings.institution || 'Time Table Pro'}`, 14, 14);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(`Timetable for: ${cls}   |   ${settings.semester || ''}   |   ${settings.year || ''}`, 14, 22);

        const head = [['Day / Period', ...Array.from({ length: periods }, (_, i) => `P${i+1}\n${timings[i] || ''}`.trim())]];
        const body = days.map(day => {
          const row = [day];
          for (let p = 1; p <= periods; p++) {
            const slot    = schedule[cls]?.[day]?.[p];
            const subject = slot ? DB.getSubjectById(slot.subjectId) : null;
            const faculty = slot ? DB.getFacultyById(slot.facultyId) : null;
            const room    = slot ? DB.getRoomById(slot.roomId) : null;
            if (subject) {
              row.push(`${subject.name}\n${faculty?.name || ''}\n${room?.name || ''}`);
            } else {
              row.push('—');
            }
          }
          return row;
        });

        doc.autoTable({
          head, body,
          startY: 28,
          theme: 'grid',
          headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          bodyStyles: { fillColor: [13, 20, 37], textColor: [241, 245, 249], fontSize: 7.5, minCellHeight: 14 },
          alternateRowStyles: { fillColor: [17, 24, 39] },
          columnStyles: { 0: { fillColor: [30, 41, 59], fontStyle: 'bold', halign: 'center' } },
          styles: { cellPadding: 2, overflow: 'linebreak' }
        });
      });
    }

    // Faculty View
    if (facView) {
      const faculty = DB.getFaculty();
      faculty.forEach(f => {
        doc.addPage();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setTextColor(241, 245, 249);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Faculty Schedule: ${f.name}`, 14, 14);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(`Dept: ${f.department || '—'}   |   Max: ${f.maxHours}h/week`, 14, 22);

        const head = [['Day / Period', ...Array.from({ length: periods }, (_, i) => `P${i+1}`)]];
        const body = days.map(day => {
          const row = [day];
          for (let p = 1; p <= periods; p++) {
            let cell = '—';
            for (const [cls, clsData] of Object.entries(schedule)) {
              const slot = clsData?.[day]?.[p];
              if (slot?.facultyId === f.id) {
                const subj = DB.getSubjectById(slot.subjectId);
                const room = DB.getRoomById(slot.roomId);
                cell = `${subj?.name || ''}\n${cls}\n${room?.name || ''}`;
                break;
              }
            }
            row.push(cell);
          }
          return row;
        });

        doc.autoTable({ head, body, startY: 28, theme: 'grid',
          headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          bodyStyles: { fillColor: [13, 20, 37], textColor: [241, 245, 249], fontSize: 7.5, minCellHeight: 14 },
          alternateRowStyles: { fillColor: [17, 24, 39] },
          columnStyles: { 0: { fillColor: [30, 41, 59], fontStyle: 'bold', halign: 'center' } },
          styles: { cellPadding: 2, overflow: 'linebreak' }
        });
      });
    }

    // Room View
    if (roomView) {
      DB.getRooms().forEach(room => {
        doc.addPage();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setTextColor(241, 245, 249);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Room Schedule: ${room.name}`, 14, 14);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(`Type: ${room.type}   |   Capacity: ${room.capacity}`, 14, 22);

        const head = [['Day / Period', ...Array.from({ length: periods }, (_, i) => `P${i+1}`)]];
        const body = days.map(day => {
          const row = [day];
          for (let p = 1; p <= periods; p++) {
            let cell = '—';
            for (const [cls, clsData] of Object.entries(schedule)) {
              const slot = clsData?.[day]?.[p];
              if (slot?.roomId === room.id) {
                const subj    = DB.getSubjectById(slot.subjectId);
                const faculty = DB.getFacultyById(slot.facultyId);
                cell = `${subj?.name || ''}\n${faculty?.name || ''}\n${cls}`;
                break;
              }
            }
            row.push(cell);
          }
          return row;
        });

        doc.autoTable({ head, body, startY: 28, theme: 'grid',
          headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          bodyStyles: { fillColor: [13, 20, 37], textColor: [241, 245, 249], fontSize: 7.5, minCellHeight: 14 },
          alternateRowStyles: { fillColor: [17, 24, 39] },
          columnStyles: { 0: { fillColor: [30, 41, 59], fontStyle: 'bold', halign: 'center' } },
          styles: { cellPadding: 2, overflow: 'linebreak' }
        });
      });
    }

    const inst = (settings.institution || 'timetable').replace(/\s+/g, '_');
    doc.save(`${inst}_timetable.pdf`);
    DB.logActivity('Exported timetable to PDF', 'info');
    showToast('PDF downloaded!', 'success');
  }

  /* ══════ EXCEL EXPORT ══════ */
  function exportExcel() {
    const schedule = DB.getSchedule();
    const settings = DB.getSettings();
    const classes  = Object.keys(schedule);

    if (!classes.length) { showToast('No timetable to export!', 'error'); return; }
    if (!window.XLSX) { showToast('Excel library not loaded', 'error'); return; }

    const XLSX    = window.XLSX;
    const wb      = XLSX.utils.book_new();
    const days    = settings.workingDays || ['Mon','Tue','Wed','Thu','Fri'];
    const periods = settings.periodsPerDay || 6;
    const timings = settings.periodTimings || [];
    const inclSummary  = document.getElementById('xl-summary')?.checked !== false;
    const inclWorkload = document.getElementById('xl-workload')?.checked !== false;

    // Class sheets
    classes.forEach(cls => {
      const header = ['Day / Period', ...Array.from({ length: periods }, (_, i) => `P${i+1} ${timings[i] || ''}`.trim())];
      const rows   = [header];

      days.forEach(day => {
        const row = [day];
        for (let p = 1; p <= periods; p++) {
          const slot    = schedule[cls]?.[day]?.[p];
          const subject = slot ? DB.getSubjectById(slot.subjectId) : null;
          const faculty = slot ? DB.getFacultyById(slot.facultyId) : null;
          const room    = slot ? DB.getRoomById(slot.roomId) : null;
          row.push(subject ? `${subject.name} | ${faculty?.name || '-'} | ${room?.name || '-'}` : '');
        }
        rows.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 12 }, ...Array(periods).fill({ wch: 30 })];
      XLSX.utils.book_append_sheet(wb, ws, cls.slice(0, 31));
    });

    // Summary sheet
    if (inclSummary) {
      const rows = [['Class', 'Day', 'Period', 'Timing', 'Subject', 'Code', 'Faculty', 'Room', 'Room Type']];
      classes.forEach(cls => {
        days.forEach(day => {
          for (let p = 1; p <= periods; p++) {
            const slot    = schedule[cls]?.[day]?.[p];
            const subject = slot ? DB.getSubjectById(slot.subjectId) : null;
            const faculty = slot ? DB.getFacultyById(slot.facultyId) : null;
            const room    = slot ? DB.getRoomById(slot.roomId) : null;
            if (slot && subject) {
              rows.push([cls, day, `P${p}`, timings[p-1] || '', subject.name, subject.code || '', faculty?.name || '', room?.name || '', room?.type || '']);
            }
          }
        });
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [10,8,6,14,24,10,20,14,10].map(w => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    }

    // Workload sheet
    if (inclWorkload) {
      const wlData = Workload.computeWorkload();
      const rows = [['Faculty', 'Department', 'Max Hours', 'Assigned Hours', 'Utilization %', 'Status']];
      wlData.forEach(({ faculty: f, assigned, maxHours }) => {
        const pct = maxHours > 0 ? Math.round((assigned / maxHours) * 100) : 0;
        const status = pct > 100 ? 'Overloaded' : pct > 80 ? 'Near Limit' : 'Balanced';
        rows.push([f.name, f.department || '', maxHours, assigned, `${pct}%`, status]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [22,18,12,14,14,12].map(w => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, 'Workload');
    }

    const inst = (settings.institution || 'timetable').replace(/\s+/g, '_');
    XLSX.writeFile(wb, `${inst}_timetable.xlsx`);
    DB.logActivity('Exported timetable to Excel', 'info');
    showToast('Excel file downloaded!', 'success');
  }

  /* ── Print ── */
  function printView() {
    window.print();
  }

  /* ── Init ── */
  function init() {
    document.getElementById('export-pdf-btn')?.addEventListener('click', exportPDF);
    document.getElementById('export-excel-btn')?.addEventListener('click', exportExcel);
    document.getElementById('print-btn')?.addEventListener('click', printView);
  }

  return { init, exportPDF, exportExcel };
})();
