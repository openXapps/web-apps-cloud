import { useEffect, useState } from "react"
import { addDoc, collection, getDocs } from "firebase/firestore"

// import useFirebase from "@/hooks/useFirebase"
import { Button } from "@/components/ui/button"
import useFirestore from "@/hooks/useFirestoreContext"
import useAuth from "@/hooks/useAuth"
import { bookmarkerProfilesConverter } from "@/lib/converter"
import type { BookmarkerProfiles } from "@/lib/models"

const isErrorInit: { status: boolean, message: string } = { status: false, message: "" }

export default function DataBookMarks() {
  const { db } = useFirestore()
  const auth = useAuth()

  const [bookmarkerProfiles, setBookmarkerProfiles] = useState<BookmarkerProfiles[]>([])
  // const [appBookmarks, setAppBookmarks] = useState<DocumentData[]>([])
  const [isError, setIsError] = useState(isErrorInit)
  const [isBusy, setIsBusy] = useState(false)

  async function fetchData() {
    !isBusy && setIsBusy(true)
    const query: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"
    // console.log(query)
    const profileRef = collection(db, query).withConverter(bookmarkerProfilesConverter)
    const snapshot = await getDocs(profileRef)
    const data = snapshot.docs.map(doc => doc.data())
    // console.log(data)
    setBookmarkerProfiles(data)
    isError && setIsError(isErrorInit)
    isBusy && setIsBusy(false)
    // handleReset()
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function createProfile() {
    const path: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"
    const docCollection = collection(db, path).withConverter(bookmarkerProfilesConverter)
    const doc = {
      profileName: "New Profile name",
      isActive: true,
    }
    const result = await addDoc(docCollection, doc)
    console.log(result.path)
  }

  // const handleReset = () => {
  //   setIsBusy(false)
  //   setIsError(isErrorInit)
  // }

  return (
    <div>
      <Button onClick={createProfile}>New Profile</Button>
      {!isBusy && bookmarkerProfiles.map(d => (
        <div key={d.id}>
          <p>{d.profileName}</p>
        </div>
      ))}
    </div>
  )
}
