import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import type { LoginPayload } from '../api/auth';
import { useAuthStore } from '../store/auth-store';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginPayload>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginPayload) => {
    setError(null);
    try {
      const response = await login(values);
      setSession(response);
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Não foi possível entrar. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-3xl font-bold text-brand-primary">GranaBot</p>
          <p className="text-slate-500 text-sm">Finance Web</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium text-slate-600">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register('email', { required: 'E-mail é obrigatório' })}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register('senha', { required: 'Senha é obrigatória' })}
            />
            {errors.senha && <p className="text-xs text-rose-500 mt-1">{errors.senha.message}</p>}
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-brand-primary font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};
