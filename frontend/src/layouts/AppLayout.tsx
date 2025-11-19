import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/shared/Sidebar';
import { Topbar } from '../components/shared/Topbar';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-surface-base text-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
