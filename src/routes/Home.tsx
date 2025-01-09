
import { Link } from 'react-router';

import { useAuth } from '@/context/AuthProvider';

import CloudModules from '@/components/CloudModules';

export default function Home() {
  const { auth, isAuthorized } = useAuth();

  return (
    <div className='p-5'>
      {isAuthorized ? (
        <div>
          <h1 className="mb-3">Welcome {auth.currentUser?.email}</h1>
          <CloudModules />
        </div>
      ) : (
        <div className='flex gap-3'>
          <p>You are not signed in, please</p>
          <Link to="/signin">Sign In</Link>
        </div>
      )}
    </div>
  )
}
