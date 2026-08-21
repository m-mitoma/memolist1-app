import type { Memo } from '../types';

export type SortField = 'id' | 'title' | 'date';
export type SortOrder = 'asc' | 'desc';

/**
 * 検索キーワードでタイトルを絞り込み、必要なら月（selectedMonth）でも絞り込んだ上で、
 * 指定した基準・順序で並び替える。
 * Appコンポーネントから切り出した純粋関数なので、Reactに依存せずテストできる。
 */
export const filterAndSortMemos = (
  memos: Memo[],
  filter: string,
  sortField: SortField,
  sortOrder: SortOrder,
  selectedMonth: string | null = null,
): Memo[] => {
  const lowerCaseFilter = (filter || '').toLowerCase();
  const filtered = memos.filter((memo) => {
    const matchesFilter = memo.title.toLowerCase().includes(lowerCaseFilter);
    const matchesMonth =
      !selectedMonth || getMonthKey(memo.date) === selectedMonth;
    return matchesFilter && matchesMonth;
  });

  return [...filtered].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === 'date') {
      const dateA = new Date(aValue).getTime();
      const dateB = new Date(bValue).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'id') {
      const idA = parseInt(aValue, 10);
      const idB = parseInt(bValue, 10);
      return sortOrder === 'asc' ? idA - idB : idB - idA;
    } else {
      const compareResult = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    }
  });
};

/**
 * 新規メモに割り振るIDを決める（既存メモの最大ID + 1）。
 */
export const generateNextId = (memos: Memo[]): string => {
  const nextId =
    memos.length > 0
      ? Math.max(...memos.map((memo) => parseInt(memo.id, 10) || 0)) + 1
      : 1;
  return nextId.toString();
};

/**
 * "2025-01-05" のような date 文字列から "2025-01" の部分だけを取り出す。
 * dateは常に "YYYY-MM-DD" 形式で保存されているので、Dateオブジェクトに変換せず
 * 文字列のまま扱うことでタイムゾーンによるズレを避けている。
 */
export const getMonthKey = (dateString: string): string => dateString.slice(0, 7);

const formatMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  return `${year}年${parseInt(month, 10)}月`;
};

export type MonthlyArchiveEntry = {
  key: string; // 例: "2025-01"
  label: string; // 例: "2025年1月"
  count: number;
};

/**
 * メモを年月ごとにグループ化して、月別アーカイブ表示用のデータを作る。
 * 新しい月が先頭に来るように並べる。
 */
export const groupMemosByMonth = (memos: Memo[]): MonthlyArchiveEntry[] => {
  const counts = new Map<string, number>();
  for (const memo of memos) {
    const key = getMonthKey(memo.date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, label: formatMonthLabel(key), count }))
    .sort((a, b) => b.key.localeCompare(a.key));
};
