import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  Auth
} from 'firebase/auth';

import { firebaseConfig } from '@/lib/firebase';
import type { AuthContextState, AuthContextType } from '@/lib/types';
import AuthReducer from './AuthReducer';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const initAppContextState: AuthContextState = {
  auth: auth,
  isAuthorized: false,
};

const AuthProviderContext = createContext<AuthContextType>({
  state: initAppContextState,
  dispatch: () => { },
});

/**
 * Auth provider
 * @param param0 Children to be rendered within auth context provider
 * @returns React provider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(AuthReducer, initAppContextState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = state.auth.onAuthStateChanged(user => {
      // console.log('onAuthStateChanged triggered: ', state.auth);
      setLoading(false);
      dispatch({ type: 'SET_ISAUTHORIZED', payload: user != null })
    });
    return unsubscribe;
  }, [])

  return (
    <AuthProviderContext.Provider value={{ state, dispatch }}>
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

  function setAuthorized(value: boolean) {
    context.dispatch({ type: 'SET_ISAUTHORIZED', payload: value });
  }

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider")

  return {
    auth: context.state.auth,
    isAuthorized: context.state.isAuthorized,
    setAuthorized: setAuthorized,
    signUserIn: signUserIn,
    signUserOut: signUserOut,
  };
}