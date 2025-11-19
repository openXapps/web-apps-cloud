import {
  serverTimestamp,
  QueryDocumentSnapshot,
  SnapshotOptions,
  type Timestamp,
} from "firebase/firestore"

import type { UsersBookmarkProfilesAppX } from "@/lib/models"

// https://javascript.plainenglish.io/mastering-firestore-converters-with-typescript-d433827a38c2

export const converter = <T extends { createdAt: Timestamp }>() => {
  return {
    toFirestore: (item: T) => {
      return {
        ...item,
        createdAt: serverTimestamp()
      }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<T>, options?: SnapshotOptions) => {
      const data = snapshot.data(options)
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate()
      }
    }
  }
}

export const profileFsConverter = converter<UsersBookmarkProfilesAppX>()