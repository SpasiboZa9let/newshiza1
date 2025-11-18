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
  ],

  // ВАЖНО: используем value, а не grade + добавляем id
  grades: [
    { id: 1, studentId: 1, subjectId: 1, value: 4, date: "2025-11-10" },
    { id: 2, studentId: 1, subjectId: 3, value: 5, date: "2025-11-11" },

    { id: 3, studentId: 2, subjectId: 1, value: 2, date: "2025-11-10" },
    { id: 4, studentId: 2, subjectId: 2, value: 2, date: "2025-11-11" },

    { id: 5, studentId: 3, subjectId: 4, value: 3, date: "2025-11-07" },

    { id: 6, studentId: 7, subjectId: 1, value: 5, date: "2025-11-10" }
  ],

  // Долги: добавлены id, чтобы статус можно было переключать
  debts: [
    {
      id: 1,
      studentId: 1,
      subjectId: 1,
      desc: "Домашнее задание №5",
      status: "open"
    },
    {
      id: 2,
      studentId: 2,
      subjectId: 2,
      desc: "Словарный диктант",
      status: "open"
    },
    {
      id: 3,
      studentId: 8,
      subjectId: 3,
      desc: "Пересказ",
      status: "open"
    },
    {
      id: 4,
      studentId: 10,
      subjectId: 1,
      desc: "Параграф 7",
      status: "in_progress"
    }
  ],

  // Заметки: тоже с id
  notes: [
    {
      id: 1,
      studentId: 8,
      type: "behavior",
      text: "Часто отвлекается."
    },
    {
      id: 2,
      studentId: 7,
      type: "academic",
      text: "Нужна консультация перед ОГЭ."
    }
  ]
};
