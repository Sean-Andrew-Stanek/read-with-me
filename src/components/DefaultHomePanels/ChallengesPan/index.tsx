import { JSX } from "react";
import { CircleArrowDown, Flame, MoveRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ChallengesPanProps = {
    randomStoryId: string | null;
    setChallengesOpen: (value: boolean) => void;
}

const ChallengesPan = ({
    randomStoryId,
    setChallengesOpen,
}: ChallengesPanProps): JSX.Element => {
    return (
        <>
            <div className="flex flex-col bg-indigo-300 text-white rounded-2xl px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 min-h-[125px] transition-all duration-300">
                <div className="flex items-center justify-between mt-2">
                    <span className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        <Flame className="fill-white sm:size-6 md:size-8 lg:size-9 mr-6 ml-2" />
                        <span>Challenges</span>
                    </span>
                    <div className="flex items-center space-x-4">
                        <Link href={randomStoryId ? `/read-story/${randomStoryId}` : '/create-story'}>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                I&#39;m ready! <MoveRight className="ml-2" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-indigo-300 p-2"
                            onClick={() => setChallengesOpen(true)}
                        >
                            <span className="flex items-center rounded-full p-1 bg-transparent">
                                <CircleArrowDown className="size-12 sm:size-18 p-2 bg-transparent rounded-3xl text-white font-extralight hover:size-20" />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChallengesPan;