import { Outlet } from 'react-router';
import AppBar from '@/components/AppBar';

export default function Layout() {
  return (
    <div className="container">
      <AppBar />
      <Outlet />
    </div>
  );
}
