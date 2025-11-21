import {
  serverTimestamp,
  QueryDocumentSnapshot,
  SnapshotOptions,
  type DocumentData,
} from "firebase/firestore"

import type { UsersBookmarkProfilesAppX } from "@/lib/models"

// https://javascript.plainenglish.io/mastering-firestore-converters-with-typescript-d433827a38c2

// Data sent to Firestore
function toFirestore<T>(data: Partial<T>): DocumentData {
  return {
    ...data,
    createdAt: serverTimestamp()
  }
}

// Data received back from Firestore
function fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions) {
  const data: DocumentData = snapshot.data(options)
  return {
    ...data,
    id: snapshot.id,
    createdAt: data.createdAt?.toDate()
  }
}

function converter<T>() {
  return {
    toFirestore: toFirestore<T>,
    fromFirestore: fromFirestore
  }
}

export const createProfileConverter = converter<UsersBookmarkProfilesAppX>()