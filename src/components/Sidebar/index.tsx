import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Sparkles, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";


const Sidebar = () => {
    const { data: session } = useSession();
    return (
        <div className="w-70 h-screen bg-gradient-to-b from-blue-100 to-red-100 p-6 flex flex-col items-center shadow-lg">
            <div className="flex flex-col items-center mb-10">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white p-1 mt-0">
                    <Image
                            src="/profile.png"
                            width={500}
                            height={500}
                            alt="Picture of the user"
                            className="rounded-xl "
                        />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                        <div className="text-xs font-bold text-gray-700">...</div>
                    </div>
                </div>
                <p className="mt-3 text-lg font-medium text-gray-800">{session?.user.name}</p>
            </div>

            <div className="w-full flex flex-col gap-4">
                <Button
                    variant="ghost"
                    className="pl-0 h-10 group w-full justify-start mb-5 bg-blue-200 hover:bg-yellow-400 text-gray-700 hover:text-white shadow-sm rounded-3xl"
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <Home className="size-9 mr-2 bg-amber-200 rounded-3xl p-1" />
                    </span>
                    Home
                </Button>
                <Button
                    variant="ghost"
                    className="pl-0 h-10 group w-full justify-start mb-5 bg-blue-200 hover:bg-yellow-400 text-gray-700 hover:text-white shadow-sm rounded-3xl"
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <BookOpen className="size-9 mr-2 bg-amber-200 rounded-3xl p-1" />
                    </span>
                    My Stories
                </Button>

                <Button
                    variant="ghost"
                    className="pl-0 h-10 group w-full justify-start mb-5 bg-blue-200 hover:bg-yellow-400 text-gray-700 hover:text-white shadow-sm rounded-3xl"
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <Sparkles className="size-9 mr-2 bg-amber-200 rounded-3xl p-1" />
                    </span>
                    Create a Story
                </Button>

                <Button
                    variant="ghost"
                    className="pl-0 h-10 group w-full justify-start mb-5 bg-blue-200 hover:bg-yellow-400 text-gray-700 hover:text-white shadow-sm rounded-3xl"
                >
                    <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                        <Trophy className="size-9 mr-2 bg-amber-200 rounded-3xl p-1" />
                    </span>
                    My Progress
                </Button>
            </div>
        </div >
    );
};

export default Sidebar;
