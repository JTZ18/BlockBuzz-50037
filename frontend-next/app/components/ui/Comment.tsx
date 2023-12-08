'use client'
import React from 'react'
import { Post } from '../../types/types';
import { Separator } from './separator';
import { SocialNetworkPost } from '../../types/SocialNetworkPost';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./avatar";
import Link from 'next/link';


interface Comment {
  data: SocialNetworkPost | null;
}

const Comment: React.FC<Comment> = ({ data }) => {
  if (data?.referencedPost === "") { return null;}
  return (
    <div className='w-full flex flex-col'>
      <div className='flex flex-start'>
        <div className="flex mr-6">
          <Avatar>
            <AvatarImage src={data?.profileImage?.[0].url} />
            <AvatarFallback>{data?.profileName.slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col flex-start justify-between">
          <Link href={`/profile/${data.author}`} className="px-0 font-semibold text-sm text-primary underline-offset-4 hover:underline">{data?.profileName}</Link>
          {/* <p className="text-sm text-primary/80">{`${data?.author.slice(0, 6)}...${data?.author.slice(-4)}`}</p> */}
          <p className='text-sm'>{data?.content}</p>
        </div>
      </div>

      <Separator className='my-4'/>
    </div>
    // <Accordion type="single" collapsible className='w-full'>
    //   <AccordionItem value="item-1">
    //     <AccordionTrigger>{data?.profileName}</AccordionTrigger>
    //     <AccordionContent>
    //       {data?.content}
    //     </AccordionContent>
    //   </AccordionItem>
    // </Accordion>
  )
}

export default Comment;