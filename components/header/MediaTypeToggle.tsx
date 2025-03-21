"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Camera, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const handleSelectChange = (option: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (option !== "Tous les posts") {
      params.set("type_Media", option);
    } else {
      params.delete("type_Media");
    }

    router.push(`/matieres?${params.toString()}`);
  };

  return (
    <div className="w-40 md:w-64">
      <Select value={selectedMediaType} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue>{selectedMediaType}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, icon }) => (
            <SelectItem key={label} value={label}>
              <div className="flex items-center gap-2">
                {icon}
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
