import { auth } from "@/auth";
import Image from "next/image";
import PostsLoadingSkeleton from "../(root)/matieres/_posts/PostsLoadingSkeleten";

export default async function page() {
  const session = await auth();

  if (!session) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  return <PostsLoadingSkeleton />;
}
