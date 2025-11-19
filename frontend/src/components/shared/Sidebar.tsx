import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Settings } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Extrato', icon: ReceiptText },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <p className="text-2xl font-bold text-brand-primary">GranaBot</p>
        <p className="text-xs text-slate-500">Finance Web</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-surface-base ${
                isActive ? 'bg-surface-base text-brand-primary' : 'text-slate-600'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
