import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
// import {
// getFirestore,
// collection,
// getDocs,
// Firestore
// } from 'firebase/firestore/lite';

import { firebaseConfig } from '@/config/firebase';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const auth = getAuth(app);

// async function getAppModules(db: Firestore) {
//   const appModuleCol = collection(db, 'appModules');
//   const appModuleSnapshot = await getDocs(appModuleCol);
//   const appModuleList = appModuleSnapshot.docs.map(doc => doc.data());
//   return appModuleList;
// }

const email = 'openapps@gmail.com';
const password = 'r3m3d1';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth.currentUser) setUser(auth.currentUser);
  }, [auth.currentUser])

  // getAppModules(db).then(data => {
  //   console.log(data);
  // })

  const handleSigIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.log(`Firebase auth error code   : ${error.code}`);
        console.log(`Firebase auth error message: ${error.message}`);
      });
  }

  const handleSignOut = () => {
    signOut(auth);
  }

  return (
    <div className='flex flex-col gap-3'>
      {`Firebase sign-in with : ${user?.email}`}
      {auth.currentUser ? (
        <Button onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Button onClick={handleSigIn}>Sign In</Button>
      )}
    </div>
  )
}
