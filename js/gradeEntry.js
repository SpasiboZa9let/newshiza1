const { useState, useMemo } = React;

/**
 * Панель быстрого выставления оценок по дате.
 *
 * Работает ТОЛЬКО для учителя (admin-режим).
 *
 * Пропсы:
 * - students: список учеников [{id, fullName, classLabel}]
 * - subjects: список предметов [{id, name}]
 * - grades:   список оценок [{id, studentId, subjectId, value, date}]
 * - onAddGrade(date, subjectId, studentId, value)
 */

// Цветовая маркировка предметов (по id из subjects.js)
const SUBJECT_COLOR_MAP = {
  1: "#2563eb",  // Алгебра — синий
  5: "#16a34a",  // Английский — зелёный
  9: "#7c3aed",  // Литература — фиолетовый
  11: "#1d4ed8", // ОБЖ — тёмно-синий
  13: "#ef4444"  // Русский язык — красный
};

// Вспомогательный формат даты (YYYY-MM-DD -> DD.MM.YYYY)
function formatDateShort(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Сегодня в формате YYYY-MM-DD
function getTodayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// Вчера в формате YYYY-MM-DD
function getYesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function GradeEntryPanel({ students, subjects, grades, onAddGrade }) {
  // --- Состояние панели ---
  const [date, setDate] = useState(() => getTodayISO());
  const [subjectId, setSubjectId] = useState(() => {
    if (!subjects || subjects.length === 0) return "";
    return String(subjects[0].id);
  });

  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null); // 2 / 3 / 4 / 5

  // --- Выбранный предмет и его цвет ---
  const selectedSubject = useMemo(() => {
    const idNum = Number(subjectId);
    return subjects?.find((s) => s.id === idNum) || null;
  }, [subjectId, subjects]);

  const selectedSubjectColor = selectedSubject
    ? SUBJECT_COLOR_MAP[selectedSubject.id] || "#4b5563"
    : "#4b5563";

  const selectedSubjectId = selectedSubject ? selectedSubject.id : null;

  // --- Фильтрация учеников по поиску ---
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((st) =>
      st.fullName.toLowerCase().includes(q)
    );
  }, [students, search]);

  // --- Обработчики кнопок дат ---
  const handleSetToday = () => setDate(getTodayISO());
  const handleSetYesterday = () => setDate(getYesterdayISO());

  // --- Клик по ученику = выставление оценки ---
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

  // --- Если нет предметов вообще ---
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
            Выбери дату, предмет и оценку, затем кликни по ученику.
          </p>
        </div>

        <div className="grade-entry-controls">
          {/* Дата */}
          <label className="grade-entry-label">
            <span>Дата</span>
            <div className="grade-entry-date-row">
              <input
                type="date"
                className="grade-entry-date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button
                type="button"
                className="grade-entry-date-btn"
                onClick={handleSetToday}
              >
                Сегодня
              </button>
              <button
                type="button"
                className="grade-entry-date-btn"
                onClick={handleSetYesterday}
              >
                Вчера
              </button>
            </div>
          </label>

          {/* Предмет */}
          <label className="grade-entry-label">
            <span>Предмет</span>
            <div className="grade-entry-subject-row">
              <select
                className="grade-entry-subject-select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {selectedSubject && (
                <span
                  className="grade-entry-subject-pill"
                  style={{ backgroundColor: selectedSubjectColor }}
                >
                  {selectedSubject.name}
                </span>
              )}
            </div>
          </label>

          {/* Поиск по ученикам */}
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

          {/* Полка оценок */}
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
        </div>
      </div>

      {/* Список учеников */}
      <div className="grade-entry-body">
        {filteredStudents.map((st) => {
          // последняя оценка по выбранному предмету (если предмет выбран)
          let lastGrade = null;
          if (selectedSubjectId && typeof getLastGrade === "function") {
            lastGrade = getLastGrade(grades || [], st.id, selectedSubjectId);
          }

          return (
            <button
              key={st.id}
              type="button"
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
                  <div className="grade-entry-student-name">
                    {st.fullName}
                  </div>
                  <div className="grade-entry-student-meta">
                    <span>{st.classLabel || "Класс не указан"}</span>
                    {selectedSubject && lastGrade && (
                      <span className="grade-entry-last-grade">
                        Последняя по {selectedSubject.name}:{" "}
                        <strong>{lastGrade.value}</strong>{" "}
                        <span className="grade-entry-last-grade-date">
                          от {formatDateShort(lastGrade.date)}
                        </span>
                      </span>
                    )}
                    {selectedSubject && !lastGrade && (
                      <span className="grade-entry-last-grade">
                        Пока нет оценок по {selectedSubject.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="grade-entry-empty">
            Никто не найден по этому фильтру.
          </div>
        )}
      </div>
    </section>
  );
}
