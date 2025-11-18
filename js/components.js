const { useMemo } = React;

function FiltersPanel({ subjects, search, onSearchChange, onlyWithDebts, onToggleDebts, subjectFilter, onSubjectFilterChange }) {
  return (
    <div className="filters-card">
      <input
        type="text"
        className="input"
        placeholder="Поиск по фамилии..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={onlyWithDebts}
          onChange={(e) => onToggleDebts(e.target.checked)}
        />
        <span>Показать только с долгами</span>
      </label>
      <select
        className="input"
        value={subjectFilter}
        onChange={(e) => onSubjectFilterChange(e.target.value)}
      >
        <option value="all">Все предметы</option>
        {subjects.map((subj) => (
          <option key={subj.id} value={subj.id}>{subj.name}</option>
        ))}
      </select>
    </div>
  );
}

function StudentsList({ students, debts, selectedStudentId, onSelect }) {
  if (!students.length) {
    return <div className="empty">Никого не найдено</div>;
  }

  return (
    <div className="students-list">
      {students.map((st) => {
        const hasDebts = debts.some((d) => d.studentId === st.id);
        const active = st.id === selectedStudentId;
        return (
          <button
            key={st.id}
            className={"student-card" + (active ? " student-card--active" : "")}
            onClick={() => onSelect(st.id)}
          >
            <div className="student-avatar">
              <span>{getInitials(st.fullName)}</span>
            </div>
            <div className="student-info">
              <div className="student-name">{st.fullName}</div>
              <div className="student-meta">
                <span>{st.classLabel || "Класс не указан"}</span>
                {hasDebts && <span className="student-badge">Есть долги</span>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function GradesBlock({ student, subjects, grades, onEditGrade }) {
  const performanceBySubject = useMemo(() => {
    if (!student) return [];
    return subjects.map((subj) => {
      const last = getLastGrade(grades, student.id, subj.id);
      return { subject: subj, lastGrade: last };
    });
  }, [subjects, grades, student]);

  if (!student) return null;

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Успеваемость по предметам</h3>
        <p className="details-section-subtitle">
          Клик по оценке — изменить последнюю.
        </p>
      </div>
      <div className="grades-grid">
        <div className="grades-grid-header">Предмет</div>
        <div className="grades-grid-header">Последняя оценка</div>
        {performanceBySubject.map(({ subject, lastGrade }) => (
          <React.Fragment key={subject.id}>
            <div className="grades-grid-cell grades-grid-subject">
              {subject.name}
            </div>
            <button
              className={
                "grades-grid-cell grades-grid-grade" +
                (lastGrade ? "" : " grades-grid-grade--empty")
              }
              onClick={() => onEditGrade(student.id, subject.id)}
            >
              {lastGrade ? lastGrade.value : "—"}
            </button>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function DebtsBlock({ student, subjects, debts, onChangeStatus }) {
  if (!student) return null;

  const studentDebts = debts.filter((d) => d.studentId === student.id);

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Долги</h3>
        <p className="details-section-subtitle">
          Клик по статусу — переключить (открыт → в работе → закрыт).
        </p>
      </div>

      {studentDebts.length === 0 && (
        <div className="empty">У ученика нет задолженностей.</div>
      )}

      {studentDebts.length > 0 && (
        <div className="debts-list">
          {studentDebts.map((d) => {
            const subj = subjects.find((s) => s.id === d.subjectId);
            return (
              <div className="debts-item" key={d.id}>
                <div className="debts-main">
                  <div className="debts-subject">
                    {subj ? subj.name : "Предмет"}
                  </div>
                  <div className="debts-desc">{d.desc}</div>
                </div>
                <button
                  className={
                    "debts-status debts-status--" + (d.status || "open")
                  }
                  onClick={() => onChangeStatus(d.id)}
                >
                  {statusLabel(d.status || "open")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function NotesBlock({ student, notes, onAddNote }) {
  if (!student) return null;

  const studentNotes = notes.filter((n) => n.studentId === student.id);

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Заметки</h3>
        <button className="btn" onClick={() => onAddNote(student.id)}>
          + Добавить заметку
        </button>
      </div>

      {studentNotes.length === 0 && (
        <div className="empty">Пока нет заметок по этому ученику.</div>
      )}

      {studentNotes.length > 0 && (
        <div className="notes-list">
          {studentNotes.map((n) => (
            <div className="note-item" key={n.id}>
              <div className="note-type">
                {n.type === "behavior"
                  ? "Поведение"
                  : n.type === "academic"
                  ? "Учёба"
                  : "Заметка"}
              </div>
              <div className="note-text">{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StudentDetails({ student, subjects, grades, debts, notes, onEditGrade, onChangeDebtStatus, onAddNote }) {
  if (!student) {
    return (
      <div className="placeholder">
        Выбери ученика слева, чтобы посмотреть оценки, долги и заметки.
      </div>
    );
  }

  return (
    <div className="details-content">
      <div className="details-header">
        <div className="details-avatar">
          <span>{getInitials(student.fullName)}</span>
        </div>
        <div>
          <h2>{student.fullName}</h2>
          <p className="details-meta">
            Класс: {student.classLabel || "не указан"}
          </p>
        </div>
      </div>

      <GradesBlock
        student={student}
        subjects={subjects}
        grades={grades}
        onEditGrade={onEditGrade}
      />

      <DebtsBlock
        student={student}
        subjects={subjects}
        debts={debts}
        onChangeStatus={onChangeDebtStatus}
      />

      <NotesBlock
        student={student}
        notes={notes}
        onAddNote={onAddNote}
      />
    </div>
  );
}
