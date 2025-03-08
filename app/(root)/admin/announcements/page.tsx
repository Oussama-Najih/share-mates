import { getAnnouncements } from "@/lib/actions/announcements.actions";
import { getUser } from "@/lib/serverFuncs";

export default async function Announcements() {
  const user = await getUser();
  const announcements = await getAnnouncements();

  return <div></div>;
}
