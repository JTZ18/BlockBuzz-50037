// React
import React, { PropsWithChildren, useMemo, useState } from "react";

// Context
import CachedProfilesAndPostsContext, {
  CachedProfilesAndPostsContextValue,
} from "./CachedProfilesAndPostsContext";

// Contract Functions
import { fetchProfile } from "../../utils/universal-profile";
import { fetchPost } from "../../utils/social-network-post";

// Types
import type { SocialNetworkProfile } from "@/app/types/SocialNetworkProfile";
import type { SocialNetworkPost } from "@/app/types/SocialNetworkPost";
import type { AddressToSocialNetworkProfileMapping } from "@/app/types/AddressToSocialNetworkProfileMapping";
import type { AddressToSocialNetworkPostMapping } from "@/app/types/AddressToSocialNetworkPostMapping";

// Context Provider
const CachedProfilesAndPostsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [profiles, setProfiles] =
    useState<AddressToSocialNetworkProfileMapping>({});
  const [posts, setPosts] = useState<AddressToSocialNetworkPostMapping>({});

  const getProfile = async (
    address: string,
    ignoreCache?: boolean
  ): Promise<null | SocialNetworkProfile> => {
    if (profiles[address] && !ignoreCache) return profiles[address];

    const profile = await fetchProfile(address);
    if (profile) {
      setProfiles((profiles) => ({
        ...profiles,
        [address]: profile,
      }));
    }

    return profile;
  };

  const getPost = async (
    address: string,
    ignoreCache?: boolean
  ): Promise<null | SocialNetworkPost> => {
    console.log('enter getPost')
    if (posts[address] && !ignoreCache) return posts[address];
    const post = await fetchPost(address);
    if (post) {
      setPosts((posts) => ({
        ...posts,
        [address]: post,
      }));
    }

    return post;
  };


  const getProfileFromCache = (address: string) => profiles[address] ?? null;

  const getPostFromCache = (address: string) => posts[address] ?? null;

  const resetProfiles = () => setProfiles({});

  const resetPosts = () => setPosts({});

  const resetAll = () => {
    resetProfiles();
    resetPosts();
  };

  const getAllProfilesFromCache = () => profiles ?? null

  const refetchProfiles = async () => {
    const newProfiles: AddressToSocialNetworkProfileMapping = {};
    const profileAddresses = Object.keys(profiles);
    for (const address of profileAddresses) {
      const newProfile = await fetchProfile(address);
      if (newProfile) {
        newProfiles[address] = newProfile;
      }
    }
    setProfiles(newProfiles);
  };

  const refetchPosts = async () => {
    const newPosts: AddressToSocialNetworkPostMapping = {};
    const postAddresses = Object.keys(posts);
    for (const address of postAddresses) {
      const newPost = await fetchPost(address);
      if (newPost) {
        newPosts[address] = newPost;
      }
    }
    setPosts(newPosts);
  };

  const refetchAll = async () => {
    await refetchProfiles();
    await refetchPosts();
  };

  const value: CachedProfilesAndPostsContextValue =
    useMemo<CachedProfilesAndPostsContextValue>(
      () => ({
        posts,
        getProfile,
        getPost,
        getProfileFromCache,
        getAllProfilesFromCache,
        getPostFromCache,
        resetAll,
        resetPosts,
        resetProfiles,
        refetchAll,
        refetchPosts,
        refetchProfiles,
      }),
      [profiles, posts]
    );

  return (
    <CachedProfilesAndPostsContext.Provider value={value}>
      {children}
    </CachedProfilesAndPostsContext.Provider>
  );
};

export default CachedProfilesAndPostsContextProvider;
