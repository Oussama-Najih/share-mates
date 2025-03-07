"use client";

import Warning from "@/components/error";

const NotFound = ({ message }: { message?: string }) => {
  return (
    <Warning
      h1="Not Found"
      p={`Could not find ${message ?? "the requested page."}`}
    />
  );
};

export default NotFound;
