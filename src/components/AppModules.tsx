import { useEffect, useRef, useState } from 'react';
import { type DocumentData } from 'firebase/firestore';

import useAppModules from '@/hooks/useAppModules';

import { Plus } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';

type AppModuleListType = {
  id: string;
  doc: DocumentData;
}

const isErrorInit: { status: boolean, message: string } = { status: false, message: '' };
// const isErrorInit: { status: boolean, message: string } = { status: true, message: 'Test' };

export default function AppModules() {
  const appModulesHook = useAppModules();
  const [appModules, setAppModules] = useState<AppModuleListType[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isError, setIsError] = useState(isErrorInit);
  const [isBusy, setIsBusy] = useState(false);

  function fetchData() {
    !isBusy && setIsBusy(true);
    appModulesHook.getAppModules().then(data => {
      setAppModules(data);
      isError && setIsError(isErrorInit);
    }).catch((error) => {
      console.log(error);
      setIsError({ status: true, message: 'Fetch app modules error' });
    })
    handleReset();
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleAddNewModule = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    let result: string = '';
    if (inputRef.current?.value) {
      !isBusy && setIsBusy(true);
      try {
        result = (await appModulesHook.addAppModule(inputRef.current.value)).id;
        console.log(result);
        fetchData();
      } catch (error) {
        console.log(error);
        setIsError({ status: true, message: 'Error while add app module' });
      }
      handleReset();
    }
  }

  const handleUpdateModule = async () => {
    await appModulesHook.updateAppModule('9Nbw2Y4PfwJyZg2EzSAJ', {
      moduleName: 'myLIST',
      moduleDesc: 'Cool PWA to generate ToDo or Shopping lists'
    });
  }

  const handleReset = () => {
    if (inputRef.current !== null) inputRef.current.value = '';
    setIsBusy(false);
    setIsError(isErrorInit);
  }

  return (
    <div>
      <p className="pb-2">OpenApps PWA Modules</p>
      {isError.status ? (
        <div>
          <p className="text-red-400">Error fetching appModules from Firebase</p>
          <Button className="mt-3" variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      ) : (
        <div>
          <form className="flex gap-2" action="" onSubmit={handleAddNewModule}>
            <Input className="w-40" ref={inputRef} placeholder="Module name" />
            <Button variant="outline" size="icon" disabled={isBusy} onClick={handleAddNewModule}><Plus /></Button>
          </form>
          <ul className="mt-3">
            {appModules.map((v, i) => (
              <ul key={i}>{`${v.doc.moduleName} (${v.id}) ${v.doc.moduleDesc}`}</ul>
            ))}
          </ul>
          <Button onClick={handleUpdateModule}>Update</Button>
        </div>
      )}
    </div>
  )
}

