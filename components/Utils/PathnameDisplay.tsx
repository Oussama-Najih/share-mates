"use client";

import { usePathname } from "next/navigation";

const PathnameDisplay = () => {
  const pathname = usePathname();

  return <p>Current Path: {pathname}</p>;
};

export default PathnameDisplay;
