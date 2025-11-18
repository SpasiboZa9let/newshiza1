const { useState, useEffect, useMemo } = React;

/**
 * Условная "таблица пользователей".
 * Здесь:
 * - один учитель (admin)
 * - несколько учеников (student), привязанных к studentId
 *
 * Логины/пароли можешь поменять как хочешь.
 */
const ACCOUNTS = [
  { login: "teacher", password: "1234", mode: "admin", studentId: null },

  { login: "zakar", password: "1111", mode: "student", studentId: 1 },
  { login: "zakhar", password: "1111", mode: "student", studentId: 2 },
  { login: "konst", password: "1111", mode: "student", studentId: 3 },
  { login: "kuzin", password: "1111", mode: "student", studentId: 4 },
  { login: "podor", password: "1111", mode: "student", studentId: 5 },
  { login: "salam", password: "1111", mode: "student", studentId: 6 },
  { login: "fomin", password: "1111", mode: "student", studentId: 7 },
  { login: "brod",  password: "1111", mode: "student", studentId: 8 },
  { login: "gol",   password: "1111", mode: "student", studentId: 9 },
  { login: "lask",  password: "1111", mode: "student", studentId: 10 }
];

/**
 * Стартовый экран логина
 */
function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(login.trim(), password.trim());
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1 className="login-title">Классный журнал</h1>
        <p className="login-subtitle">
          Вход для классного руководителя и учеников.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Войти
          </button>
        </form>

        <div className="login-footer">
          Учитель: <b>teacher / 1234</b><br />
          (логины и пароли можно поменять в <code>app.js</code>)
        </div>
      </div>
    </div>
  );
}

/**
 * Основное приложение журнала (то, что у тебя было, плюс учёт auth)
 */
function JournalApp({ state, setState, auth, onLogout }) {
  const [selectedStudentId, setSelectedStudentId] = useState(
    auth.mode === "student" ? auth.studentId : null
  );
  const [search, setSearch] = useState("");
  const [onlyWithDebts, setOnlyWithDebts] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { students, subjects, grades, debts, notes } = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  const isAdminMode = auth.mode === "admin";
  const isStudentMode = auth.mode === "student";

  const updateState = (updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
  };

  const handleEditGrade = (studentId, subjectId) => {
    if (!isAdminMode) {
      alert("Редактирование оценок доступно только учителю.");
      return;
    }

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
    if (!isAdminMode) {
      alert("Добавлять заметки может только учитель.");
      return;
    }

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
    if (!isAdminMode) {
      alert("Изменять статус долга может только учитель.");
      return;
    }

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

    // В режиме ученика он видит только себя
    if (isStudentMode && auth.studentId) {
      return list.filter((st) => st.id === auth.studentId);
    }

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
  }, [students, debts, search, onlyWithDebts, subjectFilter, auth, isStudentMode]);

  const selectedStudent = useMemo(() => {
    if (isStudentMode && auth.studentId) {
      return students.find((s) => s.id === auth.studentId) || null;
    }
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId, auth, isStudentMode]);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Классный журнал</h1>
          <p className="app-subtitle">
            {isAdminMode
              ? "Режим классного руководителя"
              : "Индивидуальный доступ ученика"}
          </p>
        </div>
        <button className="btn" onClick={onLogout}>
          Выйти
        </button>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          {isStudentMode ? (
            <div className="empty">
              Индивидуальный доступ. Список класса скрыт.
            </div>
          ) : (
            <>
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
            </>
          )}
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

/**
 * Обёртка над приложением: здесь логин / выбор режима
 */
function AppWrapper() {
  const [state, setState] = useState(loadInitialState);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleLogin = (login, password) => {
    const acc = ACCOUNTS.find(
      (a) => a.login === login && a.password === password
    );
    if (!acc) {
      alert("Неверный логин или пароль.");
      return;
    }
    setAuth(acc);
  };

  const handleLogout = () => {
    setAuth(null);
  };

  if (!auth) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <JournalApp
      state={state}
      setState={setState}
      auth={auth}
      onLogout={handleLogout}
    />
  );
}

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<AppWrapper />);
