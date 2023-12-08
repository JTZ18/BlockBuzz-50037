'use client'
import React, { useContext, useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import Container from './ui/container';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import { Separator } from './ui/separator';
import { SocialNetworkProfile } from '../types/SocialNetworkProfile';
import CachedProfilesAndPostsContext from '../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext';
import { usePathname } from 'next/navigation';
import { fetchProfile } from '../utils/universal-profile';
import { Skeleton } from './ui/skeleton';
import { SocialNetwork } from '../utils/social-network';
import { Page } from '../types/Page';


const ProfileCard = () => {
  const [profile, setProfile] = useState<(SocialNetworkProfile | null)>();
  const [numPosts, setNumPosts] = useState(0)
  const [loading, setLoading] = useState(false)
  const { getPost } = useContext(CachedProfilesAndPostsContext);
  const pathname = usePathname()
  const parts = pathname.split('/');
  let profileAddress: string = ''
  if ((parts.length >= 3) && (parts[1] == 'profile')) {
    profileAddress = parts[2];
  };

  const handlefetchProfile = async (address: string) => {
    try {
      setLoading(true);
      const retrievedProfile = await fetchProfile(address, true)
      setProfile(retrievedProfile)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }

  }

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

  const getUserNumberOfPosts = async () => {
    const page = await fetchPostAddressesOfUser(profileAddress)
    if (page?.itemCount) {
      setNumPosts(page?.itemCount)
    }
  }


  useEffect(() => {
    handlefetchProfile(profileAddress)
    getUserNumberOfPosts()
  }, []);

  return (
    <Container className='flex justify-center mt-6'>
     { loading ?
      (<Skeleton className="aspect-[16/9] rounded-xl w-full"/>) : (

        <Card className='flex flex-col justify-center items-center w-full p-6'>
          <Avatar>
            <AvatarImage src={profile?.profileImage?.[0]?.url} alt="profile-picture" />
            <AvatarFallback>{profile?.name.slice(0,2)}</AvatarFallback>
          </Avatar>
          <CardHeader className='pt-4 pb-0'>
            <CardTitle className='text-center'>{profile?.name}</CardTitle>
            <CardDescription className='text-center'>{`${profile?.address.slice(0, 6)}...${profile?.address.slice(-4)}`}</CardDescription>
          </CardHeader>
          <CardFooter>
            <div>
              <div className="space-y-1">
              </div>
              <Separator className="my-4" />
              <div className="flex h-5 items-center space-x-4 text-sm justify-center">
                <div className='flex flex-col items-center justify-center'>
                  <p>{numPosts}</p>
                  <p>Posts</p>
                </div>
                <Separator orientation="vertical" />
                <div className='flex flex-col items-center justify-center'>
                  <p>{profile?.socialProfileStats?.subscribers}</p>
                  <p>Followers</p>
                </div>
                <Separator orientation="vertical" />
                <div className='flex flex-col items-center justify-center'>
                  <p>{profile?.socialProfileStats?.subscriptions}</p>
                  <p>Following</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      )
      }
    </Container>
  )
}

export default ProfileCard;


