import { cn } from "@/lib/utils";
import Image from "next/image";
import { Pencil } from "lucide-react"; // Import the Pencil icon from lucide-react

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
  canEdit?: boolean; // New prop to conditionally show the pencil icon
  isInComment?: boolean; // New prop to conditionally show the pencil icon
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
  canEdit = false, // Default to false if not provided
  isInComment = false,
}: UserAvatarProps) {
  return (
    <div className={cn("relative group", isInComment && "hidden sm:block")}>
      {" "}
      {/* Use group to enable hover effect */}
      <Image
        src={avatarUrl || "/images/avatar-placeHolder.png"}
        alt="User avatar"
        width={size ?? 42}
        height={size ?? 42}
        className={cn(
          "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
          className
        )}
      />
      {/* Conditional rendering of the pencil icon inside the image */}
      {canEdit && (
        <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md group-hover:opacity-100 transition-opacity duration-300">
          <Pencil size={18} className="text-primary dark:text-secondary" />
        </div>
      )}
    </div>
  );
}
