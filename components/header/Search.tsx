"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to hold the selected category
  const [selectedOption, setSelectedOption] = useState("Toutes_les_categories");

  useEffect(() => {
    // Sync the selectedOption state with the current searchParam
    const category = searchParams.get("categorie") || "Toutes_les_categories";
    setSelectedOption(category);
  }, [searchParams]); // Re-run effect when searchParams change

  const handleSelectChange = (categorie: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categorie !== "Toutes_les_categories") {
      params.set("categorie", categorie);
    } else {
      params.delete("categorie");
    }

    router.push(`/matieres?${params.toString()}`);
  };

  return (
    <form action="/search" method="GET">
      <div className="flex w-40 md:w-64 items-center space-x-2">
        <Select value={selectedOption} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{selectedOption}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map(({ name, icon: Icon }) => (
              <SelectItem key={name} value={name}>
                <div className="flex gap-3 items-center">
                  {Icon && <Icon />}
                  {name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default Search;
