import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { JSX } from 'react'

const ParentDashboard = (): JSX.Element => {
    return (
        <>
            <div className="text-2xl">Parent Dashboard</div>
            <div className="flex flex-col space-y-8 mr-0 p-0 mt-7 text-2xl w-[20%] bg-gray-200">
                <Link href="/story-board">
                    <Button
                        className="w-[45%] lg:w-[90%] pl-0 h-16 group justify-start ml-9 text-2xl text-gray-700 hover:text-white bg-transparent hover:bg-yellow-400 shadow-none rounded-4xl cursor-pointer"
                    >
                        View a child
                    </Button>
                </Link>
                <Link href="/story-board">
                    <Button
                        className="w-[45%] lg:w-[90%] pl-0 h-16 group justify-start ml-9 text-2xl text-gray-700 hover:text-white bg-transparent hover:bg-yellow-400 shadow-none rounded-4xl cursor-pointer"
                    >
                        Add Restrictions
                    </Button>
                </Link>
                <Link href="/story-board">
                </Link>
                <Link href="/story-board">
                <Button className="w-[45%] lg:w-[90%] pl-0 h-16 group justify-start ml-9 text-2xl text-gray-700 hover:text-white bg-transparent hover:bg-yellow-400 shadow-none rounded-4xl cursor-pointer"
                >
                    Add a child
                </Button>
                </Link>
                <Link href="/story-board">
                    <Button className="w-[45%] lg:w-[90%] pl-0 h-16 group justify-start ml-9 text-2xl text-gray-700 hover:text-white bg-transparent hover:bg-yellow-400 shadow-none rounded-4xl cursor-pointer"
                    >
                        Remove a child
                    </Button>
                </Link>
            </div>
        </>
    )
}

export default ParentDashboard;