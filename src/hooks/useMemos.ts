import { useEffect, useState } from 'react';
import { defaultMemos } from '../memo_data';
import type { Memo } from '../types';
import type { MemoFormValues } from '../components/MemoForm';
import { generateNextId } from '../utils/memoUtils';
import { isMemoArray } from '../utils/memoValidation';

const STORAGE_KEY = 'memolist1_memos';

// localStorageに保存済みのメモがあればそれを、無ければ初期データを使う
const loadInitialMemos = (): Memo[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isMemoArray(parsed)) {
        return parsed;
      }
      console.warn(
        'localStorageのメモの形式が想定と異なるため、初期データを使用します',
      );
    }
  } catch (error) {
    console.error('メモの読み込みに失敗しました', error);
  }
  return defaultMemos;
};

export type UseMemosResult = {
  memos: Memo[];
  addMemo: (values: MemoFormValues) => void;
  updateMemo: (id: string, values: MemoFormValues) => void;
  deleteMemo: (id: string) => void;
};

/**
 * メモ一覧の状態管理とlocalStorageへの永続化をまとめたカスタムフック。
 * Appコンポーネントからこのロジックを切り出すことで、
 * Appは「画面の組み立て」に専念でき、状態管理のロジックは
 * このファイル単体でテストできるようになる。
 */
export const useMemos = (): UseMemosResult => {
  const [memos, setMemos] = useState<Memo[]>(loadInitialMemos);

  // memosが変わるたびにlocalStorageへ保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  const addMemo = (values: MemoFormValues) => {
    const newMemo: Memo = {
      id: generateNextId(memos),
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

  const deleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  return { memos, addMemo, updateMemo, deleteMemo };
};
