function GradesHistoryModal({ subject, history, onClose, onAddGrade }) {
  if (!subject) return null;

  const formatDate = (iso) => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <div className="history-modal-backdrop" onClick={onClose}>
      <div
        className="history-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="history-modal-header">
          <div>
            <h3>История оценок</h3>
            <div className="history-modal-subtitle">{subject.name}</div>
          </div>
          <button
            className="history-modal-close"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {history.length === 0 && (
          <div className="history-modal-empty">
            Пока нет оценок по этому предмету.
          </div>
        )}

        {history.length > 0 && (
          <div className="history-modal-table">
            <div className="history-modal-row history-modal-row--head">
              <div>Дата</div>
              <div>Оценка</div>
            </div>
            {history.map((g) => (
              <div
                className="history-modal-row"
                key={g.id || `${g.date}-${g.value}`}
              >
                <div className="history-modal-date">
                  {formatDate(g.date)}
                </div>
                <div className="history-modal-value">
                  {g.value}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="history-modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddGrade}
          >
            Добавить / изменить оценку
          </button>
        </div>
      </div>
    </div>
  );
}

function GradesBlock({ student, subjects, grades, onEditGrade }) {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  const performanceBySubject = React.useMemo(() => {
    if (!student) return [];
    return subjects.map((subj) => {
      const last = getLastGrade(grades, student.id, subj.id);
      return { subject: subj, lastGrade: last };
    });
  }, [subjects, grades, student]);

  const selectedSubject = React.useMemo(() => {
    if (!student || !selectedSubjectId) return null;
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, student, selectedSubjectId]);

  const history = React.useMemo(() => {
    if (!student || !selectedSubjectId) return [];
    return grades
      .filter(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === selectedSubjectId
      )
      .sort((a, b) => {
        if (a.date === b.date) return 0;
        return a.date < b.date ? -1 : 1;
      });
  }, [grades, student, selectedSubjectId]);

  if (!student) return null;

  const openHistory = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setIsHistoryOpen(true);
  };

  const handleAddGrade = () => {
    if (!student || !selectedSubjectId) return;
    onEditGrade(student.id, selectedSubjectId);
  };

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Успеваемость по предметам</h3>
        <p className="details-section-subtitle">
          Клик по строке предмета — открыть историю оценок.
        </p>
      </div>
      <div className="grades-grid">
        <div className="grades-grid-header">Предмет</div>
        <div className="grades-grid-header">Последняя оценка</div>
        {performanceBySubject.map(({ subject, lastGrade }) => (
          <React.Fragment key={subject.id}>
            <button
              className="grades-grid-cell grades-grid-subject grades-grid-subject-btn"
              onClick={() => openHistory(subject.id)}
            >
              {subject.name}
            </button>
            <button
              className={
                "grades-grid-cell grades-grid-grade" +
                (lastGrade ? "" : " grades-grid-grade--empty")
              }
              onClick={() => openHistory(subject.id)}
            >
              {lastGrade ? lastGrade.value : "—"}
            </button>
          </React.Fragment>
        ))}
      </div>

      {isHistoryOpen && selectedSubject && (
        <GradesHistoryModal
          subject={selectedSubject}
          history={history}
          onClose={() => setIsHistoryOpen(false)}
          onAddGrade={handleAddGrade}
        />
      )}
    </section>
  );
}
