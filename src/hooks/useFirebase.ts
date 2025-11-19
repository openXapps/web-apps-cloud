import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  type DocumentData,
  type CollectionReference,
  type DocumentReference,
} from 'firebase/firestore'

import { useFirestore } from "@/hooks/useFirestore"

// https://firebase.google.com/docs/firestore/query-data/get-data
// https://firebase.google.com/docs/firestore/manage-data/add-data
// https://javascript.plainenglish.io/mastering-firestore-converters-with-typescript-d433827a38c2

type DocType = {
  docId?: string
  document: DocumentData
}

export default function useFirebase() {
  const { db } = useFirestore()

  /**
   * Fetch documents from a collection
   * @param {string} fbPath Firebase database path string
   * @returns Firebase DocType object
   */
  async function getData(fbPath: string): Promise<DocType[]> {
    let docList: DocType[] = []
    const docCollection: CollectionReference<DocumentData, DocumentData> = collection(db, fbPath)
    const docSnapshot = await getDocs(docCollection)
    docList = docSnapshot.docs.map(doc => {
      return { id: doc.id, document: doc.data() }
    })
    return docList
  }

  /**
   * Create new document in a collection
   * @param {string} fbPath Firebase database path string
   * @param {DocumentData} fbDoc Document data consists of fields mapped to values
   * @returns Reference to new document
   */
  async function addData(fbPath: string, fbDoc: DocumentData): Promise<DocumentReference<DocumentData, DocumentData>> {
    const docCollection = collection(db, fbPath)
    return addDoc(docCollection, fbDoc)
  }

  /**
   * Update an existing document in a collection
   * @param {string} fbPath Firebase database path string
   * @param {string} docId Document Id to update
   * @param {any} fbDoc Document data consists of fields mapped to values
   * @returns REmpty Promise
   */
  async function setData(fbPath: string, docId: string, fbDoc: DocumentData): Promise<void> {
    const docRef = doc(db, fbPath, docId)
    return setDoc(docRef, fbDoc)
  }

  /**
 * Delete an existing document in a collection
 * @param {string} fbPath Firebase database path string
 * @param {string} docId Document Id to delete
 * @returns Empty Promise
 */
  async function delData(fbPath: string, docId: string): Promise<void> {
    const docRef = doc(db, fbPath, docId)
    return deleteDoc(docRef)
  }

  return {
    getData: getData,
    addData: addData,
    setData: setData,
    delData: delData,
  }
}
