import React from 'react'
import { Post } from '@/app/types/types';
import { Separator } from "@/app/components/ui/separator"
import { SocialNetworkPost } from '@/app/types/SocialNetworkPost';


interface Comment {
  data: SocialNetworkPost | null;
}

const Comment: React.FC<Comment> = ({ data }) => {
  if (data?.referencedPost === "0x0000000000000000000000000000000000000000") { return null;}
  return (
    <div className='w-full'>
      <p className='font-bold'>{data?.profileName}</p>
      <p>{data?.content}</p>
      <Separator className='my-4'/>
    </div>
  )
}

export default Comment;