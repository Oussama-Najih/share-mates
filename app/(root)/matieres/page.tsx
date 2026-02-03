import Header from "@/components/header";
import PostEditor from "../../../components/Utils/PostEditor";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import NotFound from "@/components/error/NotFound";
import { Categorie, Subject } from "@prisma/client";
import Posts from "@/components/posts/Posts";

export default async function page(props: {
  searchParams: Promise<{
    matiere?: string;
    categorie?: string;
    option?: string;
    type_Media?: string;
  }>;
}) {
  const session = await auth();

  if (!session) {
    return <NotFound message="Unauthorized access." />;
  }
  const userId = session.user.id;

  const {
    matiere = "Toutes les matieres",
    categorie = "Toutes les categories",
    option = "Énoncés_ET_Corrections",
    type_Media = "PDF_ET_IMAGE",
  } = await props.searchParams;

  if (
    matiere !== "Toutes les matieres" &&
    !Object.values(Subject).includes(matiere as Subject)
  ) {
    return <NotFound message={`Invalid subject: ${matiere}`} />;
  }

  if (
    categorie !== "Toutes les categories" &&
    !Object.values(Categorie).includes(categorie as Categorie)
  ) {
    return <NotFound message={`Invalid category: ${categorie}`} />;
  }

  if (
    option !== "Énoncés_ET_Corrections" &&
    !["CORRECTIONS", "Énoncés"].includes(option)
  ) {
    return <NotFound message={`Invalid option: ${option}`} />;
  }

  if (type_Media !== "PDF_ET_IMAGE" && !["PDF", "IMAGE"].includes(type_Media)) {
    return <NotFound message={`Invalid mediaType: ${type_Media}`} />;
  }

  return (
    <div className="w-full">
      <Header isCoursPage={categorie == "COURS"} isSubjectsPage={true} />
      <h1
        className="font-poppins border-t-2 p-2 text-xl border-b-2 border-primary
        pb-4 text-center text-primary mb-5"
      >
        {matiere} / {categorie} / {categorie === "COURS" ? "" : `${option} / `}
        {type_Media}
      </h1>

      {/* Conditionally render PostEditor if applicable */}
      {matiere !== "Toutes les matieres" &&
        categorie !== "Toutes les categories" &&
        !(option === "Énoncés_ET_Corrections" && categorie !== "COURS") &&
        type_Media !== "PDF_ET_IMAGE" && (
          <SessionProvider session={session}>
            <PostEditor isPdf={type_Media === "PDF"} />
          </SessionProvider>
        )}

      <div className="w-full flex flex-col items-center">
        <Posts userId={userId} />
      </div>
    </div>
  );
}
