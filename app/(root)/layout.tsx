import type { Metadata } from "next";
import ScrollToTop from "@/components/Utils/ScrollToTop";

export const metadata: Metadata = {
  title: "Flow",
  description: "A modern school platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col container">
      <ScrollToTop />
      {children}
    </div>
  );
}
