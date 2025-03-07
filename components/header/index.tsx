import { auth } from "@/auth";
import MainSideBar from "../sideBars/MainSideBar";
import UserButton from "../user/UserButton";
import ModeToggle from "./ModeToggle";
import SubjectsDrawer from "./SubjectsDrawer";
import Search from "./Search";
import { filterType } from "@/index/helpers";

export default async function index({
  isSubjectsPage,
}: {
  isSubjectsPage: boolean;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const user = session.user;

  return (
    <header className="flex mb-5 justify-between border-b border-border items-center px-8 py-8  h-14 relative w-full top-0  shadow-md">
      <div className="flex items-center space-x-6 md:space-x-12">
        <MainSideBar />
        <h1 className="text-2xl text-foreground font-poppins font-bold">
          Flow
        </h1>
      </div>
      {isSubjectsPage && (
        <div className="flex justify-center gap-4 items-center">
          <SubjectsDrawer />
          <Search />
        </div>
      )}
      <div className="flex items-center space-x-6 md:space-x-12">
        <ModeToggle />
        <UserButton user={user} />
      </div>
    </header>
  );
}
