// import { useEffect, useRef, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  getFirestore,
  type DocumentData,
} from 'firebase/firestore';

import { firebaseConfig } from '@/lib/firebase';
import type { AppModuleDocType } from '@/lib/types';

type AppModuleListType = {
  id: string;
  doc: DocumentData;
}

// https://firebase.google.com/docs/firestore/query-data/get-data
// https://firebase.google.com/docs/firestore/manage-data/add-data

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function useAppModules() {

  // Get App Modules
  async function getAppModules(): Promise<AppModuleListType[]> {
    let appModuleList: AppModuleListType[] = [];
    const appModuleCol = collection(db, 'appModules');
    const appModuleSnapshot = await getDocs(appModuleCol);
    appModuleList = appModuleSnapshot.docs.map(doc => {
      return { id: doc.id, doc: doc.data() }
    });
    return appModuleList;
  }

  // Create new App Module
  async function addAppModule(appModuleName: string) {
    const appModuleCol = collection(db, 'appModules');
    const appModuleRef = await addDoc(appModuleCol, { moduleName: appModuleName });
    return appModuleRef;
  }

  // Update existing App Module
  async function updateAppModule(appModuleId: string, appModule: AppModuleDocType) {
    const appModuleRef = doc(db, 'appModules', appModuleId);
    setDoc(appModuleRef, { moduleName: appModule.moduleName, moduleDesc: appModule.moduleDesc }, { merge: true });
  }

  return {
    getAppModules: getAppModules,
    addAppModule: addAppModule,
    updateAppModule: updateAppModule,
  }
}
