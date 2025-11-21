const { useState, useMemo } = React;

/**
 * Панель быстрого выставления оценок по дате.
 *
 * Работает ТОЛЬКО для учителя (admin-режим).
 *
 * Пропсы:
 * - students: список учеников [{id, fullName, classLabel}]
 * - subjects: список предметов [{id, name}]
 * - onAddGrade(date, subjectId, studentId, value)
 */
function GradeEntryPanel({ students, subjects, onAddGrade }) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  });

  const [subjectId, setSubjectId] = useState(() => {
    if (!subjects || subjects.length === 0) return "";
    return String(subjects[0].id);
  });

  const [search, setSearch] = useState("");

  const selectedSubject = useMemo(() => {
    const idNum = Number(subjectId);
    return subjects?.find((s) => s.id === idNum) || null;
  }, [subjectId, subjects]);

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const query = search.trim().toLowerCase();
    return students.filter((st) =>
      st.fullName.toLowerCase().includes(query)
    );
  }, [students, search]);

  const handleSetToday = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setDate(`${d.getFullYear()}-${m}-${day}`);
  };

  const handleSetYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setDate(`${d.getFullYear()}-${m}-${day}`);
  };

  const handleClickGrade = (studentId, value, e) => {
    if (!date) {
      alert("Сначала выбери дату.");
      return;
    }
    if (!subjectId) {
      alert("Сначала выбери предмет.");
      return;
    }

    const num = Number(value);
    const subjNum = Number(subjectId);

    onAddGrade(date, subjNum, studentId, num);

    // анимация «вспышки» по кнопке
    const btn = e.currentTarget;
    btn.classList.remove("flash");
    // перезапускаем анимацию
    // eslint-disable-next-line no-unused-expressions
    void btn.offsetWidth;
    btn.classList.add("flash");
  };

  if (!subjects || subjects.length === 0) {
    return (
      <section className="grade-entry">
        <div className="grade-entry-header">
          <div>
            <h2 className="grade-entry-title">Быстрое выставление оценок</h2>
            <p className="grade-entry-subtitle">
              Сначала добавь предметы в журнал.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grade-entry">
      <div className="grade-entry-header">
        <div>
          <h2 className="grade-entry-title">Быстрое выставление оценок</h2>
          <p className="grade-entry-subtitle">
            1) выбери дату и предмет, 2) кликай по ученикам.
          </p>
        </div>

        <div className="grade-entry-date-block">
          <label className="grade-entry-label">
            <span>Дата</span>
            <input
              type="date"
              className="grade-entry-date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <div className="grade-entry-date-buttons">
            <button
              type="button"
              className="btn btn-light grade-entry-small-btn"
              onClick={handleSetToday}
            >
              Сегодня
            </button>
            <button
              type="button"
              className="btn btn-light grade-entry-small-btn"
              onClick={handleSetYesterday}
            >
              Вчера
            </button>
          </div>
        </div>
      </div>

      <div className="grade-entry-controls">
        <label className="grade-entry-label">
          <span>Предмет</span>
          <select
            className="grade-entry-select"
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

        <label className="grade-entry-label grade-entry-search">
          <span>Фильтр по ученикам</span>
          <input
            type="text"
            className="grade-entry-search-input"
            placeholder="Начни вводить фамилию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {selectedSubject && (
          <div className="grade-entry-pill">
            {selectedSubject.name}
          </div>
        )}

        <div className="grade-entry-count">
          Ученики: {filteredStudents.length} из {students.length}
        </div>
      </div>

      <div className="grade-entry-list">
        {filteredStudents.map((st) => (
          <div key={st.id} className="grade-entry-row">
            <div className="grade-entry-student">
              <div className="grade-entry-avatar">
                <span>
                  {typeof getInitials === "function"
                    ? getInitials(st.fullName)
                    : "?"}
                </span>
              </div>
              <div className="grade-entry-student-info">
                <div className="grade-entry-student-name">{st.fullName}</div>
                <div className="grade-entry-student-meta">
                  {st.classLabel || "Класс не указан"}
                </div>
              </div>
            </div>

            <div className="grade-entry-actions">
              {[2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`grade-entry-btn grade-entry-btn-${v}`}
                  onClick={(e) => handleClickGrade(st.id, v, e)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="grade-entry-empty">
            Никто не найден по этому фильтру.
          </div>
        )}
      </div>
    </section>
  );
}
