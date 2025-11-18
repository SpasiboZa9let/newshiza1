// =============================
// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ МАКЕТА
// =============================

// Предметы
const subjects = [
  { id: 1, name: "Математика" },
  { id: 2, name: "Русский язык" },
  { id: 3, name: "Литература" },
  { id: 4, name: "Обществознание" },
  { id: 5, name: "Английский язык" }
];

// Ученики
const students = [
  { id: 1, fullName: "Закарьяева Эсмира", classLabel: "8А" },
  { id: 2, fullName: "Захаров Михаил", classLabel: "8А" },
  { id: 3, fullName: "Константинова Кристина", classLabel: "8А" },
  { id: 4, fullName: "Кузин Максим", classLabel: "8А" },
  { id: 5, fullName: "Подоров Никита", classLabel: "8А" },
  { id: 6, fullName: "Саламатов Артём", classLabel: "8А" },
  { id: 7, fullName: "Фомин Даниил", classLabel: "8А" },
  { id: 8, fullName: "Бродецкий Виктор", classLabel: "8А" },
  { id: 9, fullName: "Головко Полина", classLabel: "8А" },
  { id: 10, fullName: "Ласкина Алина", classLabel: "8А" }
];

// Оценки
const grades = [
  { studentId: 1, subjectId: 1, grade: 4, date: "2025-11-10" },
  { studentId: 1, subjectId: 3, grade: 5, date: "2025-11-11" },
  { studentId: 2, subjectId: 1, grade: 2, date: "2025-11-10" },
  { studentId: 2, subjectId: 2, grade: 2, date: "2025-11-11" },
  { studentId: 3, subjectId: 4, grade: 3, date: "2025-11-07" },
  { studentId: 7, subjectId: 1, grade: 5, date: "2025-11-10" }
];

// Долги
const debts = [
  { studentId: 1, subjectId: 1, desc: "Домашнее задание №5", status: "open" },
  { studentId: 2, subjectId: 2, desc: "Словарный диктант", status: "open" },
  { studentId: 8, subjectId: 3, desc: "Пересказ", status: "open" },
  { studentId: 10, subjectId: 1, desc: "Параграф 7", status: "in_progress" }
];

// Заметки
const notes = [
  { studentId: 8, type: "behavior", text: "Часто отвлекается." },
  { studentId: 7, type: "academic", text: "Нужна консультация перед ОГЭ." }
];

// Пользуемся как глобальными
window.__DATA__ = {
  subjects,
  students,
  grades,
  debts,
  notes
};
