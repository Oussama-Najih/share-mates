"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoonIcon, Settings, SunIcon, SunMoon } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { signOutUser } from "@/lib/actions/user.actions";
import Link from "next/link";

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-10" asChild>
        <Button
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
          variant="ghost"
        >
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other</DropdownMenuLabel>
        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/profil"
            className="sm:hidden flex justify-center text-left text-primary-foreground"
          >
            <span> </span>
            <p className="text-primary">Profil</p>
          </Link>
          <form action={signOutUser}>
            <button
              type="submit"
              className="w-full flex justify-center
                items-center text-left"
            >
              Log Out
            </button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
