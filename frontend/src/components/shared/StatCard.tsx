interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  accent?: 'income' | 'expense' | 'neutral';
}

const accentMap = {
  income: 'text-emerald-600 bg-emerald-50',
  expense: 'text-rose-600 bg-rose-50',
  neutral: 'text-slate-600 bg-slate-50',
};

export const StatCard = ({ label, value, helper, accent = 'neutral' }: StatCardProps) => {
  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm ${accentMap[accent]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      {helper && <p className="text-xs mt-1 opacity-70">{helper}</p>}
    </div>
  );
};
