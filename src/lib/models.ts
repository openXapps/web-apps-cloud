import type { Timestamp } from "firebase/firestore"

// Generic Firestore model
export type FirestoreModel = {
  id?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// /appModules/
export type AppModules = FirestoreModel & {
  moduleName: string
  moduleDesc?: string
}

// /users/{userId}/bookmarker/{userId}/profiles/
export type BookmarkerProfiles = FirestoreModel & {
  profileName: string
  isActive: boolean
}

