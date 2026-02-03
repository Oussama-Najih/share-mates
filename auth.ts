import type { NextAuthConfig } from "next-auth";
import { compare } from "bcrypt-ts-edge";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth";

const prismaAdapter = PrismaAdapter(prisma) as Adapter;

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  adapter: prismaAdapter,
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
              { original_name: credentials.name as string },
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

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { image: true, name: true },
      });

      session.user.id = token.sub;
      session.user.role = token.role;
      if (user) {
        session.user.name = user.name;
      } else {
        session.user.name = token.name!;
      }
      session.user.image = user?.image ?? token.image;

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
