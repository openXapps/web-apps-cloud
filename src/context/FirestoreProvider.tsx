import { createContext } from "react"
import type { Firestore } from "firebase/firestore"
import { db } from "@/lib/firebase"

type FirestoreContextType = {
  db: Firestore
}

export const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined)

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirestoreContext.Provider value={{ db }}>
      {children}
    </FirestoreContext.Provider>
  )
}


