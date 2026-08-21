import type { Memo } from '../types';
import type { MemoFormValues } from './MemoForm';
import MemoListItem from './MemoListItem';

type MemoListProps = {
  memos: Memo[];
  editingId: string | null;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, values: MemoFormValues) => void;
  onDelete: (id: string) => void;
};

const MemoList = ({
  memos,
  editingId,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: MemoListProps) => {
  if (memos.length === 0) {
    return <p className="no-memos-message">表示するメモがありません。</p>;
  }

  return (
    <ul>
      {memos.map((memo) => (
        <MemoListItem
          key={memo.id}
          memo={memo}
          isEditing={memo.id === editingId}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default MemoList;
