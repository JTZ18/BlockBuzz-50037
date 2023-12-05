'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Badge } from "@/app/components/ui/badge"
import { SocialNetworkPost } from '@/app/types/SocialNetworkPost';
import EthersContext from '@/app/context/EthersContext/EthersContext';
import CachedProfileAndPostsContext from '@/app/context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext';
import { SocialNetwork } from '@/app/utils/social-network';
import { Loader2 } from "lucide-react"

interface Props {
  post: SocialNetworkPost;
}

const FollowButton: React.FC<Props> = ( { post } ) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const { posts, refetchPost } = useContext(CachedProfileAndPostsContext)
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const authenticated =
  provider &&
  universalProfile?.socialNetworkProfileDataContract &&
  universalProfile?.socialNetworkProfileDataERC725Contract &&
  universalProfile?.socialProfileStats &&
  currentPost?.author.toLowerCase() !== universalProfile?.address.toLowerCase();

  const fetchFollowStatus = async () => {
    if (!authenticated) return;
    console.log('enter follow status')
    try {
      setFollowed(
        await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
          currentPost.author
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollow = async () => {
    if (!authenticated) return;
    setLoading(true)
    try{
      if (
        await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
          currentPost.author
        )
      ) {
        setFollowed(true);
        setLoading(false)
        return;
      }
      const tx = await SocialNetwork.connect(provider.getSigner()).subscribeUser(
        currentPost.author
      );
      await tx.wait();
      await fetchFollowStatus();
      // setFollowed(prev => !prev);
      setLoading(false)
    } catch (e) {
      setLoading(false);
    }
  }
  const handleUnfollow = async () => {
    if (!authenticated) return;
    setLoading(true)
    try{
      if (
        !(await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(
          currentPost.author
        ))
      ) {
        setFollowed(false);
        setLoading(false)
        return;
      }

      const tx = await SocialNetwork.connect(provider.getSigner()).unsubscribeUser(
        currentPost.author
      );
      await tx.wait();
      await fetchFollowStatus()
      // setFollowed(false);
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchFollowStatus();
  }, [post]);

  useEffect(() => {
    fetchFollowStatus()
  }, [followed, authenticated]);
  return (
    <>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Badge onClick={followed ? handleUnfollow : handleFollow} variant={followed ? 'secondary' : 'default'}>{followed ? 'Unfollow' : 'Follow'}</Badge>
      )}
    </>

  );
};

export default FollowButton;
