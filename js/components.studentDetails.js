const { useState, useMemo } = React;

function StudentDetails({
  student,
  subjects,
  grades,
  debts,
  notes,
  absences,
  onEditGrade,
  onChangeDebtStatus,
  onAddNote,
  onAddAbsence
}) {
  if (!student) {
    return (
      <div className="placeholder">
        Выбери ученика слева, чтобы посмотреть оценки, пропуски и долги.
      </div>
    );
  }

  const allGrades = Array.isArray(grades)
    ? grades.filter((g) => g.studentId === student.id)
    : [];

  const studentAbsences = Array.isArray(absences)
    ? absences.filter((a) => a.studentId === student.id)
    : [];

  const studentDebts = Array.isArray(debts)
    ? debts.filter((d) => d.studentId === student.id)
    : [];

  const studentNotes = Array.isArray(notes)
    ? notes.filter((n) => n.studentId === student.id)
    : [];

  const averageGrade = useMemo(() => {
    if (!allGrades.length) return null;
    const sum = allGrades.reduce((acc, g) => acc + Number(g.value || 0), 0);
    return sum / allGrades.length;
  }, [allGrades]);

  const openDebtsCount = useMemo(
    () =>
      studentDebts.filter(
        (d) => !d.status || d.status === "open" || d.status === "in_progress"
      ).length,
    [studentDebts]
  );

  const [activeTab, setActiveTab] = useState("grades");

  const formatAverage = (avg) => {
    if (avg == null) return "—";
    return avg.toFixed(1).replace(".", ",");
  };

  const initials =
    typeof getInitials === "function"
      ? getInitials(student.fullName || "")
      : "?";

  const hasAnyData =
    allGrades.length || studentAbsences.length || studentDebts.length || studentNotes.length;

  return (
    <div className="details-content">
      {/* Хедер ученика */}
      <div className="details-header">
        <div className="details-avatar">
          <span>{initials}</span>
        </div>

        <div className="details-header-main">
          <div className="details-name">{student.fullName}</div>
          <div className="details-meta-row">
            <span className="details-class">
              {student.classLabel || "Класс не указан"}
            </span>
            {hasAnyData ? (
              <span className="details-tag-muted">
                Данные по ученику загружены
              </span>
            ) : (
              <span className="details-tag-muted">
                Пока нет данных об успеваемости
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Сводка по ученику */}
      <div className="details-summary">
        <div className="details-summary-item">
          <div className="details-summary-label">Средний балл</div>
          <div className="details-summary-value">
            {formatAverage(averageGrade)}
          </div>
        </div>

        <div className="details-summary-item">
          <div className="details-summary-label">Пропуски / опоздания</div>
          <div className="details-summary-value">
            {studentAbsences.length || "—"}
          </div>
        </div>

        <div className="details-summary-item">
          <div className="details-summary-label">Долги</div>
          <div className="details-summary-value">
            {studentDebts.length
              ? `${openDebtsCount} / ${studentDebts.length}`
              : "—"}
          </div>
        </div>

        <div className="details-summary-item">
          <div className="details-summary-label">Заметки</div>
          <div className="details-summary-value">
            {studentNotes.length || "—"}
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="details-tabs">
        <button
          type="button"
          className={
            "details-tab" +
            (activeTab === "grades" ? " details-tab--active" : "")
          }
          onClick={() => setActiveTab("grades")}
        >
          Оценки
        </button>

        <button
          type="button"
          className={
            "details-tab" +
            (activeTab === "absences" ? " details-tab--active" : "")
          }
          onClick={() => setActiveTab("absences")}
        >
          Пропуски
        </button>

        <button
          type="button"
          className={
            "details-tab" +
            (activeTab === "debts" ? " details-tab--active" : "")
          }
          onClick={() => setActiveTab("debts")}
        >
          Долги
        </button>

        <button
          type="button"
          className={
            "details-tab" +
            (activeTab === "notes" ? " details-tab--active" : "")
          }
          onClick={() => setActiveTab("notes")}
        >
          Заметки
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="details-tab-content">
        {activeTab === "grades" && (
          <GradesBlock
            student={student}
            subjects={subjects}
            grades={grades}
            onEditGrade={onEditGrade}
          />
        )}

        {activeTab === "absences" && (
          <AbsencesBlock
            student={student}
            absences={absences}
            onAddAbsence={onAddAbsence}
          />
        )}

        {activeTab === "debts" && (
          <DebtsBlock
            student={student}
            subjects={subjects}
            debts={debts}
            onChangeStatus={onChangeDebtStatus}
          />
        )}

        {activeTab === "notes" && (
          <NotesBlock
            student={student}
            notes={notes}
            onAddNote={onAddNote}
          />
        )}
      </div>
    </div>
  );
}
