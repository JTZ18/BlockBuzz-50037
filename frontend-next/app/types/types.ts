export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  image?: string;
  likes: number;
  comments: number;
}

declare global {
  interface Window {
    ethereum: any;
  }
}