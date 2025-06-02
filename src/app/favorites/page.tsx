import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function () {
    return (
        <>
            <div className="relative">
                <div className="flex flex-col space-y-4 p-4 sm:p-8 md:p-16 bg-white rounded-[2rem] shadow-md w-full max-w-5xl mx-auto my-0 h-10/12">
                    <p className="text-6xl text-gray-700">Viewing and managing user favorite stories will happen here.</p>
                    <Link href={'/home'}>
                        <Button
                            variant="default"
                            className='bg-indigo-400 text-gray-500'
                        >
                            <span className="inline-flex items-center p-1 rounded-3xl group-hover:bg-amber-200 text-lg transition-colors duration-200">
                                <Home className='size-9 text-white' />
                            </span>
                            <span className="hidden sm:inline text-blue-100">Home</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}