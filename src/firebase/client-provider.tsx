'use client';

import { useMemo } from 'react';
import { FirebaseProvider, initializeFirebase } from '@/firebase';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return <FirebaseProvider {...firebaseApp}>{children}</FirebaseProvider>;
}
