"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";

const Warning = ({ h1, p }: { h1: string; p: string }) => {
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
            className="mt-4 ml-2"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
