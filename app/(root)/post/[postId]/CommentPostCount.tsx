import { usePostCommentsCount } from "@/lib/hooks";

type CommentCountProps = {
  postId: string;
  initialState: number;
};

export default function CommentCount({
  postId,
  initialState,
}: CommentCountProps) {
  const { data: count } = usePostCommentsCount(postId, initialState);

  return (
    <span className="text-sm font-medium tabular-nums">
      {count} <span>comments</span>
    </span>
  );
}
