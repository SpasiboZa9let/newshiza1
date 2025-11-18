const STORAGE_KEY = "class_journal_state_v1";

const SUBJECTS = window.__SUBJECTS__ || [];

const BASE_DATA = window.__DATA__ || {
  students: [],
  grades: [],
  debts: [],
  notes: [],
  absences: []
};

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return BASE_DATA;
    const parsed = JSON.parse(raw);
    return {
      students: parsed.students || BASE_DATA.students,
      grades: parsed.grades || BASE_DATA.grades,
      debts: parsed.debts || BASE_DATA.debts,
      notes: parsed.notes || BASE_DATA.notes,
      absences: parsed.absences || BASE_DATA.absences
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
