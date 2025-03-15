import { auth } from "@/auth";
import Header from "@/components/header";
import Add from "@/components/home/Add";
import AnnouncementsCarousel from "@/components/home/AnnouncementsCarousel";
import { getAnnouncements } from "@/lib/actions/announcements.actions";
import { SessionProvider } from "next-auth/react";

export default async function Page() {
  const announcements = await getAnnouncements();
  console.log({ announcements });

  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="flex min-h-screen flex-col py-2">
      <Header isWork={false} isSubjectsPage={false} />
      {!!announcements.length ? (
        <AnnouncementsCarousel data={announcements} userId={session.user.id} />
      ) : (
        <div className="flex flex-col mt-10 items-center gap-y-20">
          <Add />
          <h1 className="text-center font-roboto text-4xl lg:text-5xl">
            Pas d'avis/annonces publiés
          </h1>
        </div>
      )}
    </div>
  );
}
