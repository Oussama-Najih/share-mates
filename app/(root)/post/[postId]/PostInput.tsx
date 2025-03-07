"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

export default function PostInput() {
  const [input, setInput] = useState("");

  return (
    <form className="flex w-full items-center gap-2">
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button type="submit" variant="ghost" size="icon" disabled={true}>
        <SendHorizonal />
      </Button>
    </form>
  );
}
