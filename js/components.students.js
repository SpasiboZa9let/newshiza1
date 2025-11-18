function StudentsList({ students, debts, selectedStudentId, onSelect }) {
  if (!students.length) {
    return <div className="empty">Никого не найдено</div>;
  }

  return (
    <div className="students-list">
      {students.map((st) => {
        const hasDebts = debts.some((d) => d.studentId === st.id);
        const active = st.id === selectedStudentId;
        return (
          <button
            key={st.id}
            className={
              "student-card" + (active ? " student-card--active" : "")
            }
            onClick={() => onSelect(st.id)}
          >
            <div className="student-avatar">
              <span>{getInitials(st.fullName)}</span>
            </div>
            <div className="student-info">
              <div className="student-name">{st.fullName}</div>
              <div className="student-meta">
                <span>{st.classLabel || "Класс не указан"} </span>
                {hasDebts && (
                  <span className="student-badge">Есть долги</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
