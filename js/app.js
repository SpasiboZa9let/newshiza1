const { useState, useEffect, useMemo } = React;

function App() {
  const [state, setState] = useState(loadInitialState);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [search, setSearch] = useState("");
  const [onlyWithDebts, setOnlyWithDebts] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { students, subjects, grades, debts, notes } = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = (updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
  };

  const handleEditGrade = (studentId, subjectId) => {
    const current = getLastGrade(grades, studentId, subjectId);
    const defaultValue = current ? String(current.value) : "";
    const input = window.prompt("Новая оценка (2–5):", defaultValue);
    if (input === null) return;

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
        { id: Date.now(), studentId, subjectId, value: num, date: today }
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
        { id: Date.now(), studentId, type: "note", text: text.trim() }
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

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Классный журнал</h1>
          <p className="app-subtitle">Мини-панель для классного руководителя</p>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <FiltersPanel
            subjects={subjects}
            search={search}
            onSearchChange={setSearch}
            onlyWithDebts={onlyWithDebts}
            onToggleDebts={setOnlyWithDebts}
            subjectFilter={subjectFilter}
            onSubjectFilterChange={setSubjectFilter}
          />
          <StudentsList
            students={filteredStudents}
            debts={debts}
            selectedStudentId={selectedStudentId}
            onSelect={setSelectedStudentId}
          />
        </aside>

        <main className="details">
          <StudentDetails
            student={selectedStudent}
            subjects={subjects}
            grades={grades}
            debts={debts}
            notes={notes}
            onEditGrade={handleEditGrade}
            onChangeDebtStatus={handleChangeDebtStatus}
            onAddNote={handleAddNote}
          />
        </main>
      </div>
    </div>
  );
}

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
