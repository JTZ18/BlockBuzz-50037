'use client'
import React, { useState } from 'react'
import { Heart } from "lucide-react";
import { Button } from "./button";
import Container from './container';

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  const handleLike = (event: any) => {
    event.preventDefault()
    setLiked(!liked);
  };
  return (
    <div>
      <Button variant="ghost" size="icon" onClick={handleLike}>
        <Heart fill={liked ? "red" : ""} stroke={liked ? "red" : "white"} className='h-4 w-4' />
      </Button>
    </div>
  )
}
