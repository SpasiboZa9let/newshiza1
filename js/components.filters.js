function FiltersPanel({
  subjects,
  search,
  onSearchChange,
  onlyWithDebts,
  onToggleDebts,
  subjectFilter,
  onSubjectFilterChange
}) {
  return (
    <div className="filters-card">
      <input
        type="text"
        className="input"
        placeholder="Поиск по фамилии..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={onlyWithDebts}
          onChange={(e) => onToggleDebts(e.target.checked)}
        />
        <span>Показать только с долгами</span>
      </label>
      <select
        className="input"
        value={subjectFilter}
        onChange={(e) => onSubjectFilterChange(e.target.value)}
      >
        <option value="all">Все предметы</option>
        {subjects.map((subj) => (
          <option key={subj.id} value={subj.id}>
            {subj.name}
          </option>
        ))}
      </select>
    </div>
  );
}
