"use client";

import { CommentsPage } from "@/index/prisma/types";
import kyInstance from "@/lib/ky";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";

type CommmentsData = {
  pages: CommentsPage[];
  pageParams: (string | null)[];
};

function AuthorName({
  postAuthorId,
  name,
}: {
  postAuthorId: string;
  name: string;
}) {
  const avatarQueryKey: QueryKey = [`user-name-${postAuthorId}`];

  const apiUrl = `/api/name/${postAuthorId}`;

  const { data } = useQuery({
    queryKey: avatarQueryKey,
    queryFn: () =>
      kyInstance
        .get(
          apiUrl,
          postAuthorId ? { searchParams: { userId: postAuthorId } } : undefined,
        )
        .json<{ name: string | null }>(),
    initialData: { name: name || null },
  });

  return (
    <h1 className="font-roboto text-primary mb-5 text-xl md:text-3xl text-center">
      {data?.name}
    </h1>
  );
}
export default AuthorName;
