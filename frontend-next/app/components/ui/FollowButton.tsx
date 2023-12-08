'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Badge } from "./badge"
import { SocialNetworkPost } from '../../types/SocialNetworkPost';
import EthersContext from '../../context/EthersContext/EthersContext';
import CachedProfilesAndPostsContext from '../../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext';
import { SocialNetwork } from '../../utils/social-network';
import { Loader2 } from "lucide-react"

interface Props {
  post: SocialNetworkPost;
}

const FollowButton: React.FC<Props> = ( { post } ) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const { posts, refetchPost } = useContext(CachedProfilesAndPostsContext)
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const authenticated =
  provider &&
  universalProfile?.socialNetworkProfileDataContract &&
  universalProfile?.socialNetworkProfileDataERC725Contract &&
  universalProfile?.socialProfileStats &&
  currentPost?.author.toLowerCase() !== universalProfile?.address.toLowerCase();

  useEffect(() => {
    if (!authenticated) return
    // Function to fetch follow status
    const fetchFollowStatus = async () => {
      if (authenticated) {
        try {
          const isFollowed = await universalProfile?.socialNetworkProfileDataContract?.isSubscriberOf(post.author);
          setFollowed(isFollowed);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchFollowStatus();
  }, [post, authenticated, universalProfile]);


  const handleFollow = async () => {
    if (!authenticated || followed) return;
    setLoading(true);

    try {
      const tx = await SocialNetwork.connect(provider.getSigner()).subscribeUser(post.author);
      await tx.wait();
      setFollowed(true);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  const handleUnfollow = async () => {
    if (!authenticated || !followed) return;
    setLoading(true);

    try {
      const tx = await SocialNetwork.connect(provider.getSigner()).unsubscribeUser(post.author);
      await tx.wait();
      setFollowed(false);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

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
