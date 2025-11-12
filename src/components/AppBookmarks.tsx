import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { type DocumentData } from "firebase/firestore"

// import useAppModules from "@/hooks/useAppModules";
import useFirebase from "@/hooks/useFirebase"
import useAuth from "@/hooks/useAuth"

// import { Pencil, Save, Trash2 } from "lucide-react";

import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
// import { Input } from "./ui/input";

const isErrorInit: { status: boolean, message: string } = { status: false, message: "" }

export default function AppBookmarks() {
  // const appModulesHook = useAppModules();
  const firebase = useFirebase()
  const auth = useAuth()
  const rrNavigate = useNavigate()
  const [appBookmarks, setAppBookmarks] = useState<DocumentData[]>([])
  const [isError, setIsError] = useState(isErrorInit)
  const [isBusy, setIsBusy] = useState(false)

  function fetchData() {
    !isBusy && setIsBusy(true)
    // firebase.getData("/appBookmarker/" + auth.getUID() + "/bookmarks").then(data => {
    firebase.getData("/" + auth.getUID() + "/bookmarks").then(data => {
      setAppBookmarks(data)
      isError && setIsError(isErrorInit)
    }).catch((error) => {
      console.log(error)
      setIsError({ status: true, message: `Error fetching bookmarks for userId ${auth.getUID()}` })
    })
    handleReset()
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleReset = () => {
    setIsBusy(false)
    setIsError(isErrorInit)
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-bold">OpenApps Bookmarks</p>
        <Button variant="ghost" size="icon" onClick={() => rrNavigate(-1)}><ArrowLeft /></Button>
      </div>
      {isError.status ? (
        <div>
          <p className="text-red-400">{isError.message}</p>
          <Button className="mt-3" variant="outline" onClick={() => {
            handleReset()
            fetchData()
          }}>Reset</Button>
        </div>
      ) : (
        <div>
          {appBookmarks.map(v => {
            const data = {
              docId: v.id,
              siteName: v.document.siteName,
              siteURL: v.document.siteURL,
              lastUsed: v.document.lastUsed,
            }
            return (
              <div key={data.docId} className="flex flex-row justify-between p-2 border border-orange-800 rounded-lg">
                <div>
                  <p className="font-bold">{data.siteName}</p>
                  <p className="">{data.siteURL}</p>
                  <p className="">{data.lastUsed}</p>
                  <p className="font-mono">{data.docId}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

