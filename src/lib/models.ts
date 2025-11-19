import type { FieldValue, Timestamp } from "firebase/firestore"

// /users/{userId}/bookmarker/{userId}/profiles/
export type UsersBookmarkProfilesApp = {
  profileId: string
  profileName: string
  isActive: boolean
  createdAt: Date | FieldValue
}

// /users/{userId}/bookmarker/{userId}/profiles/
export type UsersBookmarkProfilesAppX = {
  profileName: string
  isActive: boolean
}

// FS model - /users/{userId}/bookmarker/{userId}/profiles/
export type UsersBookmarkProfilesFS = {
  profileName: string
  isActive: boolean
  createdAt: Timestamp
}

