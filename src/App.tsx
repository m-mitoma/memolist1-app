import { useState, useMemo } from 'react';
import MemoList from './components/MemoList';
import MemoFilter from './components/MemoFilter';
import { memos } from './memo_data';
import './App.css';

type SortField = 'id' | 'title' | 'date';
type SortOrder = 'asc' | 'desc';
const App = () => {
  const [filter, setFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredMemos = useMemo(() => {
    const lowerCaseFilter = (filter || '').toLowerCase();
    const filtered = memos.filter((memo) =>
      memo.title.toLowerCase().includes(lowerCaseFilter),
    );
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortField === 'date') {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'id') {
        const idA = parseInt(aValue as string, 10);
        const idB = parseInt(bValue as string, 10);
        return sortOrder === 'asc' ? idA - idB : idB - idA;
      } else {
        const compareResult = (aValue as string).localeCompare(
          bValue as string,
        );
        return sortOrder === 'asc' ? compareResult : -compareResult;
      }
    });
  }, [filter, sortField, sortOrder]);

  return (
    <div className="container">
      <h1>簡易メモリスト</h1>
      <h2>検索と並び替え</h2>
      <MemoFilter filter={filter} setFilter={setFilter} />
      <button
        onClick={() => {
          setSortField('id');
          setSortOrder('asc');
        }}
      >
        ID(昇順)
      </button>
      <button
        onClick={() => {
          setSortField('id');
          setSortOrder('desc');
        }}
      >
        ID(降順)
      </button>
      <button
        onClick={() => {
          setSortField('title');
          setSortOrder('asc');
        }}
      >
        タイトル(昇順)
      </button>
      <button
        onClick={() => {
          setSortField('title');
          setSortOrder('desc');
        }}
      >
        タイトル(降順)
      </button>
      <button
        onClick={() => {
          setSortField('date');
          setSortOrder('asc');
        }}
      >
        日付(昇順)
      </button>
      <button
        onClick={() => {
          setSortField('date');
          setSortOrder('desc');
        }}
      >
        日付(降順)
      </button>
      <MemoList memos={filteredMemos} />
    </div>
  );
};

export default App;
