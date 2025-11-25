// Generic Firestore model to be extended by app models
export type FirestoreModel = {
  id: string
  createdAt: Date
  updatedAt: Date
}

// /users/{userId}/bookmarker/{userId}/profiles/
export type BookmarkerProfile = FirestoreModel & {
  profileName: string
  isActive: boolean
}

// /appModules/
export type AppModule = FirestoreModel & {
  moduleName: string
  moduleDesc?: string
}

