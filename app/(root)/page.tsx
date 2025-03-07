import Header from "@/components/header";
import AnnouncementsCarousel from "@/components/home/AnnouncementsCarousel";
import { getAnnouncements } from "@/lib/actions/announcements.actions";
import { announcements } from "@/sampleData";

export default async function Page() {
  return (
    <div className="flex min-h-screen flex-col py-2">
      <Header isSubjectsPage={false} />
      <AnnouncementsCarousel data={announcements} />
    </div>
  );
}
