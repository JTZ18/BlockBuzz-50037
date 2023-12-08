'use client'
import React, { Suspense, useContext, useEffect, useState, useCallback } from "react";
import PostCard from "./ui/PostCard";
import { Post } from "../types/types";
import { SocialNetworkPost } from "../types/SocialNetworkPost";
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import EthersContext from '../context/EthersContext/EthersContext'
import { Page } from "../types/Page";
import { SocialNetwork } from "../utils/social-network";
import _ from "lodash";
import { Button } from "./ui/button";
import usePullToRefresh from "../hooks/usePullToRefresh";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Label } from "./ui/label"
import AddComment from "./AddComment";
import { AddPost } from "./AddPost";
import { usePathname } from "next/navigation";
import { AddressToSocialNetworkPostMapping } from "../types/AddressToSocialNetworkPostMapping";
import { useSignaller } from "../context/CachedProfilesAndPostsContext/useSignaller";

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

// interface PostListProps {
//   // items: Post[];
//   // items: (SocialNetworkPost | null)[] | undefined;
//   // profileAddress?: string;
// }

const PostList = () => {
  const [currentPosts, setPosts] = useState<(SocialNetworkPost | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const { getPost, posts, refetchAll } = useContext(CachedProfilesAndPostsContext);
  const pathname = usePathname(); // extract profile address from url path if the user is in profile mode
  const parts = pathname.split('/');
  let profileAddress: string = ''
  if ((parts.length >= 3) && (parts[1] == 'profile')) {
    profileAddress = parts[2];
  };
  const { signaller, toggle } = useSignaller();
  const {
    provider,
    universalProfile,
    initSocialProfileData,
    logout,
  } = useContext(EthersContext);


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

  const fetchPostAddressesOfUser = async (userAddress: string): Promise<null | Page<string>> => {
    const page: Page<string> = {
      totalItemCount: 0,
      itemCount: 0,
      items: {},
    };
    try {
      const MAIN_POST_TYPE = 0;
      const eventFilter = SocialNetwork.filters.UserCreatedPost(MAIN_POST_TYPE, userAddress);
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
  const getPosts = useCallback(async () => {
    setIsLoading(true);
    const page = await fetchPostAddresses();
    console.log(page);
    if (page?.items) {
      const addresses = Object.values(page.items);

      try {
        // Map each address to a getPost promise
        const promises = addresses.map(address => getPost(address));
        // Wait for all promises to resolve
        const retrievedPostsArray = await Promise.all(promises);
        // Set the state with all retrieved posts
        setPosts(retrievedPostsArray);
        console.log("postsData: ", retrievedPostsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle any errors that occurred during fetch
      }
    }
    setIsLoading(false);
  }, [getPost]);

  const getPostsOfProfile = async () => {
    if (!profileAddress) return
    console.log("triggered getpostsofprofile")
    setIsLoading(true);
    const page = await fetchPostAddressesOfUser( profileAddress );
    console.log(page);
    if (page?.items) {
      const addresses = Object.values(page.items);

      try {
        // Map each address to a getPost promise
        const promises = addresses.map(address => getPost(address));
        // Wait for all promises to resolve
        const retrievedPostsArray = await Promise.all(promises);
        // Set the state with all retrieved posts
        setPosts(retrievedPostsArray);
        console.log("postsData: ", retrievedPostsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle any errors that occurred during fetch
        setIsLoading(false)
      }
    }
    setIsLoading(false);
  };

  usePullToRefresh(getPosts)

  useEffect(() => {
    if (profileAddress) {
      getPostsOfProfile()
      return
    }
    getPosts();
  }, []);

  useEffect(() => {
    () => {
      console.log("postlist refetching posts")
      getPosts().then(() => {
        // let postsArray: SocialNetworkPost[] = Object.values(posts);
        // setPosts(postsArray)
        console.log("we refetched posts ish")
      })
    }
  }, [signaller, getPosts, posts]); // TODO: care that it does not recursivvely loop

  // run get postsData from addresses

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-4">
      {/* <Button onClick={getPosts}>Get Posts</Button> */}

      <div className="grid grid-col-1 gap4">
        {currentPosts?.map((item) => (
          <PostCard key={item?.address} data={item} />
        ))}
      </div>

      {isLoading && (<Skeleton className="aspect-[9/16] rounded-xl w-full"/>)}
      {isLoading && (<Skeleton className="aspect-[9/16] rounded-xl w-full"/>)}
      {isLoading && (<Skeleton className="aspect-[9/16] rounded-xl w-full"/>)}
    </div>
  );
};

export default PostList;
