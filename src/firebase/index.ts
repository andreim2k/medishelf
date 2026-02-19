'use client';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { useCollection } from './firestore/use-collection';
import { useUser } from './auth/use-user';
import {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';
import { FirebaseClientProvider } from './client-provider';

// This is a re-export of all the hooks and providers that the app will use.
// This is to avoid having to import from multiple files.
export {
  useCollection,
  useUser,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
};

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  } else {
    firebaseApp = getApps()[0];
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}
