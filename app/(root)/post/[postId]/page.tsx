import { prisma } from "@/db/prisma";
import { getPostDataInclude, PostData } from "@/index/prisma/types";
import { getServerUser } from "@/lib/serverFuncs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, use } from "react";
import Image from "next/image";
import Help from "./Help";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import UserAvatar from "@/components/user/UserAvatar";

interface PageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const user = await getServerUser();
  const { postId } = await params;

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.author.name}: ${post.content?.slice(0, 50)}...`,
  };
}

export default async function Page({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const { user } = session;

  const { postId } = await params;

  //Normally they should not see this ever because we check login in layout, but we still have to handle null case

  const post = await getPost(postId, user.id);

  return (
    <main className="flex flex-col items-center w-9/12 max-w-xl py-2 px-1 mx-auto min-w-0 gap-5">
      <section className="flex w-full  items-center gap-14 border-b-2">
        <h1 className="font-roboto text-primary mb-5 text-xl md:text-3xl text-center">
          @{post.author.name}
        </h1>
        <UserAvatar
          avatarUrl={post.author.image}
          size={250}
          className="size-full max-h-60 max-w-60 rounded-full"
        />
      </section>
      {post.attachment[0].type === "IMAGE" ? (
        <h1 className="font-serif text-xl border-b-2">{post.title}</h1>
      ) : (
        <a target="_blank" href={post.attachment[0].url}>
          <h1 className="font-serif text-xl hover:underline underline-offset-8 border-b-2">
            {post.title}
          </h1>
        </a>
      )}

      {post.attachment[0].type === "IMAGE" ? (
        // <TransformWrapper
        //   initialScale={1}
        //   initialPositionX={100}
        //   initialPositionY={200}
        // >
        //   <TransformComponent>
        //     <Image
        //       src={post.attachment[0].url}
        //       alt={post.title}
        //       width={350}
        //       height={300}
        //       className="w-full object-cover rounded-md"
        //     />
        //   </TransformComponent>
        // </TransformWrapper>
        <Image
          src={post.attachment[0].url}
          alt={post.title}
          width={350}
          height={300}
          className="w-full object-cover rounded-md"
        />
      ) : (
        <a
          target="_blank"
          href={post.attachment[0].url}
          className="inline-block text-blue-500 text-sm md:text-md"
        >
          <div className="h-[300px] aspect-square flex items-center justify-center bg-[url('/images/pdf_image.png')] bg-center bg-cover"></div>
        </a>
      )}
      {post.content ? (
        <h2 className="border-b-2">{post.content}</h2>
      ) : (
        <h1 className="font-roboto w-full text-center pb-3 border-b-2 text-xl">
          <span className="text-blue-500">@{post.author.name}</span> didn't add
          any description
        </h1>
      )}
      <Help post={post} userId={user.id} />
    </main>
  );
}
