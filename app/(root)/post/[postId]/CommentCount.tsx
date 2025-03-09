import useCommentsCount from "@/lib/hooks";

type CommentCountProps = {
  postId: string;
  initialState: number;
};

export default function CommentCount({
  postId,
  initialState,
}: CommentCountProps) {
  const { data: count } = useCommentsCount(postId, initialState);

  return (
    <span className="text-sm font-medium tabular-nums">
      {count} <span>comments</span>
    </span>
  );
}
