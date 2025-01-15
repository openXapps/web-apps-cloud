import { useContext } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  type UserCredential,
  type Auth,
  type User,
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

  function getUID(): string | undefined {
    return context.state.auth.currentUser?.uid;
  }

  function getInfo(): UserInfoType {
    if (context.state.auth.currentUser) {
      const user: User = context.state.auth.currentUser;
      return {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        emailVerified: user.emailVerified,
      }
    }
    return {
      displayName: null,
      photoURL: null,
      email: null,
      emailVerified: false
    }
  }

  function setInfo(info: UserInfoType): Promise<void> {
    if (context.state.auth.currentUser !== null) {
      const user: User = {
        ...context.state.auth.currentUser,
        displayName: info.displayName,
        photoURL: info.photoURL,
        email: info.email,
      }
      return updateProfile(context.state.auth.currentUser, user);
    }
    return Promise.resolve();
  }

  function setEmail(newEmail: string): Promise<void> {
    if (context.state.auth.currentUser !== null)
      return updateEmail(context.state.auth.currentUser, newEmail);
    return Promise.resolve();
  }

  function setPassword(newPassword: string): Promise<void> {
    if (context.state.auth.currentUser !== null)
      return updatePassword(context.state.auth.currentUser, newPassword);
    return Promise.resolve();
  }

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return {
    auth: context.state.auth,
    isAuthorized: context.state.isAuthorized,
    setAuthorized: setAuthorized,
    signUserIn: signUserIn,
    signUserOut: signUserOut,
    getUID: getUID,
    getInfo: getInfo,
    setInfo: setInfo,
    setEmail: setEmail,
    setPassword: setPassword,
  };
}