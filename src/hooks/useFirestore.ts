import { useContext } from "react"
import { FirestoreContext } from '@/context/FirestoreProvider'

export const useFirestore = () => {
  const context = useContext(FirestoreContext)
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider')
  }
  return context
}