
import { Link } from 'react-router';

import useAuth from '@/hooks/useAuth';

import AppModules from '@/components/AppModules';
import AppBookmarks from '@/components/AppBookmarks';

export default function Home() {
  const { auth, isAuthorized } = useAuth();

  return (
    <div className="p-3">
      {isAuthorized ? (
        <div>
          <h1 className="mb-3">Welcome {auth.currentUser?.displayName || 'NO NAME'}</h1>
          <AppModules />
          <div className="my-8 h-1 bg-slate-700"></div>
          <AppBookmarks />
          <div className="my-8 h-1 bg-slate-700"></div>
        </div>
      ) : (
        <div className='flex gap-3'>
          <p>You are not signed in, please <span><Link className="text-orange-400" to="/signin">Sign In</Link></span></p>
          
        </div>
      )}
    </div>
  )
}
