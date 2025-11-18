const { useMemo, useState } = React;

function FiltersPanel({
  subjects,
  search,
  onSearchChange,
  onlyWithDebts,
  onToggleDebts,
  subjectFilter,
  onSubjectFilterChange
}) {
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
          <option key={subj.id} value={subj.id}>
            {subj.name}
          </option>
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
            className={
              "student-card" + (active ? " student-card--active" : "")
            }
            onClick={() => onSelect(st.id)}
          >
            <div className="student-avatar">
              <span>{getInitials(st.fullName)}</span>
            </div>
            <div className="student-info">
              <div className="student-name">{st.fullName}</div>
              <div className="student-meta">
                <span>{st.classLabel || "Класс не указан"}</span>
                {hasDebts && (
                  <span className="student-badge">Есть долги</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function GradesBlock({ student, subjects, grades, onEditGrade }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const performanceBySubject = useMemo(() => {
    if (!student) return [];
    return subjects.map((subj) => {
      const last = getLastGrade(grades, student.id, subj.id);
      return { subject: subj, lastGrade: last };
    });
  }, [subjects, grades, student]);

  const selectedSubject = useMemo(() => {
    if (!student || !selectedSubjectId) return null;
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, student, selectedSubjectId]);

  const history = useMemo(() => {
    if (!student || !selectedSubjectId) return [];
    return grades
      .filter(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === selectedSubjectId
      )
      .sort((a, b) => {
        if (a.date === b.date) return 0;
        return a.date < b.date ? -1 : 1;
      });
  }, [grades, student, selectedSubjectId]);

  if (!student) return null;

  const handleRowClick = (subjectId) => {
    setSelectedSubjectId((prev) => (prev === subjectId ? null : subjectId));
  };

  const handleAddGrade = () => {
    if (!student || !selectedSubjectId) return;
    onEditGrade(student.id, selectedSubjectId);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Успеваемость по предметам</h3>
        <p className="details-section-subtitle">
          Клик по строке предмета — посмотреть все оценки.
        </p>
      </div>
      <div className="grades-grid">
        <div className="grades-grid-header">Предмет</div>
        <div className="grades-grid-header">Последняя оценка</div>
        {performanceBySubject.map(({ subject, lastGrade }) => (
          <React.Fragment key={subject.id}>
            <button
              className="grades-grid-cell grades-grid-subject grades-grid-subject-btn"
              onClick={() => handleRowClick(subject.id)}
            >
              {subject.name}
            </button>
            <button
              className={
                "grades-grid-cell grades-grid-grade" +
                (lastGrade ? "" : " grades-grid-grade--empty")
              }
              onClick={() => handleRowClick(subject.id)}
            >
              {lastGrade ? lastGrade.value : "—"}
            </button>
          </React.Fragment>
        ))}
      </div>

      {selectedSubject && (
        <div className="grades-history">
          <div className="grades-history-title">
            История оценок: {selectedSubject.name}
          </div>

          {history.length === 0 && (
            <div className="grades-history-empty">
              Пока нет оценок по этому предмету.
            </div>
          )}

          {history.length > 0 && (
            <div className="grades-history-list">
              {history.map((g) => (
                <div
                  className="grades-history-row"
                  key={g.id || `${g.date}-${g.value}`}
                >
                  <span className="grades-history-date">
                    {formatDate(g.date)}
                  </span>
                  <span className="grades-history-value">
                    {g.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grades-history-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddGrade}
            >
              Добавить / изменить оценку
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function AbsencesBlock({ student, absences, onAddAbsence }) {
  if (!student) return null;

  const studentAbsences = absences
    .filter((a) => a.studentId === student.id)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const formatDate = (iso) => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const typeLabel = (t) => {
    if (t === "late") return "Опоздание";
    if (t === "absence") return "Пропуск";
    return t || "";
  };

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Пропуски и опоздания</h3>
        <button
          className="btn"
          type="button"
          onClick={() => onAddAbsence(student.id)}
        >
          + Добавить запись
        </button>
      </div>

      {studentAbsences.length === 0 && (
        <div className="empty">Пока нет данных о пропусках и опозданиях.</div>
      )}

      {studentAbsences.length > 0 && (
        <div className="absences-list">
          {studentAbsences.map((a) => (
            <div className="absence-item" key={a.id}>
              <span className="absence-date">{formatDate(a.date)}</span>
              <span className={"absence-type absence-type--" + a.type}>
                {typeLabel(a.type)}
              </span>
            </div>
          ))}
        </div>
      )}
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

function StudentDetails({
  student,
  subjects,
  grades,
  debts,
  notes,
  absences,
  onEditGrade,
  onChangeDebtStatus,
  onAddNote,
  onAddAbsence
}) {
  if (!student) {
    return (
      <div className="placeholder">
        Выбери ученика слева, чтобы посмотреть оценки, пропуски и долги.
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

      <AbsencesBlock
        student={student}
        absences={absences}
        onAddAbsence={onAddAbsence}
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
