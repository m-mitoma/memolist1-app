import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { Memo } from '../types';

export type MemoFormValues = {
  title: string;
  content: string;
};

type MemoFormProps = {
  onSubmit: (values: MemoFormValues) => void;
  editingMemo: Memo | null;
  onCancelEdit: () => void;
};

const MemoForm = ({ onSubmit, editingMemo, onCancelEdit }: MemoFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemoFormValues>({
    defaultValues: { title: '', content: '' },
  });

  // 編集対象が変わるたびに、フォームの内容を入れ替える
  useEffect(() => {
    if (editingMemo) {
      reset({ title: editingMemo.title, content: editingMemo.content });
    } else {
      reset({ title: '', content: '' });
    }
  }, [editingMemo, reset]);

  const submitHandler: SubmitHandler<MemoFormValues> = (values) => {
    onSubmit(values);
    if (!editingMemo) {
      reset({ title: '', content: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="memo-form">
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          placeholder="タイトルを入力してください"
          {...register('title', {
            required: 'タイトルは必須です',
            maxLength: {
              value: 50,
              message: 'タイトルは50文字以内で入力してください',
            },
          })}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="content">内容</label>
        <textarea
          id="content"
          placeholder="メモの内容を入力してください"
          rows={4}
          {...register('content', {
            required: '内容は必須です',
          })}
        />
        {errors.content && (
          <p className="form-error">{errors.content.message}</p>
        )}
      </div>
      <div className="memo-form-buttons">
        <button type="submit">
          {editingMemo ? '更新する' : 'メモを追加'}
        </button>
        {editingMemo && (
          <button type="button" onClick={onCancelEdit} className="cancel-button">
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
};

export default MemoForm;
