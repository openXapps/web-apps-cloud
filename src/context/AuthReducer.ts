import { AuthContextState, AuthReducerActions } from '@/lib/types';

/**
 * Reducer function to mutate Auth state
 * @param {AuthContextState} state Current state
 * @param {AuthReducerActions} action Reducer action type and payload
 */
export default function AuthReducer(state: AuthContextState, action: AuthReducerActions): AuthContextState {

  // console.log('auth reducer: state.......', state);
  // console.log('auth reducer: action......', action);

  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: action.payload,
      };
    case 'SET_ISAUTHORIZED':
      return {
        ...state,
        isAuthorized: action.payload,
      };
    default:
      return state;
  };
}