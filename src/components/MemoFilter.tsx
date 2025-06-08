import type React from 'react';

type MemoFilterProps = {
  filter: string;
  setFilter: (value: string) => void;
};
const MemoFilter = ({ filter, setFilter }: MemoFilterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div>
      <input
        type="text"
        id="filter"
        value={filter}
        onChange={handleChange}
        placeholder="検索キーワードをいれてください"
      />
    </div>
  );
};
export default MemoFilter;
