import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/context/AuthProvider';

const isErrorInit: { status: boolean, message: string } = { status: false, message: '' };

export default function SignUserIn() {
  const rrNavigate = useNavigate();
  const { signUserIn } = useAuth();
  const username = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const [isError, setIsError] = useState(isErrorInit);
  const [isBusy, setIsBusy] = useState(false);

  const handleSignUserIn = () => {
    if (username.current?.value && password.current?.value) {
      setIsBusy(true);
      signUserIn(username.current.value, password.current.value)
        .then(() => {
          isError && setIsError({ status: false, message: '' });
          rrNavigate('/', { replace: true });
        })
        .catch(() => {
          // Silently handle error!
          setIsError({ status: true, message: 'Sign in error, try again' });
          setIsBusy(false);
          if (password.current != undefined) password.current.value = '';
        })
      // try {
      //   await signUserIn(username.current.value, password.current.value);
      //   isError && setIsError(false);
      //   rrNavigate('/', { replace: true });
      // } catch (error) {
      //   password.current.value = '';
      //   setIsError(true);
      // }
    } else {
      setIsError({ status: true, message: 'Provide both username and password' });
    }
  }

  const handleClearFields = () => {
    if (username.current != undefined) username.current.value = '';
    if (password.current != undefined) password.current.value = '';
    setIsError(isErrorInit);
    username.current?.focus();
  }

  return (
    <div className="max-w-md mx-auto p-5">
      <h1 className="text-xl mb-3">Sign In</h1>
      <div className="flex flex-col gap-3">
        <Input ref={username} type="email" placeholder="username" />
        <Input id="password" ref={password} type="password" placeholder="password" />
        <div className="flex gap-2">
          <Button disabled={isBusy} className='' onClick={handleSignUserIn}>Sign In</Button>
          <Button disabled={isBusy} className='' onClick={handleClearFields}>Clear</Button>
          <Button disabled={isBusy} className='' onClick={() => rrNavigate('/', { replace: true })}>Cancel</Button>
        </div>
        {isError.status && <p className="text-red-400">{isError.message}</p>}
      </div>
    </div>
  );
}
