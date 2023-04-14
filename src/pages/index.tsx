import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-16 w-16 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostsWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostsWithUser) => {
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
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`· ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  const user = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {user.isSignedIn ? (
              <CreatePostWizard />
            ) : (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {[...data, ...data, ...data].map((data) => (
              <PostView {...data} key={data.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
