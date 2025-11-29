import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"

import useFirestore from "@/hooks/useFirestore"
import { appModuleConverter } from "@/lib/converter"
import type { AppModuleModel } from "@/lib/models"
import type { GetAllDocumentsProps } from "@/lib/types"

import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Modes = "NEW" | "SET"

const initCurrentAppModule: AppModuleModel = {
  moduleName: "",
  moduleDesc: "",
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function DataModules() {
  const rrNavigate = useNavigate()
  const { isLoading, getAllDocuments, addDocument, setDocument, deleteDocument } = useFirestore()
  const [currentAppModule, setCurrentAppModule] = useState<AppModuleModel>(initCurrentAppModule)
  const moduleNameRef = useRef<HTMLInputElement>(null)
  const moduleDescRef = useRef<HTMLInputElement>(null)
  const [appModules, setAppModules] = useState<AppModuleModel[]>([])
  const [saveMode, setSaveMode] = useState<Modes>("NEW")

  async function fetchData() {
    const data: GetAllDocumentsProps<AppModuleModel> = await getAllDocuments("/appModules/", appModuleConverter)
    setAppModules(data.payload)
    handleReset()
  }

  useEffect(() => {
    fetchData()

    return () => { }
  }, [])

  const handleSaveModule = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

    if (saveMode === "NEW" && moduleNameRef.current?.value) {
      await addDocument("/appModules/", {
        moduleName: moduleNameRef.current.value,
        moduleDesc: moduleDescRef.current?.value || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: ""
      }, appModuleConverter)
      handleReset()
      fetchData()
    }

    if (saveMode === "SET" && moduleNameRef.current?.value) {
      await setDocument("/appModules/", currentAppModule.id, {
        moduleName: moduleNameRef.current.value,
        moduleDesc: moduleDescRef.current?.value || null,
        createdAt: currentAppModule.createdAt,
        updatedAt: new Date(),
        id: currentAppModule.id
      }, appModuleConverter)
      handleReset()
      fetchData()
    }
  }

  const handleDeleteModule = async (e: React.FormEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault()
    await deleteDocument("/appModules/", appModules[index].id)
    fetchData()
  }

  const handleEditModule = async (e: React.FormEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault()
    setSaveMode("SET")
    setCurrentAppModule(appModules[index])
    if (moduleNameRef.current && moduleDescRef.current) {
      moduleNameRef.current.value = appModules[index].moduleName
      moduleDescRef.current.value = appModules[index].moduleDesc || ""
    }
  }

  const handleReset = () => {
    if (moduleNameRef.current !== null) moduleNameRef.current.value = ""
    if (moduleDescRef.current !== null) moduleDescRef.current.value = ""
    setSaveMode("NEW")
    setCurrentAppModule(initCurrentAppModule)
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-bold">App Modules</p>
        <Button variant="ghost" size="icon" onClick={() => rrNavigate(-1)}><ArrowLeft /></Button>
      </div>

      <div className="">
        <form className="flex gap-5 justify-between items-center border border-slate-400 rounded-lg p-3" action="" onSubmit={handleSaveModule}>
          <div className="space-y-2 w-full">
            <Input className="" ref={moduleNameRef} placeholder="Module name" />
            <Input className="" ref={moduleDescRef} placeholder="Module description" />
          </div>
          <Button type="submit" variant="ghost" size="icon" disabled={isLoading} onClick={handleSaveModule}><Save /></Button>
        </form>

        {isLoading && <p className="mt-3">Loading...</p>}

        {appModules.map((v, i) => {
          return (
            <div key={v.id} className="flex flex-row justify-between mt-3 p-2 border border-orange-800 rounded-lg">
              <div className="space-y-1">
                <p className="font-bold">{v.moduleName}</p>
                <p>{v.moduleDesc || "No description"}</p>
                <p className="font-mono">{v.id}</p>
              </div>
              <div className="flex flex-nowrap gap-1">
                <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleEditModule(e, i)}><Pencil /></Button>
                <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleDeleteModule(e, i)}><Trash2 /></Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

