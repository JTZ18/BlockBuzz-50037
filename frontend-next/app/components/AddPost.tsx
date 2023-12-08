"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Textarea } from "./ui/textarea"
import { toast, useToast } from "./ui/use-toast"
import React, { useState, useContext } from "react"
import { uploadImageToIPFS } from "../utils/ipfs-client"
import { createStandalonePost } from "../utils/social-network-post"
import { LoadingButton } from "./ui/LoadingButton"
import EthersContext from "../context/EthersContext/EthersContext"
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useSignaller } from "../context/CachedProfilesAndPostsContext/useSignaller"

const FormSchema = z.object({
  post: z
    .string()
    .min(1, {
      message: "Post must be at least 1 character.",
    })
    .max(160, {
      message: "Post must not be longer than 30 characters.",
    }),
  image: z.instanceof(File).optional()
})

interface Props {
  classNameButton?: string;
}

export function AddPost({ classNameButton = '' }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const [loading, setLoading] = useState(false)
  const [postContent, setPostContent] = useState<string>('');
  const [postImage, setPostImage] = useState<string>('');
  const [postFile, setPostFile] = useState<File>()
  const { provider, universalProfile } = useContext(EthersContext);
  const { posts, refetchPost } = useContext(CachedProfilesAndPostsContext)
  const { toast } = useToast();
  const { signaller, toggle } = useSignaller();

  const validate =
  provider &&
  universalProfile &&
  universalProfile.socialNetworkProfileDataContract;

  // if (!validate) return null;

  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        // You can perform image validation here if needed
        const imageFile = event.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setPostImage(imageUrl);
        setPostFile(imageFile)
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (!validate) {
        toast({
          title: "No Universal Profile detected",
          description: "Please connect profile or download the UP Extension",
          variant: "destructive",
        })
        return
       }
      setLoading(true);
      // if (!postContent && !postImage) return;
      // upload image to IPFS and get back imageurl link
      let image;
      if (postFile) {
        const uploadResult = await uploadImageToIPFS(postFile);
        if (uploadResult !== null) {
          image = uploadResult;
        }
      }

      const newPost = await createStandalonePost(provider, data.post, image);
      if (newPost) {
        // await refetchPost(Object.keys(posts)[0]); // This will trigger a re-render of components consuming the posts state
        toggle()
        // Clear the form fields and image preview
        form.reset();
        setPostImage('');
        setPostFile(undefined);
      }

      setLoading(false);
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (e) {
      setLoading(false)
    }

  }

  return (
    <Dialog>
      {universalProfile ? (
      <DialogTrigger asChild>
      <Button variant="default" className={`${classNameButton}`}>Create Post</Button>
      </DialogTrigger>
      ) : (
      <DialogTrigger asChild>
      <Button variant="default" disabled className={`${classNameButton} bg-slate-400 cursor-not-allowed`}>Connect your UP to Create Post</Button>
      </DialogTrigger>
      )}
     
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>
            {`Write your thoughts here. Click post when you're done`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="post"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Post</FormLabel>
                  <FormControl>
                    <div className="w-full flex flex-col">
                      <Textarea
                        placeholder="What's happening?"
                        className="resize-none"
                        {...field}
                      />
                      <Input id="picture" type="file" onChange={handleImageChange} accept=".jpg,.png,.jpeg" className="my-4" />
                      {postImage && (
                        <img src={postImage} alt="Preview" className="mt-4" />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a picture
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {loading ? <LoadingButton /> : <Button type="submit">Post</Button>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
