import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const Card = ({ title, description, actions, children }: CardProps) => {
  return (
    <div className="bg-surface-card rounded-xl shadow-sm border border-slate-100 p-5">
      {(title || description || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
};
