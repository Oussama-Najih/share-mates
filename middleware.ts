import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const loggedIn = !!req.auth;

  // Allow API routes like /api/auth and /api/uploadthing to bypass auth
  if (
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/api/uploadthing") ||
    nextUrl.pathname.startsWith("/api/comments")
  ) {
    return NextResponse.next();
  }

  // if (!loggedIn && nextUrl.pathname === "/profile") {
  //   const signInUrl = new URL("/sign-in", req.url);
  //   signInUrl.searchParams.set("callbackUrl", nextUrl.toString());
  //   return NextResponse.redirect(signInUrl);
  // }

  if (!loggedIn && nextUrl.pathname !== "/sign-in") {
    const signInUrl = new URL("/sign-in", req.url);

    // Preserve the callbackUrl parameter
    signInUrl.searchParams.set("callbackUrl", nextUrl.toString());

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next|api).*)", "/", "/(trpc)(.*)"],
// };
