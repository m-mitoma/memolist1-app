import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { MemoFormValues } from './MemoForm';

type MemoFormFieldsProps = {
  register: UseFormRegister<MemoFormValues>;
  errors: FieldErrors<MemoFormValues>;
  idPrefix?: string;
};

/**
 * タイトル・内容の入力欄とバリデーションエラー表示。
 * 「新規追加フォーム」と「各メモのインライン編集フォーム」の両方から使う共通部品。
 * 同じページに複数のフォームが同時に存在しうるため、idPrefixでid/labelの重複を避ける。
 */
const MemoFormFields = ({
  register,
  errors,
  idPrefix = '',
}: MemoFormFieldsProps) => {
  const titleId = `${idPrefix}title`;
  const contentId = `${idPrefix}content`;

  return (
    <>
      <div>
        <label htmlFor={titleId}>タイトル</label>
        <input
          id={titleId}
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
        <label htmlFor={contentId}>内容</label>
        <textarea
          id={contentId}
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
    </>
  );
};

export default MemoFormFields;
