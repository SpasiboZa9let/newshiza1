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

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.trim().toLowerCase();
    return students.filter((st) =>
      (st.fullName || "").toLowerCase().includes(q)
    );
  }, [students, search]);

  const handleAdd = (studentId, value, evt) => {
    if (!date) {
      alert("Сначала выбери дату.");
      return;
    }
    if (!subjectId) {
      alert("Сначала выбери предмет.");
      return;
    }

    const num = Number(value);
    if (!Number.isFinite(num)) return;

    onAddGrade(date, Number(subjectId), studentId, num);

    // визуальная «вспышка» на кнопке
    if (evt && evt.target) {
      evt.target.classList.remove("flash");
      // перезапустить анимацию
      void evt.target.offsetWidth;
      evt.target.classList.add("flash");
    }
  };

  return (
    <section className="grade-entry">
      <div className="grade-entry-header">
        <div>
          <div className="grade-entry-title">Быстрое выставление оценок</div>
          <div className="grade-entry-subtitle">
            Выбери дату и предмет, потом кликай по 2 / 3 / 4 / 5
            напротив ученика.
          </div>
        </div>
      </div>

      <div className="grade-entry-controls">
        <label className="grade-entry-label">
          <span className="grade-entry-label-caption">Дата</span>
          <input
            type="date"
            className="grade-entry-input grade-entry-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="grade-entry-label">
          <span className="grade-entry-label-caption">Предмет</span>
          <select
            className="grade-entry-input grade-entry-subject"
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

        <label className="grade-entry-label grade-entry-label--search">
          <span className="grade-entry-label-caption">Поиск по фамилии</span>
          <input
            type="text"
            className="grade-entry-input"
            placeholder="Начни вводить фамилию…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <div className="grade-entry-legend">
        Клик по кнопке оценки добавляет отметку за выбранные дату и предмет.
      </div>

      {filteredStudents.length === 0 ? (
        <div className="grade-entry-empty">
          По этому запросу учеников нет.
        </div>
      ) : (
        <div className="grade-entry-grid">
          {filteredStudents.map((st) => (
            <div key={st.id} className="grade-entry-row">
              <div className="grade-entry-student">
                <div className="grade-entry-student-name">{st.fullName}</div>
                <div className="grade-entry-student-meta">
                  {st.classLabel || "Класс не указан"}
                </div>
              </div>
              <div className="grade-entry-actions">
                {[2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="grade-entry-btn"
                    onClick={(e) => handleAdd(st.id, v, e)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
