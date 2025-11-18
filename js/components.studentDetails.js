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

  return (
    <div className="details-content">
      <div className="details-header">
        <div className="details-avatar">
          <span>{getInitials(student.fullName)}</span>
        </div>
        <div>
          <h2>{student.fullName}</h2>
          <p className="details-meta">
            Класс: {student.classLabel || "не указан"}
          </p>
        </div>
      </div>

      <GradesBlock
        student={student}
        subjects={subjects}
        grades={grades}
        onEditGrade={onEditGrade}
      />

      <AbsencesBlock
        student={student}
        absences={absences}
        onAddAbsence={onAddAbsence}
      />

      <DebtsBlock
        student={student}
        subjects={subjects}
        debts={debts}
        onChangeStatus={onChangeDebtStatus}
      />

      <NotesBlock
        student={student}
        notes={notes}
        onAddNote={onAddNote}
      />
    </div>
  );
}
