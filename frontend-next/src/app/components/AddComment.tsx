'use client';
import React, { useContext, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import EthersContext from "../context/EthersContext/EthersContext";
import { commentPost } from "../utils/social-network-post";
import { SocialNetworkPost } from "../types/SocialNetworkPost";
import { Loader2 } from "lucide-react";

interface Props {
  post: SocialNetworkPost;
}

const AddComment: React.FC<Props> = ({ post }) => {
  const { provider, universalProfile } = useContext(EthersContext);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const authenticated =
  provider &&
  universalProfile?.socialNetworkProfileDataContract &&
  universalProfile?.socialNetworkProfileDataERC725Contract &&
  universalProfile?.socialProfileStats;

  const handleInput = (event: any) => {
    event.preventDefault()
    setContent(event.target.value);
  }

  const handlePost = async (event: any) => {
    event.preventDefault()
    if (!authenticated) return;
    if (content.length === 0) return;
    try {
      setLoading(true)
      const res = await commentPost(provider, content, post.address); // return me the address of the post
      console.log("comment result", res)
      setLoading(false)
    } catch {
      setLoading(false)
    }

  };
  return (
    <div className="flex w-full items-center space-x-2">
      <Input type="comment" placeholder="Add a comment..." className="w-full" value={content} onChange={handleInput} />
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Button type="submit" variant='ghost' onClick={handlePost} disabled={authenticated ? false : true}>Post</Button>
      )}
    </div>
  );
}

export default AddComment;