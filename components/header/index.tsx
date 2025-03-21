import { auth } from "@/auth";
import MainSideBar from "../sideBars/MainSideBar";
import UserButton from "../user/UserButton";
import ModeToggle from "./ModeToggle";
import SubjectsDrawer from "./SubjectsDrawer";
import Search from "./Search";
import OptionToggle from "./OptionToggle";
import MediaTypeToggle from "./MediaTypeToggle";
import { prisma } from "@/db/prisma";

export default async function index({
  isSubjectsPage,
  isCoursPage = false,
}: {
  isSubjectsPage: boolean;
  isCoursPage?: boolean;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const user = session.user;

  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <header>
      <section className="flex justify-between border-b border-border items-center px-8 py-8  h-14 relative w-full top-0 shadow-md">
        <nav className="flex w-full items-center justify-between space-x-6 md:space-x-12">
          <MainSideBar unreadNotificationCount={unreadNotificationCount} />
          <h1 className="text-2xl hidden sm:block text-foreground font-poppins font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <div className="flex items-center space-x-6 sm:space-x-12">
            <ModeToggle />
            <UserButton user={user} />
          </div>
        </nav>
      </section>
      {isSubjectsPage && (
        <div className="px-4">
          <div className="flex mb-4 py-4 border-b-2 w-full justify-around gap-4 items-center">
            <SubjectsDrawer />
            <Search />
          </div>
          <div className="flex pb-4 justify-around items-center">
            {!isCoursPage && <OptionToggle />}
            <MediaTypeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
