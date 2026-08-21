import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonthlyArchive from './MonthlyArchive';
import type { MonthlyArchiveEntry } from '../utils/memoUtils';

const sampleEntries: MonthlyArchiveEntry[] = [
  { key: '2025-02', label: '2025年2月', count: 1 },
  { key: '2025-01', label: '2025年1月', count: 2 },
];

describe('MonthlyArchive', () => {
  it('メモが無ければ何も表示しない', () => {
    const { container } = render(
      <MonthlyArchive
        entries={[]}
        selectedMonth={null}
        onSelectMonth={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('各月のラベルと件数が表示される', () => {
    render(
      <MonthlyArchive
        entries={sampleEntries}
        selectedMonth={null}
        onSelectMonth={vi.fn()}
      />,
    );

    expect(screen.getByText('2025年2月 (1)')).toBeInTheDocument();
    expect(screen.getByText('2025年1月 (2)')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'すべて表示' }),
    ).toBeInTheDocument();
  });

  it('月のボタンを押すと、その月のkeyでonSelectMonthが呼ばれる', async () => {
    const user = userEvent.setup();
    const onSelectMonth = vi.fn();

    render(
      <MonthlyArchive
        entries={sampleEntries}
        selectedMonth={null}
        onSelectMonth={onSelectMonth}
      />,
    );

    await user.click(screen.getByText('2025年1月 (2)'));
    expect(onSelectMonth).toHaveBeenCalledWith('2025-01');
  });

  it('「すべて表示」を押すとnullでonSelectMonthが呼ばれる', async () => {
    const user = userEvent.setup();
    const onSelectMonth = vi.fn();

    render(
      <MonthlyArchive
        entries={sampleEntries}
        selectedMonth="2025-01"
        onSelectMonth={onSelectMonth}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'すべて表示' }));
    expect(onSelectMonth).toHaveBeenCalledWith(null);
  });

  it('選択中の月のボタンにactive-monthクラスが付く', () => {
    render(
      <MonthlyArchive
        entries={sampleEntries}
        selectedMonth="2025-01"
        onSelectMonth={vi.fn()}
      />,
    );

    expect(screen.getByText('2025年1月 (2)')).toHaveClass('active-month');
    expect(screen.getByText('2025年2月 (1)')).not.toHaveClass('active-month');
  });
});
