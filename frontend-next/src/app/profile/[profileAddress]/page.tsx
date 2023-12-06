import React from 'react';
import Container from '@/app/components/ui/container'
import PostList from '@/app/components/PostList'

interface Props {
  profileAddress: string;
}

const ProfilePage: React.FC<Props> = ({ profileAddress }) => {
  // Your component logic goes here

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <h1 className='font-bold'>Profile Page</h1>
          {/* <PostList /> */}
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
