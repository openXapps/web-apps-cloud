import { Navigate, Outlet } from 'react-router';

type ProtectedRouteProps = {
  isAuthorized: boolean;
  redirectPath: string;
};

export default function ProtectedRoute({ isAuthorized, redirectPath }: ProtectedRouteProps) {

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};