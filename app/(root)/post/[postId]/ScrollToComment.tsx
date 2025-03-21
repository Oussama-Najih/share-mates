"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToComment() {
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");

  useEffect(() => {
    if (commentId) {
      const timeout = setTimeout(() => {
        const element = document.getElementById(commentId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          // Add highlight effect
          element.classList.add("highlight-effect");

          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.classList.remove("highlight-effect");
          }, 3000);
        }
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [commentId]);

  return null;
}
