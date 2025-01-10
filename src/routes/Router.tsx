import { BrowserRouter, Routes, Route } from 'react-router';

import Layout from '@/routes/Layout';
import Home from '@/routes/Home';
import ProtectedRoute from '@/routes/ProtectedRoute';
import SignUserIn from '@/routes/SignUserIn';

import { useAuth } from '@/context/AuthProvider';

export default function Router() {
  const { isAuthorized } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute isAuthorized={!isAuthorized} redirectPath="/" />}>
            <Route path="signin" element={<SignUserIn />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
