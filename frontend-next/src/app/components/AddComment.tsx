'use client';
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AddComment() {
  const handleInput = (event: any) => {
    event.preventDefault()
  }

  const handlePost = (event: any) => {
    event.preventDefault()
  }
  return (
    <div className="flex w-full items-center space-x-2">
      <Input type="comment" placeholder="Add a comment..." className="w-full" onClick={handleInput} />
      <Button type="submit" variant='ghost' onClick={handlePost}>Post</Button>
    </div>
  );
}
