import type { FieldValue, Timestamp } from "firebase/firestore"

// Generic Firestore model
export type FirestoreModel = {
  id?: string
  // Other potential common fields like 'createdAt' or 'updatedAt'
}

// /users/{userId}/bookmarker/{userId}/profiles/
export type UsersBookmarkProfiles = FirestoreModel & {
  profileId: string
  profileName: string
  isActive: boolean
}

// /users/{userId}/bookmarker/{userId}/profiles/
export type UsersBookmarkProfilesAppX = {
  id: string
  profileName: string
  isActive: boolean
  createdAt: Date | FieldValue
}

// FS model - /users/{userId}/bookmarker/{userId}/profiles/
export type UsersBookmarkProfilesFS = {
  profileName: string
  isActive: boolean
  createdAt: Timestamp
}

