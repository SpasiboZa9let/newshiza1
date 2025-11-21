const { useState, useMemo } = React;

/**
 * Панель быстрого выставления оценок по дате.
 *
 * Работает ТОЛЬКО для учителя (admin-режим).
 *
 * Пропсы:
 * - students: список учеников
 * - subjects: список предметов
 * - onAddGrade(date, subjectId, studentId, value)
 */
function GradeEntryPanel({ students, subjects, onAddGrade }) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  });

  const [subjectId, setSubjectId] = useState(
    subjects && subjects.length ? String(subjects[0].id) : ""
  );
  const [search, setSearch] = useState("");

  const numericSubjectId = subjectId ? Number(subjectId) : null;

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((st) =>
      st.fullName.toLowerCase().includes(q)
    );
  }, [students, search]);

  function handleGradeClick(studentId, value, event) {
    if (!date) {
      alert("Сначала выбери дату.");
      return;
    }
    if (!numericSubjectId) {
      alert("Сначала выбери предмет.");
      return;
    }

    onAddGrade(date, numericSubjectId, studentId, value);

    const btn = event && event.currentTarget;
    if (btn) {
      btn.classList.remove("flash");
      // перезапуск анимации
      // eslint-disable-next-line no-unused-expressions
      btn.offsetWidth;
      btn.classList.add("flash");
    }
  }

  return (
    <section className="grade-entry">
      <header className="grade-entry-header">
        <div className="grade-entry-header-text">
          <h2 className="grade-entry-title">Быстрое выставление оценок</h2>
          <p className="grade-entry-subtitle">
            1) выбери дату и предмет, 2) кликни по оценке напротив фамилии.
          </p>
        </div>
        <div className="grade-entry-badge">Только учитель</div>
      </header>

      <div className="grade-entry-controls">
        <label className="grade-entry-control">
          <span className="grade-entry-label">Дата</span>
          <input
            type="date"
            className="grade-entry-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="grade-entry-control">
          <span className="grade-entry-label">Предмет</span>
          <select
            className="grade-entry-input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grade-entry-control grade-entry-control--wide">
          <span className="grade-entry-label">Поиск по фамилии</span>
          <input
            type="text"
            className="grade-entry-input"
            placeholder="Начни вводить фамилию или имя"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <div className="grade-entry-meta-row">
        <span className="grade-entry-meta">
          Ученики: {filteredStudents.length} из {students.length}
        </span>
        {!numericSubjectId && (
          <span className="grade-entry-warning">Выбери предмет, чтобы выставлять оценки</span>
        )}
      </div>

      <div className="grade-entry-list">
        {filteredStudents.length === 0 && (
          <div className="grade-entry-empty">
            Никого не найдено. Попробуй изменить запрос поиска.
          </div>
        )}

        {filteredStudents.map((st) => (
          <div key={st.id} className="grade-entry-row">
            <div className="grade-entry-student">
              <div className="grade-entry-avatar">
                <span>
                  {typeof getInitials === "function"
                    ? getInitials(st.fullName)
                    : (st.fullName || "?").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="grade-entry-student-text">
                <div className="grade-entry-name">{st.fullName}</div>
                <div className="grade-entry-student-meta">
                  {st.classLabel || "Класс не указан"}
                </div>
              </div>
            </div>

            <div className="grade-entry-btn-group">
              {[2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`grade-entry-btn grade-entry-btn-${v}`}
                  title={`Оценка ${v}`}
                  disabled={!date || !numericSubjectId}
                  onClick={(e) => handleGradeClick(st.id, v, e)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
