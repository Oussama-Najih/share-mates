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

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { name: credentials.name as string },
              { original_name: credentials.name as string }, // Assuming you want to match either field
            ],
          },
        });

        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password,
          );

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

      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name!;
      session.user.image = token.image;

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
