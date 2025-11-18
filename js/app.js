const { useState, useMemo } = React;

// Забираем данные из data.js
const DATA = window.__DATA__ || {
  students: [],
  subjects: [],
  grades: [],
  debts: [],
  notes: []
};

function getInitials(fullName) {
  const parts = fullName.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getSubjectById(subjects, id) {
  return subjects.find((s) => s.id === id);
}

function calcAverageGrade(grades, studentId) {
  const g = grades.filter((gr) => gr.studentId === studentId);
  if (!g.length) return null;
  const sum = g.reduce((acc, item) => acc + item.grade, 0);
  return (sum / g.length).toFixed(1);
}

function App() {
  const { students, subjects, grades, debts, notes } = DATA;

  const [search, setSearch] = useState("");
  const [onlyWithDebts, setOnlyWithDebts] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const subjectId = subjectFilter ? Number(subjectFilter) : null;

    let list = [...students];

    if (query) {
      list = list.filter((s) => s.fullName.toLowerCase().includes(query));
    }

    if (onlyWithDebts) {
      list = list.filter((s) => {
        const studentDebts = debts.filter((d) => d.studentId === s.id);
        return studentDebts.some(
          (d) => d.status === "open" || d.status === "in_progress"
        );
      });
    }

    if (subjectId) {
      list = list.filter((s) => {
        const studentDebts = debts.filter((d) => d.studentId === s.id);
        return studentDebts.some((d) => d.subjectId === subjectId);
      });
    }

    return list;
  }, [students, debts, search, onlyWithDebts, subjectFilter]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const handleCommonChatClick = () => {
    alert(
      "Пока это макет. Здесь позже будет экран 'Общий чат' с темами: Домашка, ОГЭ, Объявления и т.д."
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-title">8А — Галерея учеников</h1>
          <p className="app-subtitle">
            Макет электронного журнала в стиле Telegram Mini App
          </p>
        </div>
        <div className="app-header-right">
          <button className="btn btn-primary" onClick={handleCommonChatClick}>
            Общий чат
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel panel-left">
          <div className="panel-header">
            <h2>Ученики</h2>
          </div>

          <div className="filters">
            <input
              type="text"
              className="input"
              placeholder="Поиск по фамилии..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filters-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={onlyWithDebts}
                  onChange={(e) => setOnlyWithDebts(e.target.checked)}
                />
                <span>Только с долгами</span>
              </label>

              <select
                className="select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">Все предметы</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <StudentsGrid
            students={filteredStudents}
            subjects={subjects}
            grades={grades}
            debts={debts}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
          />
        </section>

        <section className="panel panel-right" id="student-details">
          {selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              subjects={subjects}
              grades={grades}
              debts={debts}
              notes={notes}
            />
          ) : (
            <div className="panel-placeholder">
              <h2>Выбери ученика из списка</h2>
              <p>
                Слева галерея с карточками, а здесь будут оценки,
                долги и заметки по выбранному ученику.
              </p>
              <p>Сейчас всё работает на тестовых данных без базы.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StudentsGrid({
  students,
  subjects,
  grades,
  debts,
  selectedStudentId,
  onSelectStudent
}) {
  if (!students.length) {
    return (
      <div style={{ fontSize: 14, color: "#777" }}>
        Нет учеников по заданным фильтрам.
      </div>
    );
  }

  return (
    <div className="students-grid">
      {students.map((student) => {
        const avg = calcAverageGrade(grades, student.id);
        const studentDebts = debts.filter((d) => d.studentId === student.id);
        const openDebts = studentDebts.filter(
          (d) => d.status === "open" || d.status === "in_progress"
        );

        const metaParts = [];
        if (avg !== null) metaParts.push(`ср. ${avg}`);
        if (openDebts.length) metaParts.push(`долгов: ${openDebts.length}`);

        const isSelected = selectedStudentId === student.id;

        return (
          <div
            key={student.id}
            className="student-card"
            style={
              isSelected
                ? {
                    borderColor: "#3390ec",
                    boxShadow: "0 0 0 2px #3390ec33"
                  }
                : {}
            }
            onClick={() => onSelectStudent(student.id)}
          >
            <div className="student-avatar">
              {getInitials(student.fullName)}
            </div>
            <div className="student-name">{student.fullName}</div>
            <div className="student-meta">
              {metaParts.length ? metaParts.join(" • ") : "пока без данных"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StudentDetails({ student, subjects, grades, debts, notes }) {
  const [activeTab, setActiveTab] = useState("grades");

  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentDebts = debts.filter((d) => d.studentId === student.id);
  const studentNotes = notes.filter((n) => n.studentId === student.id);

  const avg = calcAverageGrade(grades, student.id);

  return (
    <div className="student-details">
      <div className="student-details-header">
        <div className="details-avatar">
          {getInitials(student.fullName)}
        </div>
        <div>
          <div className="details-name">{student.fullName}</div>
          <div style={{ fontSize: 14, color: "#666" }}>
            Класс: {student.classLabel}
            {avg !== null ? ` • средний балл: ${avg}` : ""}
          </div>
        </div>
      </div>

      {/* Табы */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton
          active={activeTab === "grades"}
          onClick={() => setActiveTab("grades")}
        >
          Оценки
        </TabButton>
        <TabButton
          active={activeTab === "debts"}
          onClick={() => setActiveTab("debts")}
        >
          Долги
        </TabButton>
        <TabButton
          active={activeTab === "notes"}
          onClick={() => setActiveTab("notes")}
        >
          Заметки
        </TabButton>
      </div>

      {activeTab === "grades" && (
        <section className="details-section">
          <h3>Оценки</h3>
          <div className="details-list">
            {studentGrades.length === 0 ? (
              <div className="details-item">Пока нет оценок.</div>
            ) : (
              studentGrades.map((g, idx) => {
                const subj = getSubjectById(subjects, g.subjectId);
                const subjName = subj ? subj.name : "Предмет";
                return (
                  <div key={idx} className="details-item">
                    {subjName}: {g.grade} ({g.date})
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === "debts" && (
        <section className="details-section">
          <h3>Долги</h3>
          <div className="details-list">
            {studentDebts.length === 0 ? (
              <div className="details-item">Долгов нет. Пока.</div>
            ) : (
              studentDebts.map((d, idx) => {
                const subj = getSubjectById(subjects, d.subjectId);
                const subjName = subj ? subj.name : "Предмет";
                const statusText =
                  d.status === "open"
                    ? "не выполнено"
                    : d.status === "in_progress"
                    ? "в процессе"
                    : "закрыто";

                return (
                  <div key={idx} className="details-item">
                    {subjName}: {d.desc} — {statusText}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === "notes" && (
        <section className="details-section">
          <h3>Заметки</h3>
          <div className="details-list">
            {studentNotes.length === 0 ? (
              <div className="details-item">Пока без заметок.</div>
            ) : (
              studentNotes.map((n, idx) => (
                <div key={idx} className="details-item">
                  [{n.type}] {n.text}
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      className="btn"
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 14,
        border: active ? "1px solid #3390ec" : "1px solid #ddd",
        background: active ? "#e7f2ff" : "#fff"
      }}
    >
      {children}
    </button>
  );
}

// Монтируем всё это безобразие
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
