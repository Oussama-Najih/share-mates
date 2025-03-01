// import NextAuth, { DefaultSession } from "next-auth";
// import { JWT } from "next-auth/jwt";

// // Extend the NextAuth.js types to include the role property
// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       role: "ADMIN" | "USER";
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     sub: string;
//     image: string | null;
//     role: "ADMIN" | "USER";
//   }
// }
