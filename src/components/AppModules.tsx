import { useEffect, useRef, useState } from 'react';
import { type DocumentData } from 'firebase/firestore';

// import useAppModules from '@/hooks/useAppModules';
import useFirebase from '@/hooks/useFirebase';

import { Pencil, Save, Trash2 } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';

const isErrorInit: { status: boolean, message: string } = { status: false, message: '' };
// const isErrorInit: { status: boolean, message: string } = { status: true, message: 'Test' };

type Modes = 'NEW' | 'SET';

export default function AppModules() {
  // const appModulesHook = useAppModules();
  const firebase = useFirebase();
  const moduleNameRef = useRef<HTMLInputElement | null>(null);
  const moduleDescRef = useRef<HTMLInputElement | null>(null);
  const [appModules, setAppModules] = useState<DocumentData[]>([]);
  const [saveMode, setSaveMode] = useState<Modes>('NEW');
  const [isError, setIsError] = useState(isErrorInit);
  const [isBusy, setIsBusy] = useState(false);

  function fetchData() {
    !isBusy && setIsBusy(true);
    firebase.getData('appModules').then(data => {
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

  const handleSaveModule = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    let result: string = '';
    if (moduleNameRef.current?.value && moduleDescRef.current?.value) {
      !isBusy && setIsBusy(true);
      try {
        if (saveMode === 'NEW') {
          result = (await firebase.addData('appModules', {
            moduleName: moduleNameRef.current.value,
            moduleDesc: moduleDescRef.current.value,
          })).id;
        }
        if (saveMode === 'SET') {
          
        }
        console.log(result);
        fetchData();
      } catch (error) {
        console.log(error);
        setIsError({ status: true, message: 'Error while add app module' });
      }
      handleReset();
    }
  }

  // const handleUpdateModule = async () => {
  //   await firebase.setData('appModules', '9Nbw2Y4PfwJyZg2EzSAJ', {
  //     moduleName: 'myLIST',
  //     moduleDesc: 'Cool PWA to generate ToDo or Shopping lists'
  //   });
  //   fetchData();
  // }

  const handleReset = () => {
    if (moduleNameRef.current !== null) moduleNameRef.current.value = '';
    if (moduleDescRef.current !== null) moduleDescRef.current.value = '';
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
          <form className="flex gap-5 justify-between items-center border rounded-lg p-3" action="" onSubmit={handleSaveModule}>
            <div className="space-y-2 w-full">
              <Input className="" ref={moduleNameRef} placeholder="Module name" />
              <Input className="" ref={moduleDescRef} placeholder="Module description" />
            </div>
            <Button variant="ghost" size="icon" disabled={isBusy} onClick={handleSaveModule}><Save /></Button>
          </form>
          {appModules.map(v => (
            <div key={v.id} className="flex flex-row justify-between mt-3 p-2 border rounded-lg">
              <div>
                <p className="font-bold">{v.document.moduleName}</p>
                <p>{v.document.moduleDesc}</p>
                <p className="font-mono">{v.id}</p>
              </div>
              <div className="space-x-1">
                <Button variant="ghost" size="icon" disabled={isBusy}><Pencil /></Button>
                <Button variant="ghost" size="icon" disabled={isBusy}><Trash2 /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

