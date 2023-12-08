'use client'
import { useContext } from 'react';
import CachedProfilesAndPostsContext from './CachedProfilesAndPostsContext';

// This is your custom hook
export const usePosts = () => {
  const context = useContext(CachedProfilesAndPostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a CachedProfilesAndPostsProvider');
  }
  // Now, this hook returns not only the functions but also the posts state directly
  return { posts: context.posts };
};
