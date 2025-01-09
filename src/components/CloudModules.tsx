import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';

import { firebaseConfig } from '@/lib/firebase';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function getAppModules(db: Firestore) {
  const appModuleCol = collection(db, 'appModules');
  const appModuleSnapshot = await getDocs(appModuleCol);
  const appModuleList = appModuleSnapshot.docs.map(doc => doc.data());
  return appModuleList;
}

// https://firebase.google.com/docs/firestore/query-data/get-data

export default function CloudModules() {
  const [appModules, setAppModules] = useState<DocumentData[]>([]);

  useEffect(() => {
    getAppModules(db).then(data => {
      console.log(data);
      setAppModules(data);
    })
  }, [])

  return (
    <div>
      <p className="text-lg">List of App Modules</p>
      <ul>
        {appModules.map((v, i) => (
          <ul key={i}>{v.moduleName}</ul>
        ))}
      </ul>
    </div>
  )
}
