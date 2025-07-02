import { Flame, CircleArrowUp, MoveRight } from 'lucide-react';
import { JSX } from 'react';
import ReadStoryPan from '../DefaultHomePanels/ReadStoryPan';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

type ChallengesExpandedPanelProps = {
    randomStoryId: string | null;
    setReadOpen: (value: boolean) => void;
    setChallengesOpen: (value: boolean) => void;
}

const ChallengesExpandedPanel = ({
    randomStoryId,
    setReadOpen,
    setChallengesOpen
}: ChallengesExpandedPanelProps): JSX.Element => {
  return (
    <>
        <div className="absolute inset-0 z-50 bg-gray-100 flex flex-col items-center justify-center rounded-[2rem] shadow-md w-full h-[61%] pl-8 pr-8 pt-1">
                    <div className='w-[95%] mb-1'>
                        <ReadStoryPan
                            setReadOpen={setReadOpen}
                            randomStoryId={randomStoryId}
                        />
                    </div>
                    <div className="w-[95%] h-[60%] max-w-screen-2xl p-6 sm:p-10 bg-indigo-300 text-white rounded-2xl shadow-xl m-[4.5%] mb-[1%] mt-[1%]">
                        <div className="flex justify-between items-start h-15">
                            <h2 className="flex items-center space-x-3 font-extralight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                                <Flame className="fill-white sm:size-6 md:size-8 lg:size-9 mr-4" />
                                <span className="ml-2">Challenges</span>
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => setChallengesOpen(false)}
                                className="p-0 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                                <CircleArrowUp className="size-12 sm:size-18 p-2 rounded-3xl font-extraligh text-white bg-transparent hover:size-20" />
                            </Button>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-5 ml-10 w-full">
                            <div className="bg-white text-gray-800 rounded-xl p-6 text-center shadow-md flex-1 max-w-2xl translate-x-4 -translate-y-3 sm:translate-x-6 sm:-translate-y-5">
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4">
                                    Validate your improvements with these rewarding sessions and help us improve by sharing feedback.
                                </p>
                                <div className="flex w-full justify-center">
                                    <Link href={randomStoryId ? `/read-story/${randomStoryId}` : '/create-story'} className="cursor-auto">
                                        <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-base sm:text-md md:text-lg lg:text-xl text-white rounded-lg flex items-center mx-auto">
                                            I&#39;m ready! <MoveRight className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-[300px] sm:w-[300px] h-[374px] relative flex-shrink-0">
                                <Image
                                    src="/boy-with-backpack.png"
                                    alt="Boy with backpack"
                                    layout="responsive"
                                    priority
                                    width={300}
                                    height={374}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
    </>
  )
}

export default ChallengesExpandedPanel;