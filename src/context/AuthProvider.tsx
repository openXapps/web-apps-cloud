import { createContext, useEffect, useReducer, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator
} from 'firebase/auth';

import { firebaseConfig } from '@/lib/firebase';
import type { AuthContextState, AuthContextType } from '@/lib/types';
import AuthReducer from '@/context/AuthReducer';

// PRODUCTION
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// DEVELOPMENT
connectAuthEmulator(auth, "http://127.0.0.1:9099");

const initAppContextState: AuthContextState = {
  auth: auth,
  isAuthorized: false,
};

export const AuthProviderContext = createContext<AuthContextType>({
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
