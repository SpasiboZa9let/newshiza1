// Данные журнала для 9Б

window.__DATA__ = {
  students: [
    { id: 1,  fullName: "Бродецкий Виктор",             classLabel: "9Б" },
    { id: 2,  fullName: "Головко Полина",               classLabel: "9Б" },
    { id: 3,  fullName: "Ефремова Елизавета",           classLabel: "9Б" },
    { id: 4,  fullName: "Закарьяева Эсмира",            classLabel: "9Б" },
    { id: 5,  fullName: "Захаров Михаил",               classLabel: "9Б" },
    { id: 6,  fullName: "Золотарева Снежана",           classLabel: "9Б" },
    { id: 7,  fullName: "Константинова Кристина А.",    classLabel: "9Б" },
    { id: 8,  fullName: "Костырченко Денис А.",         classLabel: "9Б" },
    { id: 9,  fullName: "Кузин Максим",                 classLabel: "9Б" },
    { id: 10, fullName: "Кузнецова Эвелина",            classLabel: "9Б" },
    { id: 11, fullName: "Ласкина Алина",                classLabel: "9Б" },
    { id: 12, fullName: "Мисев Глеб",                   classLabel: "9Б" },
    { id: 13, fullName: "Овчинников Максим Д.",         classLabel: "9Б" },
    { id: 14, fullName: "Орифжанов Алексей",            classLabel: "9Б" },
    { id: 15, fullName: "Подоров Никита",               classLabel: "9Б" },
    { id: 16, fullName: "Разинькова Арина",             classLabel: "9Б" },
    { id: 17, fullName: "Саламатов Артём",              classLabel: "9Б" },
    { id: 18, fullName: "Синицына Ирина",               classLabel: "9Б" },
    { id: 19, fullName: "Тымарская Виктория",           classLabel: "9Б" },
    { id: 20, fullName: "Фомин Даниил",                 classLabel: "9Б" }
  ],

  // История оценок: будем забивать сюда по мере переноса из журнала
  grades: [
    // { id, studentId, subjectId, value, date: "2025-09-01" }
  ],

  // Пропуски / опоздания добавим позже
  absences: [
    // { id, studentId, date: "2025-09-01", type: "absence" | "late" }
  ],

  // Долги (если захочешь фиксировать)
  debts: [
    // { id, studentId, subjectId, desc, status: "open" | "in_progress" | "closed" }
  ],

  // Заметки для себя
  notes: [
    // { id, studentId, type: "note" | "academic", text }
  ]
};
