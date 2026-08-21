import type { MonthlyArchiveEntry } from '../utils/memoUtils';

type MonthlyArchiveProps = {
  entries: MonthlyArchiveEntry[];
  selectedMonth: string | null;
  onSelectMonth: (month: string | null) => void;
};

// 月ごとの件数一覧を表示し、クリックでその月だけに絞り込めるようにする
const MonthlyArchive = ({
  entries,
  selectedMonth,
  onSelectMonth,
}: MonthlyArchiveProps) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <nav className="monthly-archive" aria-label="月別アーカイブ">
      <button
        type="button"
        onClick={() => onSelectMonth(null)}
        className={selectedMonth === null ? 'active-month' : ''}
      >
        すべて表示
      </button>
      {entries.map((entry) => (
        <button
          key={entry.key}
          type="button"
          onClick={() => onSelectMonth(entry.key)}
          className={selectedMonth === entry.key ? 'active-month' : ''}
        >
          {entry.label} ({entry.count})
        </button>
      ))}
    </nav>
  );
};

export default MonthlyArchive;
