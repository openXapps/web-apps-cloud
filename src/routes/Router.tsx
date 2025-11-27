import { BrowserRouter, Routes, Route } from "react-router"

import Layout from "@/routes/Layout"
import Home from "@/routes/Home"
import ProtectedRoute from "@/routes/ProtectedRoute"
import SignInUser from "@/routes/SignInUser"
import SignUpUser from "@/routes/SignUpUser"
import User from "@/routes/User"
import DataModules from "@/routes/DataModules"
import DataBookmarks from "@/routes/DataBookmarks"

import useAuth from "@/hooks/useAuth"

export default function Router() {
  const { isAuthorized } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute isAuthorized={!isAuthorized} redirectPath="/" />}>
            <Route path="signin" element={<SignInUser />} />
            <Route path="signup" element={<SignUpUser />} />
          </Route>
          <Route element={<ProtectedRoute isAuthorized={isAuthorized} redirectPath="/" />}>
            <Route path="user" element={<User />} />
            <Route path="datamodules" element={<DataModules />} />
            <Route path="databookmarks" element={<DataBookmarks />} />
          </Route>
        </Route>
        <Route path="*" element={<p>Error</p>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
