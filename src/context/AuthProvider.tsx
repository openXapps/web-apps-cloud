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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type AuthContextType = {
  auth: Auth;
  currentUser: User | null;
  signUserIn: (email: string, password: string) => Promise<UserCredential>;
  signUserOut: (auth: Auth) => Promise<void>;
}

function signUserIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

function signUserOut(auth: Auth): Promise<void> {
  return signOut(auth);
}

const currentUser: User | null = null;

const AuthContext = createContext<AuthContextType>({
  auth: auth,
  currentUser: currentUser,
  signUserIn: signUserIn,
  signUserOut: signUserOut,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [])

  const value: AuthContextType = {
    auth: auth,
    currentUser: user,
    signUserIn: signUserIn,
    signUserOut: signUserOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}