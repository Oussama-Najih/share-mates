import type { Metadata } from "next";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Prostore",
  description: "A modern school platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex min-h-screen flex-col container">{children}</div>;
}
