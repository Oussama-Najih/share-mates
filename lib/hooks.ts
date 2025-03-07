import { auth } from "@/auth";

export async function getServerUser() {
  const session = await auth();

  if (session) {
    const { user } = session;
    return user;
  }

  return null;
}
