'use client'
import React, { useContext, useEffect, useState } from "react";
import PostCard from "@/app/components/ui/PostCard";
import { Post } from "@/app/types/types";
import { SocialNetworkPost } from "../types/SocialNetworkPost";
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import { Page } from "../types/Page";
import { SocialNetwork } from "../utils/social-network";
import _ from "lodash";
import { Button } from "./ui/button";

interface PostListProps {
  // items: Post[];
  items: (SocialNetworkPost | null)[] | undefined;
}

const PostList: React.FC<PostListProps> = ({ items }) => {
  const [posts, setPosts] = useState<(SocialNetworkPost | null)[]>([]);
  const { getPost } = useContext(CachedProfilesAndPostsContext);

  const getBlockBuzzPosts = async () => {
    // get all posts in the blockbuzz dapp
  };

  const fetchPostAddresses = async (): Promise<null | Page<string>> => {
    const page: Page<string> = {
      totalItemCount: 0,
      itemCount: 0,
      items: {},
    };
    try {
      const eventFilter = SocialNetwork.filters.UserCreatedPost();
      const events = await SocialNetwork.queryFilter(eventFilter);
      page.items = _.reverse(
        events.map((event) => event?.args?.newPost).filter((address) => address)
      ).reduce(
        (items: any, item: any, index: any) => ({
          ...items,
          [(index + 1).toString()]: item, // increment by 1 since 0 is sentinel value
        }),
        {}
      );
      page.itemCount = page.totalItemCount = Object.keys(page.items).length;
    } catch (e) {
      console.error(e);
    }

    return page;
  };

  // run get postsData from addresses
  const getPosts = async () => {
    const page = await fetchPostAddresses();
    if (page?.items) {
      const addresses = Object.values(page.items);
      const postsData = await Promise.all(
        addresses.map((address) => getPost(address))
      );
      setPosts(postsData);
    }
  };

  useEffect(() => {
    getPosts();
    console.log(posts); // TODO: fix these throwing errors when getting posts to show up on users main feed
  }, []);

  // run get postsData from addresses

  return (
    <div className="flex items-center justify-center space-y-4 mt-4">
      <div className="grid grid-cols-1 gap-4">
        <Button onClick={getPosts}>get post</Button>
        {items?.map((item) => (
          <PostCard key={item?.address} data={item} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
