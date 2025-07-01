import { JSX } from 'react/jsx-runtime';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';

const SurveyCard = (): JSX.Element => {
  return (
    <>
        {/* Survey Card */}
                    <div className="relative flex flex-col flex-1 basis-[300px] max-w-lg bg-white rounded-xl shadow-md p-4 overflow-hidden">
                        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-purple-700 text-center">
                            Take on our survey
                        </h3>
                        <p className="text-gray-600 mt-4 text-sm sm:text-md md:text-lg lg:text-2xl text-center leading-loose">
                            Give us your feedback and help us make our app better for you!
                        </p>
                        <Link href="#" className="mt-auto flex justify-center">
                            <Button className="border border-purple-500 bg-gray-100 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                Survey
                                <span className="pl-4">
                                    <MoveRight />
                                </span>
                            </Button>
                        </Link>
                        <div className="absolute bottom-0 right-0 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
                            <Image
                                src="/child-survey.png"
                                alt="Child with tablet"
                                priority={true}
                                fill
                                sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, (max-width: 1024px) 100px, 120px"
                                className="object-contain z-10"
                            />
                        </div>
                    </div>
    </>
  )
}

export default SurveyCard;