import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

export default function useCommentsCount(postId: string, initialState: number) {
  const query = useQuery({
    queryKey: ["commentsCount", postId],
    queryFn: () =>
      kyInstance.get(`/api/commentsCount/${postId}`).json<number>(),
    initialData: initialState,
  });

  return query;
}
