import Image from 'next/image'
import Hero from './components/Hero'
import Container from './components/ui/container'
import { Button } from './components/ui/button'
import PostList from './components/PostList'
import Loading from './loading'
import { ThirdwebProvider } from './components/ThirdwebProvider';
import { SocialNetwork } from './utils/social-network'
import { Page } from './types/Page'
import _ from "lodash";
import { SocialNetworkPost } from './types/SocialNetworkPost'
import { fetchPost } from './utils/social-network-post'
import { fetchPosts } from './lib/data'


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


export default async function Home() {

  // const posts = await getPosts()
  // const posts = await fetchPosts()
  // console.log(posts);
  //PostList items={posts} />

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <PostList />
        </div>
      </div>
    </Container>
  )
}