import { useState } from "react"
import { useNavigate } from "react-router"

import useAuth from "@/hooks/useAuth"
import useFirestore from "@/hooks/useFirestore"
import { bookmarkerProfilesConverter } from "@/lib/converter"
import type { BookmarkerProfile } from "@/lib/models"
import type { GetAllDocumentsProps, GetDocumentProps } from "@/lib/types"

import { ArrowLeft, Pencil, Save, Trash2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Modes = "NEW" | "SET"

type CurrentProfileProps = BookmarkerProfile & {
  index: number
}

const initCurrentProfile: CurrentProfileProps = {
  index: 0,
  profileName: "",
  isActive: true,
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function DataBookMarks() {
  const rrNavigate = useNavigate()
  const auth = useAuth()
  const { isLoading, getDocument, getAllDocuments, addDocument, setDocument } = useFirestore()
  const [currentProfile, setCurrentProfile] = useState<CurrentProfileProps>(initCurrentProfile)
  // const [bookmarkerProfile, setBookmarkerProfile] = useState<BookmarkerProfile>()
  const [bookmarkerProfiles, setBookmarkerProfiles] = useState<BookmarkerProfile[]>([])
  const [profileName, setProfileName] = useState<string>("")
  const [profileIsActive, setProfileIsActive] = useState<boolean>(true)
  const [saveMode, setSaveMode] = useState<Modes>("NEW")
  // const [isError, setIsError] = useState(isErrorInit)
  // const [isBusy, setIsBusy] = useState(false)

  async function handleSaveProfile(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    let path: string = "/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles/"

    if (saveMode === "NEW") {
      await addDocument(path, {
        profileName: profileName,
        isActive: profileIsActive,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: ""
      }, bookmarkerProfilesConverter)
      handleReset()
      // console.log(result.path)
    }

    if (saveMode === "SET") {
      await setDocument(path, currentProfile.id, {
        profileName: profileName,
        isActive: profileIsActive,
        createdAt: currentProfile.createdAt,
        updatedAt: new Date(),
        id: currentProfile.id
      }, bookmarkerProfilesConverter)
      handleReset()
    }
  }

  async function handleEditModule(e: React.FormEvent<HTMLButtonElement>, index: number) {
    e.preventDefault()
    console.log(bookmarkerProfiles[index]);
    
    setSaveMode("SET")
    setCurrentProfile({
      index: index,
      profileName: bookmarkerProfiles[index].profileName,
      isActive: bookmarkerProfiles[index].isActive,
      id: bookmarkerProfiles[index].id,
      createdAt: bookmarkerProfiles[index].createdAt,
      updatedAt: bookmarkerProfiles[index].updatedAt,
    })
    setProfileName(bookmarkerProfiles[index].profileName)
    setProfileIsActive(bookmarkerProfiles[index].isActive)
  }

  async function handleDeleteModule(e: React.FormEvent<HTMLButtonElement>, index: number) {
    e.preventDefault()
  }

  function handleReset() {
    setProfileName("")
    setProfileIsActive(true)
    setCurrentProfile(initCurrentProfile)
    setSaveMode("NEW")
    // setIsBusy(false)
    // setIsError(isErrorInit)
  }

  function handleUndo(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    handleReset()
  }

  async function handleGetOneDocument(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    const data: GetDocumentProps<BookmarkerProfile> = await getDocument("/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles", "3CxzC03kxeBx1riVoOa4", bookmarkerProfilesConverter)
    console.log(data)
  }

  async function handleGetDocumentList(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    const data: GetAllDocumentsProps<BookmarkerProfile> = await getAllDocuments("/users/" + auth.getUID() + "/bookmarker/" + auth.getUID() + "/profiles", bookmarkerProfilesConverter)
    console.log(data)
    setBookmarkerProfiles(data.payload)
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
            <Input type="text" value={profileName} onChange={e => setProfileName(e.currentTarget.value)} placeholder="Profile name" />
            <div className="flex items-center space-x-3 border py-2 pl-3 rounded-sm">
              <Label htmlFor="is-active">Enabled</Label>
              <Switch id="is-active" checked={profileIsActive} onCheckedChange={checked => setProfileIsActive(checked)} />
            </div>
            {currentProfile.id && (
              <div>
                <p>Created at: {currentProfile.createdAt.toISOString()}</p>
                <p>Updated at: {currentProfile.updatedAt.toISOString()}</p>
                <p>Firestore ID: {currentProfile.id}</p>
              </div>
            )}
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

        {bookmarkerProfiles.length > 0 && bookmarkerProfiles.map((v, i) => (
          <div key={v.id} className="flex flex-row justify-between mt-3 p-2 border border-orange-800 rounded-lg">
            <div>
              <p className="font-bold">{v.profileName}</p>
              <p>Is Active: {v.isActive ? "true" : "false"}</p>
              <p className="font-mono">ID: {v.id}</p>
            </div>
            <div className="flex flex-nowrap gap-1">
              <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleEditModule(e, i)}><Pencil /></Button>
              <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleDeleteModule(e, i)}><Trash2 /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
