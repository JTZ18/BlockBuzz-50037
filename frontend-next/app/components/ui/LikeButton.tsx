'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Heart, TrendingUpIcon } from "lucide-react";
import { Button } from "./button";
import Container from './container';
import { SocialNetworkPost } from '../../types/SocialNetworkPost';
import EthersContext from '../../context/EthersContext/EthersContext';
import CachedProfilesAndPostsContext from '../../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext';
import { SocialNetwork } from '../../utils/social-network';
import { Loader2 } from "lucide-react"

interface Props {
  post: SocialNetworkPost;
}

const LikeButton: React.FC<Props> = ( { post } ) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const { posts, refetchPost } = useContext(CachedProfilesAndPostsContext)
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const authenticated =
  provider &&
  universalProfile?.socialNetworkProfileDataContract &&
  universalProfile?.socialNetworkProfileDataERC725Contract &&
  universalProfile?.socialProfileStats &&
  currentPost?.author.toLowerCase() !== universalProfile?.address.toLowerCase();

  const fetchLikeStatus = async () => {
    if (!authenticated) return;
    try {
      setLiked(
        await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
          currentPost.address
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLike = async (event: any) => {
    event.preventDefault()
    if (!authenticated) return;
    setLoading(true)
    try{
      if (
        await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
          currentPost.address
        )
      ) {
        setLiked(true);
        setLoading(false)
        return;
      }
      const tx = await SocialNetwork.connect(provider.getSigner()).likePost(
        currentPost.address
      );
      await tx.wait();
      await refetchPost(currentPost.address)
      setLiked(prev => !prev);
      setLoading(false)
    } catch (e) {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!authenticated) return;
    setLoading(true)
    try{
      if (
        !(await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
          currentPost.address
        ))
      ) {
        setLiked(false);
        setLoading(false)
        return;
      }

      const tx = await SocialNetwork.connect(provider.getSigner()).unlikePost(
        currentPost.address
      );
      await tx.wait();
      await refetchPost(currentPost.address)

      setLiked(false);
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [post]);

  useEffect(() => {
    const updatedPost = posts[currentPost.address];
    if (updatedPost) {
      fetchLikeStatus()
      setCurrentPost(updatedPost)
    }
  }, [posts, authenticated]);

  return (
    <div>
      <Button
        variant="ghost"
        size="default"
        onClick={liked ? handleDislike : handleLike}
        disabled={!authenticated}
        className={!authenticated ? 'cursor-not-allowed opacity-50' : ''}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Heart fill={liked ? "red" : ""} stroke={liked ? "red" : "white"} className='h-4 w-4' />
        )}
        <p className="text-sm text-primary/80 ml-4">{currentPost?.likes}</p>
      </Button>
    </div>
  )
}

export default LikeButton;