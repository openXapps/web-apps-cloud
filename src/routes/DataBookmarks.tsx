import { useState } from "react"
import { useNavigate } from "react-router"

import useAuth from "@/hooks/useAuth"
import useFirestore from "@/hooks/useFirestore"
import { bookmarkerProfileConverter } from "@/lib/converter"
import type { BookmarkerProfile } from "@/lib/models"
import type { GetAllDocumentsProps } from "@/lib/types"

import { ArrowLeft, Pencil, Save, Trash2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useEffect } from "react"
import { useRef } from "react"

type Modes = "NEW" | "SET"

const initCurrentProfile: BookmarkerProfile = {
  profileName: "",
  isActive: true,
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function DataBookmarks() {
  const rrNavigate = useNavigate()
  const auth = useAuth()
  const { isLoading, getAllDocuments, addDocument, setDocument, deleteDocument } = useFirestore()
  const [currentProfile, setCurrentProfile] = useState<BookmarkerProfile>(initCurrentProfile)
  const [bookmarkerProfiles, setBookmarkerProfiles] = useState<BookmarkerProfile[]>([])
  const [profileName, setProfileName] = useState<string>("")
  const [profileIsActive, setProfileIsActive] = useState<boolean>(true)
  const [saveMode, setSaveMode] = useState<Modes>("NEW")
  const focusRef = useRef<HTMLInputElement>(null)

  async function fetchData() {
    const data: GetAllDocumentsProps<BookmarkerProfile> = await getAllDocuments(`/users/${auth.getUID()}/bookmarker/${auth.getUID()}/profiles`, bookmarkerProfileConverter)
    setBookmarkerProfiles(data.payload)
  }

  useEffect(() => {
    fetchData()

    return () => { }
  }, [])

  async function handleSaveProfile(e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) {
    e.preventDefault()
    const path: string = `/users/${auth.getUID()}/bookmarker/${auth.getUID()}/profiles`

    if (saveMode === "NEW") {
      await addDocument(path, {
        profileName: profileName,
        isActive: profileIsActive,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: ""
      }, bookmarkerProfileConverter)
      handleReset()
      fetchData()
    }

    if (saveMode === "SET") {
      await setDocument(path, currentProfile.id, {
        profileName: profileName,
        isActive: profileIsActive,
        createdAt: currentProfile.createdAt,
        updatedAt: new Date(),
        id: currentProfile.id
      }, bookmarkerProfileConverter)
      handleReset()
      fetchData()
    }
  }

  async function handleDeleteModule(e: React.FormEvent<HTMLButtonElement>, index: number) {
    e.preventDefault()
    await deleteDocument("/appModules/", bookmarkerProfiles[index].id)
    fetchData()
  }

  async function handleEditModule(e: React.FormEvent<HTMLButtonElement>, index: number) {
    e.preventDefault()
    setSaveMode("SET")
    setCurrentProfile({
      profileName: bookmarkerProfiles[index].profileName,
      isActive: bookmarkerProfiles[index].isActive,
      id: bookmarkerProfiles[index].id,
      createdAt: bookmarkerProfiles[index].createdAt,
      updatedAt: bookmarkerProfiles[index].updatedAt,
    })
    setProfileName(bookmarkerProfiles[index].profileName)
    setProfileIsActive(bookmarkerProfiles[index].isActive)
    focusRef.current?.focus()
  }

  function handleReset() {
    setProfileName("")
    setProfileIsActive(true)
    setCurrentProfile(initCurrentProfile)
    setSaveMode("NEW")
  }

  function handleUndo(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    handleReset()
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
            <Input ref={focusRef} type="text" value={profileName} onChange={e => setProfileName(e.currentTarget.value)} placeholder="Profile name" />
            <div className="flex items-center space-x-3 border py-2 pl-3 rounded-sm">
              <Label htmlFor="is-active">Enabled</Label>
              <Switch id="is-active" checked={profileIsActive} onCheckedChange={checked => setProfileIsActive(checked)} />
            </div>
          </div>
          <div>
            <Button variant="ghost" size="icon" disabled={isLoading} onClick={handleSaveProfile}><Save /></Button>
            <Button variant="ghost" size="icon" disabled={isLoading} onClick={handleUndo}><Undo2 /></Button>
          </div>
        </form>

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
