import { prisma } from "@/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import { getUserDataSelect } from "@/index/prisma/types";
import { ExtendedUser } from "@/types/next-auth";
import UserProfile from "./UserProfile";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Header from "@/components/header";

//Deduplicate the 2 requests with getUser()
const getUser = cache(async (loggedInUser: ExtendedUser) => {
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: loggedInUser.name,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(),
  });

  if (!user) notFound();

  return user;
});

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }
  const { user: loggedInUser } = session;

  const detailedLoggedInUser = await getUser(loggedInUser);

  return (
    <>
      <Header isSubjectsPage={false} />
      <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
          <SessionProvider session={session}>
            <UserProfile detailedLoggedInUser={detailedLoggedInUser} />
            <div className="rounded-2xl bg-card p-5 shadow-sm">
              <h2 className="text-center text-2xl font-bold">Your posts</h2>
            </div>
            <UserPosts userId={session.user.id} />
          </SessionProvider>
        </div>
      </main>
    </>
  );
}
