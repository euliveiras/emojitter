import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
type PostsWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostsWithUser) => {
  const { author, post } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        className="h-16 w-16 rounded-full"
        src={author.profilePicture}
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 font-bold text-slate-300">
          <Link href={`@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`· ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
