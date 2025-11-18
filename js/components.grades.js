function GradesBlock({ student, subjects, grades, onEditGrade }) {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState(null);

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

  const handleRowClick = (subjectId) => {
    setSelectedSubjectId((prev) => (prev === subjectId ? null : subjectId));
  };

  const handleAddGrade = () => {
    if (!student || !selectedSubjectId) return;
    onEditGrade(student.id, selectedSubjectId);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Успеваемость по предметам</h3>
        <p className="details-section-subtitle">
          Клик по строке предмета — посмотреть все оценки.
        </p>
      </div>
      <div className="grades-grid">
        <div className="grades-grid-header">Предмет</div>
        <div className="grades-grid-header">Последняя оценка</div>
        {performanceBySubject.map(({ subject, lastGrade }) => (
          <React.Fragment key={subject.id}>
            <button
              className="grades-grid-cell grades-grid-subject grades-grid-subject-btn"
              onClick={() => handleRowClick(subject.id)}
            >
              {subject.name}
            </button>
            <button
              className={
                "grades-grid-cell grades-grid-grade" +
                (lastGrade ? "" : " grades-grid-grade--empty")
              }
              onClick={() => handleRowClick(subject.id)}
            >
              {lastGrade ? lastGrade.value : "—"}
            </button>
          </React.Fragment>
        ))}
      </div>

      {selectedSubject && (
        <div className="grades-history">
          <div className="grades-history-title">
            История оценок: {selectedSubject.name}
          </div>

          {history.length === 0 && (
            <div className="grades-history-empty">
              Пока нет оценок по этому предмету.
            </div>
          )}

          {history.length > 0 && (
            <div className="grades-history-list">
              {history.map((g) => (
                <div
                  className="grades-history-row"
                  key={g.id || `${g.date}-${g.value}`}
                >
                  <span className="grades-history-date">
                    {formatDate(g.date)}
                  </span>
                  <span className="grades-history-value">
                    {g.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grades-history-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddGrade}
            >
              Добавить / изменить оценку
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
