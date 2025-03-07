"use client";

import { PostsPage } from "@/index/prisma/types";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PostsLoadingSkeleton from "./PostsLoadingSkeleten";
import InfiniteScrollContainer from "@/components/Utils/InfiniteScrollContainer";
import Post from "./Post";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Posts() {
  const searchParams = useSearchParams();
  const matiere = searchParams.get("matiere");
  const categorie = searchParams.get("categorie");

  const queryKey = ["matieres"];
  if (matiere) {
    queryKey.push(matiere);
  }
  if (categorie) {
    queryKey.push(categorie);
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      const searchParams: Record<string, string> = {};

      if (matiere) searchParams.matiere = matiere;
      if (categorie) searchParams.categorie = categorie;
      if (pageParam) searchParams.cursor = pageParam;

      return kyInstance
        .get("/api/matieres", { searchParams })
        .json<PostsPage>();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-2xl md:text-3xl text-muted-foreground">
        No one has posted anything yet.
        <br /> Be the first !!
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5 w-full"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
