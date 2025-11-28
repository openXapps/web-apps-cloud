import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"

import useFirestore from "@/hooks/useFirestore"
import { appModuleConverter } from "@/lib/converter"
import type { AppModuleModel } from "@/lib/models"
import type { GetAllDocumentsProps } from "@/lib/types"

import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// type Modes = "NEW" | "SET"

// const initCurrentAppModule: AppModuleModel = {
//   moduleName: "",
//   moduleDesc: "",
//   id: "",
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }

export default function DataModules() {
  // const appModulesHook = useAppModules();
  const rrNavigate = useNavigate()
  const { isLoading, getAllDocuments, addDocument, setDocument } = useFirestore()
  // const [currentAppModule, setCurrentAppModule] = useState<AppModuleModel>(initCurrentAppModule)
  const moduleNameRef = useRef<HTMLInputElement | null>(null)
  const moduleDescRef = useRef<HTMLInputElement | null>(null)
  const [appModules, setAppModules] = useState<AppModuleModel[]>([])
  // const [saveMode, setSaveMode] = useState<Modes>("NEW")
  // const [isError, setIsError] = useState(isErrorInit)
  // const [isBusy, setIsBusy] = useState(false)

  async function fetchData() {
    // !isBusy && setIsBusy(true)
    const data: GetAllDocumentsProps<AppModuleModel> = await getAllDocuments("/appModules/", appModuleConverter)
    setAppModules(data.payload)
    // firebase.getData("appModules").then(data => {
    //   setAppModules(data)
    //   isError && setIsError(isErrorInit)
    // }).catch((error) => {
    //   console.log(error)
    //   setIsError({ status: true, message: "Fetch app modules error" })
    // })
    handleReset()
  }

  useEffect(() => {
    fetchData()

    return () => { }
  }, [])

  const handleSaveModule = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

    // if (saveMode === "NEW") {
    //   await addDocument("/appModules/", {
    //     profileName: profileName,
    //     isActive: profileIsActive,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     id: ""
    //   }, appModuleConverter)
    //   handleReset()
    // console.log(result.path)
  // }

  // if (saveMode === "SET") {
  //   await setDocument("/appModules/", currentProfile.id, {
  //     profileName: profileName,
  //     isActive: profileIsActive,
  //     createdAt: currentProfile.createdAt,
  //     updatedAt: new Date(),
  //     id: currentProfile.id
  //   }, appModuleConverter)
  //   handleReset()
// }
    // if (moduleNameRef.current?.value && moduleDescRef.current?.value) {
    //   !isBusy && setIsBusy(true)
    //   try {
    //     if (saveMode === "NEW") {
    //       await firebase.addData("appModules", {
    //         moduleName: moduleNameRef.current.value,
    //         moduleDesc: moduleDescRef.current.value,
    //       })
    //     }
    //     if (saveMode === "SET" && docId) {
    //       await firebase.setData("appModules", docId, {
    //         moduleName: moduleNameRef.current.value,
    //         moduleDesc: moduleDescRef.current.value,
    //       })
    //     }
    //     fetchData()
    //   } catch (error) {
    //     console.log(error)
    //     setIsError({ status: true, message: "Error while add app module" })
    //   }
    //   handleReset()
    // }
  }

const handleEditModule = async (e: React.FormEvent<HTMLButtonElement>, index: number) => {
  e.preventDefault()
  // setDocId(docId)
  // setSaveMode("SET")
  // if (moduleNameRef.current && moduleDescRef.current) {
  //   moduleNameRef.current.value = moduleName
  //   moduleDescRef.current.value = moduleDesc
  // }
}

const handleDeleteModule = async (e: React.FormEvent<HTMLButtonElement>, index: number) => {
  e.preventDefault()
  if (index) {
    // !isBusy && setIsBusy(true)
    // try {
    //   await firebase.delData("appModules", docId)
    //   fetchData()
    // } catch (error) {
    //   console.log(error)
    //   setIsError({ status: true, message: "Error while deleting app module" })
    // }
    // handleReset()
  }
}

const handleReset = () => {
  // if (moduleNameRef.current !== null) moduleNameRef.current.value = ""
  // if (moduleDescRef.current !== null) moduleDescRef.current.value = ""
  // setSaveMode("NEW")
  // setDocId("")
  // setIsBusy(false)
  // setIsError(isErrorInit)
}

return (
  <div className="p-3 space-y-3">
    <div className="flex justify-between items-center">
      <p className="font-bold">OpenApps PWA Modules</p>
      <Button variant="ghost" size="icon" onClick={() => rrNavigate(-1)}><ArrowLeft /></Button>
    </div>

    <div className="">
      <form className="flex gap-5 justify-between items-center border border-slate-400 rounded-lg p-3" action="" onSubmit={handleSaveModule}>
        <div className="space-y-2 w-full">
          <Input className="" ref={moduleNameRef} placeholder="Module name" />
          <Input className="" ref={moduleDescRef} placeholder="Module description" />
        </div>
        <Button variant="ghost" size="icon" disabled={isLoading} onClick={handleSaveModule}><Save /></Button>
      </form>

      {isLoading && <p className="mt-3">Loading...</p>}

      {appModules.map((v, i) => {
        return (
          <div key={v.id} className="flex flex-row justify-between mt-3 p-2 border border-orange-800 rounded-lg">
            <div>
              <p className="font-bold">{v.moduleName}</p>
              <p>{v.moduleDesc}</p>
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

