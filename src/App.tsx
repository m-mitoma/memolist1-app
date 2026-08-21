import { useEffect, useMemo, useState } from 'react';
import MemoList from './components/MemoList';
import MemoFilter from './components/MemoFilter';
import MemoForm from './components/MemoForm';
import type { MemoFormValues } from './components/MemoForm';
import { defaultMemos } from './memo_data';
import type { Memo } from './types';
import {
  filterAndSortMemos,
  generateNextId,
  type SortField,
  type SortOrder,
} from './utils/memoUtils';
import './App.css';

const STORAGE_KEY = 'memolist1_memos';

// localStorageに保存済みのメモがあればそれを、無ければ初期データを使う
const loadInitialMemos = (): Memo[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as Memo[];
    }
  } catch (error) {
    console.error('メモの読み込みに失敗しました', error);
  }
  return defaultMemos;
};

const App = () => {
  const [memos, setMemos] = useState<Memo[]>(loadInitialMemos);
  const [filter, setFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  // 今どのメモが編集中か（IDのみ保持。フォームの初期値は各カード側で持つ）
  const [editingId, setEditingId] = useState<string | null>(null);

  // memosが変わるたびにlocalStorageへ保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  const handleAdd = (values: MemoFormValues) => {
    const newMemo: Memo = {
      id: generateNextId(memos),
      title: values.title,
      content: values.content,
      date: new Date().toISOString().slice(0, 10),
    };
    setMemos((prev) => [...prev, newMemo]);
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = (id: string, values: MemoFormValues) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id
          ? { ...memo, title: values.title, content: values.content }
          : memo,
      ),
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('このメモを削除してもよろしいですか？')) {
      return;
    }
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
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
      <MemoForm onAdd={handleAdd} />
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
