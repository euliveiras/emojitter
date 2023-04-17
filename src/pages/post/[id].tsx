import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import { api } from "~/utils/api";
import Head from "next/head";
import { Layout } from "~/components/layout";
import { PostView } from "~/components/post-view";
import { generateSSGHelper } from "~/server/ssg-helper";

type ProfilePageProps = { postId: string };

const SinglePostPage: NextPage<ProfilePageProps> = (props) => {
  const { data } = api.posts.getById.useQuery({ id: props.postId });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <Layout>
        <PostView author={data.author} post={data.post} key={data.post.id} />
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = generateSSGHelper();
  const postId = ctx.params?.id;

  if (typeof postId !== "string") throw new Error("no slug");

  await ssg.posts.getById.prefetch({ id: postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

export default SinglePostPage;
