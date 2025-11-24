import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  // setDoc,
  // deleteDoc,
  // type DocumentData,
  // type CollectionReference,
  // type DocumentReference,
  type FirestoreDataConverter,
} from 'firebase/firestore'

import useFirestoreContext from "@/hooks/useFirestoreContext"
import { useState } from "react"

// https://firebase.google.com/docs/firestore/query-data/get-data
// https://firebase.google.com/docs/firestore/manage-data/add-data
// https://javascript.plainenglish.io/mastering-firestore-converters-with-typescript-d433827a38c2

export default function useFirestore() {
  const { db } = useFirestoreContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Fetch a document from a collection
   * @param {string} path Firestore database path
   * @returns Firestore document object
   */
  async function getDocument<T>(path: string, id: string, converter: FirestoreDataConverter<T>): Promise<T | undefined> {
    setIsLoading(true)
    let document: T | undefined = undefined
    const docRef = doc(db, path, id).withConverter(converter)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data())
      document = docSnap.data()
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!")
    }
    setIsLoading(false)
    return document
  }

  /**
   * Fetch documents from a collection
   * @param {string} path Firestore database path
   * @returns Firestore DocType object
   */
  async function getAllDocuments<T>(path: string, converter: FirestoreDataConverter<T>): Promise<T[]> {
    setIsLoading(true)
    let documents: T[] = []
    const querySnap = await getDocs(collection(db, path).withConverter(converter))
    
    querySnap.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data())
      documents.push(document.data())
    })
    setIsLoading(false)
    return documents
  }

  /**
   * Create new document in a collection
   * @param {string} path Firestore database path
   * @param {DocumentData} payload Document object
   * @returns Reference to new document
   */
  async function addDocument<T>(path: string, payload: T, converter: FirestoreDataConverter<T>) {
    const docCollection = collection(db, path).withConverter(converter)
    return addDoc(docCollection, payload)
  }

  /**
   * Update an existing document in a collection
   * @param {string} fbPath Firestore database path string
   * @param {string} docId Document Id to update
   * @param {any} fbDoc Document data consists of fields mapped to values
   * @returns REmpty Promise
   */
  // async function setData(fbPath: string, docId: string, fbDoc: DocumentData): Promise<void> {
  //   const docRef = doc(db, fbPath, docId)
  //   return setDoc(docRef, fbDoc)
  // }

  /**
 * Delete an existing document in a collection
 * @param {string} fbPath Firestore database path string
 * @param {string} docId Document Id to delete
 * @returns Empty Promise
 */
  // async function delData(fbPath: string, docId: string): Promise<void> {
  //   const docRef = doc(db, fbPath, docId)
  //   return deleteDoc(docRef)
  // }

  return {
    isLoading,
    getDocument: getDocument,
    getAllDocuments: getAllDocuments,
    addDocument: addDocument,
    // setData: setData,
    // delData: delData,
  }
}
