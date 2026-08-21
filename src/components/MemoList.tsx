import type { Memo } from '../types';

type MemoListProps = {
  memos: Memo[];
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
};

const MemoList = ({ memos, onEdit, onDelete, editingId }: MemoListProps) => {
  if (memos.length === 0) {
    return <p className="no-memos-message">表示するメモがありません。</p>;
  }

  return (
    <ul>
      {memos.map((memo) => (
        <li
          key={memo.id}
          className={memo.id === editingId ? 'editing-item' : ''}
        >
          <h3>{memo.title}</h3>
          <span>ID: {memo.id}</span>
          <span>{memo.date}</span>
          <p>{memo.content}</p>
          <div className="memo-item-buttons">
            <button type="button" onClick={() => onEdit(memo)}>
              編集
            </button>
            <button
              type="button"
              onClick={() => onDelete(memo.id)}
              className="delete-button"
            >
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MemoList;
