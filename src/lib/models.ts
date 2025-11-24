import type { Timestamp } from "firebase/firestore"

// Generic Firestore model to be extended by app models
export type FirestoreModel = {
  id?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// /appModules/
export type AppModule = FirestoreModel & {
  moduleName: string
  moduleDesc?: string
}

// /users/{userId}/bookmarker/{userId}/profiles/
export type BookmarkerProfile = FirestoreModel & {
  profileName: string
  isActive: boolean
}

