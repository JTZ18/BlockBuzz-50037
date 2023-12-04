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

interface PostCard {
  // data: Post;
  data: SocialNetworkPost | null
}

const PostCard: React.FC<PostCard> = ({ data }) => {
  return (
    <Link
      href="/"
      className="outline-0 focus:ring-2 hover:ring-2 ring-primary transition duration-300 rounded-lg"
    >
      <Card className="rounded-lg border-2 p-5">
        <CardContent className="flex">
          <div className="mr-6">
            <Avatar>
              <AvatarImage src={data?.profileImage?.[0].url} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <p className="font-semibold text-lg">{data?.author}</p>
              <p className="text-sm text-primary/80">{data?.content}</p>
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
          <LikeButton/>
          <CommentsList/>
          <AddComment />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard;
