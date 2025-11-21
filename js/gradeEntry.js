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
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [subjectId, setSubjectId] = useState(() => {
    if (subjects && subjects.length > 0) {
      return subjects[0].id;
    }
    return "";
  });

  const [filterText, setFilterText] = useState("");

  if (!students || !students.length || !subjects || !subjects.length) {
    return null;
  }

  const filteredStudents = useMemo(() => {
    if (!filterText) return students;
    const query = filterText.toLowerCase();
    return students.filter((st) =>
      (st.fullName || "").toLowerCase().includes(query)
    );
  }, [students, filterText]);

  const handleClickGrade = (studentId, value, e) => {
    if (!subjectId) {
      alert("Сначала выбери предмет.");
      return;
    }
    if (!date) {
      alert("Сначала выбери дату.");
      return;
    }

    onAddGrade(date, Number(subjectId), studentId, value);

    if (e && e.target) {
      const btn = e.target;
      btn.classList.remove("flash");
      // форсируем перерисовку, чтобы анимация срабатывала каждый раз
      void btn.offsetWidth;
      btn.classList.add("flash");
    }
  };

  return (
    <section className="grade-entry">
      <div className="grade-entry-header">
        <div className="grade-entry-title">Быстрое выставление оценок</div>
        <div className="grade-entry-subtitle">
          Выставляет оценки сразу по классу за выбранную дату и предмет.
        </div>
      </div>

      <div className="grade-entry-controls">
        <label className="grade-entry-field">
          <span className="grade-entry-label">Дата</span>
          <input
            type="date"
            className="input grade-entry-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="grade-entry-field">
          <span className="grade-entry-label">Предмет</span>
          <select
            className="input grade-entry-input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grade-entry-field grade-entry-field--grow">
          <span className="grade-entry-label">Фильтр по фамилии</span>
          <input
            type="text"
            className="input grade-entry-input"
            placeholder="Начни вводить фамилию..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </label>
      </div>

      <div className="grade-entry-legend">
        <span>Нажми на оценку, чтобы выставить её ученику.</span>
        <span className="grade-entry-legend-date">
          Дата: <strong>{date || "—"}</strong>
        </span>
      </div>

      <div className="grade-entry-students">
        {filteredStudents.map((st) => (
          <div key={st.id} className="grade-entry-row">
            <div className="grade-entry-student">
              <div className="grade-entry-avatar">
                <span>{getInitials(st.fullName)}</span>
              </div>
              <div className="grade-entry-student-info">
                <div className="grade-entry-student-name">
                  {st.fullName}
                </div>
                <div className="grade-entry-student-meta">
                  {st.classLabel || "Класс не указан"}
                </div>
              </div>
            </div>

            <div className="grade-entry-buttons">
              {[2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className="btn grade-entry-btn"
                  onClick={(e) => handleClickGrade(st.id, v, e)}
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
