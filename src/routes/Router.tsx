import { BrowserRouter, Routes, Route } from 'react-router';

import Layout from '@/routes/Layout';
import Home from '@/routes/Home';
import ProtectedRoute from '@/routes/ProtectedRoute';
import SignUserIn from '@/routes/SignUserIn';
import User from '@/routes/User';

import useAuth from '@/hooks/useAuth';
import DataModules from './DataModules';
import DataBookMarks from './DataBookMarks';

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
          <Route element={<ProtectedRoute isAuthorized={isAuthorized} redirectPath="/" />}>
            <Route path="user" element={<User />} />
            <Route path="datamodules" element={<DataModules />} />
            <Route path="databookmarks" element={<DataBookMarks />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
