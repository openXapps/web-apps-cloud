import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  Auth
} from 'firebase/auth';

import { firebaseConfig } from '@/lib/firebase';

// Check this tut out!
// https://medium.com/@yogeshmulecraft/building-a-react-app-with-firebase-authentication-using-authcontext-c749886678b2

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type AuthProviderContextType = {
  auth: Auth;
  currentUser: User | null;
}

const currentUser: User | null = null;

const AuthProviderContext = createContext<AuthProviderContextType>({
  auth: auth,
  currentUser: currentUser,
});

/**
 * Auth provider
 * @param param0 Children to be rendered within auth context provider
 * @returns React provider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
      console.log('onAuthStateChanged triggered');
    });
    return unsubscribe;
  }, [])

  const value: AuthProviderContextType = {
    auth: auth,
    currentUser: user,
  }

  return (
    <AuthProviderContext.Provider value={value}>
      {!loading && children}
    </AuthProviderContext.Provider>
  )
}

/**
 * Auth context hook
 * @returns AuthProviderContext and helper functions
 */
export function useAuth() {
  const context = useContext(AuthProviderContext)

  function signUserIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUserOut(auth: Auth): Promise<void> {
    return signOut(auth);
  }

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider")

  return {
    auth: context.auth,
    currentUser: context.currentUser,
    signUserIn: signUserIn,
    signUserOut: signUserOut,
  };
}