import React from 'react'
import { Post } from '@/app/types/types';
import { Separator } from "@/app/components/ui/separator"


interface Comment {
  data: Post;
}

const Comment: React.FC<Comment> = ({ data }) => {
  return (
    <div className='w-full'>
      <p className='font-bold'>{data.author}</p>
      <p>{data.content}</p>
      <Separator className='my-4'/>
    </div>
  )
}

export default Comment;