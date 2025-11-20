const { useState } = React;

/**
 * Панель быстрого выставления оценок по дате.
 *
 * Работает ТОЛЬКО для учителя (admin-режим, см. App).
 *
 * Пропсы:
 * - students: список учеников
 * - subjects: список предметов
 * - onAddGrade(date, subjectId, studentId, value)
 */
function GradeEntryPanel({ students, subjects, onAddGrade }) {
  if (!students || !students.length || !subjects || !subjects.length) {
    return null;
  }

  const [date, setDate] = useState(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  });

  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const sortedStudents = students
    .slice()
    .sort((a, b) => a.fullName.localeCompare(b.fullName, "ru"));

  const visibleStudents = normalizedSearch
    ? sortedStudents.filter((st) =>
        st.fullName.toLowerCase().includes(normalizedSearch)
      )
    : sortedStudents;

  function handleGradeClick(studentId, value, event) {
    if (!date) {
      alert("Сначала выбери дату.");
      return;
    }
    if (!subjectId) {
      alert("Сначала выбери предмет.");
      return;
    }

    onAddGrade(date, subjectId, studentId, value);

    // анимация "вспышки" на кнопке
    if (event && event.currentTarget) {
      const btn = event.currentTarget;
      btn.classList.remove("flash");
      // форсируем перерисовку, чтобы анимация срабатывала каждый раз
      void btn.offsetWidth;
      btn.classList.add("flash");
    }
  }

  return (
    <section className="grade-entry">
      <header className="grade-entry-header">
        <div>
          <h2 className="grade-entry-title">Быстрое выставление оценок</h2>
          <p className="grade-entry-subtitle">
            Выбери дату, предмет и кликни по цифре напротив ученика.
          </p>
        </div>
        <div className="grade-entry-meta">
          <span>{visibleStudents.length} учеников в списке</span>
        </div>
      </header>

      <div className="grade-entry-controls">
        <div className="grade-entry-control">
          <label className="grade-entry-label">Дата</label>
          <input
            type="date"
            className="grade-entry-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grade-entry-control">
          <label className="grade-entry-label">Предмет</label>
          <select
            className="grade-entry-input"
            value={subjectId}
            onChange={(e) => setSubjectId(Number(e.target.value))}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grade-entry-control grade-entry-control--search">
          <label className="grade-entry-label">Поиск по фамилии</label>
          <input
            type="text"
            className="grade-entry-input"
            placeholder="Начни вводить фамилию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grade-entry-list">
        {visibleStudents.map((st) => (
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
                  className="grade-entry-btn"
                  onClick={(e) => handleGradeClick(st.id, v, e)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}

        {visibleStudents.length === 0 && (
          <div className="grade-entry-empty">
            Никого не найдено по текущему фильтру.
          </div>
        )}
      </div>
    </section>
  );
}
