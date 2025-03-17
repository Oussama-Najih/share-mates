import type { NextAuthConfig } from "next-auth";
import { compare } from "bcrypt-ts-edge";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters"; // Import the Adapter type
import NextAuth from "next-auth";

const prismaAdapter = PrismaAdapter(prisma) as Adapter; // Explicitly cast

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  adapter: prismaAdapter, // Use the casted adapter
  providers: [
    CredentialsProvider({
      credentials: {
        name: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            name: credentials.name as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              role: user.role,
              image: user.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig,
    async session({ session, token }) {
      if (!token.sub) return session;

      // Fetch the latest user data from the database
      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { image: true }, // Only fetch the image
      });

      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name!;
      session.user.image = user?.image ?? token.image; // Always get the latest image

      return session;
    },

    async jwt({ token, user, trigger, session }) {

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.image = user.image;
      }
      if (session?.user.image && trigger === "update") {
        token.image = session.user.image;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
