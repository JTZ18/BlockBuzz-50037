'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Heart, TrendingUpIcon } from "lucide-react";
import { Button } from "./button";
import Container from './container';
import { SocialNetworkPost } from '@/app/types/SocialNetworkPost';
import EthersContext from '@/app/context/EthersContext/EthersContext';
import { SocialNetwork } from '@/app/utils/social-network';
import { Loader2 } from "lucide-react"

interface Props {
  post: SocialNetworkPost;
}

const LikeButton: React.FC<Props> = ( { post } ) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const authenticated =
  provider &&
  universalProfile?.socialNetworkProfileDataContract &&
  universalProfile?.socialNetworkProfileDataERC725Contract &&
  universalProfile?.socialProfileStats &&
  post?.author.toLowerCase() !== universalProfile?.address.toLowerCase();

  const fetchLikeStatus = async () => {
    if (!authenticated) return;
    try {
      setLiked(
        await universalProfile?.socialNetworkProfileDataContract?.hasLiked(
          post.address
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
          post.address
        )
      ) {
        setLiked(true);
        setLoading(false)
        return;
      }
      const tx = await SocialNetwork.connect(provider.getSigner()).likePost(
        post.address
      );
      await tx.wait();
      setLiked(true);
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
          post.address
        ))
      ) {
        setLiked(false);
        setLoading(false)
        return;
      }

      const tx = await SocialNetwork.connect(provider.getSigner()).unlikePost(
        post.address
      );
      await tx.wait();
      setLiked(false);
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, []);

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
      </Button>
    </div>
  )
}

export default LikeButton;