import { useState } from "react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  type FirestoreDataConverter,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore'

import useFirestoreContext from "@/hooks/useFirestoreContext"
import type { GetAllDocumentsProps, GetDocumentProps } from "@/lib/types"

// https://firebase.google.com/docs/firestore/query-data/get-data
// https://firebase.google.com/docs/firestore/manage-data/add-data
// https://javascript.plainenglish.io/mastering-firestore-converters-with-typescript-d433827a38c2

export default function useFirestore() {
  const { db } = useFirestoreContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * Fetch a document from a collection
   */
  async function getDocument<T>(path: string, id: string, converter: FirestoreDataConverter<T>): Promise<GetDocumentProps<T>> {
    setIsLoading(true)
    let response: GetDocumentProps<T> = { message: "No document found", ok: false, payload: <T>{} }
    const docRef = doc(db, path, id).withConverter(converter)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      response = { ok: true, message: "", payload: docSnap.data() }
    }
    setIsLoading(false)
    return response
  }

  /**
   * Fetch documents from a collection
   */
  async function getAllDocuments<T>(path: string, converter: FirestoreDataConverter<T>): Promise<GetAllDocumentsProps<T>> {
    setIsLoading(true)
    let response: GetAllDocumentsProps<T> = { message: "No documents found", ok: false, payload: [] }
    let documents: T[] = []
    const querySnap = await getDocs(collection(db, path).withConverter(converter))

    if (!querySnap.empty) {
      querySnap.forEach((document) => documents.push(document.data()))
      response = { ok: true, message: "", payload: documents }
    }
    setIsLoading(false)
    return response
  }

  /**
   * Create new document in a collection
   */
  async function addDocument<T>(path: string, payload: T, converter: FirestoreDataConverter<T>): Promise<DocumentReference<T, DocumentData>> {
    const docCollection = collection(db, path).withConverter(converter)
    return addDoc(docCollection, payload)
  }

  /**
   * Update an existing document in a collection
   */
  async function setDocument<T>(path: string, id: string, payload: T, converter: FirestoreDataConverter<T>): Promise<void> {
    const docRef = doc(db, path, id).withConverter(converter)
    return setDoc(docRef, payload)
  }

  /**
 * Delete an existing document in a collection
 */
  async function deleteDocument(path: string, id: string): Promise<void> {
    const docRef = doc(db, path, id)
    return deleteDoc(docRef)
  }

  return {
    isLoading,
    getDocument: getDocument,
    getAllDocuments: getAllDocuments,
    addDocument: addDocument,
    setDocument: setDocument,
    deleteDocument: deleteDocument,
  }
}
