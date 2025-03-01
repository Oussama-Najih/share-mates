import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log("middleware");
  const { nextUrl } = req;
  const loggedIn = !!req.auth;

  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!loggedIn && nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
