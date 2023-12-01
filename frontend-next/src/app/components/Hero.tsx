import Image from "next/image";
import Post from "./Post";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">

      <Post
        imageSrc="https://example.com/image.jpg"
        altText="A beautiful sunset"
        postTitle="My Vacation"
        postContent="I had a great time on my vacation. Here's a picture of the sunset!"
        postAuthor="John Doe"
      />

      </div>
    </section>
  );
};

export default Hero;