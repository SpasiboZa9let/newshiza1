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

// Цветовая маркировка предметов (по id из subjects.js)
const SUBJECT_COLOR_MAP = {
  1: "#2563eb", // Алгебра — синий
  13: "#ef4444", // Русский язык — красный
  5: "#16a34a", // Английский — зелёный
  9: "#7c3aed", // Литература — фиолетовый
  11: "#1d4ed8", // ОБЖ — тёмно-синий
};

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
  const [selectedGrade, setSelectedGrade] = useState(null); // 2/3/4/5

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

  const handleClickStudent = (studentId, e) => {
    if (!date) {
      alert("Сначала выбери дату.");
      return;
    }
    if (!subjectId) {
      alert("Сначала выбери предмет.");
      return;
    }
    if (!selectedGrade) {
      alert("Сначала выбери оценку наверху.");
      return;
    }

    const subjNum = Number(subjectId);
    const num = Number(selectedGrade);

    onAddGrade(date, subjNum, studentId, num);

    // анимация «вспышки» по строке
    const row = e.currentTarget;
    row.classList.remove("flash");
    // перезапуск анимации
    // eslint-disable-next-line no-unused-expressions
    void row.offsetWidth;
    row.classList.add("flash");
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

  const subjectColor =
    selectedSubject && SUBJECT_COLOR_MAP[selectedSubject.id]
      ? SUBJECT_COLOR_MAP[selectedSubject.id]
      : "#4b5563";

  return (
    <section className="grade-entry">
      <div className="grade-entry-header">
        <div className="grade-entry-header-main">
          <div>
            <h2 className="grade-entry-title">Быстрое выставление оценок</h2>
            <p className="grade-entry-subtitle">
              1) выбери дату, предмет и оценку, 2) кликай по ученикам.
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
              onChange={(e) => {
                setSubjectId(e.target.value);
              }}
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

          <div className="grade-entry-grade-bar">
            <span className="grade-entry-label-inline">Оценка</span>
            {[2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                className={
                  "grade-entry-grade-pill" +
                  (selectedGrade === v
                    ? " grade-entry-grade-pill--active"
                    : "")
                }
                onClick={() => setSelectedGrade(v)}
              >
                {v}
              </button>
            ))}
          </div>

          {selectedSubject && (
            <div
              className="grade-entry-pill"
              style={{
                borderColor: subjectColor,
                color: subjectColor,
              }}
            >
              <span className="grade-entry-pill-dot" />
              <span className="grade-entry-pill-text">
                {selectedSubject.name}
              </span>
            </div>
          )}

          <div className="grade-entry-count">
            Ученики: {filteredStudents.length} из {students.length}
          </div>
        </div>
      </div>

      <div className="grade-entry-list">
        {filteredStudents.map((st) => (
          <div
            key={st.id}
            className="grade-entry-row"
            onClick={(e) => handleClickStudent(st.id, e)}
          >
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
