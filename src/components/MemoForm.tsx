import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import MemoFormFields from './MemoFormFields';

export type MemoFormValues = {
  title: string;
  content: string;
};

type MemoFormProps = {
  onAdd: (values: MemoFormValues) => void;
};

// 新規メモの追加専用フォーム。編集は各メモのカード側（MemoListItem）で行う。
const MemoForm = ({ onAdd }: MemoFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemoFormValues>({
    defaultValues: { title: '', content: '' },
  });

  const submitHandler: SubmitHandler<MemoFormValues> = (values) => {
    onAdd(values);
    reset({ title: '', content: '' });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="memo-form">
      <MemoFormFields register={register} errors={errors} idPrefix="new-" />
      <div className="memo-form-buttons">
        <button type="submit">メモを追加</button>
      </div>
    </form>
  );
};

export default MemoForm;
