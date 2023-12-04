import React from 'react'
import { Post } from "@/app/types/types";
import Comment from './ui/Comment';

// interface PostListProps {
//   items: Post[];
// }

const items = [
  {
    id: '1',
    author: 'JohnDOe',
    content: 'This is great',
    timestamp: Date.now(),
    likes: 3,
    comments: 0,
  },
  {
    id: '2',
    author: 'JaneDoe',
    content: 'I agree',
    timestamp: Date.now(),
    likes: 20,
    comments: 0,
  },
];

const CommentsList = ({ }) => {
  return (
    <div className="flex flex-col items-center justify-start space-y-4 my-4 w-full">
      {items.map((item) => (
        <Comment key={item.id} data={item} />
      ))}
  </div>
  )
}

export default CommentsList;
