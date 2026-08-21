import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const STORAGE_KEY = 'memolist1_memos';

const addMemoViaForm = async (
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  content: string,
) => {
  await user.type(screen.getByLabelText('タイトル'), title);
  await user.type(screen.getByLabelText('内容'), content);
  await user.click(screen.getByRole('button', { name: 'メモを追加' }));
};

beforeEach(() => {
  // 各テストがlocalStorageの状態に影響し合わないようにする
  localStorage.clear();
});

describe('App（メモの追加・編集・削除・永続化）', () => {
  it('初回表示時は初期データ（10件）が表示される', () => {
    render(<App />);
    // MemoList内の各メモは "ID: n" というテキストを持つ
    expect(screen.getAllByText(/^ID: /)).toHaveLength(10);
  });

  it('localStorageの中身が壊れている（Memo[]の形をしていない）場合は初期データにフォールバックする', () => {
    // 想定と違う形のデータが入っているケース（例：仕様変更前の古いデータや改ざん）
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ foo: 'bar' }]));

    render(<App />);

    // 壊れたデータではなく、初期データ（10件）が表示される
    expect(screen.getAllByText(/^ID: /)).toHaveLength(10);
  });

  it('メモを追加すると一覧に表示され、localStorageにも保存される', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addMemoViaForm(user, 'テストで追加したメモ', 'テストの内容');

    expect(screen.getByText('テストで追加したメモ')).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(
      saved.some((memo: { title: string }) => memo.title === 'テストで追加したメモ'),
    ).toBe(true);
  });

  it('編集ボタンを押すと、そのメモのカード内にインライン編集フォームが表示され、更新できる', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addMemoViaForm(user, '編集前のタイトル', '編集前の内容');

    const memoItem = screen.getByText('編集前のタイトル').closest('li');
    expect(memoItem).not.toBeNull();

    // カード内の「編集」ボタンを押す（画面上部のフォームには戻らない）
    await user.click(within(memoItem!).getByRole('button', { name: '編集' }));

    // 同じカードの中にインラインフォームが現れる
    const titleInput = within(memoItem!).getByLabelText('タイトル');
    expect(titleInput).toHaveValue('編集前のタイトル');
    await user.clear(titleInput);
    await user.type(titleInput, '編集後のタイトル');
    await user.click(
      within(memoItem!).getByRole('button', { name: '更新する' }),
    );

    expect(screen.getByText('編集後のタイトル')).toBeInTheDocument();
    expect(screen.queryByText('編集前のタイトル')).not.toBeInTheDocument();
    // 画面上部の追加フォームは編集の影響を受けず空のまま
    expect(screen.getAllByLabelText('タイトル')[0]).toHaveValue('');
  });

  it('削除ボタンを押して確認すると、メモが一覧から消える', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<App />);

    await addMemoViaForm(user, '削除対象のメモ', '削除される内容');
    expect(screen.getByText('削除対象のメモ')).toBeInTheDocument();

    const memoItem = screen.getByText('削除対象のメモ').closest('li');
    const deleteButton = screen
      .getAllByRole('button', { name: '削除' })
      .find((button) => memoItem?.contains(button));
    await user.click(deleteButton!);

    expect(confirmSpy).toHaveBeenCalled();
    expect(screen.queryByText('削除対象のメモ')).not.toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('削除確認でキャンセルすると、メモは消えない', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<App />);

    await addMemoViaForm(user, '残したいメモ', '残る内容');

    const memoItem = screen.getByText('残したいメモ').closest('li');
    const deleteButton = screen
      .getAllByRole('button', { name: '削除' })
      .find((button) => memoItem?.contains(button));
    await user.click(deleteButton!);

    expect(screen.getByText('残したいメモ')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('検索欄にキーワードを入力すると、一致するメモだけに絞り込まれる', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByPlaceholderText('検索キーワードをいれてください'),
      '存在しないキーワードxyz',
    );

    expect(screen.getByText('表示するメモがありません。')).toBeInTheDocument();
  });
});
