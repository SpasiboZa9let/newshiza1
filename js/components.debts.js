function DebtsBlock({ student, subjects, debts, onChangeStatus }) {
  if (!student) return null;

  const studentDebts = debts.filter((d) => d.studentId === student.id);

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Долги</h3>
        <p className="details-section-subtitle">
          Клик по статусу — переключить (открыт → в работе → закрыт).
        </p>
      </div>

      {studentDebts.length === 0 && (
        <div className="empty">У ученика нет задолженностей.</div>
      )}

      {studentDebts.length > 0 && (
        <div className="debts-list">
          {studentDebts.map((d) => {
            const subj = subjects.find((s) => s.id === d.subjectId);
            return (
              <div className="debts-item" key={d.id}>
                <div className="debts-main">
                  <div className="debts-subject">
                    {subj ? subj.name : "Предмет"}
                  </div>
                  <div className="debts-desc">{d.desc}</div>
                </div>
                <button
                  className={
                    "debts-status debts-status--" + (d.status || "open")
                  }
                  onClick={() => onChangeStatus(d.id)}
                >
                  {statusLabel(d.status || "open")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
