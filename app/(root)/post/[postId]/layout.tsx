import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col items-center container">
      <Header isSubjectsPage={false} />
      {children}
    </div>
  );
}
