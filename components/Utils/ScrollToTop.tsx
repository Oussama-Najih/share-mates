"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollButtonProps {
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center-left"
    | "center-right";
}

export default function ScrollButton({
  position = "bottom-right",
}: ScrollButtonProps) {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setIsAtTop(scrollY === 0);
      setIsAtBottom(scrollY + windowHeight >= fullHeight - 10);

      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col items-center space-y-2 transition-opacity duration-500",
        isScrolling ? "opacity-0 pointer-events-none" : "opacity-100",
        {
          "top-5 left-5": position === "top-left",
          "top-5 right-5": position === "top-right",
          "bottom-5 left-5": position === "bottom-left",
          "bottom-5 right-5": position === "bottom-right",
          "top-1/2 left-5 -translate-y-1/2": position === "center-left",
          "top-1/2 right-5 -translate-y-1/2": position === "center-right",
        },
      )}
    >
      {!isAtTop && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-secondary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="p-3 bg-secondary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
        >
          <ChevronDown size={24} />
        </button>
      )}
    </div>
  );
}
