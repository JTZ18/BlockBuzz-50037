'use client'
import Image from 'next/image'
import Container from './components/ui/container'
import PostList from './components/PostList'
import { ThirdwebProvider } from './components/ThirdwebProvider';
import _ from "lodash";
import { AddPost } from './components/AddPost'
import { useEffect, useState, useContext } from 'react';
import RegistrationDialog from './components/RegistrationDialog';
import EthersContext from './context/EthersContext/EthersContext';


const posts = [
  {
    id: '1',
    author: 'Author1',
    content: 'This is the content of the first post.',
    timestamp: Date.now(),
    image: 'https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-15.jpg',
    likes: 3,
    comments: 5,
  },
  {
    id: '2',
    author: 'Author2',
    content: 'This is the content of the second post.',
    timestamp: Date.now(),
    image: "https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic.png",
    likes: 20,
    comments: 10,
  },
  {
    id: '3',
    author: 'Author3',
    content: 'This is the content of the third post.',
    timestamp: Date.now(),
    image: "https://www.nawpic.com/media/2020/desktop-backgrounds-nawpic-21-300x200.jpg",
    likes: 30,
    comments: 15,
  },
];


export default function Home() {

  // const posts = await getPosts()
  // const posts = await fetchPosts()
  // console.log(posts);
  //PostList items={posts} />
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const { universalProfile } = useContext(EthersContext);

  useEffect(() => {
    if(!universalProfile) return
    if (universalProfile!.socialNetworkProfileDataERC725Contract) return;
    console.log('open register modal')
    setShowRegistrationModal(true)

  }, [universalProfile])

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <div className='flex w-full items-center justify-center mt-6'>
            <AddPost classNameButton='max-w-sm' />
          </div>
          <RegistrationDialog showModal={showRegistrationModal} setShowModal={setShowRegistrationModal}/>
          <PostList />
        </div>
      </div>
    </Container>
  )
}