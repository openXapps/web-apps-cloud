import { useRef } from 'react';
// import {
// getFirestore,
// collection,
// getDocs,
// Firestore
// } from 'firebase/firestore/lite';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// async function getAppModules(db: Firestore) {
//   const appModuleCol = collection(db, 'appModules');
//   const appModuleSnapshot = await getDocs(appModuleCol);
//   const appModuleList = appModuleSnapshot.docs.map(doc => doc.data());
//   return appModuleList;
// }

import { useAuth } from '@/context/AuthProvider';

export default function Home() {
  const { auth, currentUser, signUserIn, signUserOut } = useAuth();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  // getAppModules(db).then(data => {
  //   console.log(data);
  // })

  const handleSigIn = () => {
    if (username.current?.value && password.current?.value) {
      console.log(username.current.value);
      console.log(password.current.value);

      signUserIn(auth, username.current.value, password.current.value)
        .then((userCredential) => {
          setUser(userCredential.user);
        })
        .catch((error) => {
          console.log(`Firebase auth error code   : ${error.code}`);
          console.log(`Firebase auth error message: ${error.message}`);
        });
    }
  }

  const handleSignOut = () => {
    signOut(auth);
  }

  return (
    <div className='flex flex-col gap-3 p-5'>
      {user ? (
        <div>Currently signed in with <span>{user.email}</span></div>
      ) : (
        <>
          <div>Currently not signed in</div>
          <Input ref={username} type="email" placeholder="username" />
          <Input ref={password} type="password" placeholder="password" />
        </>
      )}
      {auth.currentUser ? (
        <Button className='w-40' onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Button className='w-40' onClick={handleSigIn}>Sign In</Button>
      )}
    </div>
  )
}
