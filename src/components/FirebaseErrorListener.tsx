'use client';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error(error); // Also log for dev debugging
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'You do not have permission to perform this action.',
      });
      // In a real dev environment, we'd throw this error to be caught by Next.js overlay.
      // For this prototype, a toast is sufficient.
    };

    const unsubscribe = errorEmitter.on('permission-error', handleError);

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return null;
}
