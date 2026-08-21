import type { Memo } from '../types';

/**
 * 値が本当にMemo型の形をしているかを実行時に確認する型ガード。
 * `JSON.parse` の戻り値は `any` なので、`as Memo[]` と書いてしまうと
 * 「本当にその形かどうか」をTypeScriptは一切チェックしてくれない。
 * localStorageの中身は開発者ツールなどから書き換えられる可能性があるので、
 * 信用せずに実際の形を確認してから使う。
 */
const isMemo = (value: unknown): value is Memo => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.content === 'string'
  );
};

export const isMemoArray = (value: unknown): value is Memo[] =>
  Array.isArray(value) && value.every(isMemo);
