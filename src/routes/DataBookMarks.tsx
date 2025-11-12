import { useEffect, useState } from "react"
import { type DocumentData } from "firebase/firestore"

import useFirebase from "@/hooks/useFirebase"
import useAuth from "@/hooks/useAuth"

// import type { UserBookmarkProfile } from "@/lib/types"
// import AppBookmarks from "@/components/AppBookmarks";

const isErrorInit: { status: boolean, message: string } = { status: false, message: "" }

export default function DataBookMarks() {
  const firebase = useFirebase()
  const auth = useAuth()
  const [profiles, setProfiles] = useState<DocumentData[]>([])
  // const [appBookmarks, setAppBookmarks] = useState<DocumentData[]>([])
  const [isError, setIsError] = useState(isErrorInit)
  const [isBusy, setIsBusy] = useState(false)

  function fetchData() {
    !isBusy && setIsBusy(true)
    // firebase.getData("/appBookmarker/" + auth.getUID() + "/bookmarks").then(data => {
    const query: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"
    console.log(query)
    firebase.getData(query).then(data => {
      setProfiles(data)
      console.log(data)

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
    <div>
      <p>Profile: Home</p>
      <p>Category: Tools</p>
      <p>Bookmark 1</p>
    </div>
  )
}
