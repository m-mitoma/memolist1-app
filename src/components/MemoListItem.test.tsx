import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemoListItem from './MemoListItem';
import type { Memo } from '../types';

const sampleMemo: Memo = {
  id: '1',
  title: 'サンプルのメモ',
  date: '2025-01-01',
  content: 'サンプルの内容',
};

describe('MemoListItem（通常表示）', () => {
  it('メモの内容が表示される', () => {
    render(
      <ul>
        <MemoListItem
          memo={sampleMemo}
          isEditing={false}
          onStartEdit={vi.fn()}
          onCancelEdit={vi.fn()}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
        />
      </ul>,
    );

    expect(screen.getByText('サンプルのメモ')).toBeInTheDocument();
    expect(screen.getByText('サンプルの内容')).toBeInTheDocument();
    // 通常表示では編集フォームは出ていない
    expect(screen.queryByLabelText('タイトル')).not.toBeInTheDocument();
  });

  it('編集ボタンを押すとonStartEditがそのメモのIDで呼ばれる', async () => {
    const user = userEvent.setup();
    const onStartEdit = vi.fn();

    render(
      <ul>
        <MemoListItem
          memo={sampleMemo}
          isEditing={false}
          onStartEdit={onStartEdit}
          onCancelEdit={vi.fn()}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
        />
      </ul>,
    );

    await user.click(screen.getByRole('button', { name: '編集' }));
    expect(onStartEdit).toHaveBeenCalledWith('1');
  });

  it('削除ボタンを押すとonDeleteがそのメモのIDで呼ばれる', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ul>
        <MemoListItem
          memo={sampleMemo}
          isEditing={false}
          onStartEdit={vi.fn()}
          onCancelEdit={vi.fn()}
          onUpdate={vi.fn()}
          onDelete={onDelete}
        />
      </ul>,
    );

    await user.click(screen.getByRole('button', { name: '削除' }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});

describe('MemoListItem（インライン編集）', () => {
  it('isEditingがtrueだと、そのメモの値が入ったフォームが表示される', () => {
    render(
      <ul>
        <MemoListItem
          memo={sampleMemo}
          isEditing={true}
          onStartEdit={vi.fn()}
          onCancelEdit={vi.fn()}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
        />
      </ul>,
    );

    expect(screen.getByLabelText('タイトル')).toHaveValue(sampleMemo.title);
    expect(screen.getByLabelText('内容')).toHaveValue(sampleMemo.content);
    expect(
      screen.getByRole('button', { name: '更新する' }),
    ).toBeInTheDocument();
  });

  it('内容を書き換えて更新すると、onUpdateがそのメモのIDと新しい値で呼ばれる', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(
      <ul>
        <MemoListItem
          memo={sampleMemo}
          isEditing={true}
          onStartEdit={vi.fn()}
          onCancelEdit={vi.fn()}
          onUpdate={onUpdate}
          onDelete={vi.fn()}
        />
      </ul>,
    );

    const titleInput = screen.getByLabelText('タイトル');
    await user.clear(titleInput);
    await user.type(titleInput, '更新後のタイトル');
    await user.click(screen.getByRole('button', { name: '更新する' }));

    expect(onUpdate).toHaveBeenCalledWith('1', {
      title: '更新後のタイトル',
      content: sampleMemo.content,
    });
  });

  it('キャンセルボタンを押すとonCancelEditが呼ばれる', async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();

    render(
      <ul>
        <MemoListItem
          memo={sampleMemo}
          isEditing={true}
          onStartEdit={vi.fn()}
          onCancelEdit={onCancelEdit}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
        />
      </ul>,
    );

    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(onCancelEdit).toHaveBeenCalledTimes(1);
  });
});
