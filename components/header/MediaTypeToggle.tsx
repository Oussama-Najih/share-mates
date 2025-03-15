"use client";

import { useState } from "react";
import { FileText, Image, CheckCircle, Camera } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils"; // Utility for conditional classNames

export default function MediaTypeToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedMediaType = searchParams.get("type_Media") || "Tous les posts";

  const options = [
    { icon: <FileText size={16} />, label: "PDF" },
    { icon: <Camera size={16} />, label: "IMAGE" },
    {
      icon: <CheckCircle size={16} />,
      label: "Tous les posts",
    },
  ];

  const [selected, setSelected] = useState(selectedMediaType);

  const handleSelect = (option: string) => {
    setSelected(option);
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
            selected === label
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
