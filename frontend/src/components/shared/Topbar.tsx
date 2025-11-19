import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';

export const Topbar = () => {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Bem-vindo(a) de volta,</p>
        <h1 className="text-xl font-semibold text-slate-900">{user?.nome ?? 'Usuário'}</h1>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-brand-primary hover:text-brand-dark"
      >
        Sair
      </button>
    </header>
  );
};
