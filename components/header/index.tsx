import { auth, signOut } from "@/auth";
import "animate.css";
import { SheetDemo } from "../sideBars/MainSideBar";
import UserButton from "../user/UserButton";
import { User } from "@prisma/client";
import { UserInfo } from "@/index/types";

export default async function index() {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const user = session.user;

  return (
    <header className="flex justify-between items-center px-12 py-8  h-14 fixed w-full top-0  shadow-md">
      <div className="flex items-center space-x-4">
        <SheetDemo />
        <h1 className="text-2xl text-foreground font-poppins font-bold">
          Flow
        </h1>
      </div>
      <UserButton user={user as UserInfo} />

      {/* {children} */}
    </header>
  );
}
