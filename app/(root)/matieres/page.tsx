import Header from "@/components/header";
import PostEditor from "../../../components/Utils/PostEditor";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Posts from "./_posts/Posts";

export default async function page(props: {
  searchParams: Promise<{
    matiere?: string;
    categorie?: string;
  }>;
}) {
  const session = await auth();

  const {
    matiere = "Toutes les matieres",
    categorie = "Toutes les categories",
  } = await props.searchParams;

  return (
    <div>
      <Header isSubjectsPage={true} />
      <h1
        className="font-poppins text-xl border-b border-primary
      pb-4 text-center text-primary mb-5"
      >
        {matiere} / {categorie}
      </h1>
      {matiere !== "Toutes les matieres" &&
      categorie !== "Toutes les categories" ? (
        <SessionProvider session={session}>
          <PostEditor />
        </SessionProvider>
      ) : null}
      <div className="flex flex-col items-center ">
        <Posts />
      </div>
    </div>
  );
}
