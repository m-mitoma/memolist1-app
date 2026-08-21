import { describe, it, expect } from 'vitest';
import {
  filterAndSortMemos,
  generateNextId,
  getMonthKey,
  groupMemosByMonth,
} from './memoUtils';
import type { Memo } from '../types';

const sampleMemos: Memo[] = [
  { id: '1', title: 'りんごを買う', date: '2025-01-05', content: 'スーパーで買う' },
  { id: '2', title: '会議の準備', date: '2025-01-01', content: '資料を作る' },
  { id: '3', title: 'バナナを買う', date: '2025-01-10', content: 'スーパーで買う' },
];

describe('filterAndSortMemos', () => {
  it('タイトルに検索キーワードを含むメモだけを返す', () => {
    // 「買う」を含むのは id:1「りんごを買う」と id:3「バナナを買う」の2件
    const result = filterAndSortMemos(sampleMemos, '買う', 'date', 'asc');
    expect(result.map((memo) => memo.id)).toEqual(['1', '3']);
  });

  it('検索キーワードは大文字・小文字を区別しない', () => {
    const memos: Memo[] = [
      { id: '1', title: 'Weekly Report', date: '2025-01-01', content: '' },
    ];
    const result = filterAndSortMemos(memos, 'weekly', 'date', 'asc');
    expect(result).toHaveLength(1);
  });

  it('検索キーワードが空文字なら全件返す', () => {
    const result = filterAndSortMemos(sampleMemos, '', 'date', 'asc');
    expect(result).toHaveLength(3);
  });

  it('日付の昇順・降順で並び替えられる', () => {
    const asc = filterAndSortMemos(sampleMemos, '', 'date', 'asc');
    expect(asc.map((memo) => memo.id)).toEqual(['2', '1', '3']);

    const desc = filterAndSortMemos(sampleMemos, '', 'date', 'desc');
    expect(desc.map((memo) => memo.id)).toEqual(['3', '1', '2']);
  });

  it('IDの昇順・降順で並び替えられる（数値として比較する）', () => {
    const asc = filterAndSortMemos(sampleMemos, '', 'id', 'asc');
    expect(asc.map((memo) => memo.id)).toEqual(['1', '2', '3']);

    const desc = filterAndSortMemos(sampleMemos, '', 'id', 'desc');
    expect(desc.map((memo) => memo.id)).toEqual(['3', '2', '1']);
  });

  it('タイトルの昇順・降順で並び替えられる（文字列として比較する）', () => {
    const titles = sampleMemos.map((memo) => memo.title);
    const expectedAsc = [...titles].sort((a, b) => a.localeCompare(b));
    const expectedDesc = [...expectedAsc].reverse();

    const asc = filterAndSortMemos(sampleMemos, '', 'title', 'asc');
    expect(asc.map((memo) => memo.title)).toEqual(expectedAsc);

    const desc = filterAndSortMemos(sampleMemos, '', 'title', 'desc');
    expect(desc.map((memo) => memo.title)).toEqual(expectedDesc);
  });

  it('該当するメモが無ければ空配列を返す', () => {
    const result = filterAndSortMemos(sampleMemos, '存在しないキーワード', 'date', 'asc');
    expect(result).toEqual([]);
  });

  it('selectedMonthを指定すると、その月のメモだけに絞り込まれる', () => {
    const memos: Memo[] = [
      ...sampleMemos, // すべて2025-01
      { id: '4', title: '2月のメモ', date: '2025-02-01', content: '' },
    ];
    const result = filterAndSortMemos(memos, '', 'date', 'asc', '2025-02');
    expect(result.map((memo) => memo.id)).toEqual(['4']);
  });

  it('selectedMonthがnullなら月による絞り込みはされない（従来通り）', () => {
    const result = filterAndSortMemos(sampleMemos, '', 'date', 'asc', null);
    expect(result).toHaveLength(3);
  });

  it('検索キーワードとselectedMonthを両方指定すると、両方の条件で絞り込まれる', () => {
    const memos: Memo[] = [
      { id: '1', title: '買い物メモ', date: '2025-01-05', content: '' },
      { id: '2', title: '買い物メモ', date: '2025-02-05', content: '' },
      { id: '3', title: '会議メモ', date: '2025-01-10', content: '' },
    ];
    const result = filterAndSortMemos(memos, '買い物', 'date', 'asc', '2025-01');
    expect(result.map((memo) => memo.id)).toEqual(['1']);
  });
});

describe('getMonthKey', () => {
  it('"YYYY-MM-DD"形式の文字列から"YYYY-MM"を取り出す', () => {
    expect(getMonthKey('2025-01-05')).toBe('2025-01');
    expect(getMonthKey('2025-12-31')).toBe('2025-12');
  });
});

describe('groupMemosByMonth', () => {
  it('年月ごとの件数を集計する', () => {
    const memos: Memo[] = [
      { id: '1', title: '', date: '2025-01-05', content: '' },
      { id: '2', title: '', date: '2025-01-20', content: '' },
      { id: '3', title: '', date: '2025-02-01', content: '' },
    ];
    const result = groupMemosByMonth(memos);
    expect(result).toEqual([
      { key: '2025-02', label: '2025年2月', count: 1 },
      { key: '2025-01', label: '2025年1月', count: 2 },
    ]);
  });

  it('新しい月が先頭に来るよう並ぶ', () => {
    const memos: Memo[] = [
      { id: '1', title: '', date: '2024-06-01', content: '' },
      { id: '2', title: '', date: '2025-01-01', content: '' },
      { id: '3', title: '', date: '2024-12-01', content: '' },
    ];
    const result = groupMemosByMonth(memos);
    expect(result.map((entry) => entry.key)).toEqual([
      '2025-01',
      '2024-12',
      '2024-06',
    ]);
  });

  it('メモが無ければ空配列を返す', () => {
    expect(groupMemosByMonth([])).toEqual([]);
  });
});

describe('generateNextId', () => {
  it('メモが無い場合は "1" を返す', () => {
    expect(generateNextId([])).toBe('1');
  });

  it('既存の最大IDに1を足した値を返す', () => {
    expect(generateNextId(sampleMemos)).toBe('4');
  });

  it('IDが数値に変換できない場合は0として扱う', () => {
    const memos: Memo[] = [{ id: 'abc', title: '', date: '', content: '' }];
    expect(generateNextId(memos)).toBe('1');
  });
});
