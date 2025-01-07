
import { useAuth } from '@/context/AuthProvider';
import { Link } from 'react-router';

export default function Home() {
  const { currentUser } = useAuth();



  return (
    <div className='p-5'>
      {currentUser ? (
        <p>Welcome {currentUser.email}</p>
      ) : (
        <div className='flex gap-3'>
          <p>You are not signed in, please sign in</p>
          <Link to="/signin">Sign In</Link>
        </div>
      )}
    </div>
  )
}
