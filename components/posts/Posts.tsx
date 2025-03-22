"use client";

import { PostsPage } from "@/index/prisma/types";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PostsLoadingSkeleton from "./PostsLoadingSkeleten";
import InfiniteScrollContainer from "@/components/Utils/InfiniteScrollContainer";
import Post from "./Post";
import { Loader2 } from "lucide-react";

export default function Posts({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const matiere = searchParams.get("matiere");
  const categorie = searchParams.get("categorie");
  const option = searchParams.get("option");
  const mediaType = searchParams.get("type_Media");

  const queryKey = ["matieres"];
  if (matiere) {
    queryKey.push(matiere);
  }
  if (categorie) {
    queryKey.push(categorie);
  }
  if (option) {
    queryKey.push(option);
  }
  if (mediaType) {
    queryKey.push(mediaType);
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
      if (option) searchParams.option = option;
      if (mediaType) searchParams.type_Media = mediaType;
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
    return (
      <div className="w-screen">
        <PostsLoadingSkeleton />
      </div>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="leading-loose text-center text-2xl md:text-3xl text-muted-foreground">
        <h1 className="font-semibold ">
          Personne n'a encore rien posté.
          <br /> Soyez le premier !!
        </h1>
        <br />
        {(!matiere ||
          !categorie ||
          (!option && categorie !== "COURS") ||
          !mediaType) && (
          <h2 className="mb-4">Pour créer un post, choisissez : </h2>
        )}
        <ul className="list-disc list-inside flex flex-col items-center">
          {!matiere ? <li>Une matiere</li> : null}
          {!categorie ? <li>Une categorie</li> : null}
          {!option && categorie !== "COURS" ? (
            <li>Une option (Correction ou Exercices)</li>
          ) : null}
          {!mediaType ? <li>Un type de media</li> : null}
        </ul>
      </div>
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
      className="space-y-5 w-[100vw] "
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} userId={userId} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
