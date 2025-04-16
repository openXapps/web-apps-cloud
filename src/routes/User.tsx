
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useAuth from '@/hooks/useAuth';

// https://picsum.photos/

export default function User() {
  const rrNavigate = useNavigate();
  const { getInfo, setInfo, setEmail, setPassword, getUID } = useAuth();
  const [isBusy, setIsBusy] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    setIsBusy(true);
    if (
      nameRef.current !== null &&
      emailRef.current !== null &&
      photoRef.current !== null
    )
      try {
        await setInfo({
          displayName: nameRef.current.value,
          photoURL: photoRef.current.value,
          email: emailRef.current.value,
        });
      } catch (error) {
        console.log(error);
      }
    if (emailRef.current !== null) {
      const isEmailValid = true; // Fixed value for now. Need implementation
      if (isEmailValid && emailRef.current.value !== getInfo().email) {
        try {
          await setEmail(emailRef.current.value);
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (passwordRef.current !== null) {
      const isPasswordValid = true; // Fixed value for now. Need implementation
      if (isPasswordValid) {
        try {
          await setPassword(passwordRef.current.value);
        } catch (error) {
          console.log(error);
        }
      }
    }
    setIsBusy(false);
    rrNavigate(-1);
  }

  return (
    <div className="p-3 space-y-3">
      <p className="font-bold">User Information</p>
      <p>{getUID()}</p>
      <form className="space-y-2" onSubmit={handleUpdateUser}>
        <Input ref={nameRef} type="text" placeholder="Display name" defaultValue={getInfo().displayName || undefined} />
        <Input ref={photoRef} type="url" placeholder="Photo URL" defaultValue={getInfo().photoURL || undefined} />
        <Input ref={emailRef} type="email" placeholder="Email" defaultValue={getInfo().email || undefined} />
        <Input ref={passwordRef} type="password" placeholder="New password (leave blank if unchanged)" />
      </form>
      <div className="space-x-2">
        <Button onClick={handleUpdateUser} type="submit" disabled={isBusy}>Save</Button>
        {/* <Button onClick={() => { }} disabled={isBusy}>Reset Password</Button> */}
        <Button onClick={() => rrNavigate(-1)} disabled={isBusy}>Back</Button>
      </div>
      <p>Email validated: {getInfo().emailVerified ? 'YES' : 'NO'}</p>
    </div>
  );
}
