'use server';
import { SocialNetworkPost } from "../types/SocialNetworkPost";
import { fetchPost } from "../utils/social-network-post";
import { Page } from "../types/Page";
import { SocialNetwork } from "../utils/social-network";
import _ from "lodash";

const getPost = async (address: string): Promise<null | SocialNetworkPost> => {
  const post = await fetchPost(address);
  return post;
};

const fetchPostAddresses = async (): Promise<null | Page<string>> => {
  const page: Page<string> = {
    totalItemCount: 0,
    itemCount: 0,
    items: {},
  };
  try {
    const eventFilter = SocialNetwork.filters.UserCreatedPost();
    const events = await SocialNetwork.queryFilter(eventFilter);
    page.items = _.reverse(
      events.map((event) => event?.args?.newPost).filter((address) => address)
    ).reduce(
      (items: any, item: any, index: number) => ({
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

export const fetchPosts = async () => {
  const page = await fetchPostAddresses();
  if (page?.items) {
    const addresses = Object.values(page.items);
    const postsData = await Promise.all(
      addresses.map((address) => getPost(address))
    );
    // setPosts(postsData);
    return postsData
  }
};