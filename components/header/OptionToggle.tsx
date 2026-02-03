"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, FileText, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OptionToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedOption, setSelectedOption] = useState("Tous les posts");

  useEffect(() => {
    const option = searchParams.get("option") || "Tous les posts";
    setSelectedOption(option);
  }, [searchParams]);

  const options = [
    { icon: <CheckCircle size={16} />, label: "CORRECTIONS" },
    { icon: <FileText size={16} />, label: "Énoncés" },
    { icon: <Search size={16} />, label: "Tous les posts" },
  ];

  const handleSelectChange = (option: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (option !== "Tous les posts") {
      params.set("option", option);
    } else {
      params.delete("option");
    }

    router.push(`/matieres?${params.toString()}`);
  };

  return (
    <div className="w-40 md:w-64">
      <Select value={selectedOption} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue>{selectedOption}</SelectValue>
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
