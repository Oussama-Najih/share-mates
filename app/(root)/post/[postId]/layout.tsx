import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col container">
      <Header isWork={false} isSubjectsPage={false} />
      {children}
    </div>
  );
}
