const { useState, useMemo, useEffect } = React;

// Ключ для localStorage
const STORAGE_KEY = "class_journal_state_v1";

// Базовые данные из data.js
const BASE_DATA = window.__DATA__ || {
  students: [],
  subjects: [],
  grades: [],
  debts: [],
  notes: []
};

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return BASE_DATA;
    const parsed = JSON.parse(raw);
    // Минимальная защита от мусора
    return {
      students: parsed.students || BASE_DATA.students,
      subjects: parsed.subjects || BASE_DATA.subjects,
      grades: parsed.grades || BASE_DATA.grades,
      debts: parsed.debts || BASE_DATA.debts,
      notes: parsed.notes || BASE_DATA.notes
    };
  } catch (e) {
    console.error("Ошибка чтения localStorage", e);
    return BASE_DATA;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Ошибка записи localStorage", e);
  }
}

function getInitials(fullName) {
  const parts = fullName.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getLastGrade(grades, studentId, subjectId) {
  const list = grades.filter(
    (g) => g.studentId === studentId && g.subjectId === subjectId
  );
  if (list.length === 0) return null;
  // считаем, что в массиве уже хронология, берем последнюю
  return list[list.length - 1];
}

function statusLabel(status) {
  switch (status) {
    case "open":
      return "Открыт";
    case "in_progress":
      return "В работе";
    case "closed":
      return "Закрыт";
    default:
      return status;
  }
}

// ============================
//   КОМПОНЕНТ ПРИЛОЖЕНИЯ
// ============================

function App() {
  const [state, setState] = useState(loadInitialState);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [search, setSearch] = useState("");
  const [onlyWithDebts, setOnlyWithDebts] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { students, subjects, grades, debts, notes } = state;

  // Сохраняем всё при любом изменении
  useEffect(() => {
    saveState(state);
  }, [state]);

  // ============================
  //   МУТАЦИИ СОСТОЯНИЯ
  // ============================

  const updateState = (updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
  };

  const handleEditGrade = (studentId, subjectId) => {
    const current = getLastGrade(grades, studentId, subjectId);
    const defaultValue = current ? String(current.value) : "";
    const input = window.prompt("Новая оценка (2–5):", defaultValue);

    if (input === null) return; // отмена

    const num = parseInt(input, 10);
    if (![2, 3, 4, 5].includes(num)) {
      alert("Допустимые оценки: 2, 3, 4, 5.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    updateState((prev) => ({
      ...prev,
      grades: [
        ...prev.grades,
        {
          id: Date.now(),
          studentId,
          subjectId,
          value: num,
          date: today
        }
      ]
    }));
  };

  const handleAddNote = (studentId) => {
    const text = window.prompt("Новая заметка по ученику:");
    if (!text || !text.trim()) return;

    updateState((prev) => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          id: Date.now(),
          studentId,
          type: "note",
          text: text.trim()
        }
      ]
    }));
  };

  const handleChangeDebtStatus = (debtId) => {
    updateState((prev) => ({
      ...prev,
      debts: prev.debts.map((d) => {
        if (d.id !== debtId) return d;
        let nextStatus = "open";
        if (d.status === "open") nextStatus = "in_progress";
        else if (d.status === "in_progress") nextStatus = "closed";
        else if (d.status === "closed") nextStatus = "open";
        return { ...d, status: nextStatus };
      })
    }));
  };

  // ============================
  //   ВЫЧИСЛЯЕМЫЕ ДАННЫЕ
  // ============================

  const filteredStudents = useMemo(() => {
    let list = [...students];

    const s = search.trim().toLowerCase();
    if (s) {
      list = list.filter((st) =>
        st.fullName.toLowerCase().includes(s)
      );
    }

    if (onlyWithDebts) {
      list = list.filter((st) =>
        debts.some((d) => d.studentId === st.id)
      );
    }

    if (subjectFilter !== "all") {
      const subjectId = Number(subjectFilter);
      list = list.filter((st) => {
        const studentDebts = debts.filter((d) => d.studentId === st.id);
        return studentDebts.some((d) => d.subjectId === subjectId);
      });
    }

    return list;
  }, [students, debts, search, onlyWithDebts, subjectFilter]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const selectedStudentDebts = useMemo(() => {
    if (!selectedStudent) return [];
    return debts.filter((d) => d.studentId === selectedStudent.id);
  }, [debts, selectedStudent]);

  const selectedStudentNotes = useMemo(() => {
    if (!selectedStudent) return [];
    return notes.filter((n) => n.studentId === selectedStudent.id);
  }, [notes, selectedStudent]);

  // Для краткого обзора успеваемости: предмет → последняя оценка
  const performanceBySubject = useMemo(() => {
    if (!selectedStudent) return [];
    return subjects.map((subj) => {
      const last = getLastGrade(grades, selectedStudent.id, subj.id);
      return {
        subject: subj,
        lastGrade: last
      };
    });
  }, [subjects, grades, selectedStudent]);

  // ============================
  //   РЕНДЕР
  // ============================

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Классный журнал</h1>
          <p className="app-subtitle">Мини-панель для классного руководителя</p>
        </div>
      </header>

      <div className="app-layout">
        {/* ЛЕВАЯ КОЛОНКА: фильтры + список учеников */}
        <aside className="sidebar">
          <div className="filters-card">
            <input
              type="text"
              className="input"
              placeholder="Поиск по фамилии..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={onlyWithDebts}
                onChange={(e) => setOnlyWithDebts(e.target.checked)}
              />
              <span>Показать только с долгами</span>
            </label>

            <select
              className="input"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="all">Все предметы</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="students-list">
            {filteredStudents.length === 0 && (
              <div className="empty">Никого не найдено</div>
            )}

            {filteredStudents.map((st) => {
              const hasDebts = debts.some((d) => d.studentId === st.id);
              const active = st.id === selectedStudentId;

              return (
                <button
                  key={st.id}
                  className={"student-card" + (active ? " student-card--active" : "")}
                  onClick={() => handleSelectStudent(st.id)}
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
        </aside>

        {/* ПРАВАЯ КОЛОНКА: детали ученика */}
        <main className="details">
          {!selectedStudent && (
            <div className="placeholder">
              Выбери ученика слева, чтобы посмотреть оценки, долги и заметки.
            </div>
          )}

          {selectedStudent && (
            <div className="details-content">
              <div className="details-header">
                <div className="details-avatar">
                  <span>{getInitials(selectedStudent.fullName)}</span>
                </div>
                <div>
                  <h2>{selectedStudent.fullName}</h2>
                  <p className="details-meta">
                    Класс: {selectedStudent.classLabel || "не указан"}
                  </p>
                </div>
              </div>

              {/* Блок успеваемости */}
              <section className="details-section">
                <div className="details-section-header">
                  <h3>Успеваемость по предметам</h3>
                  <p className="details-section-subtitle">
                    Клик по ячейке с оценкой — изменить последнюю.
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
                        onClick={() =>
                          handleEditGrade(selectedStudent.id, subject.id)
                        }
                      >
                        {lastGrade ? lastGrade.value : "—"}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </section>

              {/* Блок долгов */}
              <section className="details-section">
                <div className="details-section-header">
                  <h3>Долги</h3>
                  <p className="details-section-subtitle">
                    Клик по статусу — переключить (открыт → в работе → закрыт).
                  </p>
                </div>

                {selectedStudentDebts.length === 0 && (
                  <div className="empty">У ученика нет задолженностей.</div>
                )}

                {selectedStudentDebts.length > 0 && (
                  <div className="debts-list">
                    {selectedStudentDebts.map((d) => {
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
                            onClick={() => handleChangeDebtStatus(d.id)}
                          >
                            {statusLabel(d.status || "open")}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Блок заметок */}
              <section className="details-section">
                <div className="details-section-header">
                  <h3>Заметки</h3>
                  <button
                    className="btn"
                    onClick={() => handleAddNote(selectedStudent.id)}
                  >
                    + Добавить заметку
                  </button>
                </div>

                {selectedStudentNotes.length === 0 && (
                  <div className="empty">
                    Пока нет заметок по этому ученику.
                  </div>
                )}

                {selectedStudentNotes.length > 0 && (
                  <div className="notes-list">
                    {selectedStudentNotes.map((n) => (
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Монтируем
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
