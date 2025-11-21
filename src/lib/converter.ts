import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "firebase/firestore"

import type { FirestoreModel, UsersBookmarkProfiles } from "./models"

/**
 * Creates a generic FirestoreDataConverter for any model that extends FirestoreModel.
 * It automatically adds the document "id" when reading data (fromFirestore)
 * and omits the "id" when writing data (toFirestore).
 *
 * @returns A generic FirestoreDataConverter<T>
 */
function createConverter<T extends FirestoreModel>(): FirestoreDataConverter<T> {
  return {
    // --- READ OPERATION (fromFirestore) ---
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T {
      const data = snapshot.data(options)!
      // Convert the data back to the type T and add the document ID
      return {
        ...data,
        id: snapshot.id, // Inject the document ID here
      } as T
    },

    // --- WRITE OPERATION (toFirestore) ---
    toFirestore(modelObject: T): DocumentData {
      // Destructure the object to exclude the "id" property before writing to Firestore
      const { id, ...data } = modelObject
      // Firestore only accepts plain objects, not DocumentData that includes the ID
      return data
    },
  }
}

export const profileConverter = createConverter<UsersBookmarkProfiles>()