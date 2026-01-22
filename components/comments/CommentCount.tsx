import { useCommentChildrenCount } from "@/lib/hooks";
import { MessageCircle } from "lucide-react";

function CommentCount({
  commentId,
  initialState,
  areChildrenHidden,
  setAreChildrenHidden,
}: {
  commentId: string;
  initialState: number;
  areChildrenHidden: boolean;
  setAreChildrenHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: count } = useCommentChildrenCount(commentId, initialState);

  return (
    <button
      onClick={() => setAreChildrenHidden((prev) => !prev)}
      className="text-sm mt-2"
    >
      {areChildrenHidden && (
        <div className="flex gap-1 items-center">
          <MessageCircle className="text-white" />
          <p>{count}</p>
        </div>
      )}
    </button>
  );
}
export default CommentCount;
