"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { subjectsWithIcons } from "@/lib/constants";
import { School } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function SubjectsDrawer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // State to hold the selected subject
  const [selectedSubject, setSelectedSubject] = useState("Toutes_les_matieres");
  const selectedIcon =
    subjectsWithIcons.find((s) => s.name === selectedSubject)?.icon || School;

  useEffect(() => {
    // Sync the selectedSubject state with the current searchParam
    const subject = searchParams.get("matiere") || "Toutes_les_matieres";
    setSelectedSubject(subject);
  }, [searchParams]); // Re-run effect when searchParams change

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    const params = new URLSearchParams(searchParams.toString());

    if (subject !== "Toutes_les_matieres") {
      params.set("matiere", subject);
    } else {
      params.delete("matiere");
    }

    router.push(`/matieres?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          {React.createElement(selectedIcon, { size: 24 })}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="font-bold font-poppins mb-4">
            Matieres
          </SheetTitle>
        </SheetHeader>
        {/* ✅ Added custom scrollbar styles */}
        <div className="flex flex-col gap-2 px-4 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {subjectsWithIcons.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              variant={name === selectedSubject ? "default" : "ghost"}
              className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleSubjectClick(name)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{name}</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
