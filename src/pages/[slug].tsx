import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import { api } from "~/utils/api";
import Head from "next/head";
import { Layout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/post-view";
import { generateSSGHelper } from "~/server/ssg-helper";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted yet!</div>;

  return (
    <div>
      {data.map(({ post, author }) => (
        <PostView author={author} post={post} key={post.id} />
      ))}
    </div>
  );
};

type ProfilePageProps = { username: string };

const ProfilePage: NextPage<ProfilePageProps> = (props) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: props.username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{props.username}</title>
      </Head>
      <Layout>
        <div className="relative h-36  bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={`${data.username ?? ""} profile's pic`}
            width={128}
            height={128}
            className=" absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data?.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = generateSSGHelper();
  const slug = ctx.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export default ProfilePage;
