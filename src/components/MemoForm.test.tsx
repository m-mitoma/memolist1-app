import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemoForm from './MemoForm';
import type { Memo } from '../types';

const sampleMemo: Memo = {
  id: '1',
  title: '既存のメモ',
  date: '2025-01-01',
  content: '既存の内容',
};

describe('MemoForm（新規追加モード）', () => {
  it('タイトル・内容が未入力のまま送信すると、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MemoForm onSubmit={onSubmit} editingMemo={null} onCancelEdit={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'メモを追加' }));

    expect(await screen.findByText('タイトルは必須です')).toBeInTheDocument();
    expect(screen.getByText('内容は必須です')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('タイトルが50文字を超えるとエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MemoForm onSubmit={onSubmit} editingMemo={null} onCancelEdit={vi.fn()} />,
    );

    await user.type(screen.getByLabelText('タイトル'), 'あ'.repeat(51));
    await user.type(screen.getByLabelText('内容'), '内容');
    await user.click(screen.getByRole('button', { name: 'メモを追加' }));

    expect(
      await screen.findByText('タイトルは50文字以内で入力してください'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('タイトル・内容を入力して送信すると、onSubmitが正しい値で呼ばれる', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <MemoForm onSubmit={onSubmit} editingMemo={null} onCancelEdit={vi.fn()} />,
    );

    await user.type(screen.getByLabelText('タイトル'), '新しいメモ');
    await user.type(screen.getByLabelText('内容'), '新しい内容');
    await user.click(screen.getByRole('button', { name: 'メモを追加' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: '新しいメモ',
      content: '新しい内容',
    });
  });
});

describe('MemoForm（編集モード）', () => {
  it('editingMemoが渡されると、フォームに既存の値が表示される', () => {
    render(
      <MemoForm
        onSubmit={vi.fn()}
        editingMemo={sampleMemo}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('タイトル')).toHaveValue(sampleMemo.title);
    expect(screen.getByLabelText('内容')).toHaveValue(sampleMemo.content);
    expect(
      screen.getByRole('button', { name: '更新する' }),
    ).toBeInTheDocument();
  });

  it('キャンセルボタンを押すとonCancelEditが呼ばれる', async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();

    render(
      <MemoForm
        onSubmit={vi.fn()}
        editingMemo={sampleMemo}
        onCancelEdit={onCancelEdit}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    expect(onCancelEdit).toHaveBeenCalledTimes(1);
  });
});
