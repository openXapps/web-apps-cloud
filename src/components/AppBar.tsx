import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';

import { LogOut, UserRound, } from 'lucide-react';

import { Button } from './ui/button';

import useAuth from '@/hooks/useAuth';

export default function AppBar() {
  const { auth, isAuthorized, setAuthorized, signUserOut } = useAuth();
  const rrNavigate = useNavigate();

  const handleSignUserOut = async () => {
    try {
      await signUserOut(auth);
      setAuthorized(false);
    } catch (error) {
      console.log('Sign out error');
    }
  }

  return (
    <div className='container max-w-[1024px]'>
      <div className='flex justify-between items-center p-3 mx-auto'>
        <h1 className="text-xl font-bold text-orange-900 dark:text-orange-400">OpenApps Cloud Data Manager</h1>
        <div className='flex gap-2'>
          <Button
            variant="ghost"
            size="icon"
            disabled={!isAuthorized}
            className={twMerge(isAuthorized ? 'text-green-800 dark:text-green-400' : '')}
            onClick={() => rrNavigate('/user')}
          ><UserRound />
          </Button>
          {isAuthorized && (
            <Button variant="ghost" size="icon" onClick={handleSignUserOut}>
              <LogOut />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
