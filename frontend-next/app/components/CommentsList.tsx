'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Post } from '../types/types';
import Comment from './ui/Comment';
import { SocialNetworkPost } from '../types/SocialNetworkPost';
import { SocialNetwork } from '../utils/social-network';
import _ from 'lodash';
import CachedProfilesAndPostsContext from '../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext';
import { usePosts } from '../context/CachedProfilesAndPostsContext/usePosts';
import { useSignaller } from '../context/CachedProfilesAndPostsContext/useSignaller';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { Page } from '../types/Page';

interface CommentListProps {
  // items: Post[];
  referencePostAddress: string
}

// const items = [
//   {
//     id: '1',
//     author: 'JohnDOe',
//     content: 'This is great',
//     timestamp: Date.now(),
//     likes: 3,
//     comments: 0,
//   },
//   {
//     id: '2',
//     author: 'JaneDoe',
//     content: 'I agree',
//     timestamp: Date.now(),
//     likes: 20,
//     comments: 0,
//   },
// ];

const CommentsList: React.FC<CommentListProps> = ({ referencePostAddress = '' }) => {
  const [comments, setComments] = useState<(SocialNetworkPost | null)[]>([]);
  const posts = usePosts();
  const { signaller, toggle } = useSignaller();


  function filterPostsByReference() {
    const postsArray = Object.values(posts.posts);
    const filteredComments: SocialNetworkPost[] = postsArray.filter(post => post?.referencedPost === referencePostAddress);
    setComments(filteredComments);
    console.log(filteredComments)
  }

  useEffect(() => {
    filterPostsByReference()
  }, [signaller])

  return (
    <div className="flex flex-col items-center justify-start space-y-4 my-4 w-full">
      {/* {comments.map((item) => (
        item?.referencedPost === referencePostAddress && <Comment key={item?.address} data={item} />
      ))} */}
        <Accordion type="single" collapsible className='w-full'>
          <AccordionItem value="item-1">
            {comments && <AccordionTrigger>{`💬 ${comments.length} Comments`}</AccordionTrigger>}
            <AccordionContent>
              {comments.map((item) => (
                item?.referencedPost === referencePostAddress && <Comment key={item?.address} data={item} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    </div>
  )
}

export default CommentsList;
