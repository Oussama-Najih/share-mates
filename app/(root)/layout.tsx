import type { Metadata } from "next";
import Header from "@/components/header";
import { SheetDemo } from "@/components/sideBars/MainSideBar";

export const metadata: Metadata = {
  title: "Prostore",
  description: "A modern school platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      {/* {children} */}
    </div>
  );
}
