'use client'
// LeftNavBar.tsx
import React, { useContext, useEffect, useState } from 'react';
import EthersContext from '../context/EthersContext/EthersContext';
import { Page } from '../types/Page';
import { fetchSubscribersOfProfile, fetchSubscriptionsOfProfile } from '../utils/social-network-profile-data';
import { SocialNetworkProfile } from '../types/SocialNetworkProfile';
import { fetchProfile } from '../utils/universal-profile';

interface Friend {
  id: number;
  name: string;
}

const friends: Friend[] = [
  { id: 1, name: 'Alice Smith' },
  { id: 2, name: 'Bob Johnson' },
  { id: 3, name: 'Charlie Williams' },
  // Add as many friends as needed
];

const LeftNavBar = () => {
  const { universalProfile } = useContext(EthersContext)
  const [followerProfiles, setFollowerProfiles] = useState<(SocialNetworkProfile | null)[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<(SocialNetworkProfile | null)[]>([]);


  useEffect(() => {
    const handleGettingInfo = async() => {
      if (!universalProfile) { return }
      const page: Page<string> = {
        totalItemCount: 0,
        itemCount: 0,
        items: {},
      };
      const pageOfFollowers = await fetchSubscribersOfProfile(universalProfile?.address, 0, 100)
      const pageOfFollowing = await fetchSubscriptionsOfProfile(universalProfile?.address, 0, 100)
      console.log('pageof followers', pageOfFollowers)
  
      // Extract items from pageOfFollowers
      const followerItems = Object.values(pageOfFollowers?.items ?? []);
      const followingItems = Object.values(pageOfFollowing?.items ?? []) ;
  
      // Combine followerItems and followingItems into one array
      const allItems = [...followerItems, ...followingItems];
  
      // Use Promise.all to fetch all profiles in parallel
      const allProfiles = await Promise.all(allItems.map(address => fetchProfile(address)));
  
      // Split the profiles back into followers and following
      const retrievedFollowerProfiles = allProfiles.slice(0, followerItems.length);
      const retrievedFollowingProfiles = allProfiles.slice(followerItems.length);
  
      // Set State
      setFollowerProfiles(retrievedFollowerProfiles)
      setFollowingProfiles(retrievedFollowingProfiles)
    }
    handleGettingInfo()
  }, [universalProfile])



  return (
    <aside className="mt-24 w-64 h-screen fixed shadow-lg overflow-y-auto border-gray-400 bg-slate-900">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-600 mt-6">Following</h2>
      <ul className="overflow-auto">
        {/* {friends.map((friend) => (
          <li key={friend.id} className="p-2 hover:bg-gray-500 cursor-pointer">
            {friend.name}
          </li>
        ))} */}
        
        {universalProfile ?  (followingProfiles.length === 0 ? (
          <li className="p-2 hover:bg-gray-500 cursor-pointer text-gray-300">
            No following yet
            </li>
            ) : (
            followingProfiles.map((profile) => (
              <li key={profile.address} className="p-2 hover:bg-gray-500 cursor-pointer text-gray-300">
                {profile.name}
              </li>
            ))
          )) : (
            <li className="p-2 hover:bg-gray-500 cursor-pointer text-gray-300">
              Connect your UP to view following
            </li>
          )
        }
      </ul>
      <h2 className="text-xl font-semibold p-4 border-b border-gray-600 mt-10">Followers</h2>
      <ul className="overflow-auto">
        {/* {friends.map((friend) => (
          <li key={friend.id} className="p-2 hover:bg-gray-500 cursor-pointer">
            {friend.name}
          </li>
        ))} */}
        
        {universalProfile ?  (followingProfiles.length === 0 ? (
          <li className="p-2 hover:bg-gray-500 cursor-pointer text-gray-300">
            No followers yet
            </li>
            ) : (
            followerProfiles.map((profile) => (
              <li key={profile.address} className="p-2 hover:bg-gray-500 cursor-pointer text-gray-300">
                {profile.name}
              </li>
            ))
          )) : (
            <li className="p-2 hover:bg-gray-500 cursor-pointer text-gray-300">
              Connect your UP to view followers
            </li>
          )
        }
      </ul>
    </aside>
  );
};

export default LeftNavBar;
