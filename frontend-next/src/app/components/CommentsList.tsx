'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Post } from "@/app/types/types";
import Comment from './ui/Comment';
import { SocialNetworkPost } from '../types/SocialNetworkPost';
import { SocialNetwork } from '../utils/social-network';
import _ from 'lodash';
import CachedProfilesAndPostsContext from '../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext';
import { usePosts } from '../context/CachedProfilesAndPostsContext/usePosts';

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

const CommentsList: React.FC<CommentListProps> = ({ referencePostAddress }) => {
  const [comments, setComments] = useState<(SocialNetworkPost | null)[]>([]);
  const posts = usePosts();
  const postsMap = posts.posts

  function filterPostsByReference() {
    const postsArray = Object.values(postsMap);
    const filteredComments: SocialNetworkPost[] = postsArray.filter(post => post?.referencedPost === referencePostAddress);
    setComments(filteredComments);
    console.log(filteredComments)
  }

  useEffect(() => {
    filterPostsByReference()
  }, [])

  return (
    <div className="flex flex-col items-center justify-start space-y-4 my-4 w-full">
      {comments.map((item) => (
        item?.referencedPost === referencePostAddress && <Comment key={item?.address} data={item} />
      ))}
    </div>
  )
}

export default CommentsList;
