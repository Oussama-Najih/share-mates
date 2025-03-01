import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const sideBarOptions = [
  "Cours",
  "Controles",
  "Examens",
  "TDs",
  "TPs",
  "Memoires",
];

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="font-bold">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-8 font-roboto flex flex-col space-y-6">
          {sideBarOptions.map((option) => (
            <Button
              key={option}
              variant="outline"
              asChild
              className="bg-primary py-3 rounded-md flex justify-center items-center "
            >
              <Link href={`/${option}`} className="text-primary-foreground">
                {option}
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
