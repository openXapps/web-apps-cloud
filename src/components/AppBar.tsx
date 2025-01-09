import { LogOut, UserRound, } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/button';

export default function AppBar() {
  const { auth, isAuthorized, setAuthorized, signUserOut } = useAuth();

  const handleSignUserOut = async () => {
    try {
      await signUserOut(auth);
      setAuthorized(false);
    } catch (error) {
      console.log('Sign out error');
    }
  }

  return (
    <div className='flex justify-between items-center p-3'>
      <h1 className="text-orange-400">OpenApps Cloud Data Manager</h1>
      <div className='flex gap-2'>
        <Button
          variant="ghost"
          size="icon"
          disabled={!isAuthorized}
          className={twMerge(isAuthorized ? 'text-green-400' : '')}
        ><UserRound />
        </Button>
        {isAuthorized && (
          <Button variant="ghost" size="icon" onClick={handleSignUserOut}>
            <LogOut />
          </Button>
        )}
      </div>
    </div>
  );
}
