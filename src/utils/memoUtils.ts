import type { Memo } from '../types';

export type SortField = 'id' | 'title' | 'date';
export type SortOrder = 'asc' | 'desc';

/**
 * 検索キーワードでタイトルを絞り込み、指定した基準・順序で並び替える。
 * Appコンポーネントから切り出した純粋関数なので、Reactに依存せずテストできる。
 */
export const filterAndSortMemos = (
  memos: Memo[],
  filter: string,
  sortField: SortField,
  sortOrder: SortOrder,
): Memo[] => {
  const lowerCaseFilter = (filter || '').toLowerCase();
  const filtered = memos.filter((memo) =>
    memo.title.toLowerCase().includes(lowerCaseFilter),
  );

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
