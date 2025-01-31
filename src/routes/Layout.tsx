import { Outlet } from 'react-router';
import AppBar from '@/components/AppBar';

export default function Layout() {
  return (
    <>
      <div className="bg-slate-400 dark:bg-slate-700">
        <AppBar />
      </div>
      <div className="container max-w-[1024px]">
        <Outlet />
      </div>
    </>
  );
}
