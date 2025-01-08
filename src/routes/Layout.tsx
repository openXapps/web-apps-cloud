import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div>
      <header>
        <h1>Here goes app bar</h1>
      </header>
      <Outlet />
    </div>
  );
}
