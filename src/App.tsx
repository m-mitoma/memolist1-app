import { useMemo, useState } from 'react';
import MemoList from './components/MemoList';
import MemoFilter from './components/MemoFilter';
import MemoForm from './components/MemoForm';
import type { MemoFormValues } from './components/MemoForm';
import { useMemos } from './hooks/useMemos';
import {
  filterAndSortMemos,
  type SortField,
  type SortOrder,
} from './utils/memoUtils';
import './App.css';

const App = () => {
  // メモの状態管理・localStorageへの保存は useMemos に任せる。
  // Appは「画面をどう組み立てるか」だけに専念する。
  const { memos, addMemo, updateMemo, deleteMemo } = useMemos();
  const [filter, setFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  // 今どのメモが編集中か（IDのみ保持。フォームの初期値は各カード側で持つ）
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleStartEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = (id: string, values: MemoFormValues) => {
    updateMemo(id, values);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('このメモを削除してもよろしいですか？')) {
      return;
    }
    deleteMemo(id);
    setEditingId((current) => (current === id ? null : current));
  };

  const filteredMemos = useMemo(
    () => filterAndSortMemos(memos, filter, sortField, sortOrder),
    [memos, filter, sortField, sortOrder],
  );

  return (
    <div className="container">
      <h1>簡易メモリスト</h1>
      <h2>検索・並び替え・編集</h2>
      <MemoForm onAdd={addMemo} />
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
      <MemoList
        memos={filteredMemos}
        editingId={editingId}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
