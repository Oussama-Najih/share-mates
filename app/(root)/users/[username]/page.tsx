import NotFound from "@/components/error/NotFound";
import { prisma } from "@/db/prisma";
import { getServerUser } from "@/lib/serverFuncs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PageProps {
  params: { username: string };
}

//Deduplicate the 2 requests with getUser()
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  if (!user) <NotFound message="User not found" />;

  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const loggedInUser = await getServerUser();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: ` (@${loggedInUser.name})`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  if (!user) return <NotFound message={`User ${username}`} />;

  return <div>{username}</div>;
}
