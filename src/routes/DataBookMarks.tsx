import { useRef, useState } from "react"
import { useNavigate } from "react-router"

import type { Timestamp } from "firebase/firestore/lite"

import useAuth from "@/hooks/useAuth"
import useFirestore from "@/hooks/useFirestore"
import { bookmarkerProfilesConverter } from "@/lib/converter"
import type { BookmarkerProfile } from "@/lib/models"

import { ArrowLeft, Pencil, Save, Trash2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Modes = "NEW" | "SET"
// const isErrorInit: { status: boolean, message: string } = { status: false, message: "" }

export default function DataBookMarks() {
  const rrNavigate = useNavigate()
  const auth = useAuth()
  const { isLoading, getDocument, getAllDocuments, addDocument } = useFirestore()
  const profileNameRef = useRef<HTMLInputElement | null>(null)
  const profileIsActiveRef = useRef<HTMLInputElement | null>(null)
  const [profileCreatedAt, setProfileCreatedAt] = useState<Timestamp>()
  // const profileCreatedAtRef = useRef<Timestamp>()
  const [profileUpdatedAt, setProfileUpdatedAt] = useState<Timestamp>()
  // const profileUpdatedAtRef = useRef<Timestamp>()
  const [editingProfileId, setEditingProfileId] = useState<string>("")
  const [saveMode, setSaveMode] = useState<Modes>("NEW")
  const [bookmarkerProfiles, setBookmarkerProfiles] = useState<BookmarkerProfile[]>([])
  // const [isError, setIsError] = useState(isErrorInit)
  // const [isBusy, setIsBusy] = useState(false)

  async function handleSaveProfile(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    let path: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"
    const data: BookmarkerProfile = {
      profileName: profileNameRef.current?.value ? profileNameRef.current?.value : "",
      isActive: profileIsActiveRef.current?.value === "true" ? true : false,
    }

    if (saveMode === "NEW") {
      const result = await addDocument(path, {
        ...data,
        id: editingProfileId,
        createdAt: profileCreatedAt,
        updatedAt: profileUpdatedAt,
      }, bookmarkerProfilesConverter)
      console.log(result.path)
    }

    if (saveMode === "SET") {
      // const docRef = doc(db, path, editingProfileId).withConverter(bookmarkerProfilesConverter)
      // const result = await setDoc(docRef, data)
      // console.log(result)
    }
  }

  async function handleEditModule(e: React.FormEvent<HTMLButtonElement>, { ...profile }: BookmarkerProfile) {
    e.preventDefault()
    setSaveMode("SET")
    if (profileNameRef.current && profileIsActiveRef.current) {
      profileNameRef.current.value = profile.profileName
      profileIsActiveRef.current.value = profile.isActive ? "true" : "false"
      setProfileCreatedAt(profile.createdAt)
      setProfileUpdatedAt(profile.updatedAt)
      setEditingProfileId(profile.id)
    }
  }

  async function handleDeleteModule(e: React.FormEvent<HTMLButtonElement>, id: string) {
    e.preventDefault()
  }

  function handleReset() {
    profileNameRef.current = null
    profileIsActiveRef.current = null
    setProfileCreatedAt(null)
    setEditingProfileId("")
    setSaveMode("NEW")
    setBookmarkerProfiles([])
    // setIsBusy(false)
    // setIsError(isErrorInit)
  }

  function handleUndo(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    handleReset()
  }

  async function handleGetOneDocument(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    const data = await getDocument("/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles", "3CxzC03kxeBx1riVoOa4", bookmarkerProfilesConverter)
    console.log(data)
  }

  async function handleGetDocumentList(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    const data = await getAllDocuments("/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles", bookmarkerProfilesConverter)
    setBookmarkerProfiles(data)
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-bold">Bookmarker Profiles</p>
        <Button variant="ghost" size="icon" onClick={() => rrNavigate(-1)}><ArrowLeft /></Button>
      </div>
      <div className="">
        <form className="flex gap-5 justify-between items-center border border-slate-400 rounded-lg p-3" action="" onSubmit={handleSaveProfile}>
          <div className="space-y-2 w-full">
            <Input className="" ref={profileNameRef} placeholder="Profile name" />
            <Input className="" ref={profileIsActiveRef} placeholder="Profile Status" />
            <Input className="" value={profileCreatedAtRef.current?.toString()} disabled />
            <Input className="" value={profileUpdatedAtRef.current?.toString()} disabled />
            <Input className="" value={profileIdRef.current} disabled />
          </div>
          <div>
            <Button variant="ghost" size="icon" disabled={isLoading} onClick={handleSaveProfile}><Save /></Button>
            <Button variant="ghost" size="icon" disabled={isLoading} onClick={handleUndo}><Undo2 /></Button>
          </div>
        </form>

        <div className="mt-3 flex gap-2">
          <Button onClick={handleGetOneDocument}>Get One Document</Button>
          <Button onClick={handleGetDocumentList}>Get Document List</Button>
        </div>

        {isLoading && <p className="mt-3">Loading...</p>}

        {bookmarkerProfiles.length > 0 && bookmarkerProfiles.map(v => (
          <div key={v.id} className="flex flex-row justify-between mt-3 p-2 border border-orange-800 rounded-lg">
            <div>
              <p className="font-bold">{v.profileName}</p>
              <p>Is Active: {v.isActive ? "true" : "false"}</p>
              <p className="font-mono">ID: {v.id}</p>
            </div>
            <div className="flex flex-nowrap gap-1">
              <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleEditModule(e, v)}><Pencil /></Button>
              <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleDeleteModule(e, v.id)}><Trash2 /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
