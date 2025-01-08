
import { useAuth } from '@/context/AuthProvider';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export default function Home() {
  const { currentUser, signUserOut, auth } = useAuth();

  const handleSignUserOut = async () => {
    try {
      await signUserOut(auth);
    } catch (error) {

    }
  }

  return (
    <div className='p-5'>
      {currentUser ? (
        <div>
          <h1 className="mb-3">Welcome {currentUser.email}</h1>
          <Button className='w-40' onClick={handleSignUserOut}>Sign Out</Button>
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
