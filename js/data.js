// =============================
// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ МАКЕТА
// =============================

window.__DATA__ = {
  subjects: [
    { id: 1, name: "Математика" },
    { id: 2, name: "Русский язык" },
    { id: 3, name: "Литература" },
    { id: 4, name: "Обществознание" },
    { id: 5, name: "Английский язык" }
  ],

  students: [
    { id: 1, fullName: "Закарьяева Алина", classLabel: "8А" },
    { id: 2, fullName: "Захаров Иван", classLabel: "8А" },
    { id: 3, fullName: "Константинова Мария", classLabel: "8А" },
    { id: 4, fullName: "Кузин Даниил", classLabel: "8А" },
    { id: 5, fullName: "Подоров Семён", classLabel: "8А" },
    { id: 6, fullName: "Саламатов Артём", classLabel: "8А" },
    { id: 7, fullName: "Фомин Никита", classLabel: "8А" },
    { id: 8, fullName: "Бродецкий Артём", classLabel: "8А" },
    { id: 9, fullName: "Головко Анастасия", classLabel: "8А" },
    { id: 10, fullName: "Ласкина Екатерина", classLabel: "8А" }
  ],

  grades: [
    { studentId: 1, subjectId: 1, grade: 4, date: "2025-11-10" },
    { studentId: 1, subjectId: 3, grade: 5, date: "2025-11-11" },
    { studentId: 2, subjectId: 1, grade: 2, date: "2025-11-10" },
    { studentId: 2, subjectId: 2, grade: 2, date: "2025-11-11" },
    { studentId: 3, subjectId: 4, grade: 3, date: "2025-11-07" },
    { studentId: 7, subjectId: 1, grade: 5, date: "2025-11-10" }
  ],

  debts: [
    { studentId: 1, subjectId: 1, desc: "Домашнее задание №5", status: "open" },
    { studentId: 2, subjectId: 2, desc: "Словарный диктант", status: "open" },
    { studentId: 8, subjectId: 3, desc: "Пересказ", status: "open" },
    { studentId: 10, subjectId: 1, desc: "Параграф 7", status: "in_progress" }
  ],

  notes: [
    { studentId: 8, type: "behavior", text: "Часто отвлекается." },
    { studentId: 7, type: "academic", text: "Нужна консультация перед ОГЭ." }
  ]
};
