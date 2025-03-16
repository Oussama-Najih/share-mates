"use client";

import { useState, useEffect } from "react";
import { FileText, Image, CheckCircle, Camera } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils"; // Utility for conditional classNames

export default function MediaTypeToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to hold the selected media type
  const [selectedMediaType, setSelectedMediaType] = useState("Tous les posts");

  useEffect(() => {
    // Sync the selectedMediaType state with the current searchParam
    const type = searchParams.get("type_Media") || "Tous les posts";
    setSelectedMediaType(type);
  }, [searchParams]); // Re-run effect when searchParams change

  const options = [
    { icon: <FileText size={16} />, label: "PDF" },
    { icon: <Camera size={16} />, label: "IMAGE" },
    { icon: <CheckCircle size={16} />, label: "Tous les posts" },
  ];

  const handleSelect = (option: string) => {
    setSelectedMediaType(option);
    const params = new URLSearchParams(searchParams.toString());

    if (option !== "Tous les posts") {
      params.set("type_Media", option);
    } else {
      params.delete("type_Media");
    }

    router.push(`/matieres?${params.toString()}`);
  };

  return (
    <div className="flex mb-4 max-w-[50rem] mx-auto justify-between space-x-2 bg-gray-100 p-1 rounded-lg">
      {options.map(({ icon, label }) => (
        <button
          key={label}
          onClick={() => handleSelect(label)}
          className={cn(
            "flex flex-1 items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition",
            selectedMediaType === label
              ? "bg-blue-600 text-white shadow"
              : "text-gray-700 hover:bg-gray-300"
          )}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </button>
      ))}
    </div>
  );
}
