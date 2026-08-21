import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { Memo } from '../types';
import type { MemoFormValues } from './MemoForm';
import MemoFormFields from './MemoFormFields';

type MemoListItemProps = {
  memo: Memo;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, values: MemoFormValues) => void;
  onDelete: (id: string) => void;
};

const MemoListItem = ({
  memo,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: MemoListItemProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemoFormValues>({
    defaultValues: { title: memo.title, content: memo.content },
  });

  // 編集モードに入るたびに、このメモの最新の値でフォームを初期化する
  useEffect(() => {
    if (isEditing) {
      reset({ title: memo.title, content: memo.content });
    }
  }, [isEditing, memo.title, memo.content, reset]);

  const submitHandler: SubmitHandler<MemoFormValues> = (values) => {
    onUpdate(memo.id, values);
  };

  if (isEditing) {
    return (
      <li className="editing-item">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="memo-edit-form"
        >
          <MemoFormFields
            register={register}
            errors={errors}
            idPrefix={`edit-${memo.id}-`}
          />
          <div className="memo-form-buttons">
            <button type="submit">更新する</button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="cancel-button"
            >
              キャンセル
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li>
      <h3>{memo.title}</h3>
      <span>ID: {memo.id}</span>
      <span>{memo.date}</span>
      <p>{memo.content}</p>
      <div className="memo-item-buttons">
        <button type="button" onClick={() => onStartEdit(memo.id)}>
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
  );
};

export default MemoListItem;
