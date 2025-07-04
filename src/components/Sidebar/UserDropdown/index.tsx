import { useRouter } from "next/navigation";
import { Ellipsis, LogOut, User } from "lucide-react";
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FC, JSX } from "react";

const UserDropdown: FC = (): JSX.Element => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-xl font-bold text-gray-700 leading-none select-none cursor-pointer hover:text-gray-900">
          <Ellipsis />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className="text-black"
        >
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-black"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;