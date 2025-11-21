import {
  serverTimestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore"

import { UsersBookmarkProfilesApp, UsersBookmarkProfilesFS } from "@/lib/models"

export const converter: FirestoreDataConverter<UsersBookmarkProfilesApp> = {
  // Convert from your App Model (UsersBookmarkProfilesApp) to Firestore Data (UsersBookmarkProfilesFS)
  toFirestore: (data: WithFieldValue<UsersBookmarkProfilesApp>): UsersBookmarkProfilesFS => {
    // Exclude the "profileId" when sending data to Firestore
    return {
      profileName: data.profileName as any,
      isActive: data.isActive as any,
      createdAt: serverTimestamp() as any
    }
  },

  // Convert from Firestore Snapshot (UsersBookmarkProfilesFS) to your App Model (UsersBookmarkProfilesApp)
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<UsersBookmarkProfilesFS>,
    options: SnapshotOptions
  ): UsersBookmarkProfilesApp => {
    const data = snapshot.data(options)

    // Convert Firestore Timestamp to JavaScript Date
    const createdAtDate = data.createdAt
      ? data.createdAt.toDate()
      : new Date()

    return {
      profileId: snapshot.id, // Inject the document ID into your model
      profileName: data.profileName,
      isActive: data.isActive,
      createdAt: createdAtDate,
    }
  },
}
