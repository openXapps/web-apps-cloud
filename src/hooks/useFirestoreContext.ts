import { useContext } from "react"
import { FirestoreContext } from '@/context/FirestoreProvider'

export default function useFirestoreContext() {
  const context = useContext(FirestoreContext)
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider')
  }
  return context
}