import Router from '@/routes/Router'

import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/context/AuthProvider'
import { FirestoreProvider } from "./context/FirestoreProvider"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FirestoreProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </FirestoreProvider>
    </ThemeProvider>
  )
}

