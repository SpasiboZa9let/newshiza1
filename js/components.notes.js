function NotesBlock({ student, notes, onAddNote }) {
  if (!student) return null;

  const studentNotes = notes.filter((n) => n.studentId === student.id);

  return (
    <section className="details-section">
      <div className="details-section-header">
        <h3>Заметки</h3>
        <button className="btn" onClick={() => onAddNote(student.id)}>
          + Добавить заметку
        </button>
      </div>

      {studentNotes.length === 0 && (
        <div className="empty">Пока нет заметок по этому ученику.</div>
      )}

      {studentNotes.length > 0 && (
        <div className="notes-list">
          {studentNotes.map((n) => (
            <div className="note-item" key={n.id}>
              <div className="note-type">
                {n.type === "behavior"
                  ? "Поведение"
                  : n.type === "academic"
                  ? "Учёба"
                  : "Заметка"}
              </div>
              <div className="note-text">{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

