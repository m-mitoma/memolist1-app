import { useEffect, useMemo, useState } from 'react';
import MemoList from './components/MemoList';
import MemoFilter from './components/MemoFilter';
import MemoForm from './components/MemoForm';
import type { MemoFormValues } from './components/MemoForm';
import { defaultMemos } from './memo_data';
import type { Memo } from './types';
import './App.css';

type SortField = 'id' | 'title' | 'date';
type SortOrder = 'asc' | 'desc';

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
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);

  // memosが変わるたびにlocalStorageへ保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  const addMemo = (values: MemoFormValues) => {
    const nextId =
      memos.length > 0
        ? (
            Math.max(...memos.map((memo) => parseInt(memo.id, 10) || 0)) + 1
          ).toString()
        : '1';
    const newMemo: Memo = {
      id: nextId,
      title: values.title,
      content: values.content,
      date: new Date().toISOString().slice(0, 10),
    };
    setMemos((prev) => [...prev, newMemo]);
  };

  const updateMemo = (id: string, values: MemoFormValues) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id
          ? { ...memo, title: values.title, content: values.content }
          : memo,
      ),
    );
  };

  const handleFormSubmit = (values: MemoFormValues) => {
    if (editingMemo) {
      updateMemo(editingMemo.id, values);
      setEditingMemo(null);
    } else {
      addMemo(values);
    }
  };

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo);
  };

  const handleCancelEdit = () => {
    setEditingMemo(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('このメモを削除してもよろしいですか？')) {
      return;
    }
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
    setEditingMemo((current) => (current?.id === id ? null : current));
  };

  const filteredMemos = useMemo(() => {
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
  }, [filter, sortField, sortOrder, memos]);

  return (
    <div className="container">
      <h1>簡易メモリスト</h1>
      <h2>検索・並び替え・編集</h2>
      <MemoForm
        onSubmit={handleFormSubmit}
        editingMemo={editingMemo}
        onCancelEdit={handleCancelEdit}
      />
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingId={editingMemo ? editingMemo.id : null}
      />
    </div>
  );
};

export default App;
