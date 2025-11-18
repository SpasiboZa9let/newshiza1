function AbsencesBlock({ student, absences, onAddAbsence }) {
  if (!student) return null;

  const studentAbsences = absences
    .filter((a) => a.studentId === student.id)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const formatDate = (iso) => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const typeLabel = (t) => {
    if (t === "late") return "Опоздание";
    if (t === "absence") return "Пропуск";
    return t || "";
  };

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Пропуски и опоздания</h3>
        <button
          className="btn"
          type="button"
          onClick={() => onAddAbsence(student.id)}
        >
          + Добавить запись
        </button>
      </div>

      {studentAbsences.length === 0 && (
        <div className="empty">Пока нет данных о пропусках и опозданиях.</div>
      )}

      {studentAbsences.length > 0 && (
        <div className="absences-list">
          {studentAbsences.map((a) => (
            <div className="absence-item" key={a.id}>
              <span className="absence-date">{formatDate(a.date)}</span>
              <span className={"absence-type absence-type--" + a.type}>
                {typeLabel(a.type)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
