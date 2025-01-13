import { useContext } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
  type Auth,
  type User
} from 'firebase/auth';

import { auth, AuthProviderContext } from '@/context/AuthProvider';
import type { UserInfoType } from '@/lib/types';

/**
 * Auth context hook
 * @returns AuthProviderContext and helper functions
 */
export default function useAuth() {
  const context = useContext(AuthProviderContext);

  function signUserIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUserOut(auth: Auth): Promise<void> {
    return signOut(auth);
  }

  function setAuthorized(value: boolean) {
    context.dispatch({ type: 'SET_ISAUTHORIZED', payload: value });
  }

  function getInfo(): UserInfoType {
    const user = context.state.auth.currentUser;
    return {
      displayName: user?.displayName || null,
      email: user?.email || null,
      phone: user?.phoneNumber || null,
      photoURL: user?.photoURL || null,
      emailVerified: user?.emailVerified || false,
    }
  }

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return {
    auth: context.state.auth,
    isAuthorized: context.state.isAuthorized,
    setAuthorized: setAuthorized,
    signUserIn: signUserIn,
    signUserOut: signUserOut,
    getInfo: getInfo,
  };
}