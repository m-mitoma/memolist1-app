import { describe, it, expect } from 'vitest';
import { isMemoArray } from './memoValidation';

describe('isMemoArray', () => {
  it('正しい形のMemo配列はtrueになる', () => {
    const value = [
      { id: '1', title: 'タイトル', date: '2025-01-01', content: '内容' },
    ];
    expect(isMemoArray(value)).toBe(true);
  });

  it('空配列はtrueになる（0件のメモとして扱える）', () => {
    expect(isMemoArray([])).toBe(true);
  });

  it('配列でなければfalseになる', () => {
    expect(isMemoArray({ id: '1' })).toBe(false);
    expect(isMemoArray('文字列')).toBe(false);
    expect(isMemoArray(null)).toBe(false);
    expect(isMemoArray(undefined)).toBe(false);
  });

  it('必要なフィールドが欠けている要素があればfalseになる', () => {
    const value = [{ id: '1', title: 'タイトルだけ' }];
    expect(isMemoArray(value)).toBe(false);
  });

  it('フィールドの型が違う要素があればfalseになる（idが数値など）', () => {
    const value = [{ id: 1, title: 'タイトル', date: '2025-01-01', content: '内容' }];
    expect(isMemoArray(value)).toBe(false);
  });

  it('一部の要素だけ不正な形でも、全体としてfalseになる', () => {
    const value = [
      { id: '1', title: 'OK', date: '2025-01-01', content: '内容' },
      { id: '2', title: 'NG' }, // dateとcontentが無い
    ];
    expect(isMemoArray(value)).toBe(false);
  });
});
