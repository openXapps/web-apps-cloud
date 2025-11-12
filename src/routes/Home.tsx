
import { Link, useNavigate } from "react-router"

import useAuth from "@/hooks/useAuth"

import { Button } from "@/components/ui/button"

export default function Home() {
  const { auth, isAuthorized } = useAuth()
  const rrNavigate = useNavigate()

  return (
    <div className="p-3">
      {isAuthorized ? (
        <div>
          <p className="mb-3 font-bold">Welcome {auth.currentUser?.displayName || "NO NAME"}</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => rrNavigate("/datamodules")}>Edit Modules</Button>
            <Button onClick={() => rrNavigate("/databookmarks")}>Edit BookMarks</Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <p>You are not signed in, please <span><Link className="text-orange-400" to="/signin">Sign In</Link></span></p>
        </div>
      )}
    </div>
  )
}
