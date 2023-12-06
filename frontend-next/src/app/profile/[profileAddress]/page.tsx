import React from 'react';
import Container from '@/app/components/ui/container'
import PostList from '@/app/components/PostList'
import ProfileCard from '@/app/components/ProfileCard';

const ProfilePage = () => {
  // Your component logic goes here

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProfileCard />
          <PostList />
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
