import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerUser } from '../api/auth';
import type { RegisterPayload } from '../api/auth';
import { useAuthStore } from '../store/auth-store';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterPayload>();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: RegisterPayload) => {
    setError(null);
    try {
      const response = await registerUser(values);
      setSession(response);
      navigate('/', { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Não foi possível criar a conta. Tente novamente.';
      setError(message);
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
            <label className="text-sm font-medium text-slate-600">Nome completo</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register('nome', { required: 'Nome é obrigatório' })}
            />
            {errors.nome && <p className="text-xs text-rose-500 mt-1">{errors.nome.message}</p>}
          </div>
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
            <label className="text-sm font-medium text-slate-600">Telefone</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register('telefone')}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' }
              })}
            />
            {errors.senha && <p className="text-xs text-rose-500 mt-1">{errors.senha.message}</p>}
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Já possui conta?{' '}
          <Link to="/login" className="text-brand-primary font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};
