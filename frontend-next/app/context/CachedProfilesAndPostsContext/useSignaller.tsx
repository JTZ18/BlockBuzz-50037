'use client'
import { useContext, useCallback } from 'react';
import CachedProfilesAndPostsContext from './CachedProfilesAndPostsContext';

export function useSignaller() {
  // Access the context
  const { signaller, toggleSignaller } = useContext(CachedProfilesAndPostsContext);

  // Wrap the `toggleSignaller` function with `useCallback` to memoize it
  // This step is optional and depends on whether `toggleSignaller` will cause expensive computations on re-creation
  const toggle = useCallback(() => {
    toggleSignaller();
  }, [toggleSignaller]);

  // Return the `signaller` state and the `toggle` function from the hook
  return { signaller, toggle };
}
