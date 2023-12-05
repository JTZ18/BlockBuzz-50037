'use client'
import React, { Suspense, useContext, useEffect, useState } from "react";
import PostCard from "@/app/components/ui/PostCard";
import { Post } from "@/app/types/types";
import { SocialNetworkPost } from "../types/SocialNetworkPost";
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import { Page } from "../types/Page";
import { SocialNetwork } from "../utils/social-network";
import _ from "lodash";
import { Button } from "./ui/button";
import usePullToRefresh from "../hooks/usePullToRefresh";
import { Skeleton } from "./ui/skeleton";
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import AddComment from "./AddComment";
import { AddPost } from "./AddPost";

// const posts = [
//   {
//     address: '1',
//     author: '0x0000000000000000000000000000000000000001',
//     profileName: 'JohnDOes',
//     profileImage: [
//       {
//         url: "https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-15.jpg"
//       }
//     ],
//     content: 'This is the content of the first post.',
//     type: 0,
//     timestamp: Date.now(),
//     image: [
//       {
//         url:'https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-15.jpg'
//       }
//     ],
//     likes: 3,
//     comments: 5,
//     shares: 0,
//     taggedUsers: ["nil"],
//     referencedPost: "0x0000000000000000000000000000000000000000"
//   },
//   {
//     address: '2',
//     author: '0x0000000000000000000000000000000000000002',
//     profileName: 'Jane',
//     profileImage: [
//       {
//         url: "https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-15.jpg"
//       }
//     ],
//     content: 'This is the content of the second post.',
//     type: 0,
//     timestamp: Date.now(),
//     image: [],
//     likes: 3,
//     comments: 5,
//     shares: 0,
//     taggedUsers: ["nil"],
//     referencedPost: "0x0000000000000000000000000000000000000000"
//   },
//   {
//     address: '3',
//     author: '0x0000000000000000000000000000000000000003',
//     profileName: 'JohnnyBoy',
//     profileImage: [
//       {
//         url: "https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-15.jpg"
//       }
//     ],
//     content: 'This is the content of the third post.',
//     type: 0,
//     timestamp: Date.now(),
//     image: [
//       {
//         url:'https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-15.jpg'
//       }
//     ],
//     likes: 3,
//     comments: 5,
//     shares: 0,
//     taggedUsers: ["nil"],
//     referencedPost: "0x0000000000000000000000000000000000000000"
//   },
// ];

interface PostListProps {
  // items: Post[];
  // items: (SocialNetworkPost | null)[] | undefined;
}

const PostList: React.FC<PostListProps> = ({  }) => {
  const [posts, setPosts] = useState<(SocialNetworkPost | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const { getPost } = useContext(CachedProfilesAndPostsContext);

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
    setIsLoading(true)
    console.log("im clicked")
    const page = await fetchPostAddresses();
    console.log(page)
    if (page?.items) {
      const addresses = Object.values(page.items);
      console.log("addresses: " + addresses)
      let retrievedPostsArray: (SocialNetworkPost | null)[] = [];
      for (let address of addresses) {
        const post = await getPost(address);
        retrievedPostsArray = [...retrievedPostsArray, post];
        setPosts([...retrievedPostsArray]);
        console.log([...retrievedPostsArray]);
      }
      console.log("postsData: ", retrievedPostsArray)
    }
    setIsLoading(false)
  };

  usePullToRefresh(getPosts)

  useEffect(() => {
    getPosts();
    // console.log(posts); // TODO: fix these throwing errors when getting posts to show up on users main feed
  }, []);

  // run get postsData from addresses

  return (
    <div className="flex items-center flex-col justify-center space-y-4 mt-4">
      <Button onClick={getPosts}>Get Posts</Button>

      <AddPost />

      <div className="grid grid-col-1 gap4">
        {posts?.map((item) => (
          <PostCard key={item?.address} data={item} />
        ))}
        {isLoading && (
          <div className="">
            <Skeleton className="aspect-square rounded-xl max-w-2xl my-4"/>
            <Skeleton className="aspect-square rounded-xl max-w-2xl my-4"/>
            <Skeleton className="aspect-square rounded-xl max-w-2xl my-4"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
