// React
import React, { createContext } from "react";

// Types
import type { SocialNetworkProfile } from "@/app/types/SocialNetworkProfile";
import type { SocialNetworkPost } from "@/app/types/SocialNetworkPost";
import { AddressToSocialNetworkProfileMapping } from "@/app/types/AddressToSocialNetworkProfileMapping";
import { AddressToSocialNetworkPostMapping } from "@/app/types/AddressToSocialNetworkPostMapping";

export interface CachedProfilesAndPostsContextValue {
  posts: AddressToSocialNetworkPostMapping;
  getProfile: (
    address: string,
    ignoreCache?: boolean
  ) => Promise<null | SocialNetworkProfile>;
  getPost: (
    address: string,
    ignoreCache?: boolean
  ) => Promise<null | SocialNetworkPost>;
  getProfileFromCache: (address: string) => null | SocialNetworkProfile;
  getAllProfilesFromCache: () => null | AddressToSocialNetworkProfileMapping;
  getPostFromCache: (address: string) => null | SocialNetworkPost;
  resetAll: () => void;
  resetPosts: () => void;
  resetProfiles: () => void;
  refetchAll: () => Promise<void>;
  refetchPosts: () => Promise<void>;
  refetchProfiles: () => Promise<void>;
  refetchPost: (postAddress: string) => Promise<void>;
}

const CachedProfilesAndPostsContext =
  createContext<CachedProfilesAndPostsContextValue>({
    posts: {},
    getProfile: async () => null,
    getAllProfilesFromCache: () => null,
    getPost: async () => null,
    getProfileFromCache: () => null,
    getPostFromCache: () => null,
    resetAll: () => {},
    resetPosts: () => {},
    resetProfiles: () => {},
    refetchAll: async () => {},
    refetchPosts: async () => {},
    refetchProfiles: async () => {},
    refetchPost: async () => {},
  });

export default CachedProfilesAndPostsContext;
