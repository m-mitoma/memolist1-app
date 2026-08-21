import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemoForm from './MemoForm';

describe('MemoForm（新規追加フォーム）', () => {
  it('タイトル・内容が未入力のまま送信すると、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<MemoForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: 'メモを追加' }));

    expect(await screen.findByText('タイトルは必須です')).toBeInTheDocument();
    expect(screen.getByText('内容は必須です')).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('タイトルが50文字を超えるとエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<MemoForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText('タイトル'), 'あ'.repeat(51));
    await user.type(screen.getByLabelText('内容'), '内容');
    await user.click(screen.getByRole('button', { name: 'メモを追加' }));

    expect(
      await screen.findByText('タイトルは50文字以内で入力してください'),
    ).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('タイトル・内容を入力して送信すると、onAddが正しい値で呼ばれ、フォームがクリアされる', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<MemoForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText('タイトル'), '新しいメモ');
    await user.type(screen.getByLabelText('内容'), '新しい内容');
    await user.click(screen.getByRole('button', { name: 'メモを追加' }));

    expect(onAdd).toHaveBeenCalledWith({
      title: '新しいメモ',
      content: '新しい内容',
    });
    expect(screen.getByLabelText('タイトル')).toHaveValue('');
    expect(screen.getByLabelText('内容')).toHaveValue('');
  });
});
