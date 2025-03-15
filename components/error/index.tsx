"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation

const Warning = ({ h1, p }: { h1: string; p: string }) => {
  const router = useRouter();

  const handleHomeClick = () => router.push("/"); // Navigate to the homepage
  const handleBackClick = () => router.back(); // Navigate to the previous page

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-2/5 rounded-lg shadow-md py-3 border-2 border-red-200 flex flex-col items-center md:w-1/3">
        <Image
          src="/images/logo.svg"
          alt={`${APP_NAME} logo`}
          width={48}
          height={48}
          priority={true}
        />
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">{h1}</h1>
          <p className="text-destructive">{p}</p>
          <Button
            variant="outline"
            className="mt-4 ml-2 w-36"
            onClick={handleHomeClick} // Use router.push for home
            aria-label="Go to homepage"
          >
            Page d'accueil
          </Button>
          <Button
            variant="outline"
            className="mt-4 ml-2"
            onClick={handleBackClick} // Use router.back for previous page
            aria-label="Go back to previous page"
          >
            Page précèdente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
