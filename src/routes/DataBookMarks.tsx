import { useEffect, useState } from "react"
import { addDoc, collection, getDocs, serverTimestamp, type DocumentData } from "firebase/firestore"

// import useFirebase from "@/hooks/useFirebase"
import { Button } from "@/components/ui/button"
import useFirestore from "@/hooks/useFirestore"
import useAuth from "@/hooks/useAuth"
import { profileConverter } from "@/lib/converter"

export default function DataBookMarks() {
  const { db } = useFirestore()
  const auth = useAuth()

  // const [profiles, setProfiles] = useState<DocumentData[]>([])
  // const [appBookmarks, setAppBookmarks] = useState<DocumentData[]>([])
  // const [isError, setIsError] = useState(isErrorInit)
  // const [isBusy, setIsBusy] = useState(false)

  async function fetchData() {
    // !isBusy && setIsBusy(true)
    // firebase.getData("/appBookmarker/" + auth.getUID() + "/bookmarks").then(data => {
    const query: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"

    // console.log(query)
    const profileRef = collection(db, query).withConverter(profileConverter)
    const snapshot = await getDocs(profileRef)
    const data = snapshot.docs.map(doc => doc.data())
    console.log(data)

    // firebase.getData(query).then(data => {
    // setProfiles(data)
    // console.log(data)
    // isError && setIsError(isErrorInit)
    // }).catch((error) => {
    // console.log(error)
    // setIsError({ status: true, message: `Error fetching bookmarks for userId ${auth.getUID()}` })
    // })
    // handleReset()
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function createProfile() {
    const path: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"
    const docCollection = collection(db, path).withConverter(profileConverter)
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
      <p>Profile: Home</p>
      <p>Category: Tools</p>
      <p>Bookmark 1</p>
      <Button onClick={createProfile}>New Profile</Button>
    </div>
  )
}
