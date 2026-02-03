"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useParentIds } from "@/lib/hooks";

export default function ScrollToComment() {
  const { setParentIds } = useParentIds();
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");

  async function fetchParentIds(commentId: string | null) {
    if (!commentId) return [];

    const ids: string[] = [];

    let currentId: string | null = commentId;

    while (currentId) {
      ids.push(currentId);

      const parentId: string = await fetch(
        `/api/parentComment/${currentId}`,
      ).then((res) => res.json());

      currentId = parentId || null;
    }

    return ids.slice(1).reverse();
  }

  useEffect(() => {
    if (!commentId) return;

    fetchParentIds(commentId).then(async (ids) => {
      setParentIds(ids);
      console.log("Parent Ids:", ids);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      const element = document.getElementById(commentId || "");
      console.log("Scrolling to element:", element);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        element.classList.add("highlight-effect");
        setTimeout(() => element.classList.remove("highlight-effect"), 3000);
      }
    });
  }, [commentId, setParentIds]);

  return null;
}
