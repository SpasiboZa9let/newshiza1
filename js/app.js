
const data = window.__DATA__;
const students = data.students;
const subjects = data.subjects;
const grades = data.grades;
const debts = data.debts;
const notes = data.notes;

// ЭЛЕМЕНТЫ
const studentsListEl = document.getElementById("students-list");
const studentDetailsEl = document.getElementById("student-details");
const searchInputEl = document.getElementById("search-input");
const filterDebtsEl = document.getElementById("filter-debts");
const subjectFilterEl = document.getElementById("subject-filter");
const commonChatBtn = document.getElementById("open-common-chat");

// ТЕКУЩЕЕ СОСТОЯНИЕ
let selectedStudentId = null;

// =============================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================

function getInitials(fullName) {
  const parts = fullName.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getStudentGrades(studentId) {
  return grades.filter((g) => g.studentId === studentId);
}

function getStudentDebts(studentId) {
  return debts.filter((d) => d.studentId === studentId);
}

function getStudentNotes(studentId) {
  return notes.filter((n) => n.studentId === studentId);
}

function getSubjectById(id) {
  return subjects.find((s) => s.id === id);
}

function calcAverageGrade(studentId) {
  const g = getStudentGrades(studentId);
  if (!g.length) return null;
  const sum = g.reduce((acc, item) => acc + item.grade, 0);
  return (sum / g.length).toFixed(1);
}

// =============================
// РЕНДЕР ФИЛЬТРОВ
// =============================

function renderSubjectFilterOptions() {
  subjects.forEach((subj) => {
    const opt = document.createElement("option");
    opt.value = String(subj.id);
    opt.textContent = subj.name;
    subjectFilterEl.appendChild(opt);
  });
}

// =============================
// РЕНДЕР СПИСКА УЧЕНИКОВ
// =============================

function applyFilters() {
  const query = (searchInputEl.value || "").trim().toLowerCase();
  const onlyWithDebts = filterDebtsEl.checked;
  const subjectFilter = subjectFilterEl.value ? Number(subjectFilterEl.value) : null;

  let list = [...students];

  if (query) {
    list = list.filter((s) => s.fullName.toLowerCase().includes(query));
  }

  if (onlyWithDebts) {
    list = list.filter((s) => {
      const studentDebts = getStudentDebts(s.id);
      return studentDebts.some((d) => d.status === "open" || d.status === "in_progress");
    });
  }

  if (subjectFilter) {
    list = list.filter((s) => {
      const studentDebts = getStudentDebts(s.id);
      return studentDebts.some((d) => d.subjectId === subjectFilter);
    });
  }

  return list;
}

function renderStudentsList() {
  const list = applyFilters();
  studentsListEl.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.textContent = "Нет учеников по заданным фильтрам.";
    empty.style.fontSize = "14px";
    empty.style.color = "#777";
    studentsListEl.appendChild(empty);
    return;
  }

  list.forEach((student) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.dataset.id = String(student.id);

    const avatar = document.createElement("div");
    avatar.className = "student-avatar";
    avatar.textContent = getInitials(student.fullName);

    const nameEl = document.createElement("div");
    nameEl.className = "student-name";
    nameEl.textContent = student.fullName;

    const metaEl = document.createElement("div");
    metaEl.className = "student-meta";

    const avg = calcAverageGrade(student.id);
    const studentDebts = getStudentDebts(student.id);
    const openDebts = studentDebts.filter(
      (d) => d.status === "open" || d.status === "in_progress"
    );

    const parts = [];
    if (avg !== null) parts.push(`ср. ${avg}`);
    if (openDebts.length) parts.push(`долгов: ${openDebts.length}`);

    metaEl.textContent = parts.length ? parts.join(" • ") : "пока без данных";

    card.appendChild(avatar);
    card.appendChild(nameEl);
    card.appendChild(metaEl);

    card.addEventListener("click", () => {
      selectedStudentId = student.id;
      renderStudentDetails(student.id);
    });

    studentsListEl.appendChild(card);
  });
}

// =============================
// РЕНДЕР ПРАВОЙ ПАНЕЛИ
// =============================

function renderStudentDetails(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  const studentGrades = getStudentGrades(studentId);
  const studentDebts = getStudentDebts(studentId);
  const studentNotes = getStudentNotes(studentId);
  const avg = calcAverageGrade(studentId);

  studentDetailsEl.innerHTML = "";

  const container = document.createElement("div");
  container.className = "student-details";

  // Шапка
  const header = document.createElement("div");
  header.className = "student-details-header";

  const avatar = document.createElement("div");
  avatar.className = "details-avatar";
  avatar.textContent = getInitials(student.fullName);

  const info = document.createElement("div");

  const nameEl = document.createElement("div");
  nameEl.className = "details-name";
  nameEl.textContent = student.fullName;

  const metaEl = document.createElement("div");
  metaEl.style.fontSize = "14px";
  metaEl.style.color = "#666";

  const metaParts = [`Класс: ${student.classLabel}`];
  if (avg !== null) metaParts.push(`средний балл: ${avg}`);
  metaEl.textContent = metaParts.join(" • ");

  info.appendChild(nameEl);
  info.appendChild(metaEl);

  header.appendChild(avatar);
  header.appendChild(info);

  container.appendChild(header);

  // Блок "Оценки"
  const gradesSection = document.createElement("section");
  gradesSection.className = "details-section";
  const gradesTitle = document.createElement("h3");
  gradesTitle.textContent = "Оценки";
  gradesSection.appendChild(gradesTitle);

  const gradesList = document.createElement("div");
  gradesList.className = "details-list";

  if (!studentGrades.length) {
    const empty = document.createElement("div");
    empty.className = "details-item";
    empty.textContent = "Пока нет оценок.";
    gradesList.appendChild(empty);
  } else {
    studentGrades.forEach((g) => {
      const item = document.createElement("div");
      item.className = "details-item";

      const subj = getSubjectById(g.subjectId);
      const subjName = subj ? subj.name : "Предмет";

      item.textContent = `${subjName}: ${g.grade} (${g.date})`;
      gradesList.appendChild(item);
    });
  }

  gradesSection.appendChild(gradesList);
  container.appendChild(gradesSection);

  // Блок "Долги"
  const debtsSection = document.createElement("section");
  debtsSection.className = "details-section";
  const debtsTitle = document.createElement("h3");
  debtsTitle.textContent = "Долги";
  debtsSection.appendChild(debtsTitle);

  const debtsList = document.createElement("div");
  debtsList.className = "details-list";

  if (!studentDebts.length) {
    const empty = document.createElement("div");
    empty.className = "details-item";
    empty.textContent = "Долгов нет. Пока.";
    debtsList.appendChild(empty);
  } else {
    studentDebts.forEach((d) => {
      const item = document.createElement("div");
      item.className = "details-item";

      const subj = getSubjectById(d.subjectId);
      const subjName = subj ? subj.name : "Предмет";

      const statusText =
        d.status === "open"
          ? "не выполнено"
          : d.status === "in_progress"
          ? "в процессе"
          : "закрыто";

      item.textContent = `${subjName}: ${d.desc} — ${statusText}`;
      debtsList.appendChild(item);
    });
  }

  debtsSection.appendChild(debtsList);
  container.appendChild(debtsSection);

  // Блок "Заметки"
  const notesSection = document.createElement("section");
  notesSection.className = "details-section";
  const notesTitle = document.createElement("h3");
  notesTitle.textContent = "Заметки";
  notesSection.appendChild(notesTitle);

  const notesList = document.createElement("div");
  notesList.className = "details-list";

  if (!studentNotes.length) {
    const empty = document.createElement("div");
    empty.className = "details-item";
    empty.textContent = "Пока без заметок.";
    notesList.appendChild(empty);
  } else {
    studentNotes.forEach((n) => {
      const item = document.createElement("div");
      item.className = "details-item";
      item.textContent = `[${n.type}] ${n.text}`;
      notesList.appendChild(item);
    });
  }

  notesSection.appendChild(notesList);
  container.appendChild(notesSection);

  studentDetailsEl.appendChild(container);
}

// =============================
// ОБЩИЙ ЧАТ (ПОКА ЗАГЛУШКА)
// =============================

if (commonChatBtn) {
  commonChatBtn.addEventListener("click", () => {
    alert(
      "Здесь позже будет экран 'Общий чат' с темами: Домашка, ОГЭ, Объявления и т.д.\nСейчас это только макет."
    );
  });
}

// =============================
// ИНИЦИАЛИЗАЦИЯ
// =============================

function init() {
  renderSubjectFilterOptions();
  renderStudentsList();

  // События фильтров
  searchInputEl.addEventListener("input", () => {
    renderStudentsList();
    // при смене фильтра не сбрасываем выбранного, просто обновляем список
  });

  filterDebtsEl.addEventListener("change", () => {
    renderStudentsList();
  });

  subjectFilterEl.addEventListener("change", () => {
    renderStudentsList();
  });
}

document.addEventListener("DOMContentLoaded", init);
