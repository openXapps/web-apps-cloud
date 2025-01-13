
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useAuth from '@/hooks/useAuth';

export default function User() {
  const rrNavigate = useNavigate();
  const { getInfo } = useAuth();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  // const passwordRef = useRef<HTMLInputElement | null>(null);
  // const confirmRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   if (
  //     nameRef.current?.value != null &&
  //     user.auth.currentUser?.displayName &&
  //     phoneRef.current?.value != null &&
  //     user.auth.currentUser?.phoneNumber &&
  //     photoRef.current?.value != null &&
  //     user.auth.currentUser?.displayName &&
  //     emailRef.current?.value != null &&
  //     user.auth.currentUser?.displayName &&
  //   ) {
  //     nameRef.current.value = getInfo(auth.currentUser?.displayName);
  //     phoneRef = ;
  //     photoRef = ;
  //     emailRef = ;
  //   }
  // }, [])

  return (
    <div className="p-3 space-y-3">
      <p>User Information</p>
      <form className="space-y-2" onSubmit={() => { }}>
        <Input ref={nameRef} type="text" placeholder="Display name" defaultValue={getInfo().displayName || undefined} />
        <Input ref={phoneRef} type="tel" placeholder="Phone number" defaultValue={getInfo().phone || undefined} />
        <Input ref={photoRef} type="url" placeholder="Photo URL" defaultValue={getInfo().photoURL || undefined} />
        <Input ref={emailRef} type="email" placeholder="Email" defaultValue={getInfo().email || undefined} />
      </form>
      <div className="space-x-2">
        <Button onClick={() => { }}>Save</Button>
        <Button onClick={() => { }}>Reset Password</Button>
        <Button onClick={() => rrNavigate(-1)}>Back</Button>
      </div>
      <p>Email validated: {getInfo().emailVerified ? 'YES' : 'NO'}</p>
    </div>
  );
}
