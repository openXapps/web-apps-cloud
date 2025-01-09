import type { Auth } from 'firebase/auth';

/**
 * Auth context state type
 */
export type AuthContextState = {
  auth: Auth;
  isAuthorized: boolean;
}

type AuthReducerSetAuth = {
  type: 'SET_AUTH';
  payload: Auth;
}

// Placeholder context for later use
type AuthReducerSetPlaceholder = {
  type: 'SET_ISAUTHORIZED';
  payload: boolean;
}

/**
 * Auth reducer action type
 */
export type AuthReducerActions = AuthReducerSetAuth | AuthReducerSetPlaceholder;

/**
 * Auth context type
 */
export type AuthContextType = {
  state: AuthContextState;
  dispatch: React.Dispatch<AuthReducerActions>;
}