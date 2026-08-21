import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMemos } from './useMemos';

const STORAGE_KEY = 'memolist1_memos';

beforeEach(() => {
  localStorage.clear();
});

describe('useMemos', () => {
  it('初回は初期データ（10件）を返す', () => {
    const { result } = renderHook(() => useMemos());
    expect(result.current.memos).toHaveLength(10);
  });

  it('addMemoで新しいメモが末尾に追加され、localStorageにも保存される', () => {
    const { result } = renderHook(() => useMemos());

    act(() => {
      result.current.addMemo({ title: '新規メモ', content: '内容' });
    });

    expect(result.current.memos).toHaveLength(11);
    expect(result.current.memos[result.current.memos.length - 1]).toMatchObject({
      title: '新規メモ',
      content: '内容',
    });

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(saved).toHaveLength(11);
  });

  it('updateMemoで指定したメモのtitle/contentだけが更新され、id/dateは変わらない', () => {
    const { result } = renderHook(() => useMemos());
    const target = result.current.memos[0];

    act(() => {
      result.current.updateMemo(target.id, {
        title: '更新後のタイトル',
        content: '更新後の内容',
      });
    });

    const updated = result.current.memos.find((memo) => memo.id === target.id);
    expect(updated).toMatchObject({
      id: target.id,
      date: target.date,
      title: '更新後のタイトル',
      content: '更新後の内容',
    });
  });

  it('deleteMemoで指定したメモだけが削除される', () => {
    const { result } = renderHook(() => useMemos());
    const target = result.current.memos[0];

    act(() => {
      result.current.deleteMemo(target.id);
    });

    expect(
      result.current.memos.some((memo) => memo.id === target.id),
    ).toBe(false);
    expect(result.current.memos).toHaveLength(9);
  });

  it('addMemoを2回呼ぶと、IDが重複せずそれぞれ発行される', () => {
    const { result } = renderHook(() => useMemos());

    act(() => {
      result.current.addMemo({ title: '1件目', content: '内容1' });
    });
    act(() => {
      result.current.addMemo({ title: '2件目', content: '内容2' });
    });

    const ids = result.current.memos.map((memo) => memo.id);
    expect(new Set(ids).size).toBe(ids.length); // 重複がない
  });
});
