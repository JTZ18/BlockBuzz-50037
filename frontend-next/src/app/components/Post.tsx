interface PostProps {
  imageSrc: string;
  altText: string;
  postTitle: string;
  postContent: string;
  postAuthor: string;
}

export default function Post({imageSrc, altText, postTitle, postContent, postAuthor}: PostProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure><img src={imageSrc} alt={altText} /></figure>
      <div className="card-body">
        <h2 className="card-title">{postTitle}</h2>
        <p>{postContent}</p>
        <p className="text-sm text-gray-500">Posted by {postAuthor}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Like</button>
          <button className="btn">Comment</button>
        </div>
      </div>
    </div>
  )
}