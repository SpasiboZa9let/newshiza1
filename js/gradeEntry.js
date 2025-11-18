const { useState } = React;

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
    subjects.length ? String(subjects[0].id) : ""
  );

  if (!subjects.length || !students.length) {
    return null;
  }

  const handleClickGrade = (studentId, value) => {
    if (!date || !subjectId) {
      alert("Сначала выбери дату и предмет.");
      return;
    }
    onAddGrade(date, Number(subjectId), studentId, value);
  };

  return (
    <section className="details-section grade-entry">
      <div className="details-section-header">
        <h3>Быстрое выставление оценок</h3>
        <p className="details-section-subtitle">
          1) Дата и предмет · 2) Нажимай на оценки у нужных учеников.
        </p>
      </div>

      <div className="grade-entry-controls">
        <div className="grade-entry-field">
          <label>Дата урока</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grade-entry-field">
          <label>Предмет</label>
          <select
            className="input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grade-entry-students">
        {students.map((st) => (
          <div className="grade-entry-row" key={st.id}>
            <div className="grade-entry-name">{st.fullName}</div>
            <div className="grade-entry-buttons">
              {[2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className="btn grade-entry-btn"
                  onClick={(e) => {
                    handleClickGrade(st.id, v);
                    // Перезапуск анимации "flash"
                    e.target.classList.remove("flash");
                    void e.target.offsetWidth;
                    e.target.classList.add("flash");
                  }}
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
