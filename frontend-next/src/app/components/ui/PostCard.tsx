import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/card";

import { Post } from "@/app/types/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import LikeButton from "./LikeButton";
import AddComment from "../AddComment";
import CommentsList from "../CommentsList";
import { SocialNetworkPost } from "@/app/types/SocialNetworkPost";
import { Separator } from "./separator";

interface PostCard {
  // data: Post;
  data: SocialNetworkPost | null
}

const PostCard: React.FC<PostCard> = ({ data }) => {
  if (data?.referencedPost != "0x0000000000000000000000000000000000000000") { return null;}
  return (
    <Link
      href="/"
      className="outline-0 focus:ring-2 hover:ring-2 ring-primary transition duration-300 rounded-lg w-full my-4"
    >
      <Card className="rounded-lg border-2 p-5">
        <CardContent className="flex">
          <div className="mr-6">
            <Avatar>
              <AvatarImage src={data?.profileImage?.[0].url} />
              <AvatarFallback>{data?.profileName.slice(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <p className="font-semibold text-lg">{data?.profileName}</p>
              <p className="text-sm text-primary/80">{`${data?.author.slice(0, 6)}...${data?.author.slice(-4)}`}</p>
            </div>
            <div className="flex items-center justify-between">
              {/* {data?.timestamp} */}
            </div>
          </div>
        </CardContent>

        <CardDescription className="pt-4">
          {data?.image && (
            <div className="aspect-square relative bg-foreground/5 dark:bg-background rounded-lg">
              <Image
                src={data?.image}
                alt=""
                fill
                className="aspect-square object-cover rounded-lg"
              />
            </div>
          )}
        </CardDescription>

        <CardFooter className="flex flex-col mt-4 items-start">
          <div className='flex flex-row items-center justify-between w-full'>
            <p className="text-sm text-primary/80">{data?.content}</p>
            <LikeButton post={data}/>
            <p className="text-sm text-primary/80">{data?.likes}</p>
          </div>
          <Separator className="my-4"/>
          <CommentsList referencePostAddress={data?.address}/>
          <AddComment post={data}/>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard;
