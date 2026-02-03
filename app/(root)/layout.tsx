import type { Metadata } from "next";
import ScrollToTop from "@/components/Utils/ScrollToTop";

export const metadata: Metadata = {
  title: "ShareMates",
  description: "A modern school platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col items-center container">
      <ScrollToTop />
      {children}
    </div>
  );
}
