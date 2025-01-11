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
  type CollectionReference,
  type DocumentReference,
} from 'firebase/firestore';

import { firebaseConfig } from '@/lib/firebase';

// https://firebase.google.com/docs/firestore/query-data/get-data
// https://firebase.google.com/docs/firestore/manage-data/add-data

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type DocType = {
  docId?: string;
  document: DocumentData;
}

export default function useFirebase() {

  /**
   * Fetch documents from a collection
   * @param {string} fbPath Firebase database path string
   * @returns Firebase DocType object
   */
  async function getData(fbPath: string): Promise<DocType[]> {
    let docList: DocType[] = [];
    const docCollection: CollectionReference<DocumentData, DocumentData> = collection(db, fbPath);
    const docSnapshot = await getDocs(docCollection);
    docList = docSnapshot.docs.map(doc => {
      return { id: doc.id, document: doc.data() }
    });
    return docList;
  }

  /**
   * Create new document in a collection
   * @param {string} fbPath Firebase database path string
   * @returns Reference to new document
   */
  async function addData(fbPath: string, fbDoc: DocumentData): Promise<DocumentReference<DocumentData, DocumentData>> {
    const docCollection = collection(db, fbPath);
    const docRef = await addDoc(docCollection, fbDoc);
    return docRef;
  }

  /**
   * Update an existing document in a collection
   * @param {string} fbPath Firebase database path string
   * @param {string} docId Document Id to update
   * @param {any} fbDoc Document to data
   * @returns Reference to new document
   */
  async function setData(fbPath: string, docId: string, fbDoc: DocumentData): Promise<DocumentReference<DocumentData, DocumentData>> {
    const docRef = doc(db, fbPath, docId);
    setDoc(docRef, fbDoc);
    return docRef;
  }

  return {
    getData: getData,
    addData: addData,
    setData: setData,
  }
}
