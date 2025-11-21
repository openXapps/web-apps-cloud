import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { type DocumentData } from "firebase/firestore"

import useFirebaseMethods from "@/hooks/useFirestoreMethods"

import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

const isErrorInit: { status: boolean, message: string } = { status: false, message: "" }

type Modes = "NEW" | "SET"
type ModuleModelType = {
  moduleName: string
  moduleDesc: string
  docId: string
}

export default function AppModules() {
  // const appModulesHook = useAppModules();
  const firebase = useFirebaseMethods()
  const moduleNameRef = useRef<HTMLInputElement | null>(null)
  const moduleDescRef = useRef<HTMLInputElement | null>(null)
  const rrNavigate = useNavigate()
  const [docId, setDocId] = useState<string>("")
  const [appModules, setAppModules] = useState<DocumentData[]>([])
  const [saveMode, setSaveMode] = useState<Modes>("NEW")
  const [isError, setIsError] = useState(isErrorInit)
  const [isBusy, setIsBusy] = useState(false)

  function fetchData() {
    !isBusy && setIsBusy(true)
    firebase.getData("appModules").then(data => {
      setAppModules(data)
      isError && setIsError(isErrorInit)
    }).catch((error) => {
      console.log(error)
      setIsError({ status: true, message: "Fetch app modules error" })
    })
    handleReset()
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveModule = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()
    if (moduleNameRef.current?.value && moduleDescRef.current?.value) {
      !isBusy && setIsBusy(true)
      try {
        if (saveMode === "NEW") {
          await firebase.addData("appModules", {
            moduleName: moduleNameRef.current.value,
            moduleDesc: moduleDescRef.current.value,
          })
        }
        if (saveMode === "SET" && docId) {
          await firebase.setData("appModules", docId, {
            moduleName: moduleNameRef.current.value,
            moduleDesc: moduleDescRef.current.value,
          })
        }
        fetchData()
      } catch (error) {
        console.log(error)
        setIsError({ status: true, message: "Error while add app module" })
      }
      handleReset()
    }
  }

  const handleEditModule = async (e: React.FormEvent<HTMLButtonElement>, { moduleName, moduleDesc, docId }: ModuleModelType) => {
    e.preventDefault()
    setDocId(docId)
    setSaveMode("SET")
    if (moduleNameRef.current && moduleDescRef.current) {
      moduleNameRef.current.value = moduleName
      moduleDescRef.current.value = moduleDesc
    }
  }

  const handleDeleteModule = async (e: React.FormEvent<HTMLButtonElement>, docId: string) => {
    e.preventDefault()
    if (docId) {
      !isBusy && setIsBusy(true)
      try {
        await firebase.delData("appModules", docId)
        fetchData()
      } catch (error) {
        console.log(error)
        setIsError({ status: true, message: "Error while deleting app module" })
      }
      handleReset()
    }
  }

  const handleReset = () => {
    if (moduleNameRef.current !== null) moduleNameRef.current.value = ""
    if (moduleDescRef.current !== null) moduleDescRef.current.value = ""
    setSaveMode("NEW")
    setDocId("")
    setIsBusy(false)
    setIsError(isErrorInit)
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-bold">OpenApps PWA Modules</p>
        <Button variant="ghost" size="icon" onClick={() => rrNavigate(-1)}><ArrowLeft /></Button>
      </div>
      {isError.status ? (
        <div className="">
          <p className="text-red-400">Error fetching appModules from Firebase</p>
          <Button className="mt-3" variant="outline" onClick={() => {
            handleReset()
            fetchData()
          }}>Reset</Button>
        </div>
      ) : (
        <div className="">
          <form className="flex gap-5 justify-between items-center border border-slate-400 rounded-lg p-3" action="" onSubmit={handleSaveModule}>
            <div className="space-y-2 w-full">
              <Input className="" ref={moduleNameRef} placeholder="Module name" />
              <Input className="" ref={moduleDescRef} placeholder="Module description" />
            </div>
            <Button variant="ghost" size="icon" disabled={isBusy} onClick={handleSaveModule}><Save /></Button>
          </form>
          {appModules.map(v => {
            const data: ModuleModelType = {
              moduleName: v.document.moduleName,
              moduleDesc: v.document.moduleDesc || "No description",
              docId: v.id
            }
            return (
              <div key={data.docId} className="flex flex-row justify-between mt-3 p-2 border border-orange-800 rounded-lg">
                <div>
                  <p className="font-bold">{data.moduleName}</p>
                  <p>{data.moduleDesc}</p>
                  <p className="font-mono">{data.docId}</p>
                </div>
                <div className="flex flex-nowrap gap-1">
                  <Button variant="ghost" size="icon" disabled={isBusy} onClick={e => handleEditModule(e, data)}><Pencil /></Button>
                  <Button variant="ghost" size="icon" disabled={isBusy} onClick={e => handleDeleteModule(e, data.docId)}><Trash2 /></Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

